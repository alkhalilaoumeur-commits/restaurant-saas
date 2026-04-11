-- Migration: Buchungs-Quick-Wins (Anlass + Sitzplatzwunsch)
-- Ausführen: psql postgresql://ilias@localhost:5432/restaurant_saas -f database/migration-buchung-quickwins.sql

-- Anlass der Reservierung (optional, z.B. "geburtstag", "jubilaeum", "date_night")
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS anlass TEXT;

-- Sitzplatzwunsch (optional, z.B. "innen", "terrasse", "bar")
ALTER TABLE reservierungen ADD COLUMN IF NOT EXISTS sitzplatz_wunsch TEXT;
