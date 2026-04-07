/**
 * Demo-Daten fuer den Vorschau-Modus (kein Backend noetig).
 * Werden verwendet, wenn der Nutzer auf "Demo ansehen" klickt.
 */

import type { Bestellung, Tisch, Gericht, Kategorie, Reservierung, Mitarbeiter } from '../types';

// ─── Mitarbeiter ─────────────────────────────────────────────────────────────

export const DEMO_MITARBEITER: Mitarbeiter = {
  id: 'demo-1',
  name: 'Ilias (Demo)',
  email: 'admin@demo.de',
  rolle: 'admin',
  restaurantId: 'demo-restaurant',
};

// ─── Tische ──────────────────────────────────────────────────────────────────

export const DEMO_TISCHE: Tisch[] = [
  { id: 't1', restaurant_id: 'demo', nummer: 1, kapazitaet: 4, status: 'besetzt', qr_url: null },
  { id: 't2', restaurant_id: 'demo', nummer: 2, kapazitaet: 2, status: 'frei', qr_url: null },
  { id: 't3', restaurant_id: 'demo', nummer: 3, kapazitaet: 6, status: 'besetzt', qr_url: null },
  { id: 't4', restaurant_id: 'demo', nummer: 4, kapazitaet: 4, status: 'frei', qr_url: null },
  { id: 't5', restaurant_id: 'demo', nummer: 5, kapazitaet: 2, status: 'wartet_auf_zahlung', qr_url: null },
  { id: 't6', restaurant_id: 'demo', nummer: 6, kapazitaet: 8, status: 'besetzt', qr_url: null },
  { id: 't7', restaurant_id: 'demo', nummer: 7, kapazitaet: 4, status: 'frei', qr_url: null },
  { id: 't8', restaurant_id: 'demo', nummer: 8, kapazitaet: 2, status: 'frei', qr_url: null },
  { id: 't9', restaurant_id: 'demo', nummer: 9, kapazitaet: 6, status: 'besetzt', qr_url: null },
  { id: 't10', restaurant_id: 'demo', nummer: 10, kapazitaet: 4, status: 'frei', qr_url: null },
];

// ─── Kategorien ────────────���─────────────────────────────────────────────────

export const DEMO_KATEGORIEN: Kategorie[] = [
  { id: 'k1', restaurant_id: 'demo', name: 'Vorspeisen', reihenfolge: 1, bild_url: null },
  { id: 'k2', restaurant_id: 'demo', name: 'Hauptgerichte', reihenfolge: 2, bild_url: null },
  { id: 'k3', restaurant_id: 'demo', name: 'Desserts', reihenfolge: 3, bild_url: null },
  { id: 'k4', restaurant_id: 'demo', name: 'Getränke', reihenfolge: 4, bild_url: null },
];

// ─── Gerichte ──────────────��───────────────────────────��─────────────────────

export const DEMO_GERICHTE: Gericht[] = [
  { id: 'g1', restaurant_id: 'demo', kategorie_id: 'k1', kategorie_name: 'Vorspeisen', name: 'Bruschetta', beschreibung: 'Geröstetes Brot mit Tomaten und Basilikum', preis: 7.50, bild_url: null, allergene: 'Gluten', verfuegbar: true },
  { id: 'g2', restaurant_id: 'demo', kategorie_id: 'k1', kategorie_name: 'Vorspeisen', name: 'Vitello Tonnato', beschreibung: 'Kalbsfleisch mit Thunfischsauce', preis: 12.90, bild_url: null, allergene: 'Fisch', verfuegbar: true },
  { id: 'g3', restaurant_id: 'demo', kategorie_id: 'k2', kategorie_name: 'Hauptgerichte', name: 'Wiener Schnitzel', beschreibung: 'Kalb, paniert, mit Kartoffelsalat', preis: 18.90, bild_url: null, allergene: 'Gluten, Ei', verfuegbar: true },
  { id: 'g4', restaurant_id: 'demo', kategorie_id: 'k2', kategorie_name: 'Hauptgerichte', name: 'Spaghetti Carbonara', beschreibung: 'Klassisch mit Guanciale und Pecorino', preis: 14.50, bild_url: null, allergene: 'Gluten, Ei, Milch', verfuegbar: true },
  { id: 'g5', restaurant_id: 'demo', kategorie_id: 'k2', kategorie_name: 'Hauptgerichte', name: 'Lachs vom Grill', beschreibung: 'Mit Spargel und Zitronenbutter', preis: 22.00, bild_url: null, allergene: 'Fisch, Milch', verfuegbar: false },
  { id: 'g6', restaurant_id: 'demo', kategorie_id: 'k3', kategorie_name: 'Desserts', name: 'Tiramisu', beschreibung: 'Hausgmacht, nach Omas Rezept', preis: 8.50, bild_url: null, allergene: 'Ei, Milch, Gluten', verfuegbar: true },
  { id: 'g7', restaurant_id: 'demo', kategorie_id: 'k3', kategorie_name: 'Desserts', name: 'Panna Cotta', beschreibung: 'Mit frischen Beeren', preis: 7.00, bild_url: null, allergene: 'Milch', verfuegbar: true },
  { id: 'g8', restaurant_id: 'demo', kategorie_id: 'k4', kategorie_name: 'Getränke', name: 'Aperol Spritz', beschreibung: null, preis: 8.00, bild_url: null, allergene: null, verfuegbar: true },
  { id: 'g9', restaurant_id: 'demo', kategorie_id: 'k4', kategorie_name: 'Getränke', name: 'Cola / Fanta / Sprite', beschreibung: '0,3l', preis: 3.50, bild_url: null, allergene: null, verfuegbar: true },
];

// ─── Bestellungen ────────────────────────────────────────────────────────────

const jetzt = new Date().toISOString();
const vorher = new Date(Date.now() - 15 * 60000).toISOString();
const frueher = new Date(Date.now() - 45 * 60000).toISOString();

export const DEMO_BESTELLUNGEN: Bestellung[] = [
  {
    id: 'b1', restaurant_id: 'demo', tisch_id: 't1', tisch_nummer: 1, status: 'offen',
    gesamtpreis: 33.40, anmerkung: 'Ohne Zwiebeln bitte', erstellt_am: jetzt,
    positionen: [
      { id: 'p1', gericht_id: 'g3', gericht_name: 'Wiener Schnitzel', menge: 1, einzelpreis: 18.90 },
      { id: 'p2', gericht_id: 'g4', gericht_name: 'Spaghetti Carbonara', menge: 1, einzelpreis: 14.50 },
    ],
  },
  {
    id: 'b2', restaurant_id: 'demo', tisch_id: 't3', tisch_nummer: 3, status: 'in_zubereitung',
    gesamtpreis: 41.30, anmerkung: null, erstellt_am: vorher,
    positionen: [
      { id: 'p3', gericht_id: 'g1', gericht_name: 'Bruschetta', menge: 2, einzelpreis: 7.50 },
      { id: 'p4', gericht_id: 'g3', gericht_name: 'Wiener Schnitzel', menge: 1, einzelpreis: 18.90 },
      { id: 'p5', gericht_id: 'g8', gericht_name: 'Aperol Spritz', menge: 1, einzelpreis: 8.00 },
    ],
  },
  {
    id: 'b3', restaurant_id: 'demo', tisch_id: 't6', tisch_nummer: 6, status: 'serviert',
    gesamtpreis: 52.80, anmerkung: 'Kindergeburtstag, extra Servietten', erstellt_am: frueher,
    positionen: [
      { id: 'p6', gericht_id: 'g4', gericht_name: 'Spaghetti Carbonara', menge: 2, einzelpreis: 14.50 },
      { id: 'p7', gericht_id: 'g6', gericht_name: 'Tiramisu', menge: 1, einzelpreis: 8.50 },
      { id: 'p8', gericht_id: 'g9', gericht_name: 'Cola / Fanta / Sprite', menge: 2, einzelpreis: 3.50 },
      { id: 'p9', gericht_id: 'g8', gericht_name: 'Aperol Spritz', menge: 1, einzelpreis: 8.00 },
    ],
  },
  {
    id: 'b4', restaurant_id: 'demo', tisch_id: 't9', tisch_nummer: 9, status: 'offen',
    gesamtpreis: 27.40, anmerkung: null, erstellt_am: jetzt,
    positionen: [
      { id: 'p10', gericht_id: 'g2', gericht_name: 'Vitello Tonnato', menge: 1, einzelpreis: 12.90 },
      { id: 'p11', gericht_id: 'g4', gericht_name: 'Spaghetti Carbonara', menge: 1, einzelpreis: 14.50 },
    ],
  },
  {
    id: 'b5', restaurant_id: 'demo', tisch_id: 't5', tisch_nummer: 5, status: 'serviert',
    gesamtpreis: 15.50, anmerkung: null, erstellt_am: frueher,
    positionen: [
      { id: 'p12', gericht_id: 'g1', gericht_name: 'Bruschetta', menge: 1, einzelpreis: 7.50 },
      { id: 'p13', gericht_id: 'g8', gericht_name: 'Aperol Spritz', menge: 1, einzelpreis: 8.00 },
    ],
  },
];

// ─── Reservierungen ─────────────���────────────────────────��───────────────────

const heute = new Date().toISOString().slice(0, 10);

export const DEMO_RESERVIERUNGEN: Reservierung[] = [
  { id: 'r1', restaurant_id: 'demo', tisch_id: 't2', gast_name: 'Familie Müller', telefon: null, datum: `${heute}T18:30:00`, personen: 4, status: 'bestaetigt', anmerkung: 'Hochstuhl benötigt', quelle: 'telefon', erstellt_am: jetzt },
  { id: 'r2', restaurant_id: 'demo', tisch_id: null, gast_name: 'Schmidt, Thomas', telefon: null, datum: `${heute}T19:00:00`, personen: 2, status: 'ausstehend', anmerkung: null, quelle: 'app', erstellt_am: jetzt },
  { id: 'r3', restaurant_id: 'demo', tisch_id: 't4', gast_name: 'Geburtstagsfeier Weber', telefon: null, datum: `${heute}T20:00:00`, personen: 8, status: 'bestaetigt', anmerkung: 'Torte wird selbst mitgebracht', quelle: 'whatsapp', erstellt_am: vorher },
  { id: 'r4', restaurant_id: 'demo', tisch_id: null, gast_name: 'Dr. Bauer', telefon: null, datum: `${heute}T19:30:00`, personen: 3, status: 'ausstehend', anmerkung: 'Vegetarisch', quelle: 'telefon', erstellt_am: frueher },
];
