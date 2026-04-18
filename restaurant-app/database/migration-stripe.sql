-- ═══════════════════════════════════════════════════════
-- Migration: Mollie → Stripe
-- Benennt mollie_payment_id in stripe_session_id um
-- ═══════════════════════════════════════════════════════

-- Spalte umbenennen (bestehende Daten bleiben erhalten)
ALTER TABLE zahlungen
  RENAME COLUMN mollie_payment_id TO stripe_session_id;
