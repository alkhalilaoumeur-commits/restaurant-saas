import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mitarbeiter } from '../types';

interface AuthState {
  token: string | null;
  mitarbeiter: Mitarbeiter | null;
  login: (token: string, mitarbeiter: Mitarbeiter) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      mitarbeiter: null,
      login: (token, mitarbeiter) => set({ token, mitarbeiter }),
      logout: () => set({ token: null, mitarbeiter: null }),
    }),
    { name: 'restaurant-auth' }
  )
);
