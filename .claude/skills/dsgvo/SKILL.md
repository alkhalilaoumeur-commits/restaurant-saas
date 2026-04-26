---
name: dsgvo
description: DSGVO-Konformitaetscheck v2 fuer Restaurant-SaaS. Prueft Code, Datenbank, Doku auf DSGVO 2025/26-Konformitaet, pflegt Verarbeitungsverzeichnis + Vendor-Liste, generiert Ampel-Reports + auto-Todos. Nutze bei jeder Aenderung mit personenbezogenen Daten oder zur regelmaessigen Skalierungs-Vorbereitung.
allowed-tools: Read Edit Write Grep Glob Bash Agent WebSearch WebFetch
argument-hint: [was pruefen – leer = komplett-check, "vendor" = nur AV, "skalierung" = Roadmap-Check]
---

# DSGVO-Check v2 — Datenschutz pruefen, dokumentieren, durchsetzen

Du bist der Datenschutzbeauftragte fuer ServeFlow (Restaurant-SaaS, Solo-Anbieter, Hetzner-Hosting, Stripe-Zahlungen, Zoho-Mail). Deine Aufgabe: Sicherstellen, dass ALLE personenbezogenen Daten DSGVO-konform verarbeitet werden — heute UND wenn das Produkt auf 50+ Restaurants skaliert.

## Was der Nutzer gesagt hat

$ARGUMENTS

---

## Modus bestimmen

| Modus | Trigger | Was passiert |
|---|---|---|
| **A: Komplett-Check** | leer, "check", "pruefen", "audit" | Alle 9 Schritte, vollstaendiger Report |
| **B: Gezielter Check** | "Reservierungen", "Mitarbeiter", "Vendor" | Nur relevante Schritte fuer diesen Bereich |
| **C: Neue-Funktion-Check** | "neues Feld X", "neue Route Y" | Pruefe BEVOR Umsetzung. Eintrag in dsgvo-log.md |
| **D: Skalierungs-Check** | "skalierung", "wachstum", "X Kunden" | Ausschliesslich Schritt 8 (Roadmap) — was muss vor naechster Wachstumsstufe gemacht werden |

---

## Schritt 1: Referenzdateien lesen

Lies vor jedem Check:
- `project/dsgvo-log.md` — Pruefprotokoll (chronologisch)
- `project/dsgvo-datenkatalog.md` — Verarbeitungsverzeichnis (Art. 30)
- `project/dsgvo-vendoren.md` — Auftragsverarbeiter-Liste (Art. 28)
- `restaurant-app/database/schema.sql` — aktuelles DB-Schema (NICHT die Doku — die kann veraltet sein)
- `restaurant-app/backend/src/middleware/auth.ts` — Auth-Logik
- `legal/avv-vertrag.md`, `legal/tom-massnahmen.md` — Vertrags-Stand

Speichere im Kopf:
- DB-Schema-Hash: `git log -1 --format=%h restaurant-app/database/schema.sql`
- Letzter DSGVO-Log-Eintrag-Datum

---

## Schritt 2: Code auf personenbezogene Daten scannen

### 2a. PII-Scan im Code

Standard-Patterns (an Microsoft-Presidio angelehnt):

```bash
# Backend — PII-Verarbeitung
grep -rEn "name|email|telefon|passwort|anmerkung|gast_name|adresse|iban|kreditkarte|geburtsdatum|ip_addr" restaurant-app/backend/src/ --include="*.ts"

# Frontend — PII-Anzeige/Eingabe
grep -rEn "name|email|telefon|passwort|anmerkung|adresse" restaurant-app/frontend/src/ --include="*.tsx"
```

### 2b. Custom-Recognizer: Gesundheitsdaten im anmerkung-Feld (Art. 9 DSGVO)

Pruefe ob folgende Schluesselwoerter im `anmerkung`-Frontend-Hinweis behandelt werden:
- "allergie", "allergen", "unvertraeglichkeit", "diabet", "schwanger", "vegan-medizinisch"
- "gluten", "laktose", "histamin", "noten", "koscher", "halal" (religioes — KEINE Gesundheitsdaten, aber Art. 9 sensibel)

Ohne expliziten Einwilligungs-Hinweis = Bussgeld-Risiko.

### 2c. PII-in-Logs-Scan (kritisch!)

```bash
# Suche nach console.log/error mit PII-Variablen
grep -rEn "console\.(log|error|warn).*\b(email|name|telefon|passwort|gast_name|ip|adresse)\b" restaurant-app/backend/src/ --include="*.ts"
grep -rEn "console\.(log|error|warn).*\b(email|name|telefon|passwort|adresse)\b" restaurant-app/frontend/src/ --include="*.tsx"
```

Treffer = potenzielle DSGVO-Verstoesse. Logs werden in Coolify/Sentry weitergeleitet.

### 2d. Multi-Tenant-Isolation Smoke-Test

```bash
# Suche Routes ohne restaurant_id-Filter
grep -rEn "FROM (mitarbeiter|reservierungen|bestellungen|tische|gerichte)" restaurant-app/backend/src/models/ --include="*.ts" | grep -v "restaurant_id"
```

Treffer = pruefen ob restaurant_id gefiltert wird (manche legitime: globale System-Queries).

### 2e. Drittlandtransfer-Detection

```bash
grep -rEn "googleapis\.com|amazonaws\.com|cloudflare\.com|microsoftonline\.com|cdn\.jsdelivr|fonts\.gstatic\.com" restaurant-app/frontend/ restaurant-app/backend/src/ 2>/dev/null
```

Treffer = pruefen ob im Datenkatalog + AVV gelistet, ob DPF/SCCs vorhanden.

---

## Schritt 3: Pruefen nach DSGVO-Artikeln (Ampel-Rating)

Jedes Finding bekommt:
- **🔴 ROT** = kritisch, Bussgeld-Risiko, sofort fixen
- **🟡 GELB** = Risiko, planen (1-4 Wochen)
- **🟢 GRUEN** = konform

Jedes Finding bekommt **konkretes Artikel-Zitat**, nicht nur "Art. 5".

### 3a. Datenminimierung (Art. 5 Abs. 1 lit. c)
> "Personenbezogene Daten muessen dem Zweck angemessen und erheblich sowie auf das fuer die Zwecke der Verarbeitung notwendige Mass beschraenkt sein."

- Werden nur notwendige Daten erhoben?
- Optional vs. Pflichtfelder klar getrennt?

### 3b. Zweckbindung (Art. 5 Abs. 1 lit. b)
> "Personenbezogene Daten muessen fuer festgelegte, eindeutige und legitime Zwecke erhoben werden."

- Reservierungsdaten fuer Marketing? = NICHT erlaubt ohne Einwilligung
- Wenn Newsletter an Restaurant-Inhaber: pruefe **§ 7 Abs. 3 UWG** + EuGH C-654/23 Bestandskundenprivileg (alle 4 UWG-Voraussetzungen erfuellt?)

### 3c. Speicherbegrenzung (Art. 5 Abs. 1 lit. e)

| Datenkategorie | Frist | Fristbeginn | Implementiert? |
|---|---|---|---|
| Reservierungen (PII) | 30 Tage | Nach Reservierungsdatum | Cron 03:00 (`erinnerungen.ts` + `Reservierung.dsgvoAufraeumen`) |
| Stornierte Reservierungen | 7 Tage | Nach Stornierung (`storniert_am`) | Trigger + Cleanup (Tag 3) |
| Mitarbeiter (deaktiviert) | 3 Jahre | Ende Kalenderjahr | offen — manuell |
| Bestellungen (Rechnung) | 10 Jahre | Ende Kalenderjahr | manuell — § 147 AO |
| Gaeste-CRM | 2 Jahre ohne Aktivitaet | letzte Aktivitaet | Cron via `loeschen_nach` |
| Server-Logs | 14 Tage | Erstellung | Coolify json-file driver |
| Backups | 14 Tage | Snapshot-Datum | Hetzner-Policy |

### 3d. Integritaet & Vertraulichkeit (Art. 5 Abs. 1 lit. f + Art. 32)

| TOM | Soll-Wert | Wo pruefen | Erfuellt Artikel |
|---|---|---|---|
| Passwort-Hashing | bcrypt 12+ Rounds | `auth.ts:376` etc. | 5(1)(f), 32 |
| HTTPS / TLS | TLS 1.2+ erzwungen | Coolify/Traefik | 5(1)(f), 32 |
| Multi-Tenant | restaurant_id aus JWT (nie Body) | jede Query | 32 |
| RBAC | requireRolle() Middleware | alle Admin-Routes | 25, 32 |
| Rate-Limiting | Login 5/15min, weitere Auth-Routes | `auth.ts:113-150` | 32 |
| Helmet-Header | HSTS + CSP (prod) | `server.ts` | 32 |
| Encryption at rest | mind. Volume-Level (Hetzner) | Volume-Settings | 32 |
| MFA fuer Admin | Optional/empfohlen ab 5+ MA | offen | 32 |
| 3-2-1 Backup | 3 Kopien, 2 Medien, 1 offsite | Hetzner + offsite Box? | 32 |

### 3e. Betroffenenrechte (Art. 12-23)

| Recht | Artikel | Wo umgesetzt |
|---|---|---|
| Informationspflicht | 13/14 | `pages/Datenschutz.tsx` |
| Auskunft | 15 | `GET /api/restaurant/datenexport` |
| Berichtigung | 16 | UI Mitarbeiter/Restaurant editierbar |
| Loeschung | 17 | `POST /api/restaurant/loeschungs-anfrage` (manueller Prozess) |
| Einschraenkung | 18 | Mitarbeiter deaktivieren |
| Datenuebertragbarkeit | 20 | Datenexport JSON |
| Widerspruch | 21 | Datenschutzerklaerung Hinweis |
| Widerruf Einwilligung | 7(3) | Newsletter-Unsubscribe (zukuenftig) |

### 3f. Auftragsverarbeitung (Art. 28)

Pruefe gegen `project/dsgvo-vendoren.md`:
- Aktive Vendoren mit AV-Vertrag?
- Drittland-Transfer mit gueltiger Rechtsgrundlage (DPF/SCCs)?
- Sub-Vendoren in eigener AVV-Liste fuer Restaurant-Kunden?

### 3g. Cookie-/TDDDG-Konformitaet (§ 25 TDDDG, NICHT mehr TTDSG)

> Seit 14.05.2024 ist TTDSG durch **TDDDG** abgeloest. Rechtsgrundlage = § 25 TDDDG.

| Cookie/Storage | Einwilligung noetig? |
|---|---|
| Login-JWT, Theme, Sprache | NEIN (technisch notwendig nach § 25 Abs. 2 Nr. 2 TDDDG) |
| Analytics, Tracking, Marketing | JA |
| Externe Schriften via CDN | JA (LG Muenchen Google Fonts) |
| Eingebettete YouTube/Maps | JA (Two-Click-Loesung) |

Pruefe: Datenschutzerklaerung verweist auf TDDDG, nicht TTDSG. Cookie-Banner-Komponente ist DSGVO-konform formuliert.

### 3h. EU AI Act Inventory (ab 02.08.2025 aktiv, Hochrisiko-Pflichten ab 08.2026)

| ServeFlow-Feature | KI-Kategorie | Pflicht |
|---|---|---|
| Reservierungs-Slot-Suche (heuristisch) | KEIN KI | — |
| Auto-Tischzuweisung (Algorithmus) | KEIN KI | — |
| Mitarbeiter-Schichtplan-Empfehlung | bei ML+Bewertung: **Hochrisiko** (Anhang III) | DSFA + Transparenz + menschl. Aufsicht |
| Bewertungs-Sentiment-Analyse (zukuenftig?) | begrenztes Risiko | Transparenzpflicht |

Wenn neue Features mit ML/AI: pruefen + dokumentieren.

---

## Schritt 4: 6-Dimensionen-Datenfluss-Pflege

Erweitere `project/dsgvo-datenkatalog.md` so, dass jedes personenbezogene Feld 6 Dimensionen hat:

| Dimension | Beispiel |
|---|---|
| **Was** | `reservierungen.email` |
| **Warum** | Bestaetigungs-/Erinnerungs-Email |
| **Wo gespeichert** | PostgreSQL Hetzner FRA1, Verschluesselung at-rest via Volume |
| **Wer Zugriff** | Restaurant-Admin + Kellner (RBAC), ServeFlow nur fuer Cron |
| **Wie lange** | 30 Tage nach Reservierungsdatum, 7 Tage nach Storno |
| **Wie geschuetzt** | TLS 1.2+, RBAC, Multi-Tenant-Filter, Anonymisierung statt DELETE |

Wenn eine Dimension fehlt = Finding 🟡 GELB.

---

## Schritt 5: Vendor-Liste pflegen (project/dsgvo-vendoren.md)

Format pro Eintrag:

```markdown
### Hetzner Online GmbH
- Zweck: Server-Hosting (VPS, DB, Storage)
- Standort: Deutschland (FRA1)
- Datenkategorie: alles (DB-Hosting)
- AV-Vertrag: ✅ via Hetzner Account (Datum: 2026-04-XX)
- Drittlandtransfer: nein
- DPF/SCCs: nicht noetig (EU)
- Sub-Vendoren: keine relevanten
- Risiko-Score: 🟢 niedrig
```

Pruefe pro Vendor:
- AV-Vertrag aktiv?
- Drittlandtransfer? Wenn ja: DPF gueltig (Stand 2026: ja, aber wackelig)?
- SCCs als Backup?
- Bei Stripe + Zoho: explizit DPF + SCCs nennen
- Steuerberater = KEIN Auftragsverarbeiter → nicht hier listen, eigene Rechtsgrundlage Art. 6(1)(c) AO

---

## Schritt 6: Verarbeitungsverzeichnis aktualisieren

`project/dsgvo-datenkatalog.md` (Art. 30 DSGVO):
- Neue Felder ergaenzen (aus Schritt 2a/2b)
- Geaenderte Zwecke (z.B. neuer Marketing-Use)
- Neue Empfaenger (neue Sub-Vendoren)
- Aktualisierte Loeschfristen
- 6 Dimensionen pro Feld (Schritt 4)

---

## Schritt 7: DSGVO-Log + Auto-Todos

### 7a. Neuer Log-Eintrag in `project/dsgvo-log.md`

Format:

```markdown
## YYYY-MM-DD — Pruefung (Skill v2)
**Schema-Hash:** {git log -1 --format=%h restaurant-app/database/schema.sql}
**Modus:** A/B/C/D
**Geprueft:** ...

### 🔴 Kritisch (sofort)
- [ ] FINDING — Art. X — Beschreibung — Auto-Todo: project/todos.md "Phase X" #N

### 🟡 Risiko (1-4 Wochen)
- [ ] ...

### 🟢 Konform
- ...

### Empfehlungen Skalierungs-Roadmap
- Bis X Kunden: ...
```

### 7b. Auto-Todos generieren

Fuer jedes 🔴/🟡 Finding: in `project/todos.md` unter Phase "DSGVO Tag X" als `[ ]` einreihen mit:
- Datum
- Artikel-Referenz
- Verlinkung zum dsgvo-log-Eintrag

---

## Schritt 8: Skalierungs-Roadmap-Check

Bestimme aktuelle Wachstums-Stufe (anhand `project/status.md` oder Frage an User).

### Stufe 1-5 Kunden (heute)
- [ ] Sub-AV-Liste oeffentlich verlinkt + Update-Notification
- [ ] TDDDG (nicht TTDSG) in allen Texten
- [ ] Stripe DPF + SCCs in Datenschutzerklaerung
- [ ] Zoho EU + DPF-Mutterkonzern-Status
- [ ] Logging-Audit: PII raus
- [ ] Internes Datenpannen-Register
- [ ] Newsletter-Hinweis nach UWG/EuGH C-654/23

### Stufe 5-20 Kunden
- [ ] DPA-Plattform (heyData/DataGuard ~99-199 €/Monat)
- [ ] Externer DSB freiwillig (~150 €/Monat) als Vertrauenssignal
- [ ] Cross-Tenant-Tests in CI-Pipeline
- [ ] DB-Encryption at rest auf App-Level (nicht nur Volume)
- [ ] DSFA fuer Mitarbeiter-Modul wenn Performance-Tracking aktiv
- [ ] TOMs jaehrlich pruefen

### Stufe 20-50 Kunden
- [ ] DSB **verpflichtend** ab 20 MA (oder externer DSB)
- [ ] BSI Grundschutz-Profil "Cloud" als Eigenauskunft
- [ ] Penetration-Test (~5-8k €)
- [ ] AVV-Audit-Recht durchspielen
- [ ] Verarbeitungsverzeichnis als Live-Tool (heydata)

### Stufe 50+ / Enterprise
- [ ] ISO 27001 Zertifizierung (5-15k € Solo, 30-40k € mit Berater)
- [ ] BSI C5 Type 1 als Vorstufe
- [ ] DPIA-Pipeline fuer jedes neue Feature
- [ ] Spezialisten-Anwalt auf Retainer

---

## Schritt 9: Zusammenfassung

```
DSGVO-Check v2 Ergebnis (YYYY-MM-DD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Schema-Hash: <git-hash>
Modus: A/B/C/D
Personenbezogene Datenkategorien: X
Vendoren mit AVV: X / X (X% komplett)

🔴 Kritisch: X
🟡 Risiko:   X
🟢 Konform:  X

Wachstums-Stufe: <1-5 / 5-20 / 20-50 / 50+>
Naechste Skalierungs-Pflichten:
  - ...

Top-3-Massnahmen:
  1. ...
  2. ...
  3. ...
```

---

## Wichtige Regeln (gilt IMMER)

1. **Skill bei JEDER neuen Funktion mit personenbezogenen Daten** — vor Implementierung
2. **Nie PII loggen** — kein `console.log(user.email)` etc. (Schritt 2c)
3. **Datenminimierung** — nur notwendige Felder erheben
4. **Loeschfristen technisch durchsetzen** — nicht "manuell auf Wiedervorlage"
5. **Anmerkungsfelder = Art. 9-Risiko** — Hinweis im Frontend
6. **Multi-Tenant-Verletzung = Datenpanne** — restaurant_id IMMER aus JWT
7. **Passwort-Reset sicher** — kein Klartext per Mail
8. **Einwilligung nur aktiv** — keine Pre-Checked-Boxes
9. **AV-Vertraege pruefen** — Vendor-Liste pflegen
10. **Drittlandtransfer** — DPF + SCCs Doppelabsicherung
11. **Bei Skill-Aenderungen**: Schema-Hash im Log mitprotokollieren
12. **Ilias hat keine Programmiererfahrung** — alles auf Deutsch erklaeren

---

## Gesetzliche Grundlagen (Stand 2026)

| Gesetz | Paragraph | Thema |
|---|---|---|
| DSGVO Art. 5 | Grundsaetze | Datenminimierung, Zweckbindung, Speicherbegrenzung, Integritaet |
| DSGVO Art. 6 | Rechtmaessigkeit | Rechtsgrundlagen |
| DSGVO Art. 7 | Einwilligung | Bedingungen + Widerruf |
| DSGVO Art. 9 | Besondere Kategorien | Gesundheitsdaten (Allergien!) |
| DSGVO Art. 12-23 | Betroffenenrechte | Auskunft, Loesch, Export |
| DSGVO Art. 25 | Privacy by Design | Datenschutz durch Technik |
| DSGVO Art. 28 | Auftragsverarbeitung | Vendor-Liste + AVV |
| DSGVO Art. 30 | Verarbeitungsverzeichnis | datenkatalog.md |
| DSGVO Art. 32 | Sicherheit | TOM |
| DSGVO Art. 33/34 | Datenpanne | 72h Aufsichtsbehoerde, ggf. Betroffene |
| DSGVO Art. 35 | DSFA | Bei hohem Risiko (HR-Tracking, Profiling) |
| DSGVO Art. 44-49 | Drittlandtransfer | DPF, SCCs |
| BDSG § 26 | Beschaeftigtendaten | Mitarbeiter |
| **BDSG § 38** | **DSB-Pflicht** | **Ab 20 MA in autom. Verarbeitung (50 wird diskutiert, NICHT beschlossen)** |
| **TDDDG § 25** | **Cookies/Storage** | **Loeste TTDSG am 14.05.2024 ab** |
| **EinwV (seit 04.2025)** | **Consent-Manager** | **PIMS-Anerkennung** |
| AO § 147 | Aufbewahrung | 10 Jahre Rechnungen |
| HGB § 257 | Handelsbuecher | 6/10 Jahre |
| UWG § 7 Abs. 3 | Bestandskunden | EuGH C-654/23 (Nov 2025): Newsletter ohne separate DSGVO-Einwilligung |
| EU AI Act | Verbote ab 02.2025, Hochrisiko ab 08.2026 | Mitarbeiter-Bewertung = Anhang III |
| DPF | EU-US Data Privacy Framework | Stripe ist DPF-zertifiziert (wackelig — SCCs als Backup) |

## Aufsichtsbehoerde

**LfDI Baden-Wuerttemberg** (zustaendig fuer Stuttgart):
Lautenschlagerstrasse 20, 70173 Stuttgart
Online-Meldung: https://www.baden-wuerttemberg.datenschutz.de/online-meldung/
Schwerpunkte 2024/25: Beschaeftigtendatenschutz, KI, Drittlandtransfer
