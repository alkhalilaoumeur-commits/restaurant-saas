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

## Extras / Modifier
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/speisekarte/:id/extras | Extras-Gruppen + verfügbare Extras eines Gerichts | Nein |
| GET | /api/speisekarte/:id/extras/admin | Alle Extras (inkl. nicht-verfügbare) | Ja (Admin) |
| POST | /api/speisekarte/:id/extras/gruppen | Extras-Gruppe erstellen | Ja (Admin) |
| PATCH | /api/speisekarte/extras/gruppen/:gruppeId | Extras-Gruppe bearbeiten | Ja (Admin) |
| DELETE | /api/speisekarte/extras/gruppen/:gruppeId | Extras-Gruppe löschen | Ja (Admin) |
| POST | /api/speisekarte/extras/gruppen/:gruppeId/extras | Extra erstellen | Ja (Admin) |
| PATCH | /api/speisekarte/extras/:extraId | Extra bearbeiten | Ja (Admin) |
| DELETE | /api/speisekarte/extras/:extraId | Extra löschen | Ja (Admin) |

## Bestellungen
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/bestellungen | Alle offenen Bestellungen (inkl. Extras pro Position) | Ja |
| POST | /api/bestellungen | Neue Bestellung mit Extras (Gast) — Aufpreise serverseitig | Nein (QR-Code) |
| PUT | /api/bestellungen/:id/status | Status ändern | Ja |

## Reservierungen
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/reservierungen | Alle Reservierungen (optional ?datum=YYYY-MM-DD) | Ja |
| POST | /api/reservierungen | Neue Reservierung | Nein (öffentlich) |
| PATCH | /api/reservierungen/:id/status | Status ändern (ausstehend/bestaetigt/storniert) | Ja (Admin/Kellner) |
| PATCH | /api/reservierungen/:id/tisch | Tisch manuell zuweisen/entfernen (body: { tisch_id }) | Ja (Admin/Kellner) |
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

## Online-Buchung (öffentlich)
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/buchung/:restaurantId/info | Restaurant-Info + Öffnungszeiten für Buchungsseite | Nein |
| GET | /api/buchung/:restaurantId/slots?datum=&personen= | Verfügbare Zeitslots | Nein |
| POST | /api/buchung/:restaurantId | Online-Reservierung erstellen (mit Email + DSGVO) | Nein |
| GET | /api/buchung/token/:token | Reservierung per Token abrufen (Self-Service) | Nein |
| POST | /api/buchung/token/:token/stornieren | Reservierung per Token stornieren | Nein |
| POST | /api/buchung/token/:token/umbuchen | Reservierung per Token auf neues Datum umbuchen | Nein |

## Mitarbeiter
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/mitarbeiter | Alle Mitarbeiter abrufen | Ja (Admin) |
| POST | /api/mitarbeiter | Mitarbeiter einladen (Name+Email+Rolle → Einladungs-Email) | Ja (Admin) |
| POST | /api/mitarbeiter/:id/erneut-einladen | Einladung erneut senden | Ja (Admin) |
| PATCH | /api/mitarbeiter/:id | Mitarbeiter bearbeiten (Name, Rolle, Aktiv) | Ja (Admin) |
| PATCH | /api/mitarbeiter/:id/passwort | Passwort ändern (eigenes oder Admin für andere) | Ja |

## Socket.io Events (Live-Updates)

Verbindung: Mitarbeiter treten `restaurant:{restaurantId}` Raum bei, Gäste treten `tisch:{restaurantId}:{tischId}` bei.

| Event | Richtung | Raum | Beschreibung |
|---|---|---|---|
| `neue_bestellung` | Server → Client | `restaurant:*` | Neue Bestellung eingegangen (Gast hat bestellt) |
| `bestellung_aktualisiert` | Server → Client | `restaurant:*` + `tisch:*` | Bestellstatus geändert |
| `neue_reservierung` | Server → Client | `restaurant:*` | Neue Online-Reservierung eingegangen |
| `reservierung_aktualisiert` | Server → Client | `restaurant:*` | Reservierung storniert/umgebucht (Gast-Self-Service) |
