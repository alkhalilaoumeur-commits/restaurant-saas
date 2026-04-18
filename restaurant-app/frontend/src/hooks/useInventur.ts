import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type {
  InventarArtikel, LagerBewegung, Lieferant, Rezeptur, InventurAuswertung
} from '../types';

// ─── Artikel ─────────────────────────────────────────────────────────────────

export function useArtikel() {
  const [artikel, setArtikel] = useState<InventarArtikel[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
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
  }, []);

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

  const laden_ = useCallback(async () => {
    try {
      setLaden(true);
      const daten = await api.get<Lieferant[]>('/inventur/lieferanten');
      setLieferanten(daten);
    } finally {
      setLaden(false);
    }
  }, []);

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

  const laden_ = useCallback(async () => {
    try {
      setLaden(true);
      const daten = await api.get<LagerBewegung[]>('/inventur/bewegungen');
      setBewegungen(daten);
    } finally {
      setLaden(false);
    }
  }, []);

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
