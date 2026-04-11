import { useState, useEffect, useCallback } from 'react';
import { Gast, GastMitReservierungen } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export function useGaeste() {
  const [gaeste, setGaeste] = useState<Gast[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const auth = useAuthStore((s) => s.mitarbeiter);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) {
      setGaeste(DEMO_GAESTE);
      setLaden(false);
      return;
    }
    if (!auth?.restaurantId) { setLaden(false); return; }
    try {
      const data = await api.get<Gast[]>('/gaeste');
      setGaeste(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo, auth?.restaurantId]);

  useEffect(() => { laden_(); }, [laden_]);

  /** Gast-Profil inkl. Reservierungsliste laden */
  const profil = useCallback(async (id: string): Promise<GastMitReservierungen> => {
    if (demo) {
      const g = DEMO_GAESTE.find((g) => g.id === id)!;
      return { ...g, reservierungen: DEMO_GAST_RESERVIERUNGEN[id] ?? [] };
    }
    return api.get<GastMitReservierungen>(`/gaeste/${id}`);
  }, [demo]);

  /** Neuen Gast manuell anlegen */
  const erstellen = useCallback(async (daten: {
    name: string;
    email?: string | null;
    telefon?: string | null;
    notizen?: string | null;
    tags?: string[];
  }): Promise<Gast> => {
    if (demo) {
      const neu: Gast = {
        id: `demo-gast-${Date.now()}`,
        restaurant_id: 'demo',
        name: daten.name,
        email: daten.email ?? null,
        telefon: daten.telefon ?? null,
        notizen: daten.notizen ?? null,
        tags: daten.tags ?? [],
        erstellt_am: new Date().toISOString(),
        aktualisiert_am: new Date().toISOString(),
        besuche: 0,
        letzter_besuch: null,
      };
      setGaeste((prev) => [neu, ...prev]);
      return neu;
    }
    const gast = await api.post<Gast>('/gaeste', daten);
    setGaeste((prev) => [gast, ...prev]);
    return gast;
  }, [demo]);

  /** Gast-Profil aktualisieren (Notizen, Tags, Kontakt) */
  const aktualisieren = useCallback(async (id: string, felder: {
    name?: string;
    email?: string | null;
    telefon?: string | null;
    notizen?: string | null;
    tags?: string[];
  }): Promise<void> => {
    if (demo) {
      setGaeste((prev) => prev.map((g) => g.id === id ? { ...g, ...felder } : g));
      return;
    }
    await api.patch(`/gaeste/${id}`, felder);
    // Lokalen State aktualisieren (optimistisch)
    setGaeste((prev) => prev.map((g) => g.id === id ? { ...g, ...felder } : g));
  }, [demo]);

  /** Gast löschen (DSGVO) */
  const loeschen = useCallback(async (id: string): Promise<void> => {
    if (demo) {
      setGaeste((prev) => prev.filter((g) => g.id !== id));
      return;
    }
    await api.delete(`/gaeste/${id}`);
    setGaeste((prev) => prev.filter((g) => g.id !== id));
  }, [demo]);

  return { gaeste, laden, fehler, laden_, profil, erstellen, aktualisieren, loeschen };
}

// ─── Demo-Daten ───────────────────────────────────────────────────────────────

const heute = new Date().toISOString().slice(0, 10);
const vorMonat = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
const vorWoche = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
const gestern = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const DEMO_GAESTE: Gast[] = [
  {
    id: 'dg1', restaurant_id: 'demo', name: 'Familie Müller',
    email: 'mueller@example.de', telefon: '0711 234567',
    notizen: 'Bevorzugt ruhige Ecke. Kommen regelmäßig zum Geburtstag.',
    tags: ['VIP', 'Stammgast', 'Geburtstagsgast'],
    erstellt_am: new Date(Date.now() - 90 * 86400000).toISOString(),
    aktualisiert_am: vorWoche,
    besuche: 8, letzter_besuch: vorWoche,
  },
  {
    id: 'dg2', restaurant_id: 'demo', name: 'Schmidt, Thomas',
    email: 'thomas.schmidt@firma.de', telefon: null,
    notizen: null,
    tags: ['Geschäftsgast', 'Vegetarisch'],
    erstellt_am: new Date(Date.now() - 45 * 86400000).toISOString(),
    aktualisiert_am: vorMonat,
    besuche: 3, letzter_besuch: vorMonat,
  },
  {
    id: 'dg3', restaurant_id: 'demo', name: 'Geburtstagsfeier Weber',
    email: 'weber@test.de', telefon: '0172 9876543',
    notizen: 'Torte wird selbst mitgebracht. Hochstuhl benötigt für Kind.',
    tags: ['Geburtstagsgast'],
    erstellt_am: new Date(Date.now() - 5 * 86400000).toISOString(),
    aktualisiert_am: new Date(Date.now() - 5 * 86400000).toISOString(),
    besuche: 1, letzter_besuch: heute,
  },
  {
    id: 'dg4', restaurant_id: 'demo', name: 'Dr. Bauer',
    email: null, telefon: '089 5555111',
    notizen: 'Vegetarisch. Kein Knoblauch.',
    tags: ['Stammgast', 'Vegetarisch'],
    erstellt_am: new Date(Date.now() - 120 * 86400000).toISOString(),
    aktualisiert_am: gestern,
    besuche: 12, letzter_besuch: gestern,
  },
  {
    id: 'dg5', restaurant_id: 'demo', name: 'Klassen, Sarah',
    email: 'sarah.k@web.de', telefon: null,
    notizen: 'Hat einmal nicht abgesagt.',
    tags: ['No-Show'],
    erstellt_am: new Date(Date.now() - 60 * 86400000).toISOString(),
    aktualisiert_am: new Date(Date.now() - 60 * 86400000).toISOString(),
    besuche: 1, letzter_besuch: vorMonat,
  },
];

const DEMO_GAST_RESERVIERUNGEN: Record<string, import('../types').GastReservierung[]> = {
  dg1: [
    { id: 'r1', datum: vorWoche + 'T19:00:00', personen: 4, status: 'abgeschlossen', anlass: 'geburtstag', tisch_nummer: 5 },
    { id: 'r2', datum: vorMonat + 'T20:00:00', personen: 2, status: 'abgeschlossen', anlass: null, tisch_nummer: 2 },
  ],
  dg2: [
    { id: 'r3', datum: vorMonat + 'T12:00:00', personen: 3, status: 'abgeschlossen', anlass: 'geschaeft', tisch_nummer: 7 },
  ],
  dg3: [
    { id: 'r4', datum: heute + 'T20:00:00', personen: 8, status: 'bestaetigt', anlass: 'geburtstag', tisch_nummer: 4 },
  ],
  dg4: [
    { id: 'r5', datum: gestern + 'T19:30:00', personen: 2, status: 'abgeschlossen', anlass: null, tisch_nummer: 3 },
  ],
};
