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
  strasse: string | null;
  plz: string | null;
  stadt: string | null;
  telefon: string | null;
  email: string | null;
  waehrung: string;
  primaerfarbe: string;
  layout_id: string;
  lizenz_code: string | null;
  max_mitarbeiter: number;
  abo_status: 'trial' | 'active' | 'expired';
  erstellt_am: string;
  aktive_mitarbeiter: number;
}

export interface RestaurantDesign {
  name: string;
  logo_url: string | null;
  primaerfarbe: string;
  layout_id: string;
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
  bild_url: string | null;
}

/** Kategorie mit Gerichteanzahl (kommt vom öffentlichen Kategorien-Endpoint) */
export interface KategorieMitAnzahl extends Kategorie {
  anzahl_gerichte: number;
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
export type ReservierungQuelle = 'app' | 'whatsapp' | 'telefon' | 'online';

export interface Reservierung {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  gast_name: string;
  telefon: string | null;
  email: string | null;
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  quelle: ReservierungQuelle;
  buchungs_token: string | null;
  dsgvo_einwilligung: boolean;
  erinnerung_gesendet: Record<string, boolean>;
  verweilzeit_min: number;
  erstellt_am: string;
}

// ─── Buchung (öffentliche Reservierung) ──────────────────────────────────────

export interface BuchungInfo {
  name: string;
  logo_url: string | null;
  primaerfarbe: string;
  adresse: string;
  telefon: string | null;
  vorlauf_tage: number;
  oeffnungszeiten: Oeffnungszeit[];
}

export interface Oeffnungszeit {
  wochentag: number;  // 0=Montag, 6=Sonntag
  von: string;        // "11:00:00"
  bis: string;        // "22:00:00"
  geschlossen: boolean;
}

export interface ZeitSlot {
  zeit: string;        // "18:00"
  verfuegbar: boolean;
  restplaetze: number;
}

export interface BuchungSelfService {
  id: string;
  gast_name: string;
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  restaurant_name: string;
  restaurant_adresse: string | null;
  restaurant_id: string;
}

// ─── Mitarbeiter (Verwaltung) ─────────────────────────────────────────────────

export interface MitarbeiterDetail {
  id: string;
  restaurant_id: string;
  name: string;
  email: string;
  rolle: Rolle;
  aktiv: boolean;
  erstellt_am: string;
  /** true = Einladung noch nicht angenommen (kein Passwort gesetzt) */
  einladung_ausstehend?: boolean;
}

// ─── Schicht (Dienstplan) ─────────────────────────────────────────────────────

export interface Schicht {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  mitarbeiter_name?: string;
  mitarbeiter_rolle?: string;
  datum: string;
  beginn: string;
  ende: string;
  notiz: string | null;
  erstellt_am: string;
}

// ─── Theme (Design-System Bestellseite) ──────────────────────────────────────

/** Alle Farben die ein Theme definiert — als Hex-Codes */
export interface ThemeFarben {
  /** Seiten-Hintergrund (z.B. #FFFFFF oder #0A0A0A) */
  hintergrund: string;
  /** Card/Surface-Hintergrund (z.B. #F8F8F7 oder #1E1E1E) */
  oberflaeche: string;
  /** Haupt-Akzentfarbe für Buttons, Preise, aktive Elemente */
  primaer: string;
  /** Zweite Akzentfarbe für Hover, Badges, sekundäre Elemente */
  sekundaer: string;
  /** Haupttext-Farbe */
  text: string;
  /** Gedämpfter Text (Beschreibungen, Platzhalter) */
  textGedaempft: string;
  /** Border/Trennlinien-Farbe */
  border: string;
}

/** Wie rund sind Ecken? */
export type ThemeEcken = 'eckig' | 'mittel' | 'rund';

/** Wie sehen Cards aus? */
export type ThemeCardStil = 'flach' | 'schatten' | 'border';

/** Komplettes Theme — wird als JSON in der DB gespeichert */
export interface Theme {
  id: string;
  name: string;
  beschreibung: string;
  emoji: string;
  farben: ThemeFarben;
  /** Google Font Name für Überschriften (z.B. "Playfair Display") */
  fontHeading: string;
  /** Google Font Name für Fließtext (z.B. "Inter") */
  fontBody: string;
  /** Ecken-Stil: eckig (0-2px), mittel (8px), rund (16px+) */
  ecken: ThemeEcken;
  /** Card-Darstellung */
  cardStil: ThemeCardStil;
}

/** Theme-ID eines der eingebauten Presets */
export type ThemePresetId = 'modern' | 'eleganz' | 'trattoria' | 'fresh' | 'street' | 'rustikal' | 'osteria' | 'editorial';

// ─── Warenkorb (nur Frontend) ─────────────────────────────────────────────────

export interface WarenkorbPosition {
  gericht: Gericht;
  menge: number;
}
