import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Bereich } from '../types';
import { useAuthStore } from '../store/auth';

const DEMO_BEREICHE: Bereich[] = [
  { id: 'b1', restaurant_id: 'demo', name: 'Innen', reihenfolge: 0 },
  { id: 'b2', restaurant_id: 'demo', name: 'Terrasse', reihenfolge: 1 },
  { id: 'b3', restaurant_id: 'demo', name: 'Bar', reihenfolge: 2 },
];

export function useBereiche() {
  const [bereiche, setBereiche] = useState<Bereich[]>([]);
  const [laden, setLaden] = useState(true);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setBereiche(DEMO_BEREICHE); setLaden(false); return; }
    try {
      const data = await api.get<Bereich[]>('/bereiche');
      setBereiche(data);
    } catch { /* leer = noch keine Bereiche */ }
    finally { setLaden(false); }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = useCallback(async (name: string) => {
    if (demo) {
      const neu: Bereich = { id: `b${Date.now()}`, restaurant_id: 'demo', name, reihenfolge: bereiche.length };
      setBereiche((prev) => [...prev, neu]);
      return neu;
    }
    const neu = await api.post<Bereich>('/bereiche', { name, reihenfolge: bereiche.length });
    await laden_();
    return neu;
  }, [demo, bereiche.length, laden_]);

  const aktualisieren = useCallback(async (id: string, felder: { name?: string; reihenfolge?: number }) => {
    if (demo) { setBereiche((prev) => prev.map((b) => b.id === id ? { ...b, ...felder } : b)); return; }
    await api.patch(`/bereiche/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const loeschen = useCallback(async (id: string) => {
    if (demo) { setBereiche((prev) => prev.filter((b) => b.id !== id)); return; }
    await api.delete(`/bereiche/${id}`);
    await laden_();
  }, [demo, laden_]);

  return { bereiche, laden, erstellen, aktualisieren, loeschen };
}
