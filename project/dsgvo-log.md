# DSGVO-Pruefprotokoll

## Wie dieser Log funktioniert
Bei jeder Session und jeder neuen Funktion wird hier eingetragen was geprueft wurde.
Vollstaendiges Verarbeitungsverzeichnis: siehe `project/dsgvo-datenkatalog.md`

---

## 2026-04-05 – Restaurant-Registrierung

### Was wurde gemacht
- Registrierungs-Endpunkt implementiert (POST /api/auth/registrieren)
- Neue personenbezogene Felder in restaurants-Tabelle: strasse, plz, stadt, telefon, email
- Passwort-Hashing: bcrypt 12 Rounds (wie bestehende Mitarbeiter-Erstellung)
- Email-Uniqueness-Check vor Registrierung
- Transaktionssichere Erstellung (Restaurant + Mitarbeiter atomar)

### Neue personenbezogene Daten

| Tabelle | Felder | Kategorie | Rechtsgrundlage |
|---|---|---|---|
| `restaurants` | `telefon`, `email` | Kontaktdaten (Betreiber) | Art. 6 Abs. 1 lit. b DSGVO |
| `restaurants` | `strasse`, `plz`, `stadt` | Adressdaten (Betreiber) | Art. 6 Abs. 1 lit. b DSGVO |

### Ergebnis
- ✅ Passwort als bcrypt-Hash (12 Rounds)
- ✅ Email-Uniqueness auf DB-Ebene (UNIQUE constraint auf mitarbeiter.email)
- ✅ Transaktion: Bei Fehler werden weder Restaurant noch Mitarbeiter angelegt
- ✅ Kein Logging personenbezogener Daten
- ✅ Lizenzcode wird automatisch generiert (REST-XXXX)

---

## 2026-04-05 – Umfassender DSGVO-Check & Skill-Erstellung

### Was wurde gemacht
- DSGVO-Regeln online recherchiert (dataguard.de, keyed.de, proliance.ai, dev.to, gastronovi.com)
- DSGVO-Skill erstellt (`.claude/skills/dsgvo/SKILL.md`)
- Verarbeitungsverzeichnis erstellt (`project/dsgvo-datenkatalog.md`) – Pflicht nach Art. 30 DSGVO
- Alle personenbezogenen Daten im System katalogisiert
- Loeschfristen definiert
- Technische Massnahmen (TOM) dokumentiert

### Personenbezogene Daten im System

| Tabelle | Felder | Kategorie | Rechtsgrundlage |
|---|---|---|---|
| `mitarbeiter` | `name`, `email`, `passwort_hash` | Beschaeftigtendaten | Art. 6 Abs. 1 lit. b / § 26 BDSG |
| `reservierungen` | `name`, `telefon` | Gaeste-Kontaktdaten | Art. 6 Abs. 1 lit. b (Vertragserfuellung) |
| `reservierungen` | `anmerkung` | Potenziell Gesundheitsdaten! | Art. 9 Abs. 2 lit. a (Einwilligung) |

### Definierte Loeschfristen

| Daten | Frist | Gesetzliche Grundlage |
|---|---|---|
| Reservierungen (Name, Telefon) | 30 Tage nach Reservierungsdatum | Art. 5 Abs. 1 lit. e DSGVO (Speicherbegrenzung) |
| Stornierte Reservierungen | 7 Tage nach Stornierung | Art. 5 Abs. 1 lit. e DSGVO |
| Mitarbeiter nach Deaktivierung | 3 Jahre nach Kalenderjahresende | § 195 BGB (Verjaehrungsfrist) |
| Rechnungsdaten (Bestellungen) | 10 Jahre nach Kalenderjahresende | § 147 AO (steuerliche Aufbewahrung) |
| Passwort-Hash bei Deaktivierung | Sofort | Art. 5 Abs. 1 lit. e DSGVO |

### Technische Massnahmen – Status

| Massnahme | Status |
|---|---|
| Passwort-Hashing (bcrypt 12 Rounds) | ✅ Umgesetzt |
| Multi-Tenant-Isolation (restaurant_id) | ✅ Umgesetzt |
| Rollenbasierte Zugriffskontrolle (RBAC) | ✅ Umgesetzt |
| JWT-Authentifizierung | ✅ Umgesetzt |
| HTTPS / TLS | ⬜ Offen (Hetzner-Setup) |
| Rate Limiting (Login) | ⬜ Offen |
| Sichere HTTP-Headers (helmet.js) | ⬜ Offen |
| Automatische Datenloeschung (Cron) | ✅ Umgesetzt (node-cron, täglich 3:00, 30 Tage) |
| Datenschutzerklaerung | ⬜ Offen |
| Impressum | ⬜ Offen |
| AV-Vertrag Supabase | ⬜ Offen |
| AV-Vertrag Hetzner | ⬜ Offen |

### Betroffenenrechte – Status

| Recht | Status |
|---|---|
| Art. 13/14 Informationspflicht | ⬜ Datenschutzerklaerung fehlt |
| Art. 15 Auskunftsrecht | ⬜ Export-Funktion fehlt |
| Art. 16 Berichtigungsrecht | ⚠️ Teilweise (Mitarbeiter ja, Reservierungen nein) |
| Art. 17 Loeschrecht | ⬜ Loeschfunktion fehlt |
| Art. 18 Einschraenkung | ⚠️ Teilweise (Mitarbeiter deaktivieren) |
| Art. 20 Datenuebertragbarkeit | ⬜ JSON-Export fehlt |

---

## 2026-04-07 – Reservierungssystem Pro (Online-Buchung)

### Was wurde gemacht
- Öffentliche Buchungsseite (`/buchen/:restaurantId`) für Gäste
- Neues Feld `email` in `reservierungen` (personenbezogen, DSGVO-relevant)
- Neues Feld `buchungs_token` für Self-Service-Links
- Neues Feld `dsgvo_einwilligung` (Pflicht-Checkbox bei Online-Buchung)
- E-Mail-Bestätigung, Erinnerungen (24h + 3h), Storno-/Umbuchungs-Emails
- DSGVO-Cleanup: Automatische Löschung personenbezogener Daten 30 Tage nach Reservierungsdatum

### DSGVO-Bewertung
- ✅ DSGVO-Einwilligung ist Pflichtfeld bei Online-Buchungen (Checkbox)
- ✅ Gäste werden über 30-Tage-Löschfrist informiert (im Checkbox-Text)
- ✅ Automatische Löschung via node-cron (täglich 3:00): gast_name → "gelöscht", email → NULL, telefon → NULL
- ✅ Self-Service: Gäste können ohne Login stornieren/umbuchen (per Token)
- ✅ E-Mail-Versand ist fire-and-forget (keine Speicherung des Email-Inhalts)
- ✅ Buchungs-Token ist kryptographisch sicher (32 Bytes = 64 Hex-Zeichen)

### Neue personenbezogene Felder
| Tabelle | Feld | Beschreibung | Löschfrist |
|---|---|---|---|
| `reservierungen` | `email` | Gast-Email für Bestätigungen/Erinnerungen | 30 Tage nach Reservierungsdatum |
| `reservierungen` | `dsgvo_einwilligung` | Einwilligungsflag | Mit Reservierung |

---

## 2026-04-05 – Mitarbeiterverwaltung

### Pruefung
- Neue Funktion: Mitarbeiter anlegen, bearbeiten, deaktivieren, Passwort aendern
- Personenbezogene Daten: `name`, `email`, `passwort_hash`

### Ergebnis
- ✅ Passwort wird als bcrypt-Hash gespeichert (12 Rounds)
- ✅ Nur Admin kann Mitarbeiterdaten sehen/aendern
- ✅ Email-Uniqueness-Check verhindert Duplikate
- ✅ Mindestlaenge Passwort: 6 Zeichen
- ✅ Eigenen Account kann man nicht deaktivieren
- ✅ `OEFFENTLICHE_FELDER` im Backend – `passwort_hash` wird nie an Frontend gesendet
- ⬜ Loeschfunktion fuer Mitarbeiter fehlt (nur Deaktivieren)
- ⬜ Passwort-Hash wird bei Deaktivierung nicht invalidiert

---

## 2026-04-04 – Initiale Bewertung

### Bubble.io (alt)
- ❌ Server in USA (AWS us-east-1) – nicht DSGVO-konform ohne zusaetzliche Massnahmen
- ❌ Wenig Kontrolle ueber Datenspeicherung
- ⚠️ DPA vorhanden, aber US-Recht greift

### Custom Code (neu – aktuelle Loesung)
- ✅ Hetzner Frankfurt geplant – Server in Deutschland
- ✅ Volle Kontrolle ueber alle Daten
- ✅ Loeschfunktionen planbar von Anfang an
- ✅ Multi-Tenant mit restaurant_id-Isolation

---

## Offene DSGVO-Punkte (Backlog)

### Kritisch (vor Produktivbetrieb)
- [ ] Datenschutzerklaerung erstellen und auf Webseite einbinden
- [ ] Impressum erstellen
- [ ] AV-Vertrag mit Supabase abschliessen (Serverstandort pruefen: EU?)
- [ ] AV-Vertrag mit Hetzner abschliessen
- [ ] HTTPS / TLS auf Produktionsserver konfigurieren
- [x] Automatische Löschung: Reservierungsdaten nach 30 Tagen ✅ erledigt 2026-04-07 (node-cron in erinnerungen.ts)
- [ ] Hinweis im Anmerkungsfeld: "Bitte keine Gesundheitsdaten ohne Einwilligung"

### Wichtig (zeitnah)
- [x] Rate Limiting auf Login-Endpunkt (Brute-Force-Schutz) ✅ erledigt 2026-04-06
- [ ] Sichere HTTP-Headers (helmet.js) einbinden
- [ ] Passwort-Hash bei Mitarbeiter-Deaktivierung auf NULL setzen
- [ ] Art. 15 Auskunftsrecht: Export-Funktion (JSON) implementieren
- [ ] Art. 17 Loeschrecht: Loeschfunktion fuer Gaeste-Daten
- [ ] Art. 20 Datenuebertragbarkeit: JSON-Export aller Daten einer Person

### Spaeter
- [ ] Cookie-Banner implementieren (falls Cookies genutzt werden)
- [ ] Datenpanne-Prozess dokumentieren (72h Meldepflicht, Art. 33/34)
- [ ] Regelmaessige Datenschutz-Audits planen
- [ ] Pruefen ob Datenschutzbeauftragter noetig (ab 20 MA in Datenverarbeitung)
