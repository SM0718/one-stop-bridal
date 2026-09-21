import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Product } from '@/types';

interface CartState {
  lines: CartLine[];
  /** Saved but not yet purchasable pieces (enquiry-only) */
  addProduct: (product: Product, options?: { size?: string | null; options?: Record<string, string>; quantity?: number }) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateLine: (lineId: string, patch: Partial<CartLine>) => void;
  clear: () => void;
}

function makeId(): string {
  return `cart-${Math.random().toString(36).slice(2, 9)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addProduct: (product, options) => {
        const size = options?.size ?? product.sizes[0] ?? null;
        const selected = options?.options ?? {};
        const quantity = options?.quantity ?? 1;

        const signature = (line: CartLine) =>
          `${line.productId}|${line.size ?? ''}|${JSON.stringify(line.options)}`;

        const candidate: CartLine = {
          id: makeId(),
          productId: product.id,
          quantity,
          size,
          options: selected,
          price: product.price,
        };

        const existing = get().lines.find((l) => signature(l) === signature(candidate));
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === existing.id ? { ...l, quantity: Math.min(l.quantity + quantity, 20) } : l,
            ),
          });
          return;
        }
        set({ lines: [...get().lines, candidate] });
      },

      removeLine: (lineId) => set({ lines: get().lines.filter((l) => l.id !== lineId) }),

      updateQuantity: (lineId, quantity) =>
        set({
          lines: get()
            .lines.map((l) => (l.id === lineId ? { ...l, quantity: Math.max(1, Math.min(quantity, 20)) } : l)),
        }),

      updateLine: (lineId, patch) =>
        set({ lines: get().lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)) }),

      clear: () => set({ lines: [] }),
    }),
    { name: 'osb:cart', version: 1 },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.quantity, 0);
}

export interface CartTotal {
  total: number;
  hasEnquiryOnly: boolean;
}

/* Zustand compares selector results by reference, so this must return a stable
   object for unchanged lines rather than building a new one every read. */
const cartTotalCache = new WeakMap<CartLine[], CartTotal>();

export function selectCartTotal(state: CartState): CartTotal {
  const lines = state.lines;
  const cached = cartTotalCache.get(lines);
  if (cached) return cached;

  let total = 0;
  let hasEnquiryOnly = false;
  for (const line of lines) {
    if (line.price === null) hasEnquiryOnly = true;
    else total += line.price * line.quantity;
  }
  const value: CartTotal = { total, hasEnquiryOnly };
  cartTotalCache.set(lines, value);
  return value;
}
