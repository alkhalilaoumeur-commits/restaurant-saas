import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Reservierung, ReservierungStatus } from '../types';
import { useAuthStore } from '../store/auth';
import { useSocket } from './useSocket';
import { DEMO_RESERVIERUNGEN } from '../lib/demo-daten';

export function useReservierungen(datum?: string) {
  const [reservierungen, setReservierungen] = useState<Reservierung[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);
  const socket = useSocket();

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

  // Socket.io Live-Updates — neue Reservierung oder Statusänderung → Liste neu laden
  useEffect(() => {
    if (demo || !socket) return;

    const onNeu = () => { laden_(); };
    const onAktualisiert = () => { laden_(); };

    socket.on('neue_reservierung', onNeu);
    socket.on('reservierung_aktualisiert', onAktualisiert);

    return () => {
      socket.off('neue_reservierung', onNeu);
      socket.off('reservierung_aktualisiert', onAktualisiert);
    };
  }, [demo, socket, laden_]);

  const statusAendern = useCallback(async (id: string, status: ReservierungStatus) => {
    if (demo) {
      setReservierungen((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      return;
    }
    await api.patch(`/reservierungen/${id}/status`, { status });
    await laden_();
  }, [demo, laden_]);

  const tischZuweisen = useCallback(async (id: string, tischId: string | null) => {
    if (demo) {
      setReservierungen((prev) => prev.map((r) => r.id === id ? { ...r, tisch_id: tischId } : r));
      return;
    }
    await api.patch(`/reservierungen/${id}/tisch`, { tisch_id: tischId });
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

  const autoZuweisen = useCallback(async (id: string): Promise<boolean> => {
    if (demo) return false;
    try {
      await api.post(`/reservierungen/${id}/auto-zuweisung`, {});
      await laden_();
      return true;
    } catch {
      return false;
    }
  }, [demo, laden_]);

  return { reservierungen, laden, fehler, laden_, statusAendern, tischZuweisen, loeschen, autoZuweisen };
}
