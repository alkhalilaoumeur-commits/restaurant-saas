-- Migration: Kassensystem-Integration
-- Erstellt: 2026-04-18
-- Zweck: Speichert KSS-Konfiguration pro Restaurant und loggt jeden Push-Versuch

-- ──────────────────────────────────────────────────────────
-- Tabelle 1: kss_konfiguration
-- Pro Restaurant genau eine KSS-Konfiguration (UNIQUE auf restaurant_id)
-- api_key_enc: AES-256-GCM verschlüsselt, niemals im Klartext
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kss_konfiguration (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  anbieter        VARCHAR(50) NOT NULL DEFAULT 'deaktiviert',
  -- Erlaubte Werte: 'deaktiviert' | 'generic_webhook' | 'orderbird' | 'ready2order' | 'sumup'
  webhook_url     TEXT,
  api_key_enc     TEXT,           -- Verschlüsselt mit AES-256-GCM + KSS_ENCRYPTION_KEY
  aktiv           BOOLEAN NOT NULL DEFAULT false,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS kss_konfiguration_restaurant_idx
  ON kss_konfiguration(restaurant_id);

-- ──────────────────────────────────────────────────────────
-- Tabelle 2: kss_log
-- Jeder Push-Versuch (Erfolg + Fehler) wird hier gespeichert
-- status: 'success' | 'failed' | 'retrying'
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kss_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  bestellung_id     UUID NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  anbieter          VARCHAR(50) NOT NULL,
  status            VARCHAR(20) NOT NULL,   -- 'success' | 'failed' | 'retrying'
  http_status       INTEGER,                -- HTTP-Antwortcode vom KSS (200, 404, 500, ...)
  fehler_meldung    TEXT,                   -- Fehlermeldung wenn status = 'failed'
  versuche          INTEGER NOT NULL DEFAULT 1,
  erstellt_am       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kss_log_restaurant_idx
  ON kss_log(restaurant_id, erstellt_am DESC);

CREATE INDEX IF NOT EXISTS kss_log_bestellung_idx
  ON kss_log(bestellung_id);
