-- ============================================================================
-- Test-User erstellen
-- NACH supabase-setup.sql im SQL Editor ausführen
-- ============================================================================

-- Admin-User in Supabase Auth erstellen
-- Email: admin@demo.de / Passwort: test1234
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@demo.de',
  crypt('test1234', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin"}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Identity für den User (nötig für Supabase Auth)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'admin@demo.de'),
  'email',
  'a0000000-0000-0000-0000-000000000001',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Mitarbeiter-Eintrag verknüpft mit Auth-User
INSERT INTO mitarbeiter (id, auth_user_id, restaurant_id, name, email, rolle)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Admin',
  'admin@demo.de',
  'admin'
) ON CONFLICT DO NOTHING;
