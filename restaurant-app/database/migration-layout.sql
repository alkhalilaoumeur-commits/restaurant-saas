-- Migration: layout_id auf restaurants
-- Speichert welches Layout die Gäste-Bestellseite nutzt (z.B. 'modern' oder 'elegant-dunkel')
-- Ausführen: psql $DATABASE_URL -f database/migration-layout.sql

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS layout_id TEXT NOT NULL DEFAULT 'modern';
