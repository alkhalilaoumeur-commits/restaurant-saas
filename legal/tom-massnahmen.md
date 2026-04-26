# Anlage 1 zum AVV — Technische und organisatorische Maßnahmen (TOM)

gemäß Art. 32 DSGVO

**Verantwortlich:** Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart
**Stand:** 25. April 2026

---

## 1. Vertraulichkeit (Art. 32 Abs. 1 lit. b DSGVO)

### 1.1 Zutrittskontrolle (physisch)
- Server stehen ausschließlich in den Rechenzentren der Hetzner Online GmbH, Frankfurt am Main
- Hetzner-Rechenzentren: 24/7 Bewachung, Mehrfaktor-Authentifizierung, Videoüberwachung,
  ISO 27001 zertifiziert
- Lokaler Entwicklungs-Arbeitsplatz: Festplatte vollverschlüsselt (FileVault), Login-Passwort,
  Bildschirmsperre

### 1.2 Zugangskontrolle (logisch)
- **Authentifizierung der Software-Nutzer:** E-Mail/Passwort mit bcrypt (12 Rounds), JWT-Tokens
  mit Ablaufzeit
- **Rate-Limiting** auf Login-Endpunkte (max. 5 Versuche / 15 Min), Registrierung,
  Passwort-Reset und Code-Versand
- **Zugang zur Server-Infrastruktur:** SSH-Key-only (keine Passwort-Authentifizierung),
  Hetzner-Konto mit 2FA
- **Zugang zur Datenbank:** ausschließlich aus dem internen Netzwerk, keine öffentliche
  Verbindung

### 1.3 Zugriffskontrolle (Berechtigungskonzept)
- **Rollenbasierte Zugriffskontrolle (RBAC):** Rollen `admin`, `kellner`, `kueche`
  mit unterschiedlichen Berechtigungen
- **Mandantentrennung (Multi-Tenancy):** Jede Datenbankabfrage filtert zwingend nach
  `restaurant_id`, abgeleitet aus dem JWT-Token (nicht aus User-Input)
- **Passwort-Hashes** werden niemals in API-Antworten zurückgegeben
- **Whitelist-Ansatz:** nur explizit freigegebene Felder werden ans Frontend übertragen

### 1.4 Trennungskontrolle
- Strikte Trennung von Produktiv-, Staging- und Entwicklungsumgebung
- Test- und Demo-Daten werden in separaten Datensätzen gehalten

### 1.5 Pseudonymisierung / Verschlüsselung
- Passwörter: bcrypt-Hash mit 12 Rounds (Industriestandard)
- Transportverschlüsselung: HTTPS/TLS 1.2+ erzwungen
- Buchungs- und Reset-Tokens: kryptographisch sichere Zufallswerte (32 Byte / 64 Hex-Zeichen)
- E-Mail-SMTP: Verbindungsverschlüsselung (SSL Port 465)
- Datenbank-Backups: verschlüsselt

---

## 2. Integrität (Art. 32 Abs. 1 lit. b DSGVO)

### 2.1 Weitergabekontrolle
- Sämtliche API-Aufrufe erfolgen über HTTPS/TLS
- CORS strikt konfiguriert (nur erlaubte Origins)
- Stripe-Webhooks werden mit Signatur verifiziert (HMAC-SHA256)
- Sub-Auftragsverarbeiter: siehe `auftragsverarbeiter-liste.md`

### 2.2 Eingabekontrolle
- Alle Schreibvorgänge sind im Anwendungslog dokumentiert (ohne personenbezogene Inhalte)
- Schreibende Operationen erfordern Authentifizierung (außer öffentliche Buchungen/Bestellungen)
- Tisch-/Restaurant-Zuordnung wird serverseitig validiert (kein Spoofing über Body/Params)
- Preise werden ausschließlich serverseitig aus der Datenbank gelesen (nie vom Client übernommen)

---

## 3. Verfügbarkeit und Belastbarkeit (Art. 32 Abs. 1 lit. b DSGVO)

### 3.1 Backup
- Tägliche automatische Backups der Datenbank durch Hetzner-Snapshots
- Backups werden mindestens 14 Tage aufbewahrt

### 3.2 Wiederherstellbarkeit
- Wiederherstellung aus Backup innerhalb von 24 Stunden möglich
- Migrations-Scripts versioniert und reproduzierbar

### 3.3 Schutz vor Angriffen
- Reverse-Proxy (Traefik) mit automatischen TLS-Zertifikaten (Let's Encrypt)
- Rate-Limiting gegen Brute-Force
- Express-Validierung gegen SQL-Injection (parametrisierte Queries via `pg`-Bibliothek)
- React-Standard-Escaping gegen XSS

### 3.4 Verfügbarkeit
- Hetzner-Verfügbarkeit historisch ≥ 99,9 %
- Health-Check-Endpunkt zur kontinuierlichen Überwachung

---

## 4. Verfahren zur regelmäßigen Überprüfung (Art. 32 Abs. 1 lit. d DSGVO)

### 4.1 Datenschutzmanagement
- Verarbeitungsverzeichnis nach Art. 30 DSGVO geführt (`project/dsgvo-datenkatalog.md`)
- DSGVO-Prüfprotokoll bei jeder neuen Funktion (`project/dsgvo-log.md`)

### 4.2 Incident-Response
- Datenschutzverletzungen werden binnen 24 Stunden an Auftraggeber gemeldet (siehe AVV § 7)
- Aufsichtsbehörden-Meldung an LfDI Baden-Württemberg innerhalb 72 Stunden (Art. 33 DSGVO)

### 4.3 Privacy by Design / Default
- Datenminimierung: nur erforderliche Felder werden erhoben
- Automatische Löschung von Reservierungs-Personendaten 30 Tage nach Reservierungstermin
  (täglich um 03:00 Uhr per Cron-Job)
- DSGVO-Einwilligung als Pflichtfeld bei Online-Buchungen
- Hinweis auf Gesundheitsdaten im Anmerkungsfeld

### 4.4 Auftragskontrolle
- Sub-Auftragsverarbeiter werden vertraglich verpflichtet (Art. 28 DSGVO)
- Aktuelle Liste in `auftragsverarbeiter-liste.md`

---

## 5. Löschkonzept

| Datenkategorie | Löschfrist | Fristbeginn | Umsetzung |
|---|---|---|---|
| Reservierungen (Name, Telefon, E-Mail, Anmerkung) | 30 Tage | Reservierungsdatum | automatisch (Cron, täglich 03:00 Uhr) |
| Stornierte Reservierungen | 7 Tage | Stornierungsdatum | automatisch (geplant) |
| Mitarbeiter (nach Deaktivierung) | 3 Jahre | Ende des Kalenderjahres | manuell durch Auftraggeber, automatisch (geplant) |
| Bestellungen mit Rechnungsbezug | 10 Jahre | Ende des Kalenderjahres | manuell |
| Passwort-Hash deaktivierter Mitarbeiter | sofort | Deaktivierung | automatisch (in Umsetzung) |
| Server-Logfiles | 14 Tage | Erstellung | automatisch |

---

## 6. Änderungshistorie

| Datum | Änderung |
|---|---|
| 25.04.2026 | Erstfassung — initiale TOM-Dokumentation |
