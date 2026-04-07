import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Gericht, Kategorie, KategorieMitAnzahl } from '../types';
import { useAuthStore } from '../store/auth';
import { DEMO_GERICHTE, DEMO_KATEGORIEN } from '../lib/demo-daten';

export function useSpeisekarte(restaurantId?: string) {
  const [gerichte, setGerichte] = useState<Gericht[]>([]);
  const [kategorien, setKategorien] = useState<Kategorie[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) {
      setGerichte(DEMO_GERICHTE);
      setKategorien(DEMO_KATEGORIEN);
      setLaden(false);
      return;
    }
    try {
      // Gerichte laden (öffentlich oder mit Auth)
      const query = restaurantId ? `?restaurantId=${restaurantId}` : '';
      const g = await api.get<Gericht[]>(`/speisekarte${query}`);
      setGerichte(g);

      // Kategorien laden — für Gäste (mit restaurantId) und Mitarbeiter (mit Auth)
      if (restaurantId) {
        const k = await api.get<KategorieMitAnzahl[]>(`/speisekarte/kategorien?restaurantId=${restaurantId}`);
        setKategorien(k);
      } else {
        const k = await api.get<Kategorie[]>('/speisekarte/kategorien');
        setKategorien(k);
      }
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [restaurantId, demo]);

  useEffect(() => { laden_(); }, [laden_]);

  // ─── Gerichte ────────────────────────────────────────────────────────────────

  const verfuegbarkeitToggle = useCallback(async (id: string, verfuegbar: boolean) => {
    if (demo) {
      setGerichte((prev) => prev.map((g) => g.id === id ? { ...g, verfuegbar } : g));
      return;
    }
    await api.patch(`/speisekarte/${id}`, { verfuegbar });
    await laden_();
  }, [demo, laden_]);

  const gerichtAktualisieren = useCallback(async (id: string, felder: Partial<Gericht>) => {
    if (demo) {
      setGerichte((prev) => prev.map((g) => g.id === id ? { ...g, ...felder } : g));
      return;
    }
    await api.patch(`/speisekarte/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const gerichtLoeschen = useCallback(async (id: string) => {
    if (demo) {
      setGerichte((prev) => prev.filter((g) => g.id !== id));
      return;
    }
    await api.delete(`/speisekarte/${id}`);
    await laden_();
  }, [demo, laden_]);

  // ─── Kategorien ──────────────────────────────────────────────────────────────

  const kategorieErstellen = useCallback(async (name: string, bild_url?: string | null) => {
    if (demo) {
      const neue: Kategorie = { id: `k${Date.now()}`, restaurant_id: 'demo', name, reihenfolge: kategorien.length, bild_url: bild_url ?? null };
      setKategorien((prev) => [...prev, neue]);
      return;
    }
    await api.post('/speisekarte/kategorien', { name, reihenfolge: kategorien.length, bild_url: bild_url ?? null });
    await laden_();
  }, [demo, kategorien.length, laden_]);

  const kategorieAktualisieren = useCallback(async (id: string, felder: Partial<Kategorie>) => {
    if (demo) {
      setKategorien((prev) => prev.map((k) => k.id === id ? { ...k, ...felder } : k));
      return;
    }
    await api.patch(`/speisekarte/kategorien/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const kategorieLoeschen = useCallback(async (id: string) => {
    if (demo) {
      setKategorien((prev) => prev.filter((k) => k.id !== id));
      return;
    }
    await api.delete(`/speisekarte/kategorien/${id}`);
    await laden_();
  }, [demo, laden_]);

  return {
    gerichte, kategorien, laden, fehler, laden_,
    verfuegbarkeitToggle, gerichtAktualisieren, gerichtLoeschen,
    kategorieErstellen, kategorieAktualisieren, kategorieLoeschen,
  };
}
