import { create } from 'zustand';
import type { FaithId } from '@/types';

/**
 * Ephemeral interface state: drawers, dialogs and the global search overlay.
 * Deliberately not persisted — a reload should not reopen a panel.
 */
interface UIState {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  searchOpen: boolean;
  openSearch: (seed?: string) => void;
  closeSearch: () => void;
  searchSeed: string;

  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;

  faithPickerOpen: boolean;
  setFaithPickerOpen: (open: boolean) => void;
  /** Which selector opened the faith picker, so it can explain itself. */
  faithPickerIntent: 'onboarding' | 'header' | 'planning' | null;
  openFaithPicker: (intent: 'onboarding' | 'header' | 'planning') => void;

  /** Faith being previewed in the picker before it is applied */
  previewFaith: FaithId | null;
  setPreviewFaith: (faith: FaithId | null) => void;

  closeEverything: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  searchOpen: false,
  searchSeed: '',
  openSearch: (seed = '') => set({ searchOpen: true, searchSeed: seed }),
  closeSearch: () => set({ searchOpen: false }),

  filtersOpen: false,
  setFiltersOpen: (open) => set({ filtersOpen: open }),

  faithPickerOpen: false,
  faithPickerIntent: null,
  openFaithPicker: (intent) => set({ faithPickerOpen: true, faithPickerIntent: intent }),
  setFaithPickerOpen: (open) => set({ faithPickerOpen: open, faithPickerIntent: open ? null : null }),

  previewFaith: null,
  setPreviewFaith: (faith) => set({ previewFaith: faith }),

  closeEverything: () =>
    set({ mobileNavOpen: false, searchOpen: false, filtersOpen: false, faithPickerOpen: false }),
}));
