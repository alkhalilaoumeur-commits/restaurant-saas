import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Bestellung, BestellungStatus } from '../types';
import { useAuthStore } from '../store/auth';
import { useSocket } from './useSocket';
import { DEMO_BESTELLUNGEN } from '../lib/demo-daten';

export function useBestellungen() {
  const [bestellungen, setBestellungen] = useState<Bestellung[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);
  const socket = useSocket();

  const laden_ = useCallback(async () => {
    if (demo) {
      setBestellungen(DEMO_BESTELLUNGEN);
      setLaden(false);
      return;
    }
    try {
      const data = await api.get<Bestellung[]>('/bestellungen');
      setBestellungen(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  // Socket.io Live-Updates
  useEffect(() => {
    if (demo || !socket) return;

    const onNeu = () => { laden_(); };
    const onAktualisiert = () => { laden_(); };

    socket.on('neue_bestellung', onNeu);
    socket.on('bestellung_aktualisiert', onAktualisiert);

    return () => {
      socket.off('neue_bestellung', onNeu);
      socket.off('bestellung_aktualisiert', onAktualisiert);
    };
  }, [demo, socket, laden_]);

  const statusAendern = useCallback(async (id: string, status: BestellungStatus) => {
    if (demo) {
      setBestellungen((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      return;
    }
    await api.patch<Bestellung>(`/bestellungen/${id}/status`, { status });
    await laden_();
  }, [demo, laden_]);

  return { bestellungen, laden, fehler, laden_, statusAendern };
}
