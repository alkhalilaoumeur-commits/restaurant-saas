import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

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

  const neuladen = useCallback(async () => {
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
  }, []);

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
