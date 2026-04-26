-- ═══════════════════════════════════════════════════════
-- Migration: Floor Plan v2 — Reservierungs-Tags + Dekorationen
-- Datum: 2026-04-26
-- ═══════════════════════════════════════════════════════

-- 1. Tags auf Reservierung (zusätzlich zu anlass/sitzplatz_wunsch)
--    Ad-hoc Tags pro Reservierung — z.B. "Vegan", "Allergie", "Geburtstag"
--    Ergänzt die CRM-Tags am Gast (für Reservierungen ohne verknüpften Gast)
ALTER TABLE reservierungen
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

-- 2. Dekorationen-Tabelle (Pflanzen, Theke, Eingang, Wand, Servicestation)
--    Statische Deko-Elemente auf dem Floor Plan — nicht klickbar im Live-Modus
CREATE TABLE IF NOT EXISTS dekorationen (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  bereich_id    UUID REFERENCES bereiche(id) ON DELETE SET NULL,
  typ           VARCHAR(30) NOT NULL CHECK (typ IN ('pflanze', 'theke', 'eingang', 'servicestation', 'wand', 'tuer')),
  pos_x         INTEGER NOT NULL DEFAULT 0,
  pos_y         INTEGER NOT NULL DEFAULT 0,
  breite        INTEGER NOT NULL DEFAULT 60,
  hoehe         INTEGER NOT NULL DEFAULT 60,
  rotation      INTEGER NOT NULL DEFAULT 0,
  label         VARCHAR(50),                       -- optional: "Eingang", "Bar", "Damen-WC" etc.
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dekorationen_restaurant
  ON dekorationen (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dekorationen_bereich
  ON dekorationen (bereich_id) WHERE bereich_id IS NOT NULL;
