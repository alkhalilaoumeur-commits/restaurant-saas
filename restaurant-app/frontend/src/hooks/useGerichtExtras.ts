import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ExtrasGruppe } from '../types';

/**
 * Lädt die Extras-Gruppen eines Gerichts (öffentlich, kein Auth nötig).
 * Wird erst aufgerufen wenn der Gast ein Gericht antippt → Detail-Modal öffnet.
 *
 * Datenfluss: Frontend → GET /api/speisekarte/{gerichtId}/extras → Backend
 *             → extras_gruppen + extras Tabellen → nur verfügbare zurück
 */
export function useGerichtExtras(gerichtId: string | null) {
  const [gruppen, setGruppen] = useState<ExtrasGruppe[]>([]);
  const [laden, setLaden] = useState(false);

  useEffect(() => {
    if (!gerichtId) {
      setGruppen([]);
      return;
    }

    let abgebrochen = false;
    setLaden(true);

    api.get<ExtrasGruppe[]>(`/speisekarte/${gerichtId}/extras`)
      .then((data) => {
        if (!abgebrochen) setGruppen(data);
      })
      .catch(() => {
        if (!abgebrochen) setGruppen([]);
      })
      .finally(() => {
        if (!abgebrochen) setLaden(false);
      });

    return () => { abgebrochen = true; };
  }, [gerichtId]);

  return { gruppen, laden, hatExtras: gruppen.length > 0 };
}
