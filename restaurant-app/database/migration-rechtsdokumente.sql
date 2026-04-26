-- DSGVO-Compliance: Akzeptanz von AGB und AVV protokollieren
-- Pflicht nach Art. 7 Abs. 1 DSGVO (Nachweisbarkeit) bzw. Art. 28 DSGVO (AVV).
-- Bei einem AGB- oder AVV-Update muss die Version erhöht und Akzeptanz erneut eingeholt werden.

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS agb_akzeptiert_am TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS agb_version       VARCHAR(20),
  ADD COLUMN IF NOT EXISTS avv_akzeptiert_am TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS avv_version       VARCHAR(20);
