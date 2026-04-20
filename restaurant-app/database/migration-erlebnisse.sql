-- Phase 8C: Erlebnis-Buchung
-- Restaurants erstellen Erlebnis-Pakete (z.B. "6-Gang-Degustation für 2").
-- Gäste buchen und bezahlen per Stripe vorab → keine No-Shows.

CREATE TABLE IF NOT EXISTS erlebnisse (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  beschreibung    TEXT,
  preis_cent      INTEGER NOT NULL CHECK (preis_cent >= 0),
  max_personen    INTEGER NOT NULL DEFAULT 10,
  dauer_min       INTEGER NOT NULL DEFAULT 120,
  aktiv           BOOLEAN NOT NULL DEFAULT true,
  bild_url        TEXT,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erlebnis_buchungen (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  erlebnis_id       UUID NOT NULL REFERENCES erlebnisse(id) ON DELETE CASCADE,
  gast_name         VARCHAR(200) NOT NULL,
  gast_email        VARCHAR(200) NOT NULL,
  gast_telefon      VARCHAR(50),
  datum             DATE NOT NULL,
  uhrzeit           TIME NOT NULL,
  personen          INTEGER NOT NULL DEFAULT 2,
  status            VARCHAR(50) NOT NULL DEFAULT 'ausstehend'
                    CHECK (status IN ('ausstehend', 'bezahlt', 'storniert', 'abgeschlossen')),
  stripe_session_id VARCHAR(300),
  zahlung_status    VARCHAR(50),
  token             VARCHAR(200) UNIQUE NOT NULL,
  anmerkungen       TEXT,
  erstellt_am       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_erlebnisse_restaurant      ON erlebnisse(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_erlebnis_buchungen_rest    ON erlebnis_buchungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_erlebnis_buchungen_datum   ON erlebnis_buchungen(restaurant_id, datum);
CREATE INDEX IF NOT EXISTS idx_erlebnis_buchungen_token   ON erlebnis_buchungen(token);
CREATE INDEX IF NOT EXISTS idx_erlebnis_buchungen_stripe  ON erlebnis_buchungen(stripe_session_id);
