-- Migration: Stripe Subscription IDs auf restaurants-Tabelle
-- Ausführen: psql $DATABASE_URL -f database/migration-stripe-subscription.sql

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS stripe_customer_id      TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  TEXT;

-- Index für schnelle Webhook-Verarbeitung (Stripe schickt subscription_id)
CREATE INDEX IF NOT EXISTS idx_restaurants_stripe_subscription
  ON restaurants (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
