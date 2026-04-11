-- Migration: Unterkategorien (optionale Gruppierung innerhalb einer Kategorie)
-- z.B. Hauptgerichte → Vegan, Vegetarisch, Fleischgerichte, Reisgerichte

-- ─── Neue Tabelle: unterkategorien ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS unterkategorien (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  kategorie_id  UUID NOT NULL REFERENCES kategorien(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_unterkategorien_kategorie ON unterkategorien(kategorie_id);
CREATE INDEX IF NOT EXISTS idx_unterkategorien_restaurant ON unterkategorien(restaurant_id);

-- ─── Gerichte: optionale Zuordnung zu Unterkategorie ────────────────────────
ALTER TABLE gerichte
  ADD COLUMN IF NOT EXISTS unterkategorie_id UUID REFERENCES unterkategorien(id) ON DELETE SET NULL DEFAULT NULL;

COMMENT ON TABLE unterkategorien IS 'Optionale Gruppierung innerhalb einer Kategorie (z.B. Vegan, Fleisch)';
COMMENT ON COLUMN gerichte.unterkategorie_id IS 'Optionale Zuordnung zu einer Unterkategorie (NULL = keiner zugeordnet)';
