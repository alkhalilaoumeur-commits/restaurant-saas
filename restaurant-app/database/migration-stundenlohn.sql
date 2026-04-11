-- Migration: Stundenlohn pro Mitarbeiter (für Budget-Overlay im Dienstplan)
-- Ausführen: psql $DATABASE_URL -f database/migration-stundenlohn.sql

ALTER TABLE mitarbeiter
  ADD COLUMN IF NOT EXISTS stundenlohn NUMERIC(8, 2) DEFAULT NULL;

-- Kein NOT NULL — Stundenlohn ist optional (wenn nicht gesetzt, wird MA im Budget ignoriert)
