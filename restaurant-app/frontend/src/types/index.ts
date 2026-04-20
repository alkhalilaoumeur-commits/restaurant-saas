// ─── Auth ────────────────────────────────────────────────────────────────────

export type Rolle = 'admin' | 'kellner' | 'kueche';

export interface Mitarbeiter {
  id: string;
  name: string;
  email: string;
  rolle: Rolle;
  restaurantId: string;
  foto_url?: string | null;
  telefon?: string | null;
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
  abo_plan: 'basis' | 'standard' | 'pro';
  buchungsintervall_min: number;
  tisch_dauer_min: number;
  max_gleichzeitige_reservierungen: number | null;
  erstellt_am: string;
  aktive_mitarbeiter: number;
  google_bewertungs_link: string | null;
}

export interface Oeffnungszeit {
  id: string;
  wochentag: number;  // 0=Mo … 6=So
  von: string;        // "09:00:00"
  bis: string;        // "22:00:00"
  geschlossen: boolean;
}

export interface Ausnahmetag {
  id: string;
  datum: string;      // "2026-12-25"
  grund: string | null;
}

export interface RestaurantDesign {
  name: string;
  logo_url: string | null;
  primaerfarbe: string;
  layout_id: string;
}

// ─── Tisch ────────────────────────────────────────────────────────────────────

export type TischStatus = 'frei' | 'besetzt' | 'wartet_auf_zahlung';
export type TischForm = 'rechteck' | 'rund' | 'quadrat' | 'bar';

export interface Tisch {
  id: string;
  restaurant_id: string;
  nummer: number;
  kapazitaet: number | null;
  status: TischStatus;
  qr_url: string | null;
  form: TischForm;
  pos_x: number;
  pos_y: number;
  breite: number;
  hoehe: number;
  rotation: number;
  bereich_id: string | null;
}

export interface Bereich {
  id: string;
  restaurant_id: string;
  name: string;
  reihenfolge: number;
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

export interface Unterkategorie {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  name: string;
  reihenfolge: number;
}

export interface Gericht {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  kategorie_name?: string;
  unterkategorie_id: string | null;
  unterkategorie_name?: string | null;
  name: string;
  beschreibung: string | null;
  preis: number;
  bild_url: string | null;
  allergene: string | null;
  verfuegbar: boolean;
  modell_3d_url: string | null;
  reihenfolge: number;
  /** true wenn das Gericht Extras/Modifier hat (vom Backend berechnet) */
  hat_extras?: boolean;
}

// ─── Extras / Modifier ───────────────────────────────────────────────────────

/** Eine einzelne Option innerhalb einer Extras-Gruppe (z.B. "Ketchup", "Extra Käse") */
export interface Extra {
  id: string;
  gruppe_id: string;
  name: string;
  aufpreis: number;
  verfuegbar: boolean;
  reihenfolge: number;
}

/** Eine Gruppe von Optionen pro Gericht (z.B. "Sauce", "Größe", "Toppings") */
export interface ExtrasGruppe {
  id: string;
  gericht_id: string;
  name: string;
  /** true = Gast muss eine Option wählen */
  pflicht: boolean;
  /** 1 = nur eine Option (Radio), >1 = mehrere gleichzeitig (Checkbox) */
  max_auswahl: number;
  reihenfolge: number;
  extras: Extra[];
}

// ─── Bestellung ───────────────────────────────────────────────────────────────

export type BestellungStatus = 'offen' | 'in_zubereitung' | 'serviert' | 'bezahlt';

export interface BestellPositionExtra {
  id: string;
  extra_name: string;
  aufpreis: number;
}

export interface BestellPosition {
  id: string;
  gericht_id: string;
  gericht_name: string;
  menge: number;
  einzelpreis: number;
  extras?: BestellPositionExtra[];
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

export type ReservierungStatus = 'ausstehend' | 'bestaetigt' | 'storniert' | 'abgeschlossen' | 'no_show';
export type ReservierungQuelle = 'app' | 'whatsapp' | 'telefon' | 'online' | 'google';

export interface Reservierung {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  tisch_kombiniert_id: string | null;
  gast_id: string | null;
  gast_name: string;
  telefon: string | null;
  email: string | null;
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  anlass: string | null;
  sitzplatz_wunsch: string | null;
  quelle: ReservierungQuelle;
  buchungs_token: string | null;
  dsgvo_einwilligung: boolean;
  erinnerung_gesendet: Record<string, boolean>;
  verweilzeit_min: number;
  erstellt_am: string;
}

// ─── Walk-in ──────────────────────────────────────────────────────────────────

export type WalkInStatus = 'wartend' | 'platziert' | 'abgegangen';

export interface WalkIn {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  gast_name: string;
  personen: number;
  status: WalkInStatus;
  anmerkung: string | null;
  erstellt_am: string;
  platziert_am: string | null;
  wartezeit_min: number;
}

// ─── Gäste-CRM ───────────────────────────────────────────────────────────────

export interface Gast {
  id: string;
  restaurant_id: string;
  name: string;
  email: string | null;
  telefon: string | null;
  notizen: string | null;
  tags: string[];
  erstellt_am: string;
  aktualisiert_am: string;
  besuche: number;
  letzter_besuch: string | null;
}

export interface GastReservierung {
  id: string;
  datum: string;
  personen: number;
  status: string;
  anlass: string | null;
  tisch_nummer: number | null;
}

export interface GastMitReservierungen extends Gast {
  reservierungen: GastReservierung[];
}

// Vordefinierte Tag-Optionen für das CRM
export const GAST_TAGS = [
  'VIP',
  'Stammgast',
  'Vegetarisch',
  'Vegan',
  'Laktoseintoleranz',
  'Glutenfrei',
  'Allergie',
  'No-Show',
  'Geburtstagsgast',
  'Geschäftsgast',
] as const;

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
  anlass: string | null;
  sitzplatz_wunsch: string | null;
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
  /** Stundenlohn in EUR — nur für Admin sichtbar, für Budget-Overlay im Dienstplan */
  stundenlohn?: number | null;
  /** Jährlicher Urlaubsanspruch in Arbeitstagen (Standard: 20 Tage laut BUrlG) */
  urlaubsanspruch_tage?: number;
  /** Profilbild-URL (optional) */
  foto_url?: string | null;
  /** Telefonnummer im internationalen Format (+4915112345678) — für SMS-Benachrichtigungen */
  telefon?: string | null;
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

// ─── Schichttausch ───────────────────────────────────────────────────────────

export type SchichttauschStatus = 'offen' | 'angeboten' | 'genehmigt' | 'abgelehnt';

export interface Schichttausch {
  id: string;
  restaurant_id: string;
  anbieter_id: string;
  anbieter_name?: string;
  anbieter_schicht_id: string;
  anbieter_datum?: string;
  anbieter_beginn?: string;
  anbieter_ende?: string;
  annehmer_id: string | null;
  annehmer_name?: string;
  annehmer_schicht_id: string | null;
  annehmer_datum?: string;
  annehmer_beginn?: string;
  annehmer_ende?: string;
  status: SchichttauschStatus;
  erstellt_am: string;
}

// ─── Schicht-Templates ───────────────────────────────────────────────────────

export interface SchichtTemplateEintrag {
  id: string;
  template_id: string;
  mitarbeiter_id: string;
  mitarbeiter_name?: string;
  wochentag: number; // 0=Mo … 6=So
  beginn: string;    // "09:00"
  ende: string;      // "17:00"
  notiz: string | null;
}

export interface SchichtTemplate {
  id: string;
  restaurant_id: string;
  name: string;
  erstellt_am: string;
  eintraege: SchichtTemplateEintrag[];
}

// ─── Mitarbeiter-Verfügbarkeit ────────────────────────────────────────────────

export type VerfuegbarkeitTyp = 'nicht_verfuegbar' | 'eingeschraenkt';

export interface MitarbeiterVerfuegbarkeit {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  wochentag: number;             // 0=Mo … 6=So
  typ: VerfuegbarkeitTyp;
  von: string | null;            // "HH:MM"
  bis: string | null;
  notiz: string | null;
  erstellt_am: string;
  mitarbeiter_name?: string;     // nur bei Admin-Abfrage
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
export type ThemePresetId = 'modern' | 'eleganz' | 'trattoria' | 'fresh' | 'street' | 'rustikal' | 'osteria' | 'editorial' | 'showcase' | 'qr-menu';

// ─── Abwesenheit (datumsbezogene Auszeit) ────────────────────────────────────

export type AbwesenheitTyp = 'urlaub' | 'krank' | 'sonstiges';

export interface Abwesenheit {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  von_datum: string;   // "YYYY-MM-DD"
  bis_datum: string;   // "YYYY-MM-DD"
  typ: AbwesenheitTyp;
  notiz: string | null;
  erstellt_am: string;
  mitarbeiter_name?: string;  // nur bei Admin-Abfrage
}

// ─── Personalbedarf (Dienstplan-Feature) ─────────────────────────────────────

export interface PersonalbedarfTag {
  datum: string;              // "YYYY-MM-DD"
  reservierungen_count: number;
  gaeste_gesamt: number;
  empfohlen_kellner: number;  // 0 nur wenn geschlossen
  empfohlen_kueche: number;   // 0 nur wenn geschlossen
  geoeffnet: boolean;         // false = Ruhetag laut Öffnungszeiten
}

// ─── Bewertung ────────────────────────────────────────────────────────────────

export interface Bewertung {
  id: string;
  restaurant_id: string;
  buchungs_id: string | null;
  token: string;
  stern: number | null;
  kommentar: string | null;
  gast_name: string;
  gast_email: string;
  dsgvo_einwilligung: boolean;
  antwort_text: string | null;
  antwort_datum: string | null;
  status: 'offen' | 'abgeschlossen';
  erstellt_am: string;
}

export interface BewertungStats {
  gesamt: number;
  abgeschlossen: number;
  durchschnitt: number | null;
  verteilung: Record<string, number>;
}

/** Daten die die öffentliche Bewertungsseite vom Backend bekommt */
export interface BewertungPublic {
  gast_name: string;
  restaurant_name: string;
  status: 'offen' | 'abgeschlossen';
  stern: number | null;
  kommentar: string | null;
  antwort_text: string | null;
  google_bewertungs_link: string | null;
}

// ─── Inventur ────────────────────────────────────────────────────────────────

export interface Lieferant {
  id: string;
  restaurant_id: string;
  name: string;
  kontakt_email: string | null;
  kontakt_telefon: string | null;
  liefertage: string[];
  notiz: string | null;
  aktiv: boolean;
  erstellt_am: string;
}

export interface InventarArtikel {
  id: string;
  restaurant_id: string;
  lieferant_id: string | null;
  lieferant_name?: string | null;
  name: string;
  kategorie: string;
  einheit: string;
  aktueller_bestand: number;
  mindestbestand: number;
  einkaufspreis: number | null;
  aktiv: boolean;
  erstellt_am: string;
  unter_mindestbestand?: boolean;
}

export type LagerBewegungTyp = 'eingang' | 'abgang' | 'korrektur' | 'bestellung';

export interface LagerBewegung {
  id: string;
  restaurant_id: string;
  artikel_id: string;
  artikel_name?: string;
  einheit?: string;
  typ: LagerBewegungTyp;
  delta: number;
  notiz: string | null;
  erstellt_am: string;
}

export interface Rezeptur {
  id: string;
  gericht_id: string;
  artikel_id: string;
  artikel_name?: string;
  einheit?: string;
  menge: number;
}

export interface InventurAuswertung {
  artikel_id: string;
  artikel_name: string;
  einheit: string;
  eingang_gesamt: number;
  abgang_gesamt: number;
  kosten_gesamt: number;
}

// ─── Warenkorb (nur Frontend) ─────────────────────────────────────────────────

/** Ein gewähltes Extra im Warenkorb (Referenz auf Extra + eingefrorener Preis) */
export interface GewaehlteExtra {
  extra_id: string;
  name: string;
  aufpreis: number;
}

export interface WarenkorbPosition {
  /** Eindeutiger Key: gericht.id + sortierte Extra-IDs → damit gleiches Gericht mit unterschiedlichen Extras getrennt bleibt */
  key: string;
  gericht: Gericht;
  menge: number;
  extras: GewaehlteExtra[];
}
