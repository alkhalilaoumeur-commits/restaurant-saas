import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

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

  const laden_ = useCallback(async () => {
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
  }, [datum]);

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
