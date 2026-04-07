-- Restaurant App – Testdaten
-- Ausführen: psql $DATABASE_URL -f database/seed.sql
-- Passwort für alle Testnutzer: "test1234"
-- bcrypt-Hash von "test1234" mit 12 Runden

-- ─── Demo-Restaurant ─────────────────────────────────────────────────────────
INSERT INTO restaurants (id, name, waehrung, lizenz_code, abo_status, restaurant_code)
VALUES ('00000000-0000-0000-0000-000000000001', 'Trattoria Demo', 'EUR', 'DEMO-0001', 'trial', 'DEMO001')
ON CONFLICT DO NOTHING;

-- ─── Mitarbeiter ─────────────────────────────────────────────────────────────
-- Admin: admin@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, email_verifiziert)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Admin',
  'admin@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'admin',
  true
) ON CONFLICT DO NOTHING;

-- Kellner: kellner@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, email_verifiziert)
VALUES (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'Maria Müller',
  'kellner@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'kellner',
  true
) ON CONFLICT DO NOTHING;

-- Küche: kueche@demo.de / test1234
INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, email_verifiziert)
VALUES (
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  'Marco Koch',
  'kueche@demo.de',
  '$2a$12$232gnizz0bXTrs0YGDc4Su7w73wAcoZlsKpZa464apEK7TL9ojT2S',
  'kueche',
  true
) ON CONFLICT DO NOTHING;

-- ─── Öffnungszeiten ─────────────────────────────────────────────────────────
INSERT INTO oeffnungszeiten (id, restaurant_id, wochentag, von, bis, geschlossen) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 0, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 1, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 2, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 3, '11:00', '22:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 4, '11:00', '23:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 5, '11:00', '23:00', false),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 6, '00:00', '00:00', true)
ON CONFLICT DO NOTHING;

-- ─── Kategorien ──────────────────────────────────────────────────────────────
INSERT INTO kategorien (id, restaurant_id, name, reihenfolge) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Vorspeisen',   1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Hauptgerichte',2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Desserts',     3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Getränke',     4)
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

-- ─── Tische ──────────────────────────────────────────────────────────────────
INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status, qr_url) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 1, 2, 'frei', 'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 2, 4, 'frei', 'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000002'),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 3, 4, 'frei', 'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000003'),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 4, 6, 'frei', 'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000004'),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 5, 6, 'frei', 'http://localhost:5173/bestellen-pro/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000005')
ON CONFLICT DO NOTHING;
