-- DSGVO Art. 5 Abs. 1 lit. e: Stornierte Reservierungen werden 7 Tage nach Stornierung
-- anonymisiert (statt erst nach 30 Tagen wie ungestornierte). Dafür brauchen wir einen
-- Zeitstempel des Stornierungs-Events. Trigger setzt ihn automatisch — auch bei direkten
-- DB-Updates, falls jemand mal manuell ans Schema geht.

ALTER TABLE reservierungen
  ADD COLUMN IF NOT EXISTS storniert_am TIMESTAMP;

CREATE OR REPLACE FUNCTION reservierungen_storno_timestamp() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'storniert' AND (OLD.status IS NULL OR OLD.status != 'storniert') THEN
    NEW.storniert_am := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reservierungen_storno_trigger ON reservierungen;
CREATE TRIGGER reservierungen_storno_trigger
  BEFORE INSERT OR UPDATE ON reservierungen
  FOR EACH ROW
  EXECUTE FUNCTION reservierungen_storno_timestamp();
