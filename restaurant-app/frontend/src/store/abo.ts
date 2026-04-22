import { create } from 'zustand';
import { api } from '../lib/api';
import { Plan } from '../lib/plan-config';

interface AboState {
  plan: Plan | null;
  status: 'trial' | 'active' | 'expired' | 'cancelled' | 'payment_failed' | null;
  geladen: boolean;
  laden: () => Promise<void>;
  reset: () => void;
}

export const useAboStore = create<AboState>((set) => ({
  plan:    null,
  status:  null,
  geladen: false,

  laden: async () => {
    try {
      const data = await api.get<{ abo_plan: Plan; abo_status: AboState['status'] }>('/abo/status');
      set({ plan: data.abo_plan, status: data.abo_status, geladen: true });
    } catch {
      set({ geladen: true });
    }
  },

  reset: () => set({ plan: null, status: null, geladen: false }),
}));
