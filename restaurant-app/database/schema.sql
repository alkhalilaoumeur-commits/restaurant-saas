-- Restaurant App – Datenbankschema
-- Ausführen: psql $DATABASE_URL -f database/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Restaurants (Tenant) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  logo_url        TEXT,
  oeffnungszeiten TEXT,
  strasse         TEXT,
  plz             TEXT,
  stadt           TEXT,
  telefon         TEXT,
  email           TEXT,
  waehrung        TEXT NOT NULL DEFAULT 'EUR',
  primaerfarbe    TEXT NOT NULL DEFAULT '#ea580c',
  layout_id       TEXT NOT NULL DEFAULT 'modern',
  restaurant_code TEXT NOT NULL UNIQUE,
  lizenz_code     TEXT UNIQUE,
  max_mitarbeiter INTEGER NOT NULL DEFAULT 5,
  abo_status      TEXT NOT NULL DEFAULT 'trial'
                  CHECK (abo_status IN ('trial', 'active', 'expired')),
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Kategorien ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kategorien (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  bild_url      TEXT,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kategorien_restaurant ON kategorien(restaurant_id);

-- ─── Tische ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tische (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  nummer        INTEGER NOT NULL,
  kapazitaet    INTEGER,
  status        TEXT NOT NULL DEFAULT 'frei'
                CHECK (status IN ('frei', 'besetzt', 'wartet_auf_zahlung')),
  qr_url        TEXT,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, nummer)
);
CREATE INDEX IF NOT EXISTS idx_tische_restaurant ON tische(restaurant_id);

-- ─── Gerichte ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gerichte (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id  UUID NOT NULL REFERENCES kategorien(id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  beschreibung  TEXT,
  preis         DECIMAL(10,2) NOT NULL,
  bild_url      TEXT,
  allergene     TEXT,
  verfuegbar    BOOLEAN NOT NULL DEFAULT true,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gerichte_restaurant ON gerichte(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gerichte_kategorie  ON gerichte(kategorie_id);

-- ─── Bestellungen ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bestellungen (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id        UUID NOT NULL REFERENCES tische(id) ON DELETE RESTRICT,
  status          TEXT NOT NULL DEFAULT 'offen'
                  CHECK (status IN ('offen', 'in_zubereitung', 'serviert', 'bezahlt')),
  gesamtpreis     DECIMAL(10,2) NOT NULL DEFAULT 0,
  anmerkung       TEXT,
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW(),
  aktualisiert_am TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_aktualisiert_am()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aktualisiert_am = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bestellungen_aktualisiert_am
  BEFORE UPDATE ON bestellungen
  FOR EACH ROW EXECUTE FUNCTION set_aktualisiert_am();
CREATE INDEX IF NOT EXISTS idx_bestellungen_restaurant ON bestellungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bestellungen_status     ON bestellungen(status);
CREATE INDEX IF NOT EXISTS idx_bestellungen_tisch      ON bestellungen(tisch_id);

-- ─── Bestellpositionen ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bestellpositionen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bestellung_id UUID NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  gericht_id    UUID NOT NULL REFERENCES gerichte(id) ON DELETE RESTRICT,
  menge         INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis   DECIMAL(10,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bestellpositionen_bestellung ON bestellpositionen(bestellung_id);

-- ─── Reservierungen ──────────────────────────────────────────────────────────
-- DSGVO: telefon ist personenbezogen – Löschfrist: 30 Tage nach Datum
CREATE TABLE IF NOT EXISTS reservierungen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id      UUID REFERENCES tische(id) ON DELETE SET NULL,
  gast_name     TEXT NOT NULL,
  telefon       TEXT,
  datum         TIMESTAMP NOT NULL,
  personen      INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ausstehend'
                CHECK (status IN ('ausstehend', 'bestaetigt', 'storniert')),
  anmerkung     TEXT,
  quelle        TEXT NOT NULL DEFAULT 'app'
                CHECK (quelle IN ('app', 'whatsapp', 'telefon')),
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reservierungen_restaurant ON reservierungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservierungen_datum      ON reservierungen(datum);

-- ─── Mitarbeiter ─────────────────────────────────────────────────────────────
-- DSGVO: email ist personenbezogen
CREATE TABLE IF NOT EXISTS mitarbeiter (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  passwort_hash TEXT,
  rolle         TEXT NOT NULL CHECK (rolle IN ('admin', 'kellner', 'kueche')),
  aktiv         BOOLEAN NOT NULL DEFAULT true,
  einladung_token      TEXT UNIQUE,
  einladung_gueltig_bis TIMESTAMP,
  email_verifiziert    BOOLEAN NOT NULL DEFAULT false,
  verifizierung_token  TEXT UNIQUE,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_restaurant ON mitarbeiter(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_email      ON mitarbeiter(email);

-- ─── Schichten (Dienstplan) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schichten (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  mitarbeiter_id  UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  datum           DATE NOT NULL,
  beginn          TIME NOT NULL,
  ende            TIME NOT NULL,
  notiz           TEXT,
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (ende > beginn)
);
CREATE INDEX IF NOT EXISTS idx_schichten_restaurant ON schichten(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_schichten_datum      ON schichten(datum);
CREATE INDEX IF NOT EXISTS idx_schichten_mitarbeiter ON schichten(mitarbeiter_id);

-- ─── Öffnungszeiten ─────────────────────────────────────────────────────────
-- Pro Wochentag: von/bis Uhrzeit. wochentag 0=Montag, 6=Sonntag
CREATE TABLE IF NOT EXISTS oeffnungszeiten (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  wochentag     INTEGER NOT NULL CHECK (wochentag BETWEEN 0 AND 6),
  von           TIME NOT NULL,
  bis           TIME NOT NULL,
  geschlossen   BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (restaurant_id, wochentag)
);
CREATE INDEX IF NOT EXISTS idx_oeffnungszeiten_restaurant ON oeffnungszeiten(restaurant_id);

-- ─── Passwort-vergessen Tokens ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS passwort_resets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mitarbeiter_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  gueltig_bis   TIMESTAMP NOT NULL,
  benutzt       BOOLEAN NOT NULL DEFAULT false,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_token ON passwort_resets(token);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_mitarbeiter ON passwort_resets(mitarbeiter_id);

-- ─── Login-Versuche (Rate Limiting) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_versuche (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL,
  ip_adresse    TEXT,
  erfolgreich   BOOLEAN NOT NULL DEFAULT false,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_login_versuche_email ON login_versuche(email);
CREATE INDEX IF NOT EXISTS idx_login_versuche_zeit ON login_versuche(erstellt_am);
