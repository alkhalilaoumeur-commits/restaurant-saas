# Datenbankschema

## Übertragen aus Bubble.io | Stand: 2026-04-04

---

## Tabellen

### restaurants
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | Eindeutige Restaurant-ID (= Tenant-ID) |
| name | TEXT | Restaurantname |
| logo_url | TEXT | URL zum Logo |
| oeffnungszeiten | TEXT | Öffnungszeiten |
| waehrung | TEXT | z.B. "EUR" |
| lizenz_code | TEXT UNIQUE | Einmaliger Code für dieses Restaurant |
| max_mitarbeiter | INTEGER | Lizenz: max. erlaubte Mitarbeiter |
| abo_status | TEXT | active / expired / trial |
| erstellt_am | TIMESTAMP | |

### kategorien
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | |
| reihenfolge | INTEGER | Sortierung |

### tische
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| nummer | INTEGER | Tischnummer |
| kapazitaet | INTEGER | Max. Personen |
| status | TEXT | frei / besetzt / wartet_auf_zahlung |
| qr_url | TEXT | Generierter QR-Code-Link |

### gerichte
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| kategorie_id | UUID (FK → kategorien) | |
| name | TEXT | |
| beschreibung | TEXT | |
| preis | DECIMAL(10,2) | |
| bild_url | TEXT | |
| verfuegbar | BOOLEAN | Ausverkauft-Toggle |
| allergene | TEXT | |

### bestellungen
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| tisch_id | UUID (FK → tische) | |
| status | TEXT | offen / in_zubereitung / serviert / bezahlt |
| gesamtpreis | DECIMAL(10,2) | |
| anmerkung | TEXT | |
| erstellt_am | TIMESTAMP | |

### bestellpositionen
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| bestellung_id | UUID (FK → bestellungen) | |
| gericht_id | UUID (FK → gerichte) | |
| menge | INTEGER | |
| einzelpreis | DECIMAL(10,2) | Preis zum Bestellzeitpunkt |

### reservierungen
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| tisch_id | UUID (FK → tische) | Optional |
| name | TEXT | Gastname |
| telefon | TEXT | ⚠️ DSGVO: personenbezogen |
| datum | TIMESTAMP | |
| personen | INTEGER | |
| status | TEXT | ausstehend / bestaetigt / storniert |
| anmerkung | TEXT | |
| quelle | TEXT | App / WhatsApp / Telefon |

### mitarbeiter
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | |
| email | TEXT UNIQUE | ⚠️ DSGVO: personenbezogen |
| passwort_hash | TEXT | Niemals Klartext! |
| rolle | TEXT | admin / kellner / kueche |
| aktiv | BOOLEAN | |
