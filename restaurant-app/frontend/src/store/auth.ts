import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mitarbeiter } from '../types';

interface AuthState {
  token: string | null;
  mitarbeiter: Mitarbeiter | null;
  demo: boolean;
  login: (token: string, mitarbeiter: Mitarbeiter) => void;
  demoLogin: (mitarbeiter: Mitarbeiter) => void;
  logout: () => void;
  /** Profilbild aktualisieren (nach Upload in Einstellungen) */
  setFotoUrl: (foto_url: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      mitarbeiter: null,
      demo: false,
      login: (token, mitarbeiter) => set({ token, mitarbeiter, demo: false }),
      demoLogin: (mitarbeiter) => set({ token: 'demo', mitarbeiter, demo: true }),
      logout: () => set({ token: null, mitarbeiter: null, demo: false }),
      setFotoUrl: (foto_url) => set((state) =>
        state.mitarbeiter ? { mitarbeiter: { ...state.mitarbeiter, foto_url } } : {}
      ),
    }),
    { name: 'restaurant-auth' }
  )
);
