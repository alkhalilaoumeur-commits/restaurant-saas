import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Reservierung, ReservierungStatus } from '../types';
import { useAuthStore } from '../store/auth';
import { DEMO_RESERVIERUNGEN } from '../lib/demo-daten';

export function useReservierungen(datum?: string) {
  const [reservierungen, setReservierungen] = useState<Reservierung[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) {
      setReservierungen(DEMO_RESERVIERUNGEN);
      setLaden(false);
      return;
    }
    try {
      const query = datum ? `?datum=${datum}` : '';
      const data = await api.get<Reservierung[]>(`/reservierungen${query}`);
      setReservierungen(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [datum, demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const statusAendern = useCallback(async (id: string, status: ReservierungStatus) => {
    if (demo) {
      setReservierungen((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      return;
    }
    await api.patch(`/reservierungen/${id}/status`, { status });
    await laden_();
  }, [demo, laden_]);

  const loeschen = useCallback(async (id: string) => {
    if (demo) {
      setReservierungen((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    await api.delete(`/reservierungen/${id}`);
    await laden_();
  }, [demo, laden_]);

  return { reservierungen, laden, fehler, laden_, statusAendern, loeschen };
}
