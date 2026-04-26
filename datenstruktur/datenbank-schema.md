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
| max_gaeste_pro_slot | INTEGER | Optional: Max Gäste pro Zeitslot (NULL = Summe Tischkapazitäten) |
| reservierung_puffer_min | INTEGER | Pufferzeit in Minuten zwischen Reservierungen (Standard: 15) |
| reservierung_vorlauf_tage | INTEGER | Wie viele Tage im Voraus online buchbar (Standard: 30) |
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

### bereiche (NEU: 2026-04-09)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | z.B. "Innen", "Terrasse", "Bar" |
| reihenfolge | INTEGER | Sortierung der Tabs im Editor |
| UNIQUE | (restaurant_id, name) | Pro Restaurant keine doppelten Namen |

### tische
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| nummer | INTEGER | Tischnummer |
| kapazitaet | INTEGER | Max. Personen |
| status | TEXT | frei / besetzt / wartet_auf_zahlung |
| qr_url | TEXT | Generierter QR-Code-Link |
| form | TEXT | rechteck / rund / quadrat / bar (NEU: 2026-04-09) |
| pos_x | REAL | X-Position auf Canvas (NEU: 2026-04-09) |
| pos_y | REAL | Y-Position auf Canvas (NEU: 2026-04-09) |
| breite | REAL | Breite auf Canvas in Pixeln (NEU: 2026-04-09) |
| hoehe | REAL | Höhe auf Canvas in Pixeln (NEU: 2026-04-09) |
| rotation | REAL | Rotation in Grad 0-360 (NEU: 2026-04-09) |
| bereich_id | UUID (FK → bereiche) | Zugehöriger Bereich, NULL = keiner (NEU: 2026-04-09) |

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

### extras_gruppen (NEU: 2026-04-08)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| gericht_id | UUID (FK → gerichte) | Zu welchem Gericht |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | z.B. "Sauce", "Größe", "Toppings" |
| pflicht | BOOLEAN | true = Gast muss wählen |
| max_auswahl | INTEGER | 1 = Radio, >1 = Checkbox |
| reihenfolge | INTEGER | Sortierung |

### extras (NEU: 2026-04-08)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| gruppe_id | UUID (FK → extras_gruppen) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| name | TEXT | z.B. "Ketchup", "Extra Käse" |
| aufpreis | DECIMAL(10,2) | 0 = kostenlos |
| verfuegbar | BOOLEAN | false = ausverkauft |
| reihenfolge | INTEGER | Sortierung |

### bestellposition_extras (NEU: 2026-04-08)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| position_id | UUID (FK → bestellpositionen) | |
| extra_id | UUID (FK → extras) | |
| extra_name | TEXT | Eingefroren zum Bestellzeitpunkt |
| aufpreis | DECIMAL(10,2) | Eingefroren zum Bestellzeitpunkt |

### reservierungen
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| tisch_id | UUID (FK → tische) | Optional (Auto-Assign bei Online-Buchung) |
| gast_name | TEXT | Gastname |
| telefon | TEXT | ⚠️ DSGVO: personenbezogen, 30 Tage Löschfrist |
| email | TEXT | ⚠️ DSGVO: personenbezogen, 30 Tage Löschfrist |
| datum | TIMESTAMP | |
| personen | INTEGER | |
| status | TEXT | ausstehend / bestaetigt / storniert |
| anmerkung | TEXT | |
| anlass | TEXT | Optional: geburtstag / jubilaeum / date_night / geschaeft / feier / sonstiges |
| sitzplatz_wunsch | TEXT | Optional: innen / terrasse / bar / fenster / ruhig |
| quelle | TEXT | app / whatsapp / telefon / online |
| buchungs_token | TEXT UNIQUE | Sicherer Token für Self-Service-Links (64 Hex-Zeichen) |
| dsgvo_einwilligung | BOOLEAN | Einwilligungsflag (Pflicht bei Online-Buchung) |
| erinnerung_gesendet | JSONB | Tracking gesendeter Erinnerungen (z.B. {"24h": true, "3h": true}) |
| verweilzeit_min | INTEGER | Geschätzte Tischbelegung in Minuten (Standard: 90) |
| tags | TEXT[] | (NEU: 2026-04-26) Ad-hoc Reservierungs-Tags wie "Vegan", "Geburtstag", "Allergie", "Fensterplatz" — max 10 pro Reservierung, max 50 Zeichen pro Tag |
| erstellt_am | TIMESTAMP | |

### dekorationen (NEU: 2026-04-26)
Statische Floor-Plan-Elemente (Pflanze, Theke, Eingang, Servicestation, Wand, Tür) — eigene Konva-Layer unter den Tischen.
| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID (PK) | |
| restaurant_id | UUID (FK → restaurants) | Multi-Tenant |
| bereich_id | UUID (FK → bereiche, NULLable) | Pro Bereich getrennt (jeder Bereich ist eigener Floor Plan) |
| typ | VARCHAR(30) | CHECK: pflanze / theke / eingang / servicestation / wand / tuer |
| pos_x, pos_y | INTEGER | Position auf Canvas |
| breite, hoehe | INTEGER | Größe |
| rotation | INTEGER | 0–360° |
| label | VARCHAR(50) | Optional: "Eingang", "Bar", "Damen-WC" — bei Eingang/Theke/Servicestation default gesetzt |
| erstellt_am | TIMESTAMPTZ | |

Indexe: `idx_dekorationen_restaurant`, `idx_dekorationen_bereich` (partiell, nur wenn bereich_id gesetzt).

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
