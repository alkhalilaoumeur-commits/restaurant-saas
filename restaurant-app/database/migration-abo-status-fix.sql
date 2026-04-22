-- Migration: abo_status Constraint + Default fixen

-- 1. Alten CHECK-Constraint entfernen
ALTER TABLE restaurants DROP CONSTRAINT IF EXISTS restaurants_abo_status_check;

-- 2. Alle bestehenden 'trial' Restaurants auf 'inactive' setzen (ZUERST!)
UPDATE restaurants SET abo_status = 'inactive' WHERE abo_status = 'trial';

-- 3. Default von 'trial' auf 'inactive' ändern
ALTER TABLE restaurants ALTER COLUMN abo_status SET DEFAULT 'inactive';

-- 4. Neuen Constraint mit allen gültigen Status setzen
ALTER TABLE restaurants
  ADD CONSTRAINT restaurants_abo_status_check
  CHECK (abo_status IN ('inactive', 'active', 'expired', 'cancelled', 'payment_failed'));
