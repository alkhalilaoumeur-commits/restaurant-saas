import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://heghjqxsieoepdhlbisz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ2hqcXhzaWVvZXBkaGxiaXN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzOTAxMiwiZXhwIjoyMDkwOTE1MDEyfQ.BbSVWeHIDbYriblONL0uLdoOLwcP-Dcxg7Pu2CL7if8';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('=== Restaurant SaaS – Supabase Setup ===\n');

  // 1. Restaurant
  console.log('1. Restaurant erstellen...');
  const { error: e1 } = await supabase.from('restaurants').upsert({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Trattoria Demo',
    waehrung: 'EUR',
    lizenz_code: 'DEMO-0001',
    abo_status: 'trial',
  }, { onConflict: 'id' });
  if (e1) console.error('  Fehler:', e1.message);
  else console.log('  OK');

  // 2. Kategorien
  console.log('2. Kategorien erstellen...');
  const kategorien = [
    { id: '00000000-0000-0000-0001-000000000001', restaurant_id: '00000000-0000-0000-0000-000000000001', name: 'Vorspeisen', reihenfolge: 1 },
    { id: '00000000-0000-0000-0001-000000000002', restaurant_id: '00000000-0000-0000-0000-000000000001', name: 'Hauptgerichte', reihenfolge: 2 },
    { id: '00000000-0000-0000-0001-000000000003', restaurant_id: '00000000-0000-0000-0000-000000000001', name: 'Desserts', reihenfolge: 3 },
    { id: '00000000-0000-0000-0001-000000000004', restaurant_id: '00000000-0000-0000-0000-000000000001', name: 'Getränke', reihenfolge: 4 },
  ];
  const { error: e2 } = await supabase.from('kategorien').upsert(kategorien, { onConflict: 'id' });
  if (e2) console.error('  Fehler:', e2.message);
  else console.log('  OK');

  // 3. Gerichte
  console.log('3. Gerichte erstellen...');
  const gerichte = [
    { id: '00000000-0000-0000-0002-000000000001', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000001', name: 'Bruschetta', beschreibung: 'Geröstetes Brot mit Tomaten und Basilikum', preis: 6.90, allergene: 'Gluten', verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000002', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000001', name: 'Carpaccio', beschreibung: 'Rinderfilet dünn aufgeschnitten mit Parmesan', preis: 12.50, allergene: 'Milch', verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000003', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000002', name: 'Pizza Margherita', beschreibung: 'Tomatensauce, Mozzarella, Basilikum', preis: 11.90, allergene: 'Gluten, Milch', verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000004', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000002', name: 'Spaghetti Carbonara', beschreibung: 'Speck, Ei, Parmesan, schwarzer Pfeffer', preis: 13.90, allergene: 'Gluten, Ei, Milch', verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000005', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000002', name: 'Bistecca', beschreibung: '250g Rindersteak mit Rosmarinkartoffeln', preis: 24.90, allergene: null, verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000006', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000003', name: 'Tiramisu', beschreibung: 'Klassisches Tiramisu mit Mascarpone', preis: 6.50, allergene: 'Gluten, Ei, Milch', verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000007', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000004', name: 'Wasser still', beschreibung: '0,5l', preis: 2.90, allergene: null, verfuegbar: true },
    { id: '00000000-0000-0000-0002-000000000008', restaurant_id: '00000000-0000-0000-0000-000000000001', kategorie_id: '00000000-0000-0000-0001-000000000004', name: 'Hauswein rot', beschreibung: '0,2l', preis: 4.90, allergene: 'Sulfite', verfuegbar: true },
  ];
  const { error: e3 } = await supabase.from('gerichte').upsert(gerichte, { onConflict: 'id' });
  if (e3) console.error('  Fehler:', e3.message);
  else console.log('  OK');

  // 4. Tische
  console.log('4. Tische erstellen...');
  const tische = [
    { id: '00000000-0000-0000-0003-000000000001', restaurant_id: '00000000-0000-0000-0000-000000000001', nummer: 1, kapazitaet: 2, status: 'frei' },
    { id: '00000000-0000-0000-0003-000000000002', restaurant_id: '00000000-0000-0000-0000-000000000001', nummer: 2, kapazitaet: 4, status: 'frei' },
    { id: '00000000-0000-0000-0003-000000000003', restaurant_id: '00000000-0000-0000-0000-000000000001', nummer: 3, kapazitaet: 4, status: 'frei' },
    { id: '00000000-0000-0000-0003-000000000004', restaurant_id: '00000000-0000-0000-0000-000000000001', nummer: 4, kapazitaet: 6, status: 'frei' },
    { id: '00000000-0000-0000-0003-000000000005', restaurant_id: '00000000-0000-0000-0000-000000000001', nummer: 5, kapazitaet: 6, status: 'frei' },
  ];
  const { error: e4 } = await supabase.from('tische').upsert(tische, { onConflict: 'id' });
  if (e4) console.error('  Fehler:', e4.message);
  else console.log('  OK');

  // 5. Admin-User in Supabase Auth
  console.log('5. Admin-User erstellen (admin@demo.de / test1234)...');
  const { data: authUser, error: e5 } = await supabase.auth.admin.createUser({
    email: 'admin@demo.de',
    password: 'test1234',
    email_confirm: true,
    user_metadata: { name: 'Admin' },
  });
  if (e5) {
    if (e5.message.includes('already been registered')) {
      console.log('  User existiert bereits, OK');
    } else {
      console.error('  Fehler:', e5.message);
    }
  } else {
    console.log('  Auth-User erstellt:', authUser.user.id);

    // 6. Mitarbeiter-Eintrag verknüpfen
    console.log('6. Mitarbeiter-Eintrag verknüpfen...');
    const { error: e6 } = await supabase.from('mitarbeiter').upsert({
      id: '00000000-0000-0000-0000-000000000010',
      auth_user_id: authUser.user.id,
      restaurant_id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin',
      email: 'admin@demo.de',
      rolle: 'admin',
    }, { onConflict: 'id' });
    if (e6) console.error('  Fehler:', e6.message);
    else console.log('  OK');
  }

  console.log('\n=== Setup abgeschlossen! ===');
  console.log('Login: admin@demo.de / test1234');
}

run().catch(console.error);
