-- Migration: Extras/Modifier-System
-- Ermöglicht Zusatzoptionen pro Gericht (z.B. "Extra Käse +2€", "Größe: Klein/Mittel/Groß")
--
-- Ausführen: psql $DATABASE_URL -f database/migration-extras.sql

-- ─── Extras-Gruppen ─────────────────────────────────────────────────────────
-- Eine Gruppe fasst zusammengehörige Optionen zusammen.
-- Beispiel: Gruppe "Sauce" enthält Extras "Ketchup", "Mayo", "BBQ"
-- pflicht = true  → Gast MUSS eine Option wählen (z.B. Größe)
-- max_auswahl = 1 → Radio-Buttons (nur eine Option), > 1 → Checkboxen (mehrere)
CREATE TABLE IF NOT EXISTS extras_gruppen (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gericht_id    UUID NOT NULL REFERENCES gerichte(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  pflicht       BOOLEAN NOT NULL DEFAULT false,
  max_auswahl   INTEGER NOT NULL DEFAULT 1 CHECK (max_auswahl >= 1),
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_extras_gruppen_gericht ON extras_gruppen(gericht_id);
CREATE INDEX IF NOT EXISTS idx_extras_gruppen_restaurant ON extras_gruppen(restaurant_id);

-- ─── Extras (einzelne Optionen) ─────────────────────────────────────────────
-- Jede Option hat einen Namen und einen Aufpreis (kann 0 sein für kostenlose Optionen).
-- verfuegbar = false → Option wird Gästen nicht angezeigt (z.B. ausverkauft)
CREATE TABLE IF NOT EXISTS extras (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gruppe_id     UUID NOT NULL REFERENCES extras_gruppen(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  aufpreis      DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (aufpreis >= 0),
  verfuegbar    BOOLEAN NOT NULL DEFAULT true,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_extras_gruppe ON extras(gruppe_id);
CREATE INDEX IF NOT EXISTS idx_extras_restaurant ON extras(restaurant_id);

-- ─── Bestellposition-Extras ─────────────────────────────────────────────────
-- Verknüpft gewählte Extras mit einer Bestellposition.
-- aufpreis wird zum Zeitpunkt der Bestellung gespeichert (Preis kann sich ändern).
CREATE TABLE IF NOT EXISTS bestellposition_extras (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id     UUID NOT NULL REFERENCES bestellpositionen(id) ON DELETE CASCADE,
  extra_id        UUID NOT NULL REFERENCES extras(id) ON DELETE RESTRICT,
  extra_name      TEXT NOT NULL,
  aufpreis        DECIMAL(10,2) NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_bestellposition_extras_position ON bestellposition_extras(position_id);
