import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

/**
 * Demo authentication.
 *
 * This is a front-end only build, so signing in creates a local session and
 * says so honestly in the interface. No credentials are sent anywhere and no
 * real account is created.
 */
interface AuthState {
  user: User | null;
  status: 'idle' | 'loading';
  signIn: (email: string, firstName?: string) => Promise<User>;
  signUp: (input: { email: string; firstName: string; lastName: string; city?: string; country?: string }) => Promise<User>;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'idle',

      signIn: async (email, firstName = 'Guest') => {
        set({ status: 'loading' });
        const user: User = {
          id: `user-${email}`,
          firstName,
          lastName: '',
          email,
          phone: '',
          city: '',
          country: '',
          marketingOptIn: false,
          retailerId: null,
        };
        set({ user, status: 'idle' });
        return user;
      },

      signUp: async (input) => {
        set({ status: 'loading' });
        const user: User = {
          id: `user-${input.email}`,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: '',
          city: input.city ?? '',
          country: input.country ?? '',
          marketingOptIn: false,
          retailerId: null,
        };
        set({ user, status: 'idle' });
        return user;
      },

      signOut: () => set({ user: null }),

      updateUser: (patch) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...patch } });
      },
    }),
    {
      name: 'osb:auth',
      version: 1,
      partialize: (state) => ({ user: state.user }) as AuthState,
    },
  ),
);
