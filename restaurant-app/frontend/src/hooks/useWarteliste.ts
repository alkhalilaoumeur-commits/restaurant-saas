import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';

const DEMO_WARTELISTE: Wartelisteneintrag[] = [
  { id: 'w1', restaurant_id: 'demo', gast_name: 'Familie Weber', telefon: '+49 170 5551234', email: null, personen: 4, datum: new Date().toISOString().slice(0, 10), anmerkung: 'Kinderstuhl benötigt', quelle: 'walk_in', status: 'wartend', position: 1, benachrichtigt_am: null, eingetragen_am: new Date().toISOString() },
  { id: 'w2', restaurant_id: 'demo', gast_name: 'Herr Becker', telefon: '+49 151 9998877', email: 'becker@mail.de', personen: 2, datum: new Date().toISOString().slice(0, 10), anmerkung: null, quelle: 'online', status: 'benachrichtigt', position: 2, benachrichtigt_am: new Date().toISOString(), eingetragen_am: new Date().toISOString() },
  { id: 'w3', restaurant_id: 'demo', gast_name: 'Gruppe Schulze', telefon: null, email: null, personen: 6, datum: new Date().toISOString().slice(0, 10), anmerkung: 'Fensterpflatz gewünscht', quelle: 'walk_in', status: 'wartend', position: 3, benachrichtigt_am: null, eingetragen_am: new Date().toISOString() },
];

export interface Wartelisteneintrag {
  id: string;
  restaurant_id: string;
  gast_name: string;
  telefon: string | null;
  email: string | null;
  personen: number;
  datum: string;
  anmerkung: string | null;
  quelle: 'walk_in' | 'online';
  status: 'wartend' | 'benachrichtigt' | 'bestaetigt' | 'abgelaufen' | 'storniert';
  position: number;
  benachrichtigt_am: string | null;
  eingetragen_am: string;
}

export function useWarteliste(datum: string) {
  const [eintraege, setEintraege] = useState<Wartelisteneintrag[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setEintraege(DEMO_WARTELISTE); setLaden(false); return; }
    setLaden(true);
    setFehler(null);
    try {
      const daten = await api.get<Wartelisteneintrag[]>(`/warteliste?datum=${datum}`);
      setEintraege(daten);
    } catch (e: unknown) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [datum, demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const hinzufuegen = async (daten: {
    gast_name: string;
    telefon?: string;
    email?: string;
    personen: number;
    anmerkung?: string;
  }) => {
    const neu = await api.post<Wartelisteneintrag>('/warteliste', { ...daten, datum });
    setEintraege((prev) => [...prev, neu]);
    return neu;
  };

  const bestaetigen = async (id: string) => {
    const aktualisiert = await api.patch<Wartelisteneintrag>(`/warteliste/${id}/bestaetigen`, {});
    setEintraege((prev) => prev.map((e) => (e.id === id ? aktualisiert : e)));
  };

  const stornieren = async (id: string) => {
    const aktualisiert = await api.patch<Wartelisteneintrag>(`/warteliste/${id}/stornieren`, {});
    setEintraege((prev) => prev.map((e) => (e.id === id ? aktualisiert : e)));
  };

  return { eintraege, laden, fehler, neu_laden: laden_, hinzufuegen, bestaetigen, stornieren };
}
