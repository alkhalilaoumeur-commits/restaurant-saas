-- Restaurant App – Testdaten
-- Ausführen: psql $DATABASE_URL -f database/seed.sql
-- Stand: 2026-04-10
--
-- Test-Accounts:
--   admin@demo.de   / test1234  (Admin)
--   kellner@demo.de / test1234  (Kellner)
--   kueche@demo.de  / test1234  (Küche)
--   ilias@demo.de   / Ilias1234 (Admin, persönliches Konto)

-- ─── Demo-Restaurant ─────────────────────────────────────────────────────────
INSERT INTO restaurants (
  id, name, waehrung, lizenz_code, abo_status, restaurant_code,
  strasse, plz, stadt, telefon,
  primaerfarbe,
  max_gaeste_pro_slot, reservierung_puffer_min, reservierung_vorlauf_tage
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Trattoria Demo', 'EUR', 'DEMO-0001', 'trial', 'DEMO001',
  'Musterstraße 1', '70173', 'Stuttgart', '+49 711 123456',
  '#ea580c',
  NULL, 15, 30
) ON CONFLICT DO NOTHING;

-- ─── Mitarbeiter ─────────────────────────────────────────────────────────────
-- Ilias (persönliches Konto): ilias@demo.de / Ilias1234
INSERT INTO mitarbeiter (restaurant_id, name, email, passwort_hash, rolle, aktiv, email_verifiziert)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Ilias', 'ilias@demo.de',
  '$2a$12$ontPtjKUkV490GNYKKfPOesN81COhtBYUepA/t0SThCnjxlUOO2Cu',
  'admin', true, true
) ON CONFLICT (email) DO UPDATE
  SET passwort_hash = EXCLUDED.passwort_hash, rolle = 'admin', aktiv = true, email_verifiziert = true;

-- Admin: admin@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, aktiv, email_verifiziert)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Admin', 'admin@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'admin', true, true
) ON CONFLICT DO NOTHING;

-- Kellner: kellner@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, aktiv, email_verifiziert, stundenlohn, urlaubsanspruch_tage)
VALUES (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'Maria Müller', 'kellner@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'kellner', true, true, 14.50, 24
) ON CONFLICT DO NOTHING;

-- Küche: kueche@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, aktiv, email_verifiziert, stundenlohn, urlaubsanspruch_tage)
VALUES (
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  'Marco Koch', 'kueche@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'kueche', true, true, 16.00, 20
) ON CONFLICT DO NOTHING;

-- ─── Öffnungszeiten ──────────────────────────────────────────────────────────
INSERT INTO oeffnungszeiten (id, restaurant_id, wochentag, von, bis, geschlossen) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 0, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 1, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 2, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 3, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 4, '11:00', '23:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 5, '11:00', '23:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 6, '00:00', '00:00', true)
ON CONFLICT DO NOTHING;

-- ─── Bereiche (Floor-Plan) ────────────────────────────────────────────────────
INSERT INTO bereiche (id, restaurant_id, name, reihenfolge) VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000001', 'Innenbereich',  0),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000001', 'Terrasse',      1)
ON CONFLICT DO NOTHING;

-- ─── Tische ──────────────────────────────────────────────────────────────────
INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status, qr_url, form, pos_x, pos_y, breite, hoehe, bereich_id) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 1, 2, 'frei',
   'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000001',
   'rechteck', 50,  50,  80, 60, '00000000-0000-0000-0005-000000000001'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 2, 4, 'frei',
   'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000002',
   'rechteck', 160, 50,  100, 80, '00000000-0000-0000-0005-000000000001'),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 3, 4, 'frei',
   'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000003',
   'rund',     280, 50,  80,  80, '00000000-0000-0000-0005-000000000001'),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 4, 6, 'frei',
   'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000004',
   'rechteck', 50,  200, 120, 80, '00000000-0000-0000-0005-000000000001'),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 5, 6, 'frei',
   'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000005',
   'rechteck', 200, 200, 120, 80, '00000000-0000-0000-0005-000000000002')
ON CONFLICT DO NOTHING;

-- ─── Kategorien ──────────────────────────────────────────────────────────────
INSERT INTO kategorien (id, restaurant_id, name, reihenfolge) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Vorspeisen',    1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Hauptgerichte', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Desserts',      3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Getränke',      4)
ON CONFLICT DO NOTHING;

-- ─── Gerichte ────────────────────────────────────────────────────────────────
INSERT INTO gerichte (id, restaurant_id, kategorie_id, name, beschreibung, preis, allergene, verfuegbar) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001',
   'Bruschetta', 'Geröstetes Brot mit Tomaten und Basilikum', 6.90, 'Gluten', true),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001',
   'Carpaccio', 'Rinderfilet dünn aufgeschnitten mit Parmesan', 12.50, 'Milch', true),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Pizza Margherita', 'Tomatensauce, Mozzarella, Basilikum', 11.90, 'Gluten, Milch', true),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Spaghetti Carbonara', 'Speck, Ei, Parmesan, schwarzer Pfeffer', 13.90, 'Gluten, Ei, Milch', true),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002',
   'Bistecca', '250g Rindersteak mit Rosmarinkartoffeln', 24.90, NULL, true),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003',
   'Tiramisu', 'Klassisches Tiramisu mit Mascarpone', 6.50, 'Gluten, Ei, Milch', true),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004',
   'Wasser still', '0,5l', 2.90, NULL, true),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004',
   'Hauswein rot', '0,2l', 4.90, 'Sulfite', true)
ON CONFLICT DO NOTHING;
