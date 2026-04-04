import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Gericht, Kategorie } from '../types';

export function useSpeisekarte(restaurantId?: string) {
  const [gerichte, setGerichte] = useState<Gericht[]>([]);
  const [kategorien, setKategorien] = useState<Kategorie[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
    try {
      const url = restaurantId ? `/speisekarte?restaurantId=${restaurantId}` : '/speisekarte';
      const [g, k] = await Promise.all([
        api.get<Gericht[]>(url),
        restaurantId ? Promise.resolve([]) : api.get<Kategorie[]>('/speisekarte/kategorien'),
      ]);
      setGerichte(g);
      setKategorien(k);
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }, [restaurantId]);

  useEffect(() => { laden_(); }, [laden_]);

  const verfuegbarkeitToggle = useCallback(async (id: string, verfuegbar: boolean) => {
    await api.patch(`/speisekarte/${id}`, { verfuegbar });
    await laden_();
  }, [laden_]);

  const gerichtLoeschen = useCallback(async (id: string) => {
    await api.delete(`/speisekarte/${id}`);
    await laden_();
  }, [laden_]);

  return { gerichte, kategorien, laden, fehler, laden_, verfuegbarkeitToggle, gerichtLoeschen };
}
