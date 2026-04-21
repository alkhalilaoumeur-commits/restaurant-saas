-- Restaurant-Business-Email Verifikation
-- Fügt email_verifiziert Feld zur restaurants Tabelle hinzu
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS email_verifiziert boolean DEFAULT false;
