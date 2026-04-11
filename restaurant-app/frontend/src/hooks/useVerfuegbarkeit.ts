import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { MitarbeiterVerfuegbarkeit, VerfuegbarkeitTyp } from '../types';

export function useVerfuegbarkeit() {
  const [eintraege, setEintraege] = useState<MitarbeiterVerfuegbarkeit[]>([]);
  const [laden, setLaden] = useState(true);

  const laden_ = useCallback(async () => {
    try {
      const daten = await api.get<MitarbeiterVerfuegbarkeit[]>('/api/verfuegbarkeit');
      setEintraege(daten);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  // Eintrag setzen (Upsert) — für MA nur eigene, Admin kann mitarbeiter_id übergeben
  const setzen = useCallback(async (daten: {
    wochentag: number;
    typ: VerfuegbarkeitTyp;
    von?: string | null;
    bis?: string | null;
    notiz?: string | null;
    mitarbeiter_id?: string;   // nur für Admin
  }) => {
    const neuer = await api.post<MitarbeiterVerfuegbarkeit>('/api/verfuegbarkeit', daten);
    setEintraege((prev) => {
      // bestehenden Eintrag für denselben MA+Tag ersetzen, sonst anhängen
      const gefiltert = prev.filter(
        (e) => !(e.mitarbeiter_id === neuer.mitarbeiter_id && e.wochentag === neuer.wochentag)
      );
      return [...gefiltert, neuer];
    });
    return neuer;
  }, []);

  // Eintrag löschen
  const loeschen = useCallback(async (id: string) => {
    await api.delete(`/api/verfuegbarkeit/${id}`);
    setEintraege((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { eintraege, laden, setzen, loeschen };
}
