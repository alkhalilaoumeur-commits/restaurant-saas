// ─── Auth ────────────────────────────────────────────────────────────────────

export type Rolle = 'admin' | 'kellner' | 'kueche';

export interface Mitarbeiter {
  id: string;
  name: string;
  email: string;
  rolle: Rolle;
  restaurantId: string;
}

// ─── Restaurant ───────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  oeffnungszeiten: string | null;
  waehrung: string;
  abo_status: 'trial' | 'active' | 'expired';
}

// ─── Tisch ────────────────────────────────────────────────────────────────────

export type TischStatus = 'frei' | 'besetzt' | 'wartet_auf_zahlung';

export interface Tisch {
  id: string;
  restaurant_id: string;
  nummer: number;
  kapazitaet: number | null;
  status: TischStatus;
  qr_url: string | null;
}

// ─── Speisekarte ──────────────────────────────────────────────────────────────

export interface Kategorie {
  id: string;
  restaurant_id: string;
  name: string;
  reihenfolge: number;
}

export interface Gericht {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  kategorie_name?: string;
  name: string;
  beschreibung: string | null;
  preis: number;
  bild_url: string | null;
  allergene: string | null;
  verfuegbar: boolean;
}

// ─── Bestellung ───────────────────────────────────────────────────────────────

export type BestellungStatus = 'offen' | 'in_zubereitung' | 'serviert' | 'bezahlt';

export interface BestellPosition {
  id: string;
  gericht_id: string;
  gericht_name: string;
  menge: number;
  einzelpreis: number;
}

export interface Bestellung {
  id: string;
  restaurant_id: string;
  tisch_id: string;
  tisch_nummer: number;
  status: BestellungStatus;
  gesamtpreis: number;
  anmerkung: string | null;
  erstellt_am: string;
  positionen: BestellPosition[];
}

// ─── Reservierung ─────────────────────────────────────────────────────────────

export type ReservierungStatus = 'ausstehend' | 'bestaetigt' | 'storniert';
export type ReservierungQuelle = 'app' | 'whatsapp' | 'telefon';

export interface Reservierung {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  gast_name: string;
  telefon: string | null;
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  quelle: ReservierungQuelle;
  erstellt_am: string;
}

// ─── Warenkorb (nur Frontend) ─────────────────────────────────────────────────

export interface WarenkorbPosition {
  gericht: Gericht;
  menge: number;
}
