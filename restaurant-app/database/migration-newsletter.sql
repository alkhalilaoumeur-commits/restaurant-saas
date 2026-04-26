-- Migration: Newsletter-Widerspruchs-Flag (EuGH C-654/23 + § 7 Abs. 3 UWG)
-- Datum: 2026-04-26
--
-- Hintergrund: Bestandskunden duerfen ohne explizite Einwilligung E-Mails ueber aehnliche
-- eigene Produkte erhalten — vorausgesetzt, der Hinweis erfolgt sowohl bei der Datenerhebung
-- als auch in jeder Werbe-Mail. Diese Spalte speichert den Widerspruch.
--
-- Default TRUE = Bestandskundenwerbung ist anfangs erlaubt (Opt-out-Modell).
-- Bei FALSE: Restaurant hat widersprochen — keine Werbung mehr versenden.
--
-- Ausfuehren: psql $DATABASE_URL -f database/migration-newsletter.sql

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS newsletter_aktiv BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS newsletter_widerspruch_am TIMESTAMPTZ;

COMMENT ON COLUMN restaurants.newsletter_aktiv IS 'EuGH C-654/23 / § 7 Abs. 3 UWG: TRUE = Werbung ueber aehnliche Produkte erlaubt; FALSE = Restaurant hat widersprochen';
COMMENT ON COLUMN restaurants.newsletter_widerspruch_am IS 'Zeitpunkt des Widerspruchs (NULL solange aktiv)';
