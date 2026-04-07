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
| Automatische Datenloeschung (Cron) | ⬜ Offen |
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
- [ ] Automatische Loeschung: Reservierungsdaten nach 30 Tagen
- [ ] Hinweis im Anmerkungsfeld: "Bitte keine Gesundheitsdaten ohne Einwilligung"

### Wichtig (zeitnah)
- [ ] Rate Limiting auf Login-Endpunkt (Brute-Force-Schutz)
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
