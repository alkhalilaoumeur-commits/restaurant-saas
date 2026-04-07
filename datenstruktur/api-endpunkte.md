# API-Endpunkte

## Stand: 2026-04-05

---

## Auth
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| POST | /api/auth/login | Login (Rate Limited: 5/15min) | Nein |
| POST | /api/auth/registrieren | Restaurant + Admin anlegen, Multi-Step (Rate Limited: 3/h) | Nein |
| GET | /api/auth/email-verifizieren/:token | Email bestätigen (Link aus Email) | Nein |
| POST | /api/auth/verifizierung-erneut | Verifizierungs-Email erneut senden | Nein |
| POST | /api/auth/passwort-vergessen | Reset-Link per Email senden (Rate Limited: 5/h) | Nein |
| POST | /api/auth/passwort-zuruecksetzen | Neues Passwort setzen (mit Token) | Nein |
| GET | /api/auth/einladung/:token | Einladungsinfo abrufen (Name, Restaurant, Rolle) | Nein |
| POST | /api/auth/einladung-annehmen | Passwort setzen als eingeladener MA | Nein |

## Restaurants
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/restaurant | Eigenes Restaurant abrufen (inkl. Lizenz-Info + aktive Mitarbeiter) | Ja (Admin) |
| PUT | /api/restaurant | Restaurant-Daten bearbeiten (Name, Öffnungszeiten, Primärfarbe) | Ja (Admin) |
| GET | /api/restaurant/:id/design | Öffentliches Design (Name, Logo, Farbe) für Gäste-Seite | Nein |

## Tische
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/tische | Alle Tische abrufen | Ja |
| POST | /api/tische | Neuen Tisch anlegen | Ja (Admin) |
| PATCH | /api/tische/:id | Tisch bearbeiten (Nummer, Kapazität) | Ja (Admin) |
| PATCH | /api/tische/:id/status | Tisch-Status ändern | Ja (Admin, Kellner) |
| DELETE | /api/tische/:id | Tisch löschen | Ja (Admin) |

## Speisekarte (Gerichte + Kategorien)
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/speisekarte | Alle Gerichte (inkl. öffentlich) | Nein |
| POST | /api/speisekarte | Neues Gericht | Ja (Admin) |
| PATCH | /api/speisekarte/:id | Gericht bearbeiten | Ja (Admin) |
| DELETE | /api/speisekarte/:id | Gericht löschen | Ja (Admin) |
| GET | /api/speisekarte/kategorien | Alle Kategorien (mit Auth) ODER öffentlich mit ?restaurantId=xxx (inkl. Gerichteanzahl + bild_url) | Nein* |
| POST | /api/speisekarte/kategorien | Neue Kategorie (name, reihenfolge, bild_url) | Ja (Admin) |
| PATCH | /api/speisekarte/kategorien/:id | Kategorie bearbeiten (name, reihenfolge, bild_url) | Ja (Admin) |
| DELETE | /api/speisekarte/kategorien/:id | Kategorie löschen (nur leere) | Ja (Admin) |

## Bestellungen
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/bestellungen | Alle offenen Bestellungen | Ja |
| POST | /api/bestellungen | Neue Bestellung (Gast) | Nein (QR-Code) |
| PUT | /api/bestellungen/:id/status | Status ändern | Ja |

## Reservierungen
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/reservierungen | Alle Reservierungen | Ja |
| POST | /api/reservierungen | Neue Reservierung | Nein (öffentlich) |
| PUT | /api/reservierungen/:id | Status ändern | Ja |
| DELETE | /api/reservierungen/:id | Löschen | Ja (Admin) |

## Dienstplan
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/dienstplan?start=YYYY-MM-DD&ende=YYYY-MM-DD | Schichten im Zeitraum | Ja |
| POST | /api/dienstplan | Neue Schicht anlegen | Ja (Admin) |
| PATCH | /api/dienstplan/:id | Schicht bearbeiten | Ja (Admin) |
| DELETE | /api/dienstplan/:id | Schicht löschen | Ja (Admin) |

## Statistiken
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/statistiken?tage=7 | Alle Statistiken (Umsatz, Gerichte, Stoßzeiten, Kategorien) | Ja (Admin) |

## Mitarbeiter
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/mitarbeiter | Alle Mitarbeiter abrufen | Ja (Admin) |
| POST | /api/mitarbeiter | Mitarbeiter einladen (Name+Email+Rolle → Einladungs-Email) | Ja (Admin) |
| POST | /api/mitarbeiter/:id/erneut-einladen | Einladung erneut senden | Ja (Admin) |
| PATCH | /api/mitarbeiter/:id | Mitarbeiter bearbeiten (Name, Rolle, Aktiv) | Ja (Admin) |
| PATCH | /api/mitarbeiter/:id/passwort | Passwort ändern (eigenes oder Admin für andere) | Ja |
