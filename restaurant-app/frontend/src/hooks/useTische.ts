import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Tisch, TischStatus, TischForm } from '../types';
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

  const tischErstellen = useCallback(async (daten: {
    nummer: number; kapazitaet?: number | null; form?: TischForm;
    pos_x?: number; pos_y?: number; breite?: number; hoehe?: number; bereich_id?: string | null;
  }) => {
    if (demo) {
      const neu: Tisch = {
        id: `t${Date.now()}`, restaurant_id: 'demo', status: 'frei', qr_url: null,
        nummer: daten.nummer, kapazitaet: daten.kapazitaet ?? null,
        form: daten.form ?? 'rechteck', pos_x: daten.pos_x ?? 0, pos_y: daten.pos_y ?? 0,
        breite: daten.breite ?? 80, hoehe: daten.hoehe ?? 80, rotation: 0, bereich_id: daten.bereich_id ?? null,
      };
      setTische((prev) => [...prev, neu]);
      return neu;
    }
    const neu = await api.post<Tisch>('/tische', daten);
    await laden_();
    return neu;
  }, [demo, laden_]);

  const tischAktualisieren = useCallback(async (id: string, felder: {
    nummer?: number; kapazitaet?: number | null; form?: TischForm;
    pos_x?: number; pos_y?: number; breite?: number; hoehe?: number;
    rotation?: number; bereich_id?: string | null;
  }) => {
    if (demo) {
      setTische((prev) => prev.map((t) => t.id === id ? { ...t, ...felder } : t));
      return;
    }
    await api.patch<Tisch>(`/tische/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const positionenSpeichern = useCallback(async (positionen: Array<{ id: string; pos_x: number; pos_y: number; breite?: number; hoehe?: number; rotation?: number }>) => {
    if (demo) {
      setTische((prev) => prev.map((t) => {
        const p = positionen.find((pos) => pos.id === t.id);
        return p ? { ...t, ...p } : t;
      }));
      return;
    }
    await api.put('/tische/positionen', { positionen });
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

  return { tische, laden, fehler, laden_, statusAendern, tischErstellen, tischAktualisieren, tischLoeschen, positionenSpeichern };
}
