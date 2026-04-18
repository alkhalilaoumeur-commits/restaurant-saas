-- Migration: Inventurmanagement (Phase 9)
-- Ausführen: psql $DATABASE_URL -f database/migration-inventur.sql
-- Stand: 2026-04-18

-- ─── Lieferanten ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lieferanten (
  id              UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID      NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT      NOT NULL,
  kontakt_email   TEXT,
  kontakt_telefon TEXT,
  liefertage      TEXT[]    NOT NULL DEFAULT '{}',  -- z.B. ['montag', 'donnerstag']
  notiz           TEXT,
  aktiv           BOOLEAN   NOT NULL DEFAULT TRUE,
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lieferanten_restaurant ON lieferanten(restaurant_id);

-- ─── Inventar-Artikel (Zutaten / Waren) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventar_artikel (
  id                 UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id      UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  lieferant_id       UUID          REFERENCES lieferanten(id) ON DELETE SET NULL,
  name               TEXT          NOT NULL,
  kategorie          TEXT          NOT NULL DEFAULT 'Sonstiges',
  einheit            TEXT          NOT NULL DEFAULT 'Stück',  -- kg, g, L, ml, Stück, Packung
  aktueller_bestand  NUMERIC(10,3) NOT NULL DEFAULT 0,
  mindestbestand     NUMERIC(10,3) NOT NULL DEFAULT 0,
  einkaufspreis      NUMERIC(10,2),                           -- Preis pro Einheit in EUR
  aktiv              BOOLEAN       NOT NULL DEFAULT TRUE,
  erstellt_am        TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventar_artikel_restaurant ON inventar_artikel(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_inventar_artikel_lieferant  ON inventar_artikel(lieferant_id);

-- ─── Lagerbewegungen ──────────────────────────────────────────────────────────
-- delta: positiv = Zugang (Eingang), negativ = Abgang
-- typ: 'eingang' | 'abgang' | 'korrektur' | 'bestellung'
--   eingang    = Ware geliefert / eingelagert
--   abgang     = manueller Verbrauch / Schwund
--   korrektur  = Bestandskorrektur nach Inventur
--   bestellung = automatischer Abzug wenn Gast-Bestellung bezahlt wird
CREATE TABLE IF NOT EXISTS lager_bewegungen (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  artikel_id    UUID          NOT NULL REFERENCES inventar_artikel(id) ON DELETE CASCADE,
  typ           TEXT          NOT NULL CHECK (typ IN ('eingang', 'abgang', 'korrektur', 'bestellung')),
  delta         NUMERIC(10,3) NOT NULL,  -- positiv = Zugang, negativ = Abgang
  notiz         TEXT,
  erstellt_am   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lager_bewegungen_restaurant ON lager_bewegungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_lager_bewegungen_artikel    ON lager_bewegungen(artikel_id);

-- ─── Rezepturen (Gericht → Zutaten-Verbrauch) ─────────────────────────────────
-- Definiert welche Artikel in welcher Menge pro Portion eines Gerichts verbraucht werden.
-- Wenn eine Bestellung bezahlt wird, werden die Bestände automatisch abgezogen.
CREATE TABLE IF NOT EXISTS rezepturen (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  gericht_id    UUID          NOT NULL REFERENCES gerichte(id) ON DELETE CASCADE,
  artikel_id    UUID          NOT NULL REFERENCES inventar_artikel(id) ON DELETE CASCADE,
  menge         NUMERIC(10,3) NOT NULL CHECK (menge > 0),  -- Menge pro Portion
  UNIQUE(gericht_id, artikel_id)
);

CREATE INDEX IF NOT EXISTS idx_rezepturen_gericht ON rezepturen(gericht_id);
CREATE INDEX IF NOT EXISTS idx_rezepturen_artikel ON rezepturen(artikel_id);
