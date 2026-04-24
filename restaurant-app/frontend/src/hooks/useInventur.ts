import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type {
  InventarArtikel, LagerBewegung, Lieferant, Rezeptur, InventurAuswertung
} from '../types';

const DEMO_ARTIKEL: InventarArtikel[] = [
  { id: 'a1', restaurant_id: 'demo', lieferant_id: 'l1', lieferant_name: 'Frische Ware GmbH', name: 'Tomaten', kategorie: 'Gemüse', einheit: 'kg', aktueller_bestand: 8, mindestbestand: 5, einkaufspreis: 2.40, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
  { id: 'a2', restaurant_id: 'demo', lieferant_id: 'l1', lieferant_name: 'Frische Ware GmbH', name: 'Mozzarella', kategorie: 'Milchprodukte', einheit: 'kg', aktueller_bestand: 3, mindestbestand: 4, einkaufspreis: 8.90, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z', unter_mindestbestand: true },
  { id: 'a3', restaurant_id: 'demo', lieferant_id: 'l2', lieferant_name: 'Weinhaus Müller', name: 'Rotwein Chianti', kategorie: 'Getränke', einheit: 'Flaschen', aktueller_bestand: 24, mindestbestand: 12, einkaufspreis: 6.50, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
  { id: 'a4', restaurant_id: 'demo', lieferant_id: null, lieferant_name: null, name: 'Olivenöl Extra Virgin', kategorie: 'Öle & Essig', einheit: 'Liter', aktueller_bestand: 2, mindestbestand: 5, einkaufspreis: 12.00, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z', unter_mindestbestand: true },
  { id: 'a5', restaurant_id: 'demo', lieferant_id: 'l1', lieferant_name: 'Frische Ware GmbH', name: 'Rinderhüftsteak', kategorie: 'Fleisch', einheit: 'kg', aktueller_bestand: 6, mindestbestand: 3, einkaufspreis: 22.00, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
  { id: 'a6', restaurant_id: 'demo', lieferant_id: 'l2', lieferant_name: 'Weinhaus Müller', name: 'Prosecco', kategorie: 'Getränke', einheit: 'Flaschen', aktueller_bestand: 18, mindestbestand: 10, einkaufspreis: 5.20, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
];

const DEMO_LIEFERANTEN: Lieferant[] = [
  { id: 'l1', restaurant_id: 'demo', name: 'Frische Ware GmbH', kontakt_email: 'bestellung@frische-ware.de', kontakt_telefon: '+49 30 12345678', liefertage: ['Mo', 'Mi', 'Fr'], notiz: 'Lieferung bis 8 Uhr morgens', aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
  { id: 'l2', restaurant_id: 'demo', name: 'Weinhaus Müller', kontakt_email: 'info@weinhaus-mueller.de', kontakt_telefon: '+49 89 9876543', liefertage: ['Di', 'Do'], notiz: null, aktiv: true, erstellt_am: '2026-01-01T00:00:00Z' },
];

const DEMO_BEWEGUNGEN: LagerBewegung[] = [
  { id: 'bw1', restaurant_id: 'demo', artikel_id: 'a1', artikel_name: 'Tomaten', typ: 'eingang', menge: 10, bestand_vorher: 3, bestand_nachher: 13, notiz: 'Wochenlieferung', erstellt_am: '2026-04-22T08:00:00Z', mitarbeiter_name: 'Ilias (Demo)' } as any,
  { id: 'bw2', restaurant_id: 'demo', artikel_id: 'a2', artikel_name: 'Mozzarella', typ: 'abgang', menge: 2, bestand_vorher: 5, bestand_nachher: 3, notiz: 'Verbrauch Mittagsservice', erstellt_am: '2026-04-23T12:00:00Z', mitarbeiter_name: 'Ilias (Demo)' } as any,
  { id: 'bw3', restaurant_id: 'demo', artikel_id: 'a4', artikel_name: 'Olivenöl Extra Virgin', typ: 'abgang', menge: 1, bestand_vorher: 3, bestand_nachher: 2, notiz: null, erstellt_am: '2026-04-24T09:30:00Z', mitarbeiter_name: 'Ilias (Demo)' } as any,
];

// ─── Artikel ─────────────────────────────────────────────────────────────────

export function useArtikel() {
  const [artikel, setArtikel] = useState<InventarArtikel[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setArtikel(DEMO_ARTIKEL); setLaden(false); return; }
    try {
      setLaden(true);
      const daten = await api.get<InventarArtikel[]>('/inventur/artikel');
      setArtikel(daten);
      setFehler(null);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = async (daten: {
    name: string; kategorie: string; einheit: string;
    mindestbestand?: number; einkaufspreis?: number | null;
    lieferant_id?: string | null; aktueller_bestand?: number;
  }) => {
    const neu = await api.post<InventarArtikel>('/inventur/artikel', daten);
    setArtikel(prev => [...prev, neu]);
    return neu;
  };

  const aktualisieren = async (id: string, daten: Partial<InventarArtikel>) => {
    const aktuell = await api.put<InventarArtikel>(`/inventur/artikel/${id}`, daten);
    setArtikel(prev => prev.map(a => a.id === id ? aktuell : a));
    return aktuell;
  };

  const loeschen = async (id: string) => {
    await api.delete(`/inventur/artikel/${id}`);
    setArtikel(prev => prev.filter(a => a.id !== id));
  };

  return { artikel, laden, fehler, neu_laden: laden_, erstellen, aktualisieren, loeschen };
}

// ─── Lieferanten ─────────────────────────────────────────────────────────────

export function useLieferanten() {
  const [lieferanten, setLieferanten] = useState<Lieferant[]>([]);
  const [laden, setLaden] = useState(true);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setLieferanten(DEMO_LIEFERANTEN); setLaden(false); return; }
    try {
      setLaden(true);
      const daten = await api.get<Lieferant[]>('/inventur/lieferanten');
      setLieferanten(daten);
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = async (daten: { name: string; kontakt_email?: string; kontakt_telefon?: string; liefertage?: string[]; notiz?: string }) => {
    const neu = await api.post<Lieferant>('/inventur/lieferanten', daten);
    setLieferanten(prev => [...prev, neu]);
    return neu;
  };

  const aktualisieren = async (id: string, daten: Partial<Lieferant>) => {
    const aktuell = await api.put<Lieferant>(`/inventur/lieferanten/${id}`, daten);
    setLieferanten(prev => prev.map(l => l.id === id ? aktuell : l));
    return aktuell;
  };

  const loeschen = async (id: string) => {
    await api.delete(`/inventur/lieferanten/${id}`);
    setLieferanten(prev => prev.filter(l => l.id !== id));
  };

  return { lieferanten, laden, neu_laden: laden_, erstellen, aktualisieren, loeschen };
}

// ─── Bewegungen ──────────────────────────────────────────────────────────────

export function useBewegungen() {
  const [bewegungen, setBewegungen] = useState<LagerBewegung[]>([]);
  const [laden, setLaden] = useState(true);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setBewegungen(DEMO_BEWEGUNGEN); setLaden(false); return; }
    try {
      setLaden(true);
      const daten = await api.get<LagerBewegung[]>('/inventur/bewegungen');
      setBewegungen(daten);
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  const buchen = async (daten: {
    artikel_id: string; typ: 'eingang' | 'abgang' | 'korrektur'; menge: number; notiz?: string;
  }) => {
    const result = await api.post<{ bewegung: LagerBewegung; artikel: InventarArtikel }>('/inventur/bewegung', daten);
    await laden_(); // Bewegungen neu laden
    return result;
  };

  return { bewegungen, laden, neu_laden: laden_, buchen };
}

// ─── Rezepturen ──────────────────────────────────────────────────────────────

export function useRezepturen(gerichtId: string | null) {
  const [rezepturen, setRezepturen] = useState<Rezeptur[]>([]);
  const [laden, setLaden] = useState(false);

  useEffect(() => {
    if (!gerichtId) { setRezepturen([]); return; }
    setLaden(true);
    api.get<Rezeptur[]>(`/inventur/rezepturen/${gerichtId}`)
      .then(setRezepturen)
      .finally(() => setLaden(false));
  }, [gerichtId]);

  const erstellen = async (daten: { gericht_id: string; artikel_id: string; menge: number }) => {
    const neu = await api.post<Rezeptur>('/inventur/rezepturen', daten);
    setRezepturen(prev => [...prev.filter(r => r.artikel_id !== neu.artikel_id), neu]);
    return neu;
  };

  const loeschen = async (id: string) => {
    await api.delete(`/inventur/rezepturen/${id}`);
    setRezepturen(prev => prev.filter(r => r.id !== id));
  };

  return { rezepturen, laden, erstellen, loeschen };
}

// ─── Auswertung ───────────────────────────────────────────────────────────────

export function useInventurAuswertung(tage = 30) {
  const [auswertung, setAuswertung] = useState<InventurAuswertung[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    setLaden(true);
    api.get<InventurAuswertung[]>(`/inventur/auswertung?tage=${tage}`)
      .then(setAuswertung)
      .finally(() => setLaden(false));
  }, [tage]);

  return { auswertung, laden };
}

// ─── Bestellvorschläge ────────────────────────────────────────────────────────

export function useVorschlaege() {
  const [vorschlaege, setVorschlaege] = useState<InventarArtikel[]>([]);

  useEffect(() => {
    api.get<InventarArtikel[]>('/inventur/vorschlaege').then(setVorschlaege).catch(() => {});
  }, []);

  return { vorschlaege };
}

// ─── Lieferanten-Bestellanfrage ───────────────────────────────────────────────

export async function bestellanfrageSenden(daten: {
  artikel: { id: string; bestellmenge: number }[];
  notiz?: string;
}): Promise<{ gesendet_an: string[]; ohne_email: string[] }> {
  return api.post('/inventur/bestellanfrage', daten);
}
