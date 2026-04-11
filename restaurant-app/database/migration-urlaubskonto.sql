-- Migration: Urlaubskonto (Urlaubsanspruch pro Mitarbeiter)
-- Rechtsgrundlage: § 3 BUrlG — Mindesturlaub 4 Wochen (= 20 AT bei 5-Tage-Woche)
-- Ausführen: psql $DATABASE_URL -f database/migration-urlaubskonto.sql

ALTER TABLE mitarbeiter
  ADD COLUMN IF NOT EXISTS urlaubsanspruch_tage INTEGER NOT NULL DEFAULT 20;

-- DSGVO-Hinweis: Diese Spalte speichert den vertraglich vereinbarten Urlaubsanspruch
-- eines Mitarbeiters. Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Pflicht
-- nach BUrlG). Verarbeitungszweck: Urlaubsverwaltung, Arbeitszeitdokumentation.
COMMENT ON COLUMN mitarbeiter.urlaubsanspruch_tage IS
  'Jährlicher Urlaubsanspruch in Arbeitstagen (Mon–Fr). '
  'BUrlG-Minimum: 20 Tage (5-Tage-Woche). Kann vom Admin abweichend eingestellt werden. '
  'Rechtsgrundlage: Art. 6(1)(c) DSGVO i.V.m. § 3 BUrlG.';
