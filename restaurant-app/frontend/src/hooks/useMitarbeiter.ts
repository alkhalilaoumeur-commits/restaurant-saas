import { useState, useEffect, useCallback } from 'react';
import { MitarbeiterDetail, Rolle } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export function useMitarbeiter() {
  const [mitarbeiter, setMitarbeiter] = useState<MitarbeiterDetail[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);
  const auth = useAuthStore((s) => s.mitarbeiter);

  const laden_ = useCallback(async () => {
    if (demo) {
      setMitarbeiter(DEMO_MITARBEITER_LISTE);
      setLaden(false);
      return;
    }
    try {
      if (!auth?.restaurantId) { setLaden(false); return; }
      if (auth.rolle === 'admin') {
        // Admin: alle Mitarbeiter mit vollen Details (inkl. Stundenlohn, E-Mail)
        const data = await api.get<MitarbeiterDetail[]>('/mitarbeiter');
        setMitarbeiter(data);
      } else {
        // Kellner/Küche: alle aktiven MA (nur Basis-Felder für Dienstplan) + eigene Details
        const [alle, ich] = await Promise.all([
          api.get<MitarbeiterDetail[]>('/mitarbeiter/alle'),
          api.get<MitarbeiterDetail>('/mitarbeiter/ich'),
        ]);
        // Eigene Details (mit Stundenlohn) in die Liste einbauen
        const merged = alle.map((m) => (m.id === ich.id ? { ...m, ...ich } : m));
        setMitarbeiter(merged);
      }
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo, auth?.restaurantId, auth?.rolle]);

  useEffect(() => { laden_(); }, [laden_]);

  /** Mitarbeiter einladen (Name + Email + Rolle → Einladungs-Email wird verschickt) */
  const einladen = useCallback(async (daten: { name: string; email: string; rolle: Rolle }) => {
    if (demo) {
      const neu: MitarbeiterDetail = {
        id: `demo-${Date.now()}`,
        restaurant_id: 'demo',
        name: daten.name,
        email: daten.email,
        rolle: daten.rolle,
        aktiv: true,
        erstellt_am: new Date().toISOString(),
        einladung_ausstehend: true,
      };
      setMitarbeiter((prev) => [...prev, neu]);
      return;
    }
    await api.post('/mitarbeiter', daten);
    await laden_();
  }, [demo, laden_]);

  /** Einladung erneut senden (für MA die noch kein Passwort gesetzt haben) */
  const erneutEinladen = useCallback(async (id: string) => {
    if (demo) return;
    await api.post(`/mitarbeiter/${id}/erneut-einladen`, {});
  }, [demo]);

  const aktualisieren = useCallback(async (id: string, felder: { name?: string; rolle?: Rolle; aktiv?: boolean; stundenlohn?: number | null; telefon?: string | null }) => {
    if (demo) {
      setMitarbeiter((prev) => prev.map((m) => m.id === id ? { ...m, ...felder } : m));
      return;
    }
    await api.patch(`/mitarbeiter/${id}`, felder);
    await laden_();
  }, [demo, laden_]);

  const passwortAendern = useCallback(async (id: string, passwort: string) => {
    if (demo) return;
    await api.patch(`/mitarbeiter/${id}/passwort`, { passwort });
  }, [demo]);

  /** Profilbild für einen Mitarbeiter setzen (Admin: beliebiger MA, sonst: eigenes) */
  const fotoAktualisieren = useCallback(async (id: string, foto_url: string | null) => {
    if (demo) {
      setMitarbeiter((prev) => prev.map((m) => m.id === id ? { ...m, foto_url } : m));
      return;
    }
    await api.patch(`/mitarbeiter/${id}`, { foto_url });
    await laden_();
  }, [demo, laden_]);

  return { mitarbeiter, laden, fehler, laden_, einladen, erneutEinladen, aktualisieren, passwortAendern, fotoAktualisieren };
}

// Demo-Daten
const DEMO_MITARBEITER_LISTE: MitarbeiterDetail[] = [
  { id: 'dm1', restaurant_id: 'demo', name: 'Ilias (Demo)', email: 'admin@demo.de', rolle: 'admin', aktiv: true, erstellt_am: new Date().toISOString(), einladung_ausstehend: false, stundenlohn: 25.00 },
  { id: 'dm2', restaurant_id: 'demo', name: 'Anna Schmidt', email: 'kellner@demo.de', rolle: 'kellner', aktiv: true, erstellt_am: new Date().toISOString(), einladung_ausstehend: false, stundenlohn: 14.50 },
  { id: 'dm3', restaurant_id: 'demo', name: 'Marco Rossi', email: 'kueche@demo.de', rolle: 'kueche', aktiv: true, erstellt_am: new Date().toISOString(), einladung_ausstehend: false, stundenlohn: 16.00 },
  { id: 'dm4', restaurant_id: 'demo', name: 'Lisa Weber', email: 'lisa@demo.de', rolle: 'kellner', aktiv: false, erstellt_am: new Date().toISOString(), einladung_ausstehend: false, stundenlohn: null },
  { id: 'dm5', restaurant_id: 'demo', name: 'Tom Bauer', email: 'tom@demo.de', rolle: 'kellner', aktiv: true, erstellt_am: new Date().toISOString(), einladung_ausstehend: true, stundenlohn: 14.50 },
];
