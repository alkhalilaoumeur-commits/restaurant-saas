import { useState, useEffect, useCallback } from 'react';
import { Schicht } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

// ─── Demo-Daten ──────────────────────────────────────────────────────────────

function demoSchichten(start: string): Schicht[] {
  const basis = new Date(start);
  const schichten: Schicht[] = [];
  const mitarbeiter = [
    { id: 'dm1', name: 'Ilias (Demo)', rolle: 'admin' },
    { id: 'dm2', name: 'Anna Schmidt', rolle: 'kellner' },
    { id: 'dm3', name: 'Marco Rossi', rolle: 'kueche' },
  ];
  const zeiten = [
    { beginn: '08:00', ende: '14:00' },
    { beginn: '14:00', ende: '22:00' },
    { beginn: '10:00', ende: '18:00' },
  ];

  for (let tag = 0; tag < 7; tag++) {
    const datum = new Date(basis);
    datum.setDate(basis.getDate() + tag);
    const datumStr = datum.toISOString().slice(0, 10);

    // Nicht alle Mitarbeiter arbeiten jeden Tag
    mitarbeiter.forEach((m, i) => {
      if ((tag + i) % 3 !== 0) {
        const z = zeiten[(tag + i) % zeiten.length];
        schichten.push({
          id: `demo-s-${tag}-${i}`,
          restaurant_id: 'demo',
          mitarbeiter_id: m.id,
          mitarbeiter_name: m.name,
          mitarbeiter_rolle: m.rolle,
          datum: datumStr,
          beginn: z.beginn,
          ende: z.ende,
          notiz: null,
          erstellt_am: new Date().toISOString(),
        });
      }
    });
  }
  return schichten;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDienstplan(start: string, ende: string) {
  const [schichten, setSchichten] = useState<Schicht[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    setLaden(true);
    setFehler(null);
    if (demo) {
      setSchichten(demoSchichten(start));
      setLaden(false);
      return;
    }
    try {
      const data = await api.get<Schicht[]>(`/dienstplan?start=${start}&ende=${ende}`);
      setSchichten(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [start, ende, demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = useCallback(async (daten: {
    mitarbeiter_id: string;
    datum: string;
    beginn: string;
    ende: string;
    notiz?: string;
  }): Promise<{ warnungen: string[] }> => {
    if (demo) {
      const neu: Schicht = {
        id: `demo-${Date.now()}`,
        restaurant_id: 'demo',
        mitarbeiter_id: daten.mitarbeiter_id,
        datum: daten.datum,
        beginn: daten.beginn,
        ende: daten.ende,
        notiz: daten.notiz || null,
        erstellt_am: new Date().toISOString(),
      };
      setSchichten((prev) => [...prev, neu]);
      return { warnungen: [] };
    }
    const result = await api.post<{ warnungen?: string[] }>('/dienstplan', daten);
    await laden_();
    return { warnungen: result?.warnungen || [] };
  }, [demo, laden_]);

  const aktualisieren = useCallback(async (id: string, felder: {
    mitarbeiter_id?: string;
    datum?: string;
    beginn?: string;
    ende?: string;
    notiz?: string | null;
  }): Promise<{ warnungen: string[] }> => {
    if (demo) {
      setSchichten((prev) => prev.map((s) => s.id === id ? { ...s, ...felder } : s));
      return { warnungen: [] };
    }
    const result = await api.patch<{ warnungen?: string[] }>(`/dienstplan/${id}`, felder);
    await laden_();
    return { warnungen: result?.warnungen || [] };
  }, [demo, laden_]);

  const loeschen = useCallback(async (id: string) => {
    if (demo) {
      setSchichten((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    await api.delete(`/dienstplan/${id}`);
    await laden_();
  }, [demo, laden_]);

  return { schichten, laden, fehler, laden_, erstellen, aktualisieren, loeschen };
}
