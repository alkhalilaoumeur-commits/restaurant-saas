-- Migration: Profilbild + Gerichte-Reihenfolge
-- Datum: 2026-04-15
-- Ausführen: psql $DATABASE_URL -f database/migration-profilbild.sql

-- 1. Profilbild für Mitarbeiter (foto_url)
ALTER TABLE mitarbeiter
  ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 2. Reihenfolge für Gerichte (für manuelle Sortierung per ↑↓ im Admin)
ALTER TABLE gerichte
  ADD COLUMN IF NOT EXISTS reihenfolge INTEGER NOT NULL DEFAULT 0;

-- 3. Index auf gerichte.reihenfolge damit ORDER BY schnell bleibt
CREATE INDEX IF NOT EXISTS idx_gerichte_reihenfolge
  ON gerichte (kategorie_id, reihenfolge);

-- Fertig
