import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Mitarbeiter {
  id: string;
  name: string;
  email: string;
  rolle: 'admin' | 'kellner' | 'kueche';
  restaurantId: string;
}

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
