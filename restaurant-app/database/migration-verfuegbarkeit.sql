-- Migration: Mitarbeiter-Verfügbarkeit
-- Ausführen: psql $DATABASE_URL -f database/migration-verfuegbarkeit.sql

CREATE TABLE IF NOT EXISTS verfuegbarkeiten (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  mitarbeiter_id UUID        NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  -- 0 = Montag, 1 = Dienstag, ..., 6 = Sonntag (wie im Dienstplan-Frontend)
  wochentag      SMALLINT    NOT NULL CHECK (wochentag BETWEEN 0 AND 6),
  -- nicht_verfuegbar: kann nicht (z.B. privater Termin)
  -- eingeschraenkt:   nur zu bestimmten Zeiten verfügbar
  typ            VARCHAR(20) NOT NULL DEFAULT 'nicht_verfuegbar'
                             CHECK (typ IN ('nicht_verfuegbar', 'eingeschraenkt')),
  von            TIME,       -- optionaler Zeitraum (nur bei typ='eingeschraenkt')
  bis            TIME,
  notiz          TEXT,
  erstellt_am    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Pro Mitarbeiter + Wochentag nur ein Eintrag (kann durch Update geändert werden)
  CONSTRAINT verfuegbarkeiten_ma_tag_uq UNIQUE (mitarbeiter_id, wochentag)
);

CREATE INDEX IF NOT EXISTS verfuegbarkeiten_restaurant_idx ON verfuegbarkeiten(restaurant_id);
CREATE INDEX IF NOT EXISTS verfuegbarkeiten_ma_idx         ON verfuegbarkeiten(mitarbeiter_id);
