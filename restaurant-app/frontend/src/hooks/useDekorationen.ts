import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Dekoration, DekoTyp } from '../types';
import { useAuthStore } from '../store/auth';

// Demo-Deko: Eingang + Theke + 2 Pflanzen für Demo-Modus
const DEMO_DEKO: Dekoration[] = [
  { id: 'd1', restaurant_id: 'demo', bereich_id: 'b1', typ: 'eingang', pos_x: 40,  pos_y: 720, breite: 80,  hoehe: 24, rotation: 0, label: 'Eingang',         erstellt_am: '2026-04-26' },
  { id: 'd2', restaurant_id: 'demo', bereich_id: 'b1', typ: 'theke',   pos_x: 60,  pos_y: 60,  breite: 200, hoehe: 30, rotation: 0, label: 'Bar',             erstellt_am: '2026-04-26' },
  { id: 'd3', restaurant_id: 'demo', bereich_id: 'b1', typ: 'pflanze', pos_x: 320, pos_y: 320, breite: 30,  hoehe: 30, rotation: 0, label: null,              erstellt_am: '2026-04-26' },
  { id: 'd4', restaurant_id: 'demo', bereich_id: 'b1', typ: 'pflanze', pos_x: 800, pos_y: 320, breite: 30,  hoehe: 30, rotation: 0, label: null,              erstellt_am: '2026-04-26' },
  { id: 'd5', restaurant_id: 'demo', bereich_id: 'b1', typ: 'servicestation', pos_x: 580, pos_y: 700, breite: 80,  hoehe: 30, rotation: 0, label: 'Service', erstellt_am: '2026-04-26' },
];

export function useDekorationen() {
  const [dekorationen, setDekorationen] = useState<Dekoration[]>([]);
  const [laden, setLaden] = useState(true);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setDekorationen(DEMO_DEKO); setLaden(false); return; }
    try {
      const data = await api.get<Dekoration[]>('/dekorationen');
      setDekorationen(data);
    } catch { /* leer */ }
    finally { setLaden(false); }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = useCallback(async (data: {
    typ: DekoTyp;
    pos_x?: number; pos_y?: number;
    breite?: number; hoehe?: number;
    rotation?: number; label?: string | null; bereich_id?: string | null;
  }) => {
    if (demo) {
      const neu: Dekoration = {
        id: `d${Date.now()}`, restaurant_id: 'demo',
        bereich_id: data.bereich_id ?? null,
        typ: data.typ,
        pos_x: data.pos_x ?? 100, pos_y: data.pos_y ?? 100,
        breite: data.breite ?? 60, hoehe: data.hoehe ?? 60,
        rotation: data.rotation ?? 0, label: data.label ?? null,
        erstellt_am: new Date().toISOString(),
      };
      setDekorationen((prev) => [...prev, neu]);
      return neu;
    }
    const neu = await api.post<Dekoration>('/dekorationen', data);
    await laden_();
    return neu;
  }, [demo, laden_]);

  const aktualisieren = useCallback(async (
    id: string,
    felder: Partial<Pick<Dekoration, 'pos_x' | 'pos_y' | 'breite' | 'hoehe' | 'rotation' | 'label' | 'bereich_id'>>
  ) => {
    if (demo) {
      setDekorationen((prev) => prev.map((d) => d.id === id ? { ...d, ...felder } : d));
      return;
    }
    await api.patch(`/dekorationen/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const loeschen = useCallback(async (id: string) => {
    if (demo) { setDekorationen((prev) => prev.filter((d) => d.id !== id)); return; }
    await api.delete(`/dekorationen/${id}`);
    await laden_();
  }, [demo, laden_]);

  return { dekorationen, laden, erstellen, aktualisieren, loeschen };
}
