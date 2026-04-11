-- Migration: Gäste-CRM
-- Neue Tabelle: gaeste (Gast-Profile mit Tags, Notizen, Kontaktdaten)
-- Neue Spalte: gast_id auf reservierungen (Verknüpfung zum CRM-Profil)

-- ── Gäste-Tabelle ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gaeste (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255),
  telefon       VARCHAR(30),
  notizen       TEXT,
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Pro Restaurant eindeutige Email (NULL erlaubt für Gäste ohne Email)
  UNIQUE NULLS NOT DISTINCT (restaurant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_gaeste_restaurant ON gaeste(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gaeste_email      ON gaeste(restaurant_id, email) WHERE email IS NOT NULL;

-- ── gast_id auf reservierungen ───────────────────────────────────────────────
-- Wenn ein Gast-Profil gelöscht wird (DSGVO), bleibt die Reservierung erhalten
-- aber der CRM-Link wird auf NULL gesetzt (ON DELETE SET NULL)
ALTER TABLE reservierungen
  ADD COLUMN IF NOT EXISTS gast_id UUID REFERENCES gaeste(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reservierungen_gast ON reservierungen(gast_id) WHERE gast_id IS NOT NULL;
