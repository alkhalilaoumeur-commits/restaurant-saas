-- Migration: Reservierungssystem Pro (Phase A)
-- Ausführen: psql $DATABASE_URL -f database/migration-reservierung-pro.sql

-- ============================================================
-- 1. Neue Spalten auf reservierungen
-- ============================================================

-- Gast-Email für Bestätigungen und Erinnerungen (DSGVO: 30 Tage Löschfrist)
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS email TEXT;

-- Sicherer Token für Self-Service-Links (Stornieren/Umbuchen)
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS buchungs_token TEXT UNIQUE;

-- DSGVO-Einwilligung (Pflicht bei Online-Buchungen)
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS dsgvo_einwilligung BOOLEAN NOT NULL DEFAULT false;

-- Tracking welche Erinnerungen gesendet wurden (z.B. {"24h": true, "3h": true})
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS erinnerung_gesendet JSONB NOT NULL DEFAULT '{}';

-- Verweilzeit in Minuten (wie lange der Tisch belegt ist)
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS verweilzeit_min INTEGER NOT NULL DEFAULT 90;

-- Quelle-Constraint erweitern um 'online'
ALTER TABLE reservierungen DROP CONSTRAINT IF EXISTS reservierungen_quelle_check;
ALTER TABLE reservierungen ADD CONSTRAINT reservierungen_quelle_check
  CHECK (quelle IN ('app', 'whatsapp', 'telefon', 'online'));

-- ============================================================
-- 2. Neue Spalten auf restaurants
-- ============================================================

-- Optionaler Override: Max Gäste pro Zeitslot (NULL = Summe der Tischkapazitäten)
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS max_gaeste_pro_slot INTEGER;

-- Pufferzeit in Minuten zwischen Reservierungen auf demselben Tisch
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS reservierung_puffer_min INTEGER NOT NULL DEFAULT 15;

-- Wie viele Tage im Voraus Gäste online buchen können
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS reservierung_vorlauf_tage INTEGER NOT NULL DEFAULT 30;

-- ============================================================
-- 3. Indexes für Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_reservierungen_buchungs_token
  ON reservierungen(buchungs_token);

CREATE INDEX IF NOT EXISTS idx_reservierungen_restaurant_datum
  ON reservierungen(restaurant_id, datum);

-- ============================================================
-- Fertig!
-- ============================================================
