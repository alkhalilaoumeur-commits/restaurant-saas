-- Migration: Floor Plan Editor (Visueller Tischplan)
-- Erstellt: 2026-04-08
--
-- Was passiert hier:
-- 1. Neue Tabelle "bereiche" — Zonen im Restaurant (Innen, Terrasse, Bar, ...)
-- 2. Neue Spalten auf "tische" — Position, Größe, Form, Rotation, Bereich-Zuordnung
--    Damit weiß die App WO ein Tisch auf der Zeichenfläche liegt und WIE er aussieht.

-- ============================================================
-- 1. Bereiche-Tabelle (Zonen im Restaurant)
-- ============================================================
CREATE TABLE IF NOT EXISTS bereiche (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,              -- z.B. "Innen", "Terrasse", "Bar"
  reihenfolge   INTEGER NOT NULL DEFAULT 0, -- Sortierung der Tabs im Editor
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, name)              -- Pro Restaurant keine doppelten Namen
);

CREATE INDEX IF NOT EXISTS idx_bereiche_restaurant ON bereiche(restaurant_id);

-- ============================================================
-- 2. Neue Spalten auf tische (Positionsdaten für den Canvas)
-- ============================================================

-- Form: Welche geometrische Form hat der Tisch?
-- rechteck = Standard, rund = Kreistisch, quadrat = quadratisch, bar = Theken-/Barplatz
ALTER TABLE tische ADD COLUMN IF NOT EXISTS form TEXT NOT NULL DEFAULT 'rechteck';

-- Position auf der Zeichenfläche (in Pixeln vom oberen linken Eck)
ALTER TABLE tische ADD COLUMN IF NOT EXISTS pos_x REAL NOT NULL DEFAULT 0;
ALTER TABLE tische ADD COLUMN IF NOT EXISTS pos_y REAL NOT NULL DEFAULT 0;

-- Größe des Tisches auf der Zeichenfläche (in Pixeln)
ALTER TABLE tische ADD COLUMN IF NOT EXISTS breite REAL NOT NULL DEFAULT 80;
ALTER TABLE tische ADD COLUMN IF NOT EXISTS hoehe REAL NOT NULL DEFAULT 80;

-- Rotation in Grad (0-360)
ALTER TABLE tische ADD COLUMN IF NOT EXISTS rotation REAL NOT NULL DEFAULT 0;

-- Zu welchem Bereich gehört dieser Tisch? (NULL = keinem Bereich zugeordnet)
ALTER TABLE tische ADD COLUMN IF NOT EXISTS bereich_id UUID REFERENCES bereiche(id) ON DELETE SET NULL;

-- Check-Constraint für erlaubte Formen
-- (IF NOT EXISTS gibt es bei CHECK nicht — daher DO-Block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tische_form_check'
  ) THEN
    ALTER TABLE tische ADD CONSTRAINT tische_form_check
      CHECK (form IN ('rechteck', 'rund', 'quadrat', 'bar'));
  END IF;
END$$;
