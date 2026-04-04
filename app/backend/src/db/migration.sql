-- Restaurant SaaS – Datenbankschema
-- Ausführen mit: psql $DATABASE_URL -f src/db/migration.sql

-- UUID-Erweiterung
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- RESTAURANTS (Tenant-Tabelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  logo_url        TEXT,
  oeffnungszeiten TEXT,
  waehrung        TEXT NOT NULL DEFAULT 'EUR',
  lizenz_code     TEXT UNIQUE,
  max_mitarbeiter INTEGER NOT NULL DEFAULT 5,
  abo_status      TEXT NOT NULL DEFAULT 'trial' CHECK (abo_status IN ('trial', 'active', 'expired')),
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- KATEGORIEN
-- ============================================================
CREATE TABLE IF NOT EXISTS kategorien (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  reihenfolge   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kategorien_restaurant ON kategorien(restaurant_id);

-- ============================================================
-- TISCHE
-- ============================================================
CREATE TABLE IF NOT EXISTS tische (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  nummer        INTEGER NOT NULL,
  kapazitaet    INTEGER,
  status        TEXT NOT NULL DEFAULT 'frei' CHECK (status IN ('frei', 'besetzt', 'wartet_auf_zahlung')),
  qr_url        TEXT,
  UNIQUE (restaurant_id, nummer)
);

CREATE INDEX IF NOT EXISTS idx_tische_restaurant ON tische(restaurant_id);

-- ============================================================
-- GERICHTE
-- ============================================================
CREATE TABLE IF NOT EXISTS gerichte (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id  UUID NOT NULL REFERENCES kategorien(id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  beschreibung  TEXT,
  preis         DECIMAL(10,2) NOT NULL,
  bild_url      TEXT,
  allergene     TEXT,
  verfuegbar    BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_gerichte_restaurant ON gerichte(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gerichte_kategorie ON gerichte(kategorie_id);

-- ============================================================
-- BESTELLUNGEN
-- ============================================================
CREATE TABLE IF NOT EXISTS bestellungen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id      UUID NOT NULL REFERENCES tische(id) ON DELETE RESTRICT,
  status        TEXT NOT NULL DEFAULT 'offen' CHECK (status IN ('offen', 'in_zubereitung', 'serviert', 'bezahlt')),
  gesamtpreis   DECIMAL(10,2) NOT NULL DEFAULT 0,
  anmerkung     TEXT,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bestellungen_restaurant ON bestellungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bestellungen_tisch ON bestellungen(tisch_id);
CREATE INDEX IF NOT EXISTS idx_bestellungen_status ON bestellungen(status);

-- ============================================================
-- BESTELLPOSITIONEN
-- ============================================================
CREATE TABLE IF NOT EXISTS bestellpositionen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bestellung_id UUID NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  gericht_id    UUID NOT NULL REFERENCES gerichte(id) ON DELETE RESTRICT,
  menge         INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis   DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bestellpositionen_bestellung ON bestellpositionen(bestellung_id);

-- ============================================================
-- RESERVIERUNGEN
-- DSGVO: telefon ist personenbezogen – Löschfrist 30 Tage nach Reservierung
-- ============================================================
CREATE TABLE IF NOT EXISTS reservierungen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id      UUID REFERENCES tische(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  telefon       TEXT,                   -- ⚠️ DSGVO: personenbezogen
  datum         TIMESTAMP NOT NULL,
  personen      INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ausstehend' CHECK (status IN ('ausstehend', 'bestaetigt', 'storniert')),
  anmerkung     TEXT,
  quelle        TEXT NOT NULL DEFAULT 'App' CHECK (quelle IN ('App', 'WhatsApp', 'Telefon')),
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservierungen_restaurant ON reservierungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservierungen_datum ON reservierungen(datum);

-- ============================================================
-- MITARBEITER
-- DSGVO: email ist personenbezogen
-- ============================================================
CREATE TABLE IF NOT EXISTS mitarbeiter (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,  -- ⚠️ DSGVO: personenbezogen
  passwort_hash  TEXT NOT NULL,
  rolle          TEXT NOT NULL CHECK (rolle IN ('admin', 'kellner', 'kueche')),
  aktiv          BOOLEAN NOT NULL DEFAULT true,
  erstellt_am    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mitarbeiter_restaurant ON mitarbeiter(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_email ON mitarbeiter(email);

-- ============================================================
-- DEMO-DATEN (optional – zum Testen)
-- ============================================================
-- INSERT INTO restaurants (id, name, waehrung, lizenz_code, abo_status)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Restaurant', 'EUR', 'DEMO-2024', 'trial');
--
-- INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle)
-- VALUES (
--   uuid_generate_v4(),
--   '00000000-0000-0000-0000-000000000001',
--   'Admin',
--   'admin@demo.de',
--   '$2a$12$...', -- bcrypt hash von 'passwort123'
--   'admin'
-- );
