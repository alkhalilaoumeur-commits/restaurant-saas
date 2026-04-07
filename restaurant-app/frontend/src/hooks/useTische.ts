import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Tisch, TischStatus } from '../types';
import { useAuthStore } from '../store/auth';
import { DEMO_TISCHE } from '../lib/demo-daten';

export function useTische() {
  const [tische, setTische] = useState<Tisch[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) {
      setTische(DEMO_TISCHE);
      setLaden(false);
      return;
    }
    try {
      const data = await api.get<Tisch[]>('/tische');
      setTische(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const statusAendern = useCallback(async (id: string, status: TischStatus) => {
    if (demo) {
      setTische((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
      return;
    }
    await api.patch<Tisch>(`/tische/${id}/status`, { status });
    await laden_();
  }, [demo, laden_]);

  const tischErstellen = useCallback(async (nummer: number, kapazitaet: number | null) => {
    if (demo) {
      const neu: Tisch = {
        id: `t${Date.now()}`,
        restaurant_id: 'demo',
        nummer,
        kapazitaet,
        status: 'frei',
        qr_url: null,
      };
      setTische((prev) => [...prev, neu].sort((a, b) => a.nummer - b.nummer));
      return;
    }
    await api.post<Tisch>('/tische', { nummer, kapazitaet });
    await laden_();
  }, [demo, laden_]);

  const tischAktualisieren = useCallback(async (id: string, felder: { nummer?: number; kapazitaet?: number | null }) => {
    if (demo) {
      setTische((prev) => prev.map((t) => t.id === id ? { ...t, ...felder } : t)
        .sort((a, b) => a.nummer - b.nummer));
      return;
    }
    await api.patch<Tisch>(`/tische/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const tischLoeschen = useCallback(async (id: string) => {
    if (demo) {
      setTische((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await api.delete(`/tische/${id}`);
    await laden_();
  }, [demo, laden_]);

  return { tische, laden, fehler, laden_, statusAendern, tischErstellen, tischAktualisieren, tischLoeschen };
}
