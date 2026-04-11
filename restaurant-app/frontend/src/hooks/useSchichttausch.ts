import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Schichttausch } from '../types';

/**
 * Hook für Schichttausch-Anfragen.
 * Lädt alle aktiven Tausche (offen + angeboten) des Restaurants.
 *
 * Datenfluss:
 *   GET  /api/dienstplan/tausch            → Liste laden
 *   POST /api/dienstplan/tausch            → Tap 1: Tausch anbieten
 *   POST /api/dienstplan/tausch/:id/annehmen    → Tap 2: Tausch annehmen
 *   POST /api/dienstplan/tausch/:id/genehmigen  → Tap 3: Admin genehmigt
 *   POST /api/dienstplan/tausch/:id/ablehnen    → Admin lehnt ab
 *   POST /api/dienstplan/tausch/:id/zurueckziehen → Anbieter zieht zurück
 */
export function useSchichttausch() {
  const [tausche, setTausche] = useState<Schichttausch[]>([]);
  const [laden, setLaden] = useState(false);

  const laden_ = useCallback(async () => {
    setLaden(true);
    try {
      const daten = await api.get<Schichttausch[]>('/dienstplan/tausch');
      setTausche(daten);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  /** Tap 1a: Eigene Schicht offen freigeben  |  Tap 1b: Direkten Tausch vorschlagen (zielSchichtId gesetzt) */
  async function anbieten(schichtId: string, zielSchichtId?: string): Promise<Schichttausch> {
    const body: Record<string, string> = { schicht_id: schichtId };
    if (zielSchichtId) body.ziel_schicht_id = zielSchichtId;
    const tausch = await api.post<Schichttausch>('/dienstplan/tausch', body);
    setTausche((prev) => [tausch, ...prev]);
    return tausch;
  }

  /** Tap 2: Tausch-Anfrage annehmen und eigene Schicht anbieten */
  async function annehmen(tauschId: string, eigeneSchichtId: string): Promise<Schichttausch> {
    const aktualisiert = await api.post<Schichttausch>(
      `/dienstplan/tausch/${tauschId}/annehmen`,
      { schicht_id: eigeneSchichtId }
    );
    setTausche((prev) => prev.map((t) => (t.id === tauschId ? aktualisiert : t)));
    return aktualisiert;
  }

  /** Tap 3: Admin genehmigt → Schichten werden getauscht */
  async function genehmigen(tauschId: string): Promise<void> {
    await api.post(`/dienstplan/tausch/${tauschId}/genehmigen`, {});
    // Genehmigter Tausch aus der Liste entfernen (wird nicht mehr in "aktiv" gezeigt)
    setTausche((prev) => prev.filter((t) => t.id !== tauschId));
  }

  /** Admin oder MA lehnt ab */
  async function ablehnen(tauschId: string): Promise<void> {
    await api.post(`/dienstplan/tausch/${tauschId}/ablehnen`, {});
    setTausche((prev) => prev.filter((t) => t.id !== tauschId));
  }

  /** Anbieter zieht seine eigene Anfrage zurück */
  async function zurueckziehen(tauschId: string): Promise<void> {
    await api.post(`/dienstplan/tausch/${tauschId}/zurueckziehen`, {});
    setTausche((prev) => prev.filter((t) => t.id !== tauschId));
  }

  return { tausche, laden, laden_, anbieten, annehmen, genehmigen, ablehnen, zurueckziehen };
}
