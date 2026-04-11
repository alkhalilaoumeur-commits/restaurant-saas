-- Migration: Speicherfrist für Gäste-CRM (DSGVO Art. 5(1)(e))
-- Gast-Profile werden automatisch nach 2 Jahren ohne Aktivität gelöscht.

-- loeschen_nach: Datum ab dem das Profil gelöscht werden darf.
-- Wird bei jeder Buchung auf now() + 2 Jahre gesetzt (Aktivität verlängert Frist).
ALTER TABLE gaeste
  ADD COLUMN IF NOT EXISTS loeschen_nach DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '2 years');

-- Index für den nächtlichen Cleanup-Job
CREATE INDEX IF NOT EXISTS idx_gaeste_loeschen_nach ON gaeste(loeschen_nach);
