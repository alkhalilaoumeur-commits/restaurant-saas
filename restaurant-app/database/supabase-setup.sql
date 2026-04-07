-- ============================================================================
-- Restaurant SaaS – Supabase Setup
-- Dieses Script im Supabase SQL Editor ausführen (Dashboard → SQL Editor → New Query)
-- Es erstellt: Tabellen, RLS Policies, Seed-Daten, und einen Test-User
-- ============================================================================

-- ─── 1. Tabellen ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS restaurants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  logo_url        TEXT,
  oeffnungszeiten TEXT,
  waehrung        TEXT NOT NULL DEFAULT 'EUR',
  lizenz_code     TEXT UNIQUE,
  max_mitarbeiter INTEGER NOT NULL DEFAULT 5,
  abo_status      TEXT NOT NULL DEFAULT 'trial'
                  CHECK (abo_status IN ('trial', 'active', 'expired')),
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mitarbeiter (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  rolle         TEXT NOT NULL CHECK (rolle IN ('admin', 'kellner', 'kueche')),
  aktiv         BOOLEAN NOT NULL DEFAULT true,
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_restaurant ON mitarbeiter(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_email ON mitarbeiter(email);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_auth_user ON mitarbeiter(auth_user_id);

CREATE TABLE IF NOT EXISTS kategorien (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kategorien_restaurant ON kategorien(restaurant_id);

CREATE TABLE IF NOT EXISTS tische (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  nummer        INTEGER NOT NULL,
  kapazitaet    INTEGER,
  status        TEXT NOT NULL DEFAULT 'frei'
                CHECK (status IN ('frei', 'besetzt', 'wartet_auf_zahlung')),
  qr_url        TEXT,
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, nummer)
);
CREATE INDEX IF NOT EXISTS idx_tische_restaurant ON tische(restaurant_id);

CREATE TABLE IF NOT EXISTS gerichte (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id  UUID NOT NULL REFERENCES kategorien(id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  beschreibung  TEXT,
  preis         DECIMAL(10,2) NOT NULL,
  bild_url      TEXT,
  allergene     TEXT,
  verfuegbar    BOOLEAN NOT NULL DEFAULT true,
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gerichte_restaurant ON gerichte(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gerichte_kategorie ON gerichte(kategorie_id);

CREATE TABLE IF NOT EXISTS bestellungen (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id        UUID NOT NULL REFERENCES tische(id) ON DELETE RESTRICT,
  status          TEXT NOT NULL DEFAULT 'offen'
                  CHECK (status IN ('offen', 'in_zubereitung', 'serviert', 'bezahlt')),
  gesamtpreis     DECIMAL(10,2) NOT NULL DEFAULT 0,
  anmerkung       TEXT,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bestellungen_restaurant ON bestellungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bestellungen_status ON bestellungen(status);
CREATE INDEX IF NOT EXISTS idx_bestellungen_tisch ON bestellungen(tisch_id);

-- Auto-Update aktualisiert_am
CREATE OR REPLACE FUNCTION set_aktualisiert_am()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aktualisiert_am = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bestellungen_aktualisiert_am ON bestellungen;
CREATE TRIGGER bestellungen_aktualisiert_am
  BEFORE UPDATE ON bestellungen
  FOR EACH ROW EXECUTE FUNCTION set_aktualisiert_am();

CREATE TABLE IF NOT EXISTS bestellpositionen (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bestellung_id UUID NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  gericht_id    UUID NOT NULL REFERENCES gerichte(id) ON DELETE RESTRICT,
  menge         INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis   DECIMAL(10,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bestellpositionen_bestellung ON bestellpositionen(bestellung_id);

-- DSGVO: telefon ist personenbezogen – Löschfrist 30 Tage nach Datum
CREATE TABLE IF NOT EXISTS reservierungen (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  tisch_id      UUID REFERENCES tische(id) ON DELETE SET NULL,
  gast_name     TEXT NOT NULL,
  telefon       TEXT,
  datum         TIMESTAMPTZ NOT NULL,
  personen      INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ausstehend'
                CHECK (status IN ('ausstehend', 'bestaetigt', 'storniert')),
  anmerkung     TEXT,
  quelle        TEXT NOT NULL DEFAULT 'app'
                CHECK (quelle IN ('app', 'whatsapp', 'telefon')),
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reservierungen_restaurant ON reservierungen(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservierungen_datum ON reservierungen(datum);

-- ─── 2. Hilfsfunktion: restaurant_id des aktuellen Users ────────────────────

CREATE OR REPLACE FUNCTION get_my_restaurant_id()
RETURNS UUID AS $$
  SELECT restaurant_id FROM mitarbeiter WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── 3. Row Level Security ──────────────────────────────────────────────────

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE mitarbeiter ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategorien ENABLE ROW LEVEL SECURITY;
ALTER TABLE tische ENABLE ROW LEVEL SECURITY;
ALTER TABLE gerichte ENABLE ROW LEVEL SECURITY;
ALTER TABLE bestellungen ENABLE ROW LEVEL SECURITY;
ALTER TABLE bestellpositionen ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservierungen ENABLE ROW LEVEL SECURITY;

-- Restaurants: Mitarbeiter sieht nur sein Restaurant
CREATE POLICY "mitarbeiter_restaurant" ON restaurants
  FOR ALL USING (id = get_my_restaurant_id());

-- Mitarbeiter: Sieht nur Kollegen im eigenen Restaurant
CREATE POLICY "mitarbeiter_eigenes_restaurant" ON mitarbeiter
  FOR ALL USING (restaurant_id = get_my_restaurant_id());

-- Kategorien: Nur eigenes Restaurant
CREATE POLICY "kategorien_tenant" ON kategorien
  FOR ALL USING (restaurant_id = get_my_restaurant_id());
-- Gäste können Kategorien lesen (für Bestellseite)
CREATE POLICY "kategorien_public_read" ON kategorien
  FOR SELECT USING (true);

-- Tische: Nur eigenes Restaurant
CREATE POLICY "tische_tenant" ON tische
  FOR ALL USING (restaurant_id = get_my_restaurant_id());
-- Gäste können Tische lesen
CREATE POLICY "tische_public_read" ON tische
  FOR SELECT USING (true);

-- Gerichte: Nur eigenes Restaurant für Mitarbeiter
CREATE POLICY "gerichte_tenant" ON gerichte
  FOR ALL USING (restaurant_id = get_my_restaurant_id());
-- Gäste können Gerichte lesen (für Bestellseite)
CREATE POLICY "gerichte_public_read" ON gerichte
  FOR SELECT USING (true);

-- Bestellungen: Nur eigenes Restaurant für Mitarbeiter
CREATE POLICY "bestellungen_tenant" ON bestellungen
  FOR ALL USING (restaurant_id = get_my_restaurant_id());
-- Gäste können Bestellungen erstellen (INSERT)
CREATE POLICY "bestellungen_gaeste_insert" ON bestellungen
  FOR INSERT WITH CHECK (true);

-- Bestellpositionen: Nur wenn Bestellung zum Restaurant gehört
CREATE POLICY "positionen_tenant" ON bestellpositionen
  FOR ALL USING (
    bestellung_id IN (SELECT id FROM bestellungen WHERE restaurant_id = get_my_restaurant_id())
  );
-- Gäste können Positionen erstellen
CREATE POLICY "positionen_gaeste_insert" ON bestellpositionen
  FOR INSERT WITH CHECK (true);

-- Reservierungen: Nur eigenes Restaurant
CREATE POLICY "reservierungen_tenant" ON reservierungen
  FOR ALL USING (restaurant_id = get_my_restaurant_id());

-- ─── 4. Realtime aktivieren (für Live-Updates bei Bestellungen) ─────────────

ALTER PUBLICATION supabase_realtime ADD TABLE bestellungen;

-- ─── 5. Seed-Daten ──────────────────────────────────────────────────────────

-- Demo-Restaurant
INSERT INTO restaurants (id, name, waehrung, lizenz_code, abo_status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Trattoria Demo', 'EUR', 'DEMO-0001', 'trial')
ON CONFLICT DO NOTHING;

-- Kategorien
INSERT INTO kategorien (id, restaurant_id, name, reihenfolge) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Vorspeisen',    1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Hauptgerichte', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Desserts',      3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Getränke',      4)
ON CONFLICT DO NOTHING;

-- Gerichte
INSERT INTO gerichte (id, restaurant_id, kategorie_id, name, beschreibung, preis, allergene, verfuegbar) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001',
   'Bruschetta', 'Geröstetes Brot mit Tomaten und Basilikum', 6.90, 'Gluten', true),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001',
   'Carpaccio', 'Rinderfilet dünn aufgeschnitten mit Parmesan', 12.50, 'Milch', true),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Pizza Margherita', 'Tomatensauce, Mozzarella, Basilikum', 11.90, 'Gluten, Milch', true),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Spaghetti Carbonara', 'Speck, Ei, Parmesan, schwarzer Pfeffer', 13.90, 'Gluten, Ei, Milch', true),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Bistecca', '250g Rindersteak mit Rosmarinkartoffeln', 24.90, NULL, true),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003',
   'Tiramisu', 'Klassisches Tiramisu mit Mascarpone', 6.50, 'Gluten, Ei, Milch', true),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004',
   'Wasser still', '0,5l', 2.90, NULL, true),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004',
   'Hauswein rot', '0,2l', 4.90, 'Sulfite', true)
ON CONFLICT DO NOTHING;

-- Tische
INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 1, 2, 'frei'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 2, 4, 'frei'),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 3, 4, 'frei'),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 4, 6, 'frei'),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 5, 6, 'frei')
ON CONFLICT DO NOTHING;
