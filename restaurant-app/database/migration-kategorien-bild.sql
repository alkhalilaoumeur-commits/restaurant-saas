-- Migration: Hintergrundbild für Kategorien
-- Ausführen: psql $DATABASE_URL -f database/migration-kategorien-bild.sql
--
-- Fügt eine bild_url Spalte zur kategorien-Tabelle hinzu.
-- Damit können Restaurants ein Hintergrundbild pro Kategorie setzen,
-- das auf der Gäste-Bestellseite als Kachel-Hintergrund angezeigt wird.

ALTER TABLE kategorien ADD COLUMN IF NOT EXISTS bild_url TEXT;
