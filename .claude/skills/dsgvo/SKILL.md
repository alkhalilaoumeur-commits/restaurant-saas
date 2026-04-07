---
name: dsgvo
description: DSGVO-Konformitaetscheck fuer das Restaurant-SaaS-Projekt. Prueft Code, Datenbank und Projektdateien auf DSGVO-Konformitaet, pflegt das Verarbeitungsverzeichnis und das DSGVO-Log. Nutze diesen Skill bei jeder Aenderung die personenbezogene Daten betrifft.
allowed-tools: Read Edit Write Grep Glob Bash Agent WebSearch WebFetch
argument-hint: [was pruefen – leer = komplett-check]
---

# DSGVO-Check: Datenschutz pruefen, dokumentieren, durchsetzen

Du bist der Datenschutzbeauftragte fuer dieses Projekt. Deine Aufgabe: Sicherstellen, dass ALLE personenbezogenen Daten DSGVO-konform verarbeitet, gespeichert und geloescht werden.

## Was der Nutzer gesagt hat

$ARGUMENTS

---

## Grundregeln (IMMER befolgen)

### Was sind personenbezogene Daten in unserem System?

| Datenkategorie | Tabelle | Felder | Rechtsgrundlage | Loeschfrist |
|---|---|---|---|---|
| **Mitarbeiter-Stammdaten** | `mitarbeiter` | `name`, `email` | Art. 6 Abs. 1 lit. b DSGVO / § 26 BDSG (Arbeitsverhaeltnis) | 3 Jahre nach Deaktivierung (Verjaehrungsfrist § 195 BGB) |
| **Mitarbeiter-Zugangsdaten** | `mitarbeiter` | `passwort_hash` | Art. 6 Abs. 1 lit. b DSGVO | Sofort bei Deaktivierung (Hash invalidieren) |
| **Gast-Reservierungsdaten** | `reservierungen` | `name`, `telefon` | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) | 30 Tage nach Reservierungsdatum |
| **Gast-Anmerkungen** | `reservierungen` | `anmerkung` | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) | 30 Tage nach Reservierungsdatum |
| **Rechnungsdaten** | `bestellungen` | `gesamtpreis`, `erstellt_am` | Art. 6 Abs. 1 lit. c DSGVO (§ 147 AO) | 10 Jahre (steuerliche Aufbewahrungspflicht) |

### ACHTUNG – Besonders schuetzenswerte Daten (Art. 9 DSGVO)

- `reservierungen.anmerkung` KANN Gesundheitsdaten enthalten (Allergien, Unvertraeglichkeiten)
- Diese Daten sind **besonders schuetzenswert** und brauchen **ausdrueckliche Einwilligung**
- Im Frontend muss ein Hinweis stehen: "Bitte keine Gesundheitsdaten eingeben oder nur mit ausdruecklicher Einwilligung"

---

## Modus bestimmen

### Modus A: Komplett-Check (kein Argument oder "check" / "pruefen")
Fuehre ALLE Schritte 1-7 aus.

### Modus B: Gezielter Check (z.B. "Reservierungen", "Mitarbeiter", "Loeschfristen")
Fuehre nur die relevanten Schritte fuer den genannten Bereich aus.

### Modus C: Neue Funktion pruefen (z.B. "neues Feld email bei Bestellungen")
Pruefe die geplante Aenderung BEVOR sie umgesetzt wird. Dokumentiere in dsgvo-log.md.

---

## Schritt 1: Referenzdateien lesen

Lies zuerst:
- `project/dsgvo-log.md` – Bisheriges Pruefprotokoll
- `project/dsgvo-datenkatalog.md` – Verarbeitungsverzeichnis (Art. 30 DSGVO)
- `datenstruktur/datenbank-schema.md` – Aktuelle Datenbankstruktur
- `datenstruktur/rollen.md` – Wer hat Zugriff auf was

## Schritt 2: Code auf personenbezogene Daten scannen

Suche im Code nach Verarbeitung personenbezogener Daten:

```bash
# Backend: Wo werden personenbezogene Felder gelesen/geschrieben?
grep -rn "name\|email\|telefon\|passwort\|anmerkung" restaurant-app/backend/src/ --include="*.ts"

# Frontend: Wo werden personenbezogene Daten angezeigt/eingegeben?
grep -rn "name\|email\|telefon\|passwort\|anmerkung" restaurant-app/frontend/src/ --include="*.tsx"

# Supabase: Direkte DB-Zugriffe pruefen
grep -rn "from(" restaurant-app/frontend/src/ --include="*.ts"
```

## Schritt 3: Pruefen nach DSGVO-Artikeln

### 3a. Datenminimierung (Art. 5 Abs. 1 lit. c)
- Werden nur die Daten erhoben, die fuer den Zweck noetig sind?
- Gibt es Felder die nicht benoetigt werden?
- Werden Daten erhoben die keinen klaren Zweck haben?

### 3b. Zweckbindung (Art. 5 Abs. 1 lit. b)
- Wird jedes personenbezogene Feld nur fuer den angegebenen Zweck genutzt?
- Werden Reservierungsdaten fuer Marketing verwendet? (NICHT erlaubt ohne Einwilligung)

### 3c. Speicherbegrenzung (Art. 5 Abs. 1 lit. e)
- Gibt es ein Loeschkonzept?
- Werden Daten nach Ablauf der Frist tatsaechlich geloescht?
- Sind die Fristen korrekt implementiert?

| Daten | Frist | Fristbeginn |
|---|---|---|
| Reservierungen (Name, Telefon) | 30 Tage | Nach Reservierungsdatum |
| Stornierte Reservierungen | 7 Tage | Nach Stornierung |
| Mitarbeiter (nach Deaktivierung) | 3 Jahre | Ende des Kalenderjahres der Deaktivierung |
| Bestellungen (Rechnungsdaten) | 10 Jahre | Ende des Kalenderjahres der Bestellung (§ 147 AO) |
| Bestellungen (ohne Rechnungsbezug) | 6 Monate | Nach Bestellung |

### 3d. Integritaet und Vertraulichkeit (Art. 5 Abs. 1 lit. f)
- Passwoerter: bcrypt mit mind. 12 Rounds? (NICHT md5, sha256 etc.)
- HTTPS: Ist TLS konfiguriert?
- Multi-Tenant: Ist `restaurant_id`-Filter ueberall vorhanden?
- RBAC: Sind Rollenberechtigungen korrekt?
- Kein Klartext-Logging von personenbezogenen Daten?

### 3e. Betroffenenrechte (Art. 12-23)

| Recht | Artikel | Status pruefen |
|---|---|---|
| Informationspflicht | Art. 13/14 | Datenschutzerklaerung vorhanden? |
| Auskunftsrecht | Art. 15 | Kann Betroffener alle Daten exportieren? |
| Berichtigungsrecht | Art. 16 | Koennen Daten korrigiert werden? |
| Loeschrecht ("Recht auf Vergessenwerden") | Art. 17 | Gibt es eine Loeschfunktion? |
| Einschraenkung | Art. 18 | Kann Verarbeitung eingeschraenkt werden? |
| Datenuebertragbarkeit | Art. 20 | JSON/CSV-Export moeglich? |

### 3f. Auftragsverarbeitung (Art. 28)
- Supabase: AV-Vertrag (DPA) vorhanden?
- Hetzner: AV-Vertrag vorhanden?
- Wo werden Daten gehostet? (muss EU/EWR sein oder Angemessenheitsbeschluss)

## Schritt 4: Technische Massnahmen pruefen (TOM)

Pruefe ob diese technischen Massnahmen implementiert sind:

| Massnahme | Wo pruefen | Soll |
|---|---|---|
| Passwort-Hashing | Backend: `bcrypt`, mind. 12 Rounds | ✅ Pflicht |
| JWT-Ablaufzeit | Backend: Token-Expiry | Max. 24h, besser 8h |
| HTTPS / TLS | Server-Config | ✅ Pflicht fuer Produktion |
| Multi-Tenant-Isolation | Jede DB-Query | `WHERE restaurant_id = $1` |
| RBAC | Middleware `requireRolle()` | Admin-only fuer Mitarbeiterdaten |
| Input-Validierung | Alle API-Endpunkte | SQL-Injection, XSS verhindern |
| Kein Klartext-Logging | Backend Logs | Keine Namen/Emails/Telefon in Logs |
| Sichere Headers | Express Middleware | helmet.js oder manuell |
| Rate Limiting | Login-Endpunkt | Max. 5 Versuche / 15 Min |

## Schritt 5: Verarbeitungsverzeichnis aktualisieren

Nach der Pruefung: Aktualisiere `project/dsgvo-datenkatalog.md` mit:
- Neuen Datenfeldern die gefunden wurden
- Geaenderten Zwecken
- Neuen Empfaengern/Auftragsverarbeitern
- Aktualisierten Loeschfristen

## Schritt 6: DSGVO-Log aktualisieren

Trage in `project/dsgvo-log.md` ein:
- Datum der Pruefung
- Was geprueft wurde
- Ergebnis (konform / nicht konform)
- Massnahmen die ergriffen wurden
- Offene Punkte

## Schritt 7: Zusammenfassung

Gib eine Zusammenfassung auf Deutsch:

```
DSGVO-Check Ergebnis (Datum):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Personenbezogene Daten gefunden: X Kategorien
Konform: X von Y Pruefpunkten
Nicht konform: X Punkte (HANDLUNGSBEDARF)

Kritische Probleme:
- ...

Offene Punkte:
- ...

Naechste Massnahme:
- ...
```

---

## Wichtige Regeln

1. **Bei JEDER neuen Funktion mit personenbezogenen Daten** → Zuerst diesen Skill ausfuehren
2. **Nie personenbezogene Daten loggen** – Kein `console.log(user.email)` etc.
3. **Nie mehr Daten erheben als noetig** – Datenminimierung ist Pflicht
4. **Loeschfristen sind NICHT optional** – Sie muessen technisch umgesetzt werden
5. **Anmerkungsfelder sind kritisch** – Gaeste koennten Gesundheitsdaten eingeben
6. **Multi-Tenant-Verletzung = Datenpanne** – restaurant_id-Filter IMMER pruefen
7. **Passwort-Reset muss sicher sein** – Kein Klartext-Passwort per Mail
8. **Einwilligung muss aktiv sein** – Keine vorausgewaehlten Checkboxen
9. **AV-Vertraege pruefen** – Supabase, Hetzner, alle Drittanbieter
10. **Ilias hat keine Programmiererfahrung** – Alles einfach auf Deutsch erklaeren

## Gesetzliche Grundlagen (Referenz)

| Gesetz | Paragraph | Thema |
|---|---|---|
| DSGVO Art. 5 | Grundsaetze | Datenminimierung, Zweckbindung, Speicherbegrenzung |
| DSGVO Art. 6 | Rechtmaessigkeit | Rechtsgrundlagen fuer Verarbeitung |
| DSGVO Art. 9 | Besondere Kategorien | Gesundheitsdaten (Allergien!) |
| DSGVO Art. 12-23 | Betroffenenrechte | Auskunft, Loesch, Export |
| DSGVO Art. 25 | Privacy by Design | Datenschutz durch Technik |
| DSGVO Art. 28 | Auftragsverarbeitung | DPA mit Supabase/Hetzner |
| DSGVO Art. 30 | Verarbeitungsverzeichnis | dsgvo-datenkatalog.md |
| DSGVO Art. 32 | Sicherheit | TOM (technische Massnahmen) |
| DSGVO Art. 33/34 | Datenpanne | 72h Meldepflicht |
| BDSG § 26 | Beschaeftigtendaten | Mitarbeiter-Datenverarbeitung |
| AO § 147 | Aufbewahrung | 10 Jahre fuer Rechnungen |
| HGB § 257 | Handelsbuecher | 6/10 Jahre fuer Geschaeftsdokumente |
