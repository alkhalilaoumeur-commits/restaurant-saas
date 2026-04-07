import { useState, useEffect } from 'react';
import { RestaurantDesign } from '../types';

/** Holt öffentliches Design (Name, Logo, Farbe) für Gäste-Seite – kein Auth nötig */
export function useRestaurantDesign(restaurantId: string | undefined) {
  const [design, setDesign] = useState<RestaurantDesign | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    fetch(`/api/restaurant/${restaurantId}/design`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setDesign(d))
      .catch(() => {});
  }, [restaurantId]);

  return design;
}
