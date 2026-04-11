-- Migration: 3D-Modell-URL für Gerichte (Premium-Feature)
-- Erlaubt das Hinterlegen einer .glb 3D-Modell-Datei pro Gericht.
-- Wird im Detail-Modal mit <model-viewer> angezeigt.

ALTER TABLE gerichte
  ADD COLUMN IF NOT EXISTS modell_3d_url TEXT DEFAULT NULL;

COMMENT ON COLUMN gerichte.modell_3d_url IS 'URL zu einer .glb 3D-Modell-Datei (Premium-Feature)';
