-- Migration: Bewertungsmanagement
-- Ausführen: psql $DATABASE_URL -f database/migration-bewertungen.sql
-- Stand: 2026-04-15

-- ─── Google-Bewertungslink auf restaurants ───────────────────────────────────
-- Jedes Restaurant kann seinen Google Maps-Bewertungslink hinterlegen.
-- Bei 4-5 Sternen intern → Link wird dem Gast nach der Bewertung angezeigt.
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS google_bewertungs_link TEXT;

-- ─── Bewertungen ─────────────────────────────────────────────────────────────
-- Speichert Gäste-Bewertungen (intern + optional weiterleitung zu Google).
-- token: einmaliger UUID-Link der per E-Mail an den Gast gesendet wird.
-- buchungs_id: optional — verknüpft Bewertung mit einer Reservierung.
CREATE TABLE IF NOT EXISTS bewertungen (
  id              UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID      NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  buchungs_id     UUID      REFERENCES reservierungen(id) ON DELETE SET NULL,
  token           UUID      NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  stern           SMALLINT  CHECK (stern BETWEEN 1 AND 5),
  kommentar       TEXT,
  gast_name       TEXT      NOT NULL,
  gast_email      TEXT      NOT NULL,
  -- Datenschutz: Einwilligung des Gastes zur Verarbeitung
  dsgvo_einwilligung BOOLEAN NOT NULL DEFAULT FALSE,
  -- Admin-Antwort auf die Bewertung
  antwort_text    TEXT,
  antwort_datum   TIMESTAMP,
  -- Status: 'offen' = Link gesendet, kein Rating; 'abgeschlossen' = Rating eingegangen
  status          TEXT      NOT NULL DEFAULT 'offen'
                  CHECK (status IN ('offen', 'abgeschlossen')),
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW(),
  -- DSGVO: Datensätze werden nach 12 Monaten gelöscht (per cron oder manuell)
  loeschen_am     TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '12 months')
);

CREATE INDEX IF NOT EXISTS idx_bewertungen_restaurant ON bewertungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bewertungen_token      ON bewertungen(token);
CREATE INDEX IF NOT EXISTS idx_bewertungen_buchung    ON bewertungen(buchungs_id);
