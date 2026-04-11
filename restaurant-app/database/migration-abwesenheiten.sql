-- Migration: Abwesenheiten (datumsbezogene Auszeiten für Mitarbeiter)
-- Ausführen: psql $DATABASE_URL -f database/migration-abwesenheiten.sql

CREATE TABLE IF NOT EXISTS abwesenheiten (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  mitarbeiter_id UUID        NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  von_datum      DATE        NOT NULL,
  bis_datum      DATE        NOT NULL,
  typ            VARCHAR(20) NOT NULL DEFAULT 'urlaub'
                             CHECK (typ IN ('urlaub', 'krank', 'sonstiges')),
  notiz          TEXT,
  erstellt_am    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT abwesenheiten_datum_check CHECK (bis_datum >= von_datum)
);

CREATE INDEX IF NOT EXISTS abwesenheiten_restaurant_idx ON abwesenheiten(restaurant_id);
CREATE INDEX IF NOT EXISTS abwesenheiten_ma_idx ON abwesenheiten(mitarbeiter_id);
CREATE INDEX IF NOT EXISTS abwesenheiten_datum_idx ON abwesenheiten(von_datum, bis_datum);
