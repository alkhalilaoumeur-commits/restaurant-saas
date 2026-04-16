import { useState, useEffect, useCallback } from 'react';
import { Bewertung, BewertungStats } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export function useBewertungen() {
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);
  const [stats, setStats] = useState<BewertungStats | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) {
      setBewertungen(DEMO_BEWERTUNGEN);
      setStats(DEMO_STATS);
      setLaden(false);
      return;
    }
    try {
      const [liste, statistiken] = await Promise.all([
        api.get<Bewertung[]>('/bewertungen'),
        api.get<BewertungStats>('/bewertungen/stats'),
      ]);
      setBewertungen(liste);
      setStats(statistiken);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { laden_(); }, [laden_]);

  /** Admin sendet manuell eine Bewertungsanfrage an einen Gast */
  const anfrageSenden = useCallback(async (daten: {
    gast_name: string;
    gast_email: string;
    buchungs_id?: string;
  }) => {
    if (demo) return;
    await api.post('/bewertungen/anfrage', daten);
  }, [demo]);

  /** Admin antwortet auf eine Bewertung */
  const antworten = useCallback(async (id: string, antwort_text: string) => {
    if (demo) {
      setBewertungen((prev) =>
        prev.map((b) => b.id === id ? { ...b, antwort_text, antwort_datum: new Date().toISOString() } : b)
      );
      return;
    }
    await api.post(`/bewertungen/${id}/antwort`, { antwort_text });
    await laden_();
  }, [demo, laden_]);

  return { bewertungen, stats, laden, fehler, laden_, anfrageSenden, antworten };
}

// ─── Demo-Daten ───────────────────────────────────────────────────────────────

const DEMO_BEWERTUNGEN: Bewertung[] = [
  {
    id: 'b1', restaurant_id: 'demo', buchungs_id: null, token: 'demo-token-1',
    stern: 5, kommentar: 'Absolut fantastisch! Das Essen war hervorragend und der Service sehr aufmerksam. Kommen definitiv wieder!',
    gast_name: 'Maria Müller', gast_email: 'maria@example.com',
    dsgvo_einwilligung: true, antwort_text: 'Vielen Dank für Ihr wunderbares Feedback, Frau Müller! Wir freuen uns auf Ihren nächsten Besuch.',
    antwort_datum: '2026-04-14T10:00:00Z', status: 'abgeschlossen', erstellt_am: '2026-04-13T18:00:00Z',
  },
  {
    id: 'b2', restaurant_id: 'demo', buchungs_id: null, token: 'demo-token-2',
    stern: 4, kommentar: 'Sehr gutes Essen, die Wartezeit war etwas lang aber das Personal war freundlich.',
    gast_name: 'Thomas Bauer', gast_email: 'thomas@example.com',
    dsgvo_einwilligung: true, antwort_text: null, antwort_datum: null,
    status: 'abgeschlossen', erstellt_am: '2026-04-12T20:00:00Z',
  },
  {
    id: 'b3', restaurant_id: 'demo', buchungs_id: null, token: 'demo-token-3',
    stern: 2, kommentar: 'Das Essen war kalt und der Service ließ zu wünschen übrig.',
    gast_name: 'Anna Schmidt', gast_email: 'anna@example.com',
    dsgvo_einwilligung: true, antwort_text: null, antwort_datum: null,
    status: 'abgeschlossen', erstellt_am: '2026-04-11T19:30:00Z',
  },
  {
    id: 'b4', restaurant_id: 'demo', buchungs_id: null, token: 'demo-token-4',
    stern: null, kommentar: null,
    gast_name: 'Klaus Weber', gast_email: 'klaus@example.com',
    dsgvo_einwilligung: false, antwort_text: null, antwort_datum: null,
    status: 'offen', erstellt_am: '2026-04-15T09:00:00Z',
  },
];

const DEMO_STATS: BewertungStats = {
  gesamt: 4,
  abgeschlossen: 3,
  durchschnitt: 3.7,
  verteilung: { '1': 0, '2': 1, '3': 0, '4': 1, '5': 1 },
};
