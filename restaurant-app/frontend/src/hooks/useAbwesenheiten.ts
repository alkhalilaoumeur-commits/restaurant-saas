import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Abwesenheit, AbwesenheitTyp } from '../types';

export function useAbwesenheiten(von?: string, bis?: string) {
  const [eintraege, setEintraege] = useState<Abwesenheit[]>([]);
  const [laden, setLaden] = useState(true);

  const laden_ = useCallback(async () => {
    setLaden(true);
    try {
      const params = von && bis ? `?von=${von}&bis=${bis}` : '';
      const daten = await api.get<Abwesenheit[]>(`/abwesenheiten${params}`);
      setEintraege(daten);
    } finally {
      setLaden(false);
    }
  }, [von, bis]);

  useEffect(() => { laden_(); }, [laden_]);

  // Neue Abwesenheit eintragen
  const erstellen = useCallback(async (daten: {
    von_datum: string;
    bis_datum: string;
    typ: AbwesenheitTyp;
    notiz?: string | null;
    mitarbeiter_id?: string;  // nur für Admin
  }): Promise<Abwesenheit> => {
    const neu = await api.post<Abwesenheit>('/abwesenheiten', daten);
    setEintraege((prev) => [neu, ...prev]);
    return neu;
  }, []);

  // Abwesenheit löschen
  const loeschen = useCallback(async (id: string) => {
    await api.delete(`/abwesenheiten/${id}`);
    setEintraege((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { eintraege, laden, erstellen, loeschen, neu_laden: laden_ };
}
