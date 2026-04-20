-- Phase 10: Abo-Pläne (Basis / Standard / Pro)
-- abo_plan speichert den aktuellen Plan des Restaurants.
-- plan in zahlungen merkt sich, welcher Plan mit dieser Zahlung gekauft wurde.

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS abo_plan VARCHAR(20) NOT NULL DEFAULT 'basis';

ALTER TABLE zahlungen
  ADD COLUMN IF NOT EXISTS plan VARCHAR(20);
