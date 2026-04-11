import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { WalkIn } from '../types';
import { useSocket } from './useSocket';

export function useWalkIns() {
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const socket = useSocket();

  const laden_ = useCallback(async () => {
    try {
      const data = await api.get<WalkIn[]>('/walk-ins');
      setWalkIns(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  // Socket.io: Live-Updates bei neuem Walk-in oder Statusänderung
  useEffect(() => {
    if (!socket) return;
    const onNeu = () => laden_();
    const onAktualisiert = () => laden_();
    socket.on('walk_in_neu', onNeu);
    socket.on('walk_in_aktualisiert', onAktualisiert);
    return () => {
      socket.off('walk_in_neu', onNeu);
      socket.off('walk_in_aktualisiert', onAktualisiert);
    };
  }, [socket, laden_]);

  const hinzufuegen = useCallback(async (data: {
    gast_name: string; personen: number; anmerkung?: string
  }) => {
    await api.post('/walk-ins', data);
    await laden_();
  }, [laden_]);

  const platzieren = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.post(`/walk-ins/${id}/platzieren`, {});
      await laden_();
      return true;
    } catch {
      return false;
    }
  }, [laden_]);

  const abgegangen = useCallback(async (id: string) => {
    await api.patch(`/walk-ins/${id}/abgegangen`, {});
    await laden_();
  }, [laden_]);

  const loeschen = useCallback(async (id: string) => {
    await api.delete(`/walk-ins/${id}`);
    await laden_();
  }, [laden_]);

  return { walkIns, laden, fehler, laden_, hinzufuegen, platzieren, abgegangen, loeschen };
}
