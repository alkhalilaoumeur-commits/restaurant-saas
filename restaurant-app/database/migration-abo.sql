-- ═══════════════════════════════════════════════════════
-- Migration: Abo-System + Rabattcodes
-- ═══════════════════════════════════════════════════════

-- 1. Restaurants: Abo-Ablaufdatum hinzufügen
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS abo_laeuft_bis TIMESTAMPTZ;

-- 2. Zahlungen-Log (jede Stripe-Zahlung wird hier gespeichert)
CREATE TABLE IF NOT EXISTS zahlungen (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(120) UNIQUE NOT NULL,
  betrag_cent       INTEGER NOT NULL,               -- z.B. 4900 = €49,00
  status            VARCHAR(20) NOT NULL DEFAULT 'open', -- open | paid | failed | cancelled | expired
  monate            INTEGER NOT NULL DEFAULT 1,
  rabattcode        VARCHAR(50),                    -- verwendeter Code (zur Nachverfolgung)
  erstellt_am       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  bezahlt_am        TIMESTAMPTZ
);

-- 3. Rabattcodes-Tabelle
CREATE TABLE IF NOT EXISTS rabattcodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  rabatt_prozent  INTEGER NOT NULL CHECK (rabatt_prozent BETWEEN 0 AND 100),
  monate          INTEGER NOT NULL DEFAULT 1,       -- wie viele Abo-Monate der Code gewährt
  max_nutzungen   INTEGER,                          -- NULL = unbegrenzt
  nutzungen       INTEGER NOT NULL DEFAULT 0,
  gueltig_bis     TIMESTAMPTZ,                      -- NULL = unbegrenzt gültig
  aktiv           BOOLEAN NOT NULL DEFAULT true,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Test-Code für Entwicklung: ILIAS100 = 100% Rabatt, 1 Monat, unbegrenzt nutzbar
INSERT INTO rabattcodes (code, rabatt_prozent, monate, max_nutzungen, gueltig_bis)
VALUES ('ILIAS100', 100, 1, NULL, NULL)
ON CONFLICT (code) DO NOTHING;

-- 5. Beispiel-Code: LAUNCH50 = 50% Rabatt, 3 Monate
INSERT INTO rabattcodes (code, rabatt_prozent, monate, max_nutzungen, gueltig_bis)
VALUES ('LAUNCH50', 50, 3, 100, NULL)
ON CONFLICT (code) DO NOTHING;
