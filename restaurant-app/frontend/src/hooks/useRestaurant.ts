import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const demo = useAuthStore((s) => s.demo);
  const auth = useAuthStore((s) => s.mitarbeiter);

  const laden_ = useCallback(async () => {
    if (demo) {
      setRestaurant(DEMO_RESTAURANT);
      setLaden(false);
      return;
    }
    try {
      if (!auth?.restaurantId) { setLaden(false); return; }
      const data = await api.get<Restaurant>('/restaurant');
      setRestaurant(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    } finally {
      setLaden(false);
    }
  }, [demo, auth?.restaurantId]);

  useEffect(() => { laden_(); }, [laden_]);

  const aktualisieren = useCallback(async (felder: {
    name?: string;
    oeffnungszeiten?: string;
    primaerfarbe?: string;
    layout_id?: string;
    logo_url?: string | null;
    buchungsintervall_min?: number;
    tisch_dauer_min?: number;
    max_gleichzeitige_reservierungen?: number | null;
    google_bewertungs_link?: string | null;
  }) => {
    if (demo) return;
    const data = await api.put<Restaurant>('/restaurant', felder);
    setRestaurant((prev) => prev ? { ...prev, ...data } : prev);
  }, [demo]);

  return { restaurant, laden, fehler, laden_, aktualisieren };
}

const DEMO_RESTAURANT: Restaurant = {
  id: 'demo',
  name: 'Demo Restaurant',
  logo_url: null,
  oeffnungszeiten: 'Mo-Sa 11:00-23:00',
  strasse: 'Musterstraße 1',
  plz: '10115',
  stadt: 'Berlin',
  telefon: '030-12345',
  email: 'demo@restaurant.de',
  waehrung: 'EUR',
  primaerfarbe: '#ea580c',
  layout_id: 'modern',
  lizenz_code: 'REST-DEMO',
  max_mitarbeiter: 5,
  abo_status: 'trial',
  abo_plan: 'pro',
  buchungsintervall_min: 15,
  tisch_dauer_min: 90,
  max_gleichzeitige_reservierungen: null,
  erstellt_am: new Date().toISOString(),
  aktive_mitarbeiter: 3,
  google_bewertungs_link: null,
};
