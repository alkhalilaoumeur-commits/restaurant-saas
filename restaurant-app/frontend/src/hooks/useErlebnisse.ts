import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';

const DEMO_ERLEBNISSE: Erlebnis[] = [
  { id: 'e1', name: 'Weinverkostung Abend', beschreibung: '5 erlesene Weine mit Sommelier-Führung und Käseplatte', preis_cent: 8900, max_personen: 12, dauer_min: 120, aktiv: true, bild_url: null, erstellt_am: '2026-01-10T18:00:00Z' },
  { id: 'e2', name: 'Kochkurs: Pasta Italiana', beschreibung: 'Frische Pasta selbst gemacht – mit unserem Küchenchef', preis_cent: 6500, max_personen: 8, dauer_min: 150, aktiv: true, bild_url: null, erstellt_am: '2026-02-01T10:00:00Z' },
  { id: 'e3', name: 'Romantisches Candle-Light-Dinner', beschreibung: 'Exklusives 5-Gang-Menü für 2 Personen, Privatbereich', preis_cent: 18000, max_personen: 2, dauer_min: 180, aktiv: true, bild_url: null, erstellt_am: '2026-02-14T19:00:00Z' },
];

const DEMO_BUCHUNGEN: ErlebnisBuchung[] = [
  { id: 'b1', erlebnis_id: 'e1', erlebnis_name: 'Weinverkostung Abend', preis_cent: 8900, dauer_min: 120, gast_name: 'Maria Schmidt', gast_email: 'maria@example.de', gast_telefon: '+49 170 1234567', datum: '2026-04-26', uhrzeit: '19:00', personen: 4, status: 'bezahlt', token: 'demo-token-1', anmerkungen: null, erstellt_am: '2026-04-20T09:00:00Z' },
  { id: 'b2', erlebnis_id: 'e2', erlebnis_name: 'Kochkurs: Pasta Italiana', preis_cent: 6500, dauer_min: 150, gast_name: 'Thomas Müller', gast_email: 'thomas@example.de', gast_telefon: null, datum: '2026-04-27', uhrzeit: '15:00', personen: 2, status: 'ausstehend', token: 'demo-token-2', anmerkungen: 'Bitte vegetarisch', erstellt_am: '2026-04-22T14:00:00Z' },
  { id: 'b3', erlebnis_id: 'e3', erlebnis_name: 'Romantisches Candle-Light-Dinner', preis_cent: 18000, dauer_min: 180, gast_name: 'Anna & Peter Koch', gast_email: 'anna@example.de', gast_telefon: '+49 151 9876543', datum: '2026-05-01', uhrzeit: '20:00', personen: 2, status: 'bezahlt', token: 'demo-token-3', anmerkungen: 'Jahrestag – Blumen bitte', erstellt_am: '2026-04-18T11:00:00Z' },
];

export interface Erlebnis {
  id: string;
  name: string;
  beschreibung: string | null;
  preis_cent: number;
  max_personen: number;
  dauer_min: number;
  aktiv: boolean;
  bild_url: string | null;
  erstellt_am: string;
}

export interface ErlebnisBuchung {
  id: string;
  erlebnis_id: string;
  erlebnis_name: string;
  preis_cent: number;
  dauer_min: number;
  gast_name: string;
  gast_email: string;
  gast_telefon: string | null;
  datum: string;
  uhrzeit: string;
  personen: number;
  status: 'ausstehend' | 'bezahlt' | 'storniert' | 'abgeschlossen';
  token: string;
  anmerkungen: string | null;
  erstellt_am: string;
}

export function useErlebnisse() {
  const [erlebnisse, setErlebnisse]   = useState<Erlebnis[]>([]);
  const [buchungen, setBuchungen]     = useState<ErlebnisBuchung[]>([]);
  const [laden, setLaden]             = useState(true);
  const [fehler, setFehler]           = useState('');
  const demo = useAuthStore((s) => s.demo);

  const neuladen = useCallback(async () => {
    if (demo) {
      setErlebnisse(DEMO_ERLEBNISSE);
      setBuchungen(DEMO_BUCHUNGEN);
      setLaden(false);
      return;
    }
    try {
      const [e, b] = await Promise.all([
        api.get<Erlebnis[]>('/erlebnisse'),
        api.get<ErlebnisBuchung[]>('/erlebnisse/buchungen'),
      ]);
      setErlebnisse(e);
      setBuchungen(b);
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }, [demo]);

  useEffect(() => { neuladen(); }, [neuladen]);

  const erstellen = async (daten: Partial<Erlebnis>): Promise<Erlebnis> => {
    const neu = await api.post<Erlebnis>('/erlebnisse', daten);
    setErlebnisse(prev => [neu, ...prev]);
    return neu;
  };

  const aktualisieren = async (id: string, daten: Partial<Erlebnis>): Promise<Erlebnis> => {
    const aktuell = await api.put<Erlebnis>(`/erlebnisse/${id}`, daten);
    setErlebnisse(prev => prev.map(e => e.id === id ? aktuell : e));
    return aktuell;
  };

  const loeschen = async (id: string) => {
    await api.delete(`/erlebnisse/${id}`);
    setErlebnisse(prev => prev.filter(e => e.id !== id));
  };

  const buchungStatusAendern = async (id: string, status: ErlebnisBuchung['status']) => {
    await api.put(`/erlebnisse/buchungen/${id}/status`, { status });
    setBuchungen(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return { erlebnisse, buchungen, laden, fehler, erstellen, aktualisieren, loeschen, buchungStatusAendern, neuladen };
}
