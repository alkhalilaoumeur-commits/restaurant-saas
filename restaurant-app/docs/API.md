# API-Übersicht

Base URL: `http://localhost:3001/api`

## Auth
| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| POST | `/auth/login` | Nein | Login, gibt JWT zurück |

## Bestellungen
| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/bestellungen` | Mitarbeiter | Alle aktiven Bestellungen |
| POST | `/bestellungen` | Nein (Gäste) | Neue Bestellung aufgeben |
| PATCH | `/bestellungen/:id/status` | Mitarbeiter | Status ändern |

## Speisekarte
| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/speisekarte?restaurantId=...` | Nein | Alle Gerichte (auch für Gäste) |
| GET | `/speisekarte/kategorien` | Mitarbeiter | Alle Kategorien |
| POST | `/speisekarte/kategorien` | Admin | Kategorie anlegen |
| POST | `/speisekarte` | Admin | Gericht anlegen |
| PATCH | `/speisekarte/:id` | Admin | Gericht bearbeiten |
| DELETE | `/speisekarte/:id` | Admin | Gericht löschen |

## Reservierungen
| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/reservierungen?datum=YYYY-MM-DD` | Admin/Kellner | Reservierungen abrufen |
| POST | `/reservierungen` | Nein | Reservierung anlegen |
| PATCH | `/reservierungen/:id/status` | Admin/Kellner | Status ändern |
| DELETE | `/reservierungen/:id` | Admin | Reservierung löschen |

## Tische
| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/tische` | Mitarbeiter | Alle Tische |
| POST | `/tische` | Admin | Tisch anlegen (QR-URL wird auto. generiert) |
| PATCH | `/tische/:id/status` | Admin/Kellner | Status ändern |
| DELETE | `/tische/:id` | Admin | Tisch löschen |

## Status-Werte

**Bestellung:** `offen` → `in_zubereitung` → `serviert` → `bezahlt`

**Tisch:** `frei` · `besetzt` · `wartet_auf_zahlung`

**Reservierung:** `ausstehend` · `bestaetigt` · `storniert`

## Socket.io Events

| Event | Richtung | Beschreibung |
|---|---|---|
| `raum_beitreten` | Client → Server | Mitarbeiter tritt Restaurant-Raum bei |
| `tisch_beitreten` | Client → Server | Gast tritt Tisch-Raum bei |
| `neue_bestellung` | Server → Client | Neue Bestellung eingegangen |
| `bestellung_aktualisiert` | Server → Client | Bestellstatus geändert |
