-- Migration: Warteliste
-- Gäste können sich online oder als Walk-in auf die Warteliste setzen.
-- Bei Stornierung einer Reservierung → erster Wartender wird automatisch benachrichtigt.

CREATE TABLE IF NOT EXISTS warteliste (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  gast_name       TEXT        NOT NULL CHECK (char_length(gast_name) BETWEEN 1 AND 100),
  telefon         TEXT,
  email           TEXT,
  personen        INT         NOT NULL CHECK (personen BETWEEN 1 AND 50),
  datum           DATE        NOT NULL,
  anmerkung       TEXT,
  quelle          TEXT        NOT NULL DEFAULT 'walk_in' CHECK (quelle IN ('walk_in', 'online')),
  status          TEXT        NOT NULL DEFAULT 'wartend' CHECK (status IN ('wartend', 'benachrichtigt', 'bestaetigt', 'abgelaufen', 'storniert')),
  -- position in der Schlange (1 = vorne)
  position        INT         NOT NULL DEFAULT 1,
  benachrichtigt_am TIMESTAMPTZ,
  eingetragen_am  TIMESTAMPTZ NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_warteliste_restaurant_datum
  ON warteliste(restaurant_id, datum);

CREATE INDEX IF NOT EXISTS idx_warteliste_status
  ON warteliste(restaurant_id, status);
