import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Zusammenfassung {
  umsatz: number;
  bestellungen: number;
  durchschnitt: number;
  reservierungen: number;
}

export interface UmsatzProTag {
  datum: string;
  umsatz: number;
  anzahl: number;
}

export interface BeliebtesGericht {
  name: string;
  kategorie: string;
  menge: number;
  umsatz: number;
}

export interface Stosszeit {
  stunde: number;
  anzahl: number;
  umsatz: number;
}

export interface KategorieUmsatz {
  name: string;
  umsatz: number;
  anzahl: number;
}

export interface StatistikDaten {
  zeitraum: number;
  zusammenfassung: Zusammenfassung;
  umsatzProTag: UmsatzProTag[];
  beliebteGerichte: BeliebtesGericht[];
  stosszeiten: Stosszeit[];
  kategorieUmsatz: KategorieUmsatz[];
}

// ─── Demo-Daten ──────────────────────────────────────────────────────────────

function demoDaten(tage: number): StatistikDaten {
  const umsatzProTag: UmsatzProTag[] = [];
  const heute = new Date();
  for (let i = tage - 1; i >= 0; i--) {
    const d = new Date(heute);
    d.setDate(d.getDate() - i);
    umsatzProTag.push({
      datum: d.toISOString().slice(0, 10),
      umsatz: Math.round(200 + Math.random() * 600),
      anzahl: Math.round(8 + Math.random() * 25),
    });
  }
  const gesamtUmsatz = umsatzProTag.reduce((s, d) => s + d.umsatz, 0);
  const gesamtAnzahl = umsatzProTag.reduce((s, d) => s + d.anzahl, 0);

  return {
    zeitraum: tage,
    zusammenfassung: {
      umsatz: gesamtUmsatz,
      bestellungen: gesamtAnzahl,
      durchschnitt: gesamtAnzahl > 0 ? gesamtUmsatz / gesamtAnzahl : 0,
      reservierungen: Math.round(15 + Math.random() * 40),
    },
    umsatzProTag,
    beliebteGerichte: [
      { name: 'Margherita', kategorie: 'Pizza', menge: 84, umsatz: 756 },
      { name: 'Spaghetti Bolognese', kategorie: 'Pasta', menge: 67, umsatz: 804 },
      { name: 'Tiramisu', kategorie: 'Dessert', menge: 52, umsatz: 364 },
      { name: 'Caesar Salad', kategorie: 'Salate', menge: 45, umsatz: 405 },
      { name: 'Bruschetta', kategorie: 'Vorspeisen', menge: 41, umsatz: 287 },
      { name: 'Risotto', kategorie: 'Hauptgerichte', menge: 38, umsatz: 532 },
      { name: 'Panna Cotta', kategorie: 'Dessert', menge: 33, umsatz: 198 },
      { name: 'Lasagne', kategorie: 'Pasta', menge: 29, umsatz: 377 },
    ],
    stosszeiten: [
      { stunde: 10, anzahl: 3, umsatz: 45 },
      { stunde: 11, anzahl: 8, umsatz: 120 },
      { stunde: 12, anzahl: 22, umsatz: 440 },
      { stunde: 13, anzahl: 18, umsatz: 360 },
      { stunde: 14, anzahl: 7, umsatz: 105 },
      { stunde: 15, anzahl: 3, umsatz: 42 },
      { stunde: 16, anzahl: 4, umsatz: 56 },
      { stunde: 17, anzahl: 9, umsatz: 135 },
      { stunde: 18, anzahl: 25, umsatz: 575 },
      { stunde: 19, anzahl: 30, umsatz: 720 },
      { stunde: 20, anzahl: 22, umsatz: 506 },
      { stunde: 21, anzahl: 12, umsatz: 252 },
      { stunde: 22, anzahl: 5, umsatz: 85 },
    ],
    kategorieUmsatz: [
      { name: 'Pizza', umsatz: 1850, anzahl: 145 },
      { name: 'Pasta', umsatz: 1420, anzahl: 96 },
      { name: 'Hauptgerichte', umsatz: 980, anzahl: 58 },
      { name: 'Dessert', umsatz: 620, anzahl: 85 },
      { name: 'Salate', umsatz: 480, anzahl: 52 },
      { name: 'Vorspeisen', umsatz: 350, anzahl: 41 },
    ],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useStatistiken(tage: number = 7) {
  const [daten, setDaten] = useState<StatistikDaten | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    setLaden(true);
    setFehler(null);
    if (demo) {
      setDaten(demoDaten(tage));
      setLaden(false);
      return;
    }
    try {
      const res = await api.get<StatistikDaten>(`/statistiken?tage=${tage}`);
      setDaten(res);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden der Statistiken');
    } finally {
      setLaden(false);
    }
  }, [tage, demo]);

  useEffect(() => { laden_(); }, [laden_]);

  return { daten, laden, fehler, neu_laden: laden_ };
}
