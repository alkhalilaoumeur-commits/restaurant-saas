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
| oeffnungszeiten | TEXT | ��ffnungszeiten |
| strasse | TEXT | Adresse: Strasse |
| plz | TEXT | Adresse: Postleitzahl |
| stadt | TEXT | Adresse: Stadt |
| telefon | TEXT | Kontakttelefon |
| email | TEXT | Kontakt-E-Mail |
| waehrung | TEXT | z.B. "EUR" |
| primaerfarbe | TEXT | Hex-Farbe für Gäste-Seite (Standard: #ea580c) |
| lizenz_code | TEXT UNIQUE | Einmaliger Code für dieses Restaurant |
| restaurant_code | TEXT UNIQUE NOT NULL | Eindeutiger Restaurant-Code (z.B. REST-A7K39M2P), bei Registrierung generiert |
| max_mitarbeiter | INTEGER | Lizenz: max. erlaubte Mitarbeiter |
| abo_status | TEXT | active / expired / trial |
| erstellt_am | TIMESTAMP | |

### oeffnungszeiten
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | |
| wochentag | INTEGER (0-6) | 0=Montag, 6=Sonntag |
| von | TIME | Öffnungszeit von |
| bis | TIME | Öffnungszeit bis |
| geschlossen | BOOLEAN | Ruhetag? |
| UNIQUE | (restaurant_id, wochentag) | Pro Tag nur ein Eintrag |

### kategorien
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | |
| reihenfolge | INTEGER | Sortierung |
| bild_url | TEXT | Hintergrundbild für die Kategorie-Kachel auf der Gäste-Bestellseite |

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
| passwort_hash | TEXT (nullable) | Niemals Klartext! NULL bei eingeladenen MA die noch kein PW gesetzt haben |
| rolle | TEXT | admin / kellner / kueche |
| aktiv | BOOLEAN | |
| einladung_token | TEXT UNIQUE | Einmal-Token für Mitarbeiter-Einladung |
| einladung_gueltig_bis | TIMESTAMP | Ablaufzeit des Einladungs-Tokens (48h) |
| email_verifiziert | BOOLEAN | Ob die Email-Adresse bestätigt wurde |
| verifizierung_token | TEXT UNIQUE | Token für Email-Verifizierungslink |

### passwort_resets
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| mitarbeiter_id | UUID (FK → mitarbeiter) | |
| token | TEXT UNIQUE | Reset-Token |
| gueltig_bis | TIMESTAMP | Ablaufzeit (1 Stunde) |
| benutzt | BOOLEAN | Schon verwendet? |
| erstellt_am | TIMESTAMP | |

### login_versuche
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| email | TEXT | Versuchte Email |
| ip_adresse | TEXT | IP des Anfragenden |
| erfolgreich | BOOLEAN | Login geklappt? |
| erstellt_am | TIMESTAMP | |

### schichten
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| mitarbeiter_id | UUID (FK → mitarbeiter) | |
| datum | DATE | Tag der Schicht |
| beginn | TIME | Schichtbeginn |
| ende | TIME | Schichtende (muss nach beginn liegen) |
| notiz | TEXT | Optionale Notiz |
