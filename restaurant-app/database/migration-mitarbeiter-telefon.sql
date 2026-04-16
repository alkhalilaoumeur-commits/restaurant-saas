-- Migration: telefon-Feld für Mitarbeiter (für interne SMS-Benachrichtigungen)
-- Ausführen: psql $DATABASE_URL -f database/migration-mitarbeiter-telefon.sql

ALTER TABLE mitarbeiter ADD COLUMN IF NOT EXISTS telefon TEXT;

COMMENT ON COLUMN mitarbeiter.telefon IS 'Optionale Telefonnummer für SMS-Benachrichtigungen (Schichttausch, Erinnerungen). Internationales Format: +4915112345678. DSGVO: personenbezogen.';
