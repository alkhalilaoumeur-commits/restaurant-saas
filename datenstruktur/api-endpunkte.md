# API-Endpunkte

## Stand: 2026-04-04 (noch nicht implementiert)

---

## Auth
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| POST | /api/auth/login | Login | Nein |
| POST | /api/auth/logout | Logout | Ja |

## Restaurants
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/restaurant | Eigenes Restaurant abrufen | Ja (Admin) |
| PUT | /api/restaurant | Restaurant-Daten bearbeiten | Ja (Admin) |

## Tische
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/tische | Alle Tische abrufen | Ja |
| POST | /api/tische | Neuen Tisch anlegen | Ja (Admin) |
| PUT | /api/tische/:id | Tisch-Status ändern | Ja |
| DELETE | /api/tische/:id | Tisch löschen | Ja (Admin) |

## Gerichte
| Methode | Route | Beschreibung | Auth nötig |
|---|---|---|---|
| GET | /api/gerichte | Alle Gerichte (inkl. öffentlich) | Nein |
| POST | /api/gerichte | Neues Gericht | Ja (Admin) |
| PUT | /api/gerichte/:id | Gericht bearbeiten | Ja (Admin) |
| DELETE | /api/gerichte/:id | Gericht löschen | Ja (Admin) |

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
