import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Bestellung, BestellungStatus } from '../types';
import { useSocket } from './useSocket';

export function useBestellungen() {
  const [bestellungen, setBestellungen] = useState<Bestellung[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const socket = useSocket();

  const laden_ = useCallback(async () => {
    try {
      const data = await api.get<Bestellung[]>('/bestellungen');
      setBestellungen(data);
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  useEffect(() => {
    if (!socket) return;
    socket.on('neue_bestellung', laden_);
    socket.on('bestellung_aktualisiert', laden_);
    return () => {
      socket.off('neue_bestellung', laden_);
      socket.off('bestellung_aktualisiert', laden_);
    };
  }, [socket, laden_]);

  const statusAendern = useCallback(async (id: string, status: BestellungStatus) => {
    await api.patch(`/bestellungen/${id}/status`, { status });
    await laden_();
  }, [laden_]);

  return { bestellungen, laden, fehler, laden_, statusAendern };
}
