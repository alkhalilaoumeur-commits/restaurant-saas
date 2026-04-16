-- Restaurant App – Datenbankschema
-- Ausführen: psql $DATABASE_URL -f database/schema.sql
-- Stand: 2026-04-10 (synchronisiert mit Produktions-DB)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Restaurants (Tenant) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id                        UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                      TEXT    NOT NULL,
  logo_url                  TEXT,
  oeffnungszeiten           TEXT,
  strasse                   TEXT,
  plz                       TEXT,
  stadt                     TEXT,
  telefon                   TEXT,
  email                     TEXT,
  waehrung                  TEXT    NOT NULL DEFAULT 'EUR',
  primaerfarbe              TEXT    NOT NULL DEFAULT '#ea580c',
  layout_id                 TEXT    NOT NULL DEFAULT 'modern',
  restaurant_code           TEXT    NOT NULL UNIQUE,
  lizenz_code               TEXT    UNIQUE,
  max_mitarbeiter           INTEGER NOT NULL DEFAULT 5,
  abo_status                TEXT    NOT NULL DEFAULT 'trial'
                            CHECK (abo_status IN ('trial', 'active', 'expired')),
  -- Reservierungs-Konfiguration
  max_gaeste_pro_slot           INTEGER,                          -- NULL = Summe aller Tischkapazitäten
  reservierung_puffer_min       INTEGER NOT NULL DEFAULT 15,      -- Minuten zwischen Buchungen
  reservierung_vorlauf_tage     INTEGER NOT NULL DEFAULT 30,      -- wie weit im Voraus buchbar
  buchungsintervall_min         INTEGER NOT NULL DEFAULT 15,      -- Slot-Abstand (15/30/60 Min.)
  tisch_dauer_min               INTEGER NOT NULL DEFAULT 90,      -- geschätzte Sitzzeit pro Reservierung
  max_gleichzeitige_reservierungen INTEGER,                       -- NULL = unbegrenzt
  erstellt_am               TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Bereiche (Floor-Plan Zonen) ─────────────────────────────────────────────
-- Muss vor tische stehen wegen FK
CREATE TABLE IF NOT EXISTS bereiche (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  reihenfolge   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_bereiche_restaurant ON bereiche(restaurant_id);

-- ─── Kategorien ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kategorien (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  bild_url      TEXT,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kategorien_restaurant ON kategorien(restaurant_id);

-- ─── Unterkategorien ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS unterkategorien (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id  UUID    NOT NULL REFERENCES kategorien(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  reihenfolge   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_unterkategorien_kategorie ON unterkategorien(kategorie_id);

-- ─── Tische ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tische (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  nummer        INTEGER NOT NULL,
  kapazitaet    INTEGER,
  status        TEXT    NOT NULL DEFAULT 'frei'
                CHECK (status IN ('frei', 'besetzt', 'wartet_auf_zahlung')),
  qr_url        TEXT,
  -- Floor-Plan Position & Form
  form          TEXT    NOT NULL DEFAULT 'rechteck'
                CHECK (form IN ('rechteck', 'rund', 'quadrat', 'bar')),
  pos_x         INTEGER NOT NULL DEFAULT 0,
  pos_y         INTEGER NOT NULL DEFAULT 0,
  breite        INTEGER NOT NULL DEFAULT 80,
  hoehe         INTEGER NOT NULL DEFAULT 80,
  rotation      INTEGER NOT NULL DEFAULT 0,
  bereich_id    UUID    REFERENCES bereiche(id) ON DELETE SET NULL,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, nummer)
);
CREATE INDEX IF NOT EXISTS idx_tische_restaurant ON tische(restaurant_id);

-- ─── Gerichte ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gerichte (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id     UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id      UUID    NOT NULL REFERENCES kategorien(id) ON DELETE RESTRICT,
  unterkategorie_id UUID    REFERENCES unterkategorien(id) ON DELETE SET NULL,
  name              TEXT    NOT NULL,
  beschreibung      TEXT,
  preis             DECIMAL(10,2) NOT NULL,
  bild_url          TEXT,
  allergene         TEXT,
  verfuegbar        BOOLEAN NOT NULL DEFAULT true,
  modell_3d_url     TEXT,
  reihenfolge       INTEGER NOT NULL DEFAULT 0,
  erstellt_am       TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gerichte_restaurant ON gerichte(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gerichte_kategorie  ON gerichte(kategorie_id);

-- ─── Extras-Gruppen (Modifier pro Gericht) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS extras_gruppen (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  gericht_id    UUID    NOT NULL REFERENCES gerichte(id) ON DELETE CASCADE,
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  pflicht       BOOLEAN NOT NULL DEFAULT false,
  max_auswahl   INTEGER NOT NULL DEFAULT 1 CHECK (max_auswahl >= 1),
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_extras_gruppen_gericht    ON extras_gruppen(gericht_id);
CREATE INDEX IF NOT EXISTS idx_extras_gruppen_restaurant ON extras_gruppen(restaurant_id);

-- ─── Extras ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS extras (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  gruppe_id     UUID    NOT NULL REFERENCES extras_gruppen(id) ON DELETE CASCADE,
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  aufpreis      DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (aufpreis >= 0),
  verfuegbar    BOOLEAN NOT NULL DEFAULT true,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_extras_gruppe     ON extras(gruppe_id);
CREATE INDEX IF NOT EXISTS idx_extras_restaurant ON extras(restaurant_id);

-- ─── Bestellungen ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bestellungen (
  id              UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID  NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id        UUID  NOT NULL REFERENCES tische(id) ON DELETE RESTRICT,
  status          TEXT  NOT NULL DEFAULT 'offen'
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

-- ─── Bestellposition-Extras ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bestellposition_extras (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES bestellpositionen(id) ON DELETE CASCADE,
  extra_id    UUID NOT NULL REFERENCES extras(id) ON DELETE RESTRICT,
  extra_name  TEXT NOT NULL,
  aufpreis    DECIMAL(10,2) NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_bestellposition_extras_position ON bestellposition_extras(position_id);

-- ─── Gäste CRM ───────────────────────────────────────────────────────────────
-- DSGVO: personenbezogen — Löschfrist via loeschen_nach
CREATE TABLE IF NOT EXISTS gaeste (
  id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT    NOT NULL,
  email           TEXT,
  telefon         TEXT,
  notizen         TEXT,
  tags            TEXT[]  NOT NULL DEFAULT '{}',
  erstellt_am     TIMESTAMP NOT NULL DEFAULT NOW(),
  aktualisiert_am TIMESTAMP NOT NULL DEFAULT NOW(),
  loeschen_nach   DATE                              -- DSGVO: automatische Löschung
);
CREATE INDEX IF NOT EXISTS idx_gaeste_restaurant ON gaeste(restaurant_id);
CREATE UNIQUE INDEX IF NOT EXISTS gaeste_restaurant_email_unique
  ON gaeste(restaurant_id, email) WHERE email IS NOT NULL;

-- ─── Reservierungen ──────────────────────────────────────────────────────────
-- DSGVO: telefon + email personenbezogen — Löschfrist 30 Tage nach Datum
CREATE TABLE IF NOT EXISTS reservierungen (
  id                   UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id        UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id             UUID    REFERENCES tische(id) ON DELETE SET NULL,
  tisch_kombiniert_id  UUID    REFERENCES tische(id) ON DELETE SET NULL,
  gast_id              UUID    REFERENCES gaeste(id) ON DELETE SET NULL,   -- CRM-Verknüpfung
  gast_name            TEXT    NOT NULL,
  email                TEXT,
  telefon              TEXT,
  datum                TIMESTAMP NOT NULL,
  personen             INTEGER NOT NULL,
  status               TEXT    NOT NULL DEFAULT 'ausstehend'
                       CHECK (status IN ('ausstehend', 'bestaetigt', 'storniert', 'abgeschlossen', 'no_show')),
  anmerkung            TEXT,
  anlass               TEXT,
  sitzplatz_wunsch     TEXT,
  quelle               TEXT    NOT NULL DEFAULT 'app'
                       CHECK (quelle IN ('app', 'whatsapp', 'telefon', 'online', 'google')),
  buchungs_token       TEXT    UNIQUE,              -- für Self-Service Storno/Umbuchung
  dsgvo_einwilligung   BOOLEAN NOT NULL DEFAULT false,
  erinnerung_gesendet  JSONB   NOT NULL DEFAULT '{}',
  verweilzeit_min      INTEGER NOT NULL DEFAULT 90,
  erstellt_am          TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reservierungen_restaurant ON reservierungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservierungen_datum      ON reservierungen(datum);
CREATE INDEX IF NOT EXISTS idx_reservierungen_token      ON reservierungen(buchungs_token);

-- ─── Walk-ins ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS walk_ins (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id      UUID    REFERENCES tische(id) ON DELETE SET NULL,
  gast_name     TEXT    NOT NULL,
  personen      INTEGER NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'wartend'
                CHECK (status IN ('wartend', 'platziert', 'abgegangen')),
  anmerkung     TEXT,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW(),
  platziert_am  TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_walk_ins_restaurant ON walk_ins(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_walk_ins_status     ON walk_ins(status);

-- ─── Mitarbeiter ─────────────────────────────────────────────────────────────
-- DSGVO: email personenbezogen
CREATE TABLE IF NOT EXISTS mitarbeiter (
  id                    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id         UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name                  TEXT    NOT NULL,
  email                 TEXT    NOT NULL UNIQUE,
  passwort_hash         TEXT,
  rolle                 TEXT    NOT NULL CHECK (rolle IN ('admin', 'kellner', 'kueche')),
  aktiv                 BOOLEAN NOT NULL DEFAULT true,
  einladung_token       TEXT    UNIQUE,
  einladung_gueltig_bis TIMESTAMP,
  email_verifiziert     BOOLEAN NOT NULL DEFAULT false,
  verifizierung_token   TEXT    UNIQUE,
  stundenlohn           NUMERIC(8,2),
  urlaubsanspruch_tage  INTEGER DEFAULT 20,
  foto_url              TEXT,
  erstellt_am           TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_restaurant ON mitarbeiter(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_email      ON mitarbeiter(email);

-- ─── Schichten (Dienstplan) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schichten (
  id             UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id  UUID  NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  mitarbeiter_id UUID  NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  datum          DATE  NOT NULL,
  beginn         TIME  NOT NULL,
  ende           TIME  NOT NULL,
  notiz          TEXT,
  erstellt_am    TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (ende > beginn)
);
CREATE INDEX IF NOT EXISTS idx_schichten_restaurant   ON schichten(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_schichten_datum        ON schichten(datum);
CREATE INDEX IF NOT EXISTS idx_schichten_mitarbeiter  ON schichten(mitarbeiter_id);

-- ─── Abwesenheiten (Urlaub / Krank) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS abwesenheiten (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  mitarbeiter_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  von_datum      DATE NOT NULL,
  bis_datum      DATE NOT NULL,
  typ            TEXT NOT NULL CHECK (typ IN ('urlaub', 'krank', 'sonstiges')),
  notiz          TEXT,
  erstellt_am    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_abwesenheiten_restaurant  ON abwesenheiten(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_abwesenheiten_mitarbeiter ON abwesenheiten(mitarbeiter_id);

-- ─── Schichttausch ───────────────────────────────────────────────────────────
-- 3-Tap-Flow: offen → angeboten → genehmigt/abgelehnt
CREATE TABLE IF NOT EXISTS schichttausch (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id        UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  anbieter_id          UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  anbieter_schicht_id  UUID NOT NULL REFERENCES schichten(id) ON DELETE CASCADE,
  annehmer_id          UUID REFERENCES mitarbeiter(id) ON DELETE SET NULL,
  annehmer_schicht_id  UUID REFERENCES schichten(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'offen'
                       CHECK (status IN ('offen', 'angeboten', 'genehmigt', 'abgelehnt')),
  erstellt_am          TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_schichttausch_restaurant ON schichttausch(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_schichttausch_anbieter   ON schichttausch(anbieter_id);

-- ─── Schicht-Templates ───────────────────────────────────────────────────────
-- Gespeicherte Wochenvorlagen für schnelles Wiederanwenden
CREATE TABLE IF NOT EXISTS schicht_templates (
  id            UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID      NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT      NOT NULL,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_schicht_templates_restaurant ON schicht_templates(restaurant_id);

-- Einzelne Schichteinträge einer Vorlage (wochentag 0=Mo … 6=So)
CREATE TABLE IF NOT EXISTS schicht_template_eintraege (
  id             UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id    UUID     NOT NULL REFERENCES schicht_templates(id) ON DELETE CASCADE,
  mitarbeiter_id UUID     NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  wochentag      SMALLINT NOT NULL CHECK (wochentag BETWEEN 0 AND 6),
  beginn         TIME     NOT NULL,
  ende           TIME     NOT NULL,
  notiz          TEXT
);
CREATE INDEX IF NOT EXISTS idx_schicht_template_eintraege_template ON schicht_template_eintraege(template_id);

-- ─── Öffnungszeiten ──────────────────────────────────────────────────────────
-- wochentag: 0=Montag … 6=Sonntag
CREATE TABLE IF NOT EXISTS oeffnungszeiten (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  wochentag     INTEGER NOT NULL CHECK (wochentag BETWEEN 0 AND 6),
  von           TIME    NOT NULL,
  bis           TIME    NOT NULL,
  geschlossen   BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (restaurant_id, wochentag)
);
CREATE INDEX IF NOT EXISTS idx_oeffnungszeiten_restaurant ON oeffnungszeiten(restaurant_id);

-- ─── Ausnahmetage (Feiertage / geschlossene Tage) ───────────────────────────
-- Überschreibt Öffnungszeiten: an diesem Datum ist das Restaurant geschlossen
CREATE TABLE IF NOT EXISTS ausnahmetage (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID    NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  datum         DATE    NOT NULL,
  grund         TEXT,                                          -- z.B. "Ostern", "Betriebsferien"
  UNIQUE (restaurant_id, datum)
);
CREATE INDEX IF NOT EXISTS idx_ausnahmetage_restaurant ON ausnahmetage(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_ausnahmetage_datum      ON ausnahmetage(datum);

-- ─── Passwort-vergessen Tokens ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS passwort_resets (
  id             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  mitarbeiter_id UUID    NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  token          TEXT    NOT NULL UNIQUE,
  gueltig_bis    TIMESTAMP NOT NULL,
  benutzt        BOOLEAN NOT NULL DEFAULT false,
  erstellt_am    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_token       ON passwort_resets(token);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_mitarbeiter ON passwort_resets(mitarbeiter_id);

-- ─── Login-Versuche (Rate Limiting) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_versuche (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT    NOT NULL,
  ip_adresse  TEXT,
  erfolgreich BOOLEAN NOT NULL DEFAULT false,
  erstellt_am TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_login_versuche_email ON login_versuche(email);
CREATE INDEX IF NOT EXISTS idx_login_versuche_zeit  ON login_versuche(erstellt_am);
