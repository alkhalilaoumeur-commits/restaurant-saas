# Verarbeitungsverzeichnis (Art. 30 DSGVO)

**Verantwortlicher:** [Restaurant-Betreiber – wird pro Tenant gesetzt]
**Software:** Restaurant SaaS
**Letzte Aktualisierung:** 2026-04-05

---

## 1. Mitarbeiter-Verwaltung

| Feld | Personenbezogen | Zweck | Rechtsgrundlage | Empfaenger | Loeschfrist |
|---|---|---|---|---|---|
| `name` | Ja | Identifikation im System, Anzeige in UI | Art. 6 Abs. 1 lit. b DSGVO / § 26 BDSG | Nur Admin des eigenen Restaurants | 3 Jahre nach Deaktivierung (§ 195 BGB) |
| `email` | Ja | Login-Kennung, eindeutige Identifikation | Art. 6 Abs. 1 lit. b DSGVO / § 26 BDSG | Nur Admin des eigenen Restaurants | 3 Jahre nach Deaktivierung |
| `passwort_hash` | Ja (sensibel) | Authentifizierung | Art. 6 Abs. 1 lit. b DSGVO | Niemand (nur System) | Sofort bei Deaktivierung invalidieren |
| `rolle` | Nein (funktional) | Zugriffssteuerung (RBAC) | Art. 6 Abs. 1 lit. b DSGVO | System-intern | Mit Mitarbeiter-Datensatz |
| `aktiv` | Nein (funktional) | Soft-Delete / Sperrung | Art. 6 Abs. 1 lit. b DSGVO | System-intern | Mit Mitarbeiter-Datensatz |

**Technische Massnahmen:**
- Passwort: bcrypt, 12 Rounds (kein Klartext, kein MD5/SHA)
- Zugriff: Nur Rolle `admin` darf Mitarbeiterdaten sehen/aendern
- Multi-Tenant: `restaurant_id`-Filter auf jeder Query
- Kein Klartext-Logging von Email oder Name

---

## 2. Reservierungen (Gaeste-Daten)

| Feld | Personenbezogen | Zweck | Rechtsgrundlage | Empfaenger | Loeschfrist |
|---|---|---|---|---|---|
| `name` | Ja | Identifikation des Gastes fuer Reservierung | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) | Mitarbeiter des Restaurants (Admin, Kellner) | 30 Tage nach Reservierungsdatum |
| `telefon` | Ja | Kontaktaufnahme bei Aenderungen | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) | Mitarbeiter des Restaurants (Admin, Kellner) | 30 Tage nach Reservierungsdatum |
| `anmerkung` | Potenziell (Gesundheitsdaten!) | Sonderwuensche, Allergien | Art. 6 Abs. 1 lit. a + Art. 9 Abs. 2 lit. a DSGVO (Einwilligung) | Mitarbeiter des Restaurants | 30 Tage nach Reservierungsdatum |
| `personen` | Nein | Tischplanung | Art. 6 Abs. 1 lit. b DSGVO | Mitarbeiter des Restaurants | Mit Reservierung |
| `datum` | Nein | Zeitplanung | Art. 6 Abs. 1 lit. b DSGVO | Mitarbeiter des Restaurants | Mit Reservierung |
| `status` | Nein | Prozesssteuerung | Art. 6 Abs. 1 lit. b DSGVO | System-intern | Mit Reservierung |
| `quelle` | Nein | Statistik (anonymisierbar) | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) | System-intern | Mit Reservierung |

**WARNUNG:** Das Feld `anmerkung` kann Gesundheitsdaten enthalten (z.B. "glutenfrei", "Nussallergie"). Diese fallen unter Art. 9 DSGVO (besondere Kategorien) und benoetigen **ausdrueckliche Einwilligung**.

**Technische Massnahmen:**
- Zugriff: Rollen `admin` und `kellner`
- Multi-Tenant: `restaurant_id`-Filter
- Hinweis im Frontend bei Anmerkungsfeld erforderlich
- Automatische Loeschung nach 30 Tagen (noch zu implementieren)

---

## 3. Bestellungen

| Feld | Personenbezogen | Zweck | Rechtsgrundlage | Empfaenger | Loeschfrist |
|---|---|---|---|---|---|
| `tisch_id` | Nein (kein Personenbezug) | Zuordnung zum Tisch | Art. 6 Abs. 1 lit. b DSGVO | Alle Mitarbeiter | Keine (kein Personenbezug) |
| `gesamtpreis` | Nein | Abrechnung | Art. 6 Abs. 1 lit. c DSGVO (§ 147 AO) | Admin | 10 Jahre (steuerliche Aufbewahrung) |
| `anmerkung` | Potenziell | Sonderwuensche | Art. 6 Abs. 1 lit. b DSGVO | Kueche, Kellner | 6 Monate (ohne Personenbezug) |
| `erstellt_am` | Nein | Rechnungsnachweis | Art. 6 Abs. 1 lit. c DSGVO (§ 147 AO) | Admin | 10 Jahre |

**Hinweis:** Bestellungen sind in unserem System NICHT direkt mit Personen verknuepft (nur mit `tisch_id`). Dadurch sind sie grundsaetzlich nicht personenbezogen. ABER: In Kombination mit einer Reservierung fuer denselben Tisch am selben Tag koennten sie indirekt zuordenbar sein.

**Technische Massnahmen:**
- Multi-Tenant: `restaurant_id`-Filter
- Keine direkte Verknuepfung Bestellung <-> Gast

---

## 4. Restaurant-Daten

| Feld | Personenbezogen | Zweck |
|---|---|---|
| `name` | Nein (Firmenname) | Identifikation |
| `logo_url` | Nein | Branding |
| `oeffnungszeiten` | Nein | Information |
| `lizenz_code` | Nein | Lizenzierung |

**Keine personenbezogenen Daten** – kein DSGVO-Handlungsbedarf.

---

## 5. Loeschkonzept (Uebersicht)

| Datenkategorie | Loeschfrist | Fristbeginn | Umsetzung |
|---|---|---|---|
| Reservierungen (Name, Telefon, Anmerkung) | 30 Tage | Nach Reservierungsdatum | Automatisch (Cron-Job / DB-Trigger) |
| Stornierte Reservierungen | 7 Tage | Nach Stornierung | Automatisch |
| Mitarbeiter (nach Deaktivierung) | 3 Jahre | Ende des Kalenderjahres der Deaktivierung | Manuell durch Admin oder automatisch |
| Bestellungen (Rechnungsdaten) | 10 Jahre | Ende des Kalenderjahres der Bestellung | Automatisch |
| Passwort-Hash (deaktivierter MA) | Sofort | Bei Deaktivierung | Automatisch (auf NULL setzen) |

**Status Umsetzung:**
- [ ] Automatische Loeschung Reservierungsdaten (30 Tage) – noch zu implementieren
- [ ] Automatische Loeschung stornierter Reservierungen (7 Tage) – noch zu implementieren
- [ ] Passwort-Hash bei Deaktivierung invalidieren – noch zu implementieren
- [ ] Mitarbeiter-Daten nach 3 Jahren loeschen – noch zu implementieren
- [ ] Hinweis im Anmerkungsfeld (Gesundheitsdaten) – noch zu implementieren

---

## 6. Auftragsverarbeiter (Art. 28 DSGVO)

| Dienst | Zweck | Serverstandort | AV-Vertrag (DPA) |
|---|---|---|---|
| Supabase | Datenbank-Hosting (PostgreSQL) | EU (Frankfurt) pruefen! | Noch abzuschliessen |
| Hetzner | Server-Hosting | Deutschland (Frankfurt) | Noch abzuschliessen |

**WICHTIG:** Vor Produktivbetrieb MUESSEN AV-Vertraege mit allen Auftragsverarbeitern abgeschlossen werden.

---

## 7. Betroffenenrechte – Umsetzungsstatus

| Recht | Artikel | Status | Wie umgesetzt |
|---|---|---|---|
| Informationspflicht | Art. 13/14 | Offen | Datenschutzerklaerung auf Webseite |
| Auskunftsrecht | Art. 15 | Offen | Export-Funktion (JSON) fuer alle Daten einer Person |
| Berichtigungsrecht | Art. 16 | Teilweise | Mitarbeiter: Name/Rolle aenderbar. Reservierungen: noch nicht |
| Loeschrecht | Art. 17 | Offen | Loeschfunktion fuer Gaeste-Daten |
| Einschraenkung | Art. 18 | Teilweise | Mitarbeiter: Deaktivieren statt Loeschen |
| Datenuebertragbarkeit | Art. 20 | Offen | JSON-Export aller personenbezogenen Daten |
| Widerspruchsrecht | Art. 21 | Offen | Widerspruch gegen Verarbeitung |

---

## 8. Technische und Organisatorische Massnahmen (TOM)

| Massnahme | Status | Details |
|---|---|---|
| Passwort-Hashing (bcrypt 12 Rounds) | Umgesetzt | Backend: mitarbeiter-Route |
| JWT-Authentifizierung | Umgesetzt | Token-basiert, httpOnly empfohlen |
| Multi-Tenant-Isolation | Umgesetzt | restaurant_id auf jeder Query |
| Rollenbasierte Zugriffskontrolle (RBAC) | Umgesetzt | admin / kellner / kueche |
| HTTPS / TLS | Offen | Muss auf Hetzner konfiguriert werden |
| Verschluesselung at rest | Offen | PostgreSQL-Verschluesselung pruefen |
| Rate Limiting (Login) | Offen | Max. 5 Versuche / 15 Min |
| Sichere HTTP-Headers (helmet.js) | Offen | CSP, X-Frame-Options etc. |
| Logging ohne personenbezogene Daten | Zu pruefen | Kein console.log mit Email/Name |
| Backup-Verschluesselung | Offen | Backups muessen verschluesselt sein |
| Datenpanne-Prozess (72h Meldepflicht) | Offen | Art. 33/34 DSGVO |
