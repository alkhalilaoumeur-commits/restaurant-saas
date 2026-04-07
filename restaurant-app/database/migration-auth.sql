-- Migration: Auth-System erweitern
-- Ausführen: psql $DATABASE_URL -f database/migration-auth.sql

-- ─── Restaurant: restaurant_code hinzufügen ─────────────────────────────────
-- Eindeutiger Code pro Restaurant (z.B. REST-A7K39M2P), wird bei Registrierung generiert
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS restaurant_code TEXT UNIQUE;

-- Bestehende Restaurants ohne Code → nachträglich generieren
UPDATE restaurants SET restaurant_code = 'REST-' || UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 8))
WHERE restaurant_code IS NULL;

ALTER TABLE restaurants ALTER COLUMN restaurant_code SET NOT NULL;

-- ─── Öffnungszeiten als eigene Tabelle ──────────────────────────────────────
-- Pro Wochentag: von/bis Uhrzeit. wochentag 0=Montag, 6=Sonntag
CREATE TABLE IF NOT EXISTS oeffnungszeiten (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  wochentag     INTEGER NOT NULL CHECK (wochentag BETWEEN 0 AND 6),
  von           TIME NOT NULL,
  bis           TIME NOT NULL,
  geschlossen   BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (restaurant_id, wochentag)
);
CREATE INDEX IF NOT EXISTS idx_oeffnungszeiten_restaurant ON oeffnungszeiten(restaurant_id);

-- ─── Mitarbeiter: Einladungssystem + Email-Verifizierung ────────────────────
-- einladung_token: Einmal-Token für Mitarbeiter-Einladung (MA setzt eigenes Passwort)
-- einladung_gueltig_bis: Ablaufzeit des Einladungs-Tokens (48h)
-- email_verifiziert: Ob die Email-Adresse bestätigt wurde
-- verifizierung_token: Token für Email-Verifizierungslink
ALTER TABLE mitarbeiter
  ADD COLUMN IF NOT EXISTS einladung_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS einladung_gueltig_bis TIMESTAMP,
  ADD COLUMN IF NOT EXISTS email_verifiziert BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verifizierung_token TEXT UNIQUE;

-- passwort_hash darf jetzt NULL sein (für eingeladene MA die noch kein Passwort gesetzt haben)
ALTER TABLE mitarbeiter ALTER COLUMN passwort_hash DROP NOT NULL;

-- ─── Passwort-vergessen Tokens ──────────────────────────────────────────────
-- Eigene Tabelle, weil ein User mehrere Reset-Anfragen haben kann
CREATE TABLE IF NOT EXISTS passwort_resets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mitarbeiter_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  gueltig_bis   TIMESTAMP NOT NULL,
  benutzt       BOOLEAN NOT NULL DEFAULT false,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_token ON passwort_resets(token);
CREATE INDEX IF NOT EXISTS idx_passwort_resets_mitarbeiter ON passwort_resets(mitarbeiter_id);

-- ─── Login-Versuche tracken (für Rate Limiting + Account-Sperre) ────────────
CREATE TABLE IF NOT EXISTS login_versuche (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL,
  ip_adresse    TEXT,
  erfolgreich   BOOLEAN NOT NULL DEFAULT false,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_login_versuche_email ON login_versuche(email);
CREATE INDEX IF NOT EXISTS idx_login_versuche_zeit ON login_versuche(erstellt_am);

-- Alte Login-Versuche automatisch aufräumen (älter als 24h)
-- Kann per Cronjob ausgeführt werden:
-- DELETE FROM login_versuche WHERE erstellt_am < NOW() - INTERVAL '24 hours';
