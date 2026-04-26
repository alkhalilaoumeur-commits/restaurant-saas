-- Migration: max_mitarbeiter aus abo_plan synchronisieren
-- Datum: 2026-04-26
--
-- Hintergrund: Bisher war restaurants.max_mitarbeiter eine separate Lizenz-Spalte (Default 5).
-- Ab jetzt wird sie aus dem Abo-Plan abgeleitet (Single Source of Truth: services/plan-limits.ts).
--
-- Ausfuehren: psql $DATABASE_URL -f database/migration-plan-limits.sql

-- ── Bestehende Restaurants nach Plan synchronisieren ────────────────────────
UPDATE restaurants
SET max_mitarbeiter = CASE abo_plan
  WHEN 'basis'    THEN 3
  WHEN 'standard' THEN 10
  WHEN 'pro'      THEN 999
  ELSE 3
END
WHERE max_mitarbeiter <> CASE abo_plan
  WHEN 'basis'    THEN 3
  WHEN 'standard' THEN 10
  WHEN 'pro'      THEN 999
  ELSE 3
END;

-- ── Default fuer neue Restaurants auf 3 setzen (Basis-Plan) ─────────────────
ALTER TABLE restaurants
  ALTER COLUMN max_mitarbeiter SET DEFAULT 3;
