import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Reservierung, ReservierungStatus } from '../types';

export function useReservierungen(datum?: string) {
  const [reservierungen, setReservierungen] = useState<Reservierung[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
    try {
      const url = datum ? `/reservierungen?datum=${datum}` : '/reservierungen';
      setReservierungen(await api.get<Reservierung[]>(url));
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }, [datum]);

  useEffect(() => { laden_(); }, [laden_]);

  const statusAendern = useCallback(async (id: string, status: ReservierungStatus) => {
    await api.patch(`/reservierungen/${id}/status`, { status });
    await laden_();
  }, [laden_]);

  const loeschen = useCallback(async (id: string) => {
    await api.delete(`/reservierungen/${id}`);
    await laden_();
  }, [laden_]);

  return { reservierungen, laden, fehler, laden_, statusAendern, loeschen };
}
