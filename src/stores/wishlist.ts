import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedItem, SavedItemKind, WishlistCollection } from '@/types';

export const DEFAULT_COLLECTIONS: WishlistCollection[] = [
  { id: 'col-bridal-looks', name: 'My bridal looks', description: 'Outfits you are considering.', system: true },
  { id: 'col-jewellery', name: 'My jewellery', description: 'Pieces to come back to.', system: true },
  { id: 'col-vendors', name: 'My vendors', description: 'Wedding professionals you are considering.', system: true },
  { id: 'col-ceremony-ideas', name: 'My ceremony ideas', description: 'Reading and references for the ceremony.', system: true },
];

interface WishlistState {
  collections: WishlistCollection[];
  items: SavedItem[];

  isSaved: (kind: SavedItemKind, refId: string) => boolean;
  save: (kind: SavedItemKind, refId: string, collectionId?: string) => void;
  remove: (kind: SavedItemKind, refId: string) => void;
  toggle: (kind: SavedItemKind, refId: string) => boolean;
  moveToCollection: (kind: SavedItemKind, refId: string, collectionId: string) => void;

  createCollection: (name: string, description?: string) => WishlistCollection;
  renameCollection: (id: string, name: string) => void;
  removeCollection: (id: string) => void;
  itemsIn: (collectionId: string) => SavedItem[];
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Default collection for a kind of saved item. */
function defaultCollectionFor(kind: SavedItemKind): string {
  if (kind === 'vendor') return 'col-vendors';
  if (kind === 'inspiration') return 'col-ceremony-ideas';
  return 'col-bridal-looks';
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      collections: DEFAULT_COLLECTIONS,
      items: [],

      isSaved: (kind, refId) => get().items.some((i) => i.kind === kind && i.refId === refId),

      save: (kind, refId, collectionId) => {
        if (get().isSaved(kind, refId)) return;
        set({
          items: [
            ...get().items,
            {
              id: makeId('saved'),
              kind,
              refId,
              collectionId: collectionId ?? defaultCollectionFor(kind),
              savedAt: new Date().toISOString(),
            },
          ],
        });
      },

      remove: (kind, refId) =>
        set({ items: get().items.filter((i) => !(i.kind === kind && i.refId === refId)) }),

      toggle: (kind, refId) => {
        const saved = get().isSaved(kind, refId);
        if (saved) get().remove(kind, refId);
        else get().save(kind, refId);
        return !saved;
      },

      moveToCollection: (kind, refId, collectionId) =>
        set({
          items: get().items.map((i) =>
            i.kind === kind && i.refId === refId ? { ...i, collectionId } : i,
          ),
        }),

      createCollection: (name, description = '') => {
        const collection: WishlistCollection = {
          id: makeId('col'),
          name,
          description,
          system: false,
        };
        set({ collections: [...get().collections, collection] });
        return collection;
      },

      renameCollection: (id, name) =>
        set({ collections: get().collections.map((c) => (c.id === id ? { ...c, name } : c)) }),

      removeCollection: (id) => {
        const collections = get().collections.filter((c) => c.id !== id);
        const fallback = collections[0]?.id ?? 'col-bridal-looks';
        set({
          collections,
          items: get().items.map((i) => (i.collectionId === id ? { ...i, collectionId: fallback } : i)),
        });
      },

      itemsIn: (collectionId) => get().items.filter((i) => i.collectionId === collectionId),
    }),
    { name: 'osb:wishlist', version: 1 },
  ),
);

export function selectWishlistCount(state: WishlistState): number {
  return state.items.length;
}
