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

---

## 2026-04-09 – Urlaubsverwaltung (Urlaubskonto)

### Was wurde gemacht
- Neue Spalte `urlaubsanspruch_tage` in Tabelle `mitarbeiter` (INTEGER, DEFAULT 20)
- Neuer API-Endpoint: GET /api/abwesenheiten/urlaubskonto?jahr=YYYY
- Berechnung verbrauchter Urlaubstage aus bestehender `abwesenheiten`-Tabelle (typ='urlaub')
- Frontend: Urlaubskonto-Anzeige (Anspruch / Verbraucht / Verbleibend + Fortschrittsbalken)
- Fix: URL-Bug in useAbwesenheiten.ts (Mitarbeiter konnten vorher keine Abwesenheiten eintragen)

### Neue personenbezogene Daten

| Tabelle      | Feld                  | Kategorie             | Rechtsgrundlage                              |
|--------------|-----------------------|-----------------------|----------------------------------------------|
| mitarbeiter  | urlaubsanspruch_tage  | Beschäftigtendaten    | Art. 6(1)(c) DSGVO i.V.m. § 3 BUrlG         |

### Rechtsgrundlage
- Art. 6 Abs. 1 lit. c DSGVO: Verarbeitung erforderlich zur Erfüllung einer rechtlichen Verpflichtung
- § 3 Bundesurlaubsgesetz (BUrlG): Arbeitgeber ist verpflichtet, Mindesturlaub (20 AT / 5-Tage-Woche) zu gewähren und zu dokumentieren

### DSGVO-Bewertung
- Zweck: Urlaubsverwaltung, Arbeitszeitdokumentation gemäß BUrlG
- Erforderlichkeit: ja — ohne Tracking kein Nachweis der BUrlG-Erfüllung
- Verhältnismäßigkeit: ja — nur Arbeitstage-Anzahl, keine inhaltlichen Daten
- Aufbewahrungsfrist: Urlaubsunterlagen mind. 2 Jahre (§ 16 ArbZG analog), Empfehlung: 3 Jahre
- Zugriff: Mitarbeiter sehen nur eigene Daten, Admin sieht alle

### Kein Risiko für Betroffene
- Keine sensiblen Kategorien (Art. 9 DSGVO) betroffen
- Keine Weitergabe an Dritte
- Kein Profiling

---

## 2026-04-25 – Vollstaendiger DSGVO-Audit mit Skill v2 + Web-Recherche

### Was wurde gemacht
- **Skill v2** in `.claude/skills/dsgvo/SKILL.md` komplett neu geschrieben — basierend auf Recherche zu DSGVO 2025/26 (LfDI BW, EnforcementTracker, EuGH-Urteile) + Open-Source Best Practices (Sushegaad GRC Skills, CISO Assistant, Microsoft Presidio, ankane/pdscan, Probo). Neue Features: Ampel-Rating, Artikel-Zitat-Pflicht, 6-Dimensionen-Datenfluss, Vendor-Liste, Skalierungs-Roadmap-Check, AI Act Inventory, TDDDG/EuGH C-654/23.
- **Vendor-Liste** angelegt: `project/dsgvo-vendoren.md` mit Hetzner, Stripe, Zoho, seven.io (geplant), Google Reserve (geplant). Risiko-Bewertung pro Vendor.

### Findings (mit Ampel-Rating)

**🔴 KRITISCH — sofort gefixt:**
- Google Fonts via CDN in `index.html` (Karla + Playfair Display SC) — **LG Muenchen-Urteil 2022, Abmahn-Klassiker**. Fix: `@fontsource/karla` + `@fontsource/playfair-display-sc` per npm installiert, in `main.tsx` lokal eingebunden, CDN-Links + preconnects entfernt.
- Dynamic Theme-Fonts via Google CDN in `useGastroTheme.ts` (Bestellseite, 9 Themes). Fix: `googleFontsUrl` deprecated, dynamischer Loader entfernt — Themes fallen jetzt auf System-Fonts zurueck. Folge-Task: @fontsource fuer alle Theme-Fonts wenn UX wichtig.
- model-viewer-Skript via `ajax.googleapis.com` (Showcase-Theme) — Drittland-Transfer ohne Rechtsgrundlage. Fix: aus index.html entfernt mit Hinweis-Kommentar (npm-Bundling als Folge-Task).
- TTDSG → TDDDG in Datenschutz.tsx + CookieBanner.tsx — Gesetz wurde am 14.05.2024 abgeloest, Bezeichnung musste aktualisiert werden.

**🟡 RISIKO — gefixt:**
- PII in Backend-Logs: `warteliste.ts:166` (gast_name), `sms-gast.ts:55` (telefon), `sms.ts:53` (telefon). Fix: anonymisierte Versionen mit ID-Verweis bzw. `slice(0,4)+***`-Maskierung.
- Datenschutz.tsx erwaehnte Stripe nur kurz — jetzt explizit DPF + SCC Doppelabsicherung (Art. 46 Abs. 2 lit. c DSGVO) + Stripe DPA verlinkt.

**🟢 KONFORM (verifiziert):**
- Multi-Tenant-Isolation: Stichproben in Mitarbeiter.ts, Statistik.ts, Gericht.ts — alle Queries haben restaurant_id im WHERE oder begruendete Ausnahme (Login per globaler Email).
- bcrypt 12 Rounds, Rate-Limiting, helmet, CORS, Trust-Proxy, Auto-DSGVO-Cleanup Cron.
- Frontend: keine PII in console.log gefunden.

### Schema-Hash zum Pruefzeitpunkt
`git log -1 --format=%h restaurant-app/database/schema.sql` → wird beim naechsten Skill-Run mitprotokolliert.

### Auto-Todos (siehe `project/todos.md` Phase "DSGVO Folge")

🟡 model-viewer per npm bundeln wenn 3D-Showcase produktiv genutzt wird
🟡 @fontsource fuer Theme-Fonts (Cormorant, Playfair Display, Lato, Oswald, etc.) wenn Bestellseiten-Themes weiter genutzt werden
🟡 EuGH C-654/23: Newsletter-Hinweis nach UWG § 7(3) im Onboarding einbauen
🟡 Cross-Tenant CI-Tests (Restaurant A darf nie Daten von Restaurant B sehen)
🟡 DB-Encryption at rest auf App-Level (Hetzner Volume reicht aktuell, aber bei Skalierung pflichtgemaess)
🟡 DSFA fuer Mitarbeiter-Modul vorbereiten falls Performance-Tracking eingefuehrt wird (EU AI Act Anhang III)

### Skalierungs-Roadmap-Check

Aktuelle Stufe: **1-5 Kunden (Pilotphase)**.
Kritische Pflichten fuer naechste Stufe (5-20 Kunden):
- Cross-Tenant-Tests in CI-Pipeline
- Externer DSB als freiwilliges Vertrauenssignal (~150 €/Monat)
- DPA-Plattform (heyData/DataGuard) ab ~10 Kunden sinnvoll
- DSFA pruefen falls neue Features

Bei Stufe 20+: DSB **verpflichtend** ab 20 MA (oder externer DSB), BSI Grundschutz-Eigenauskunft, Penetration-Test.

### TypeScript / Smoke-Test
- Backend: clean
- Frontend: clean

---

## 2026-04-25 – Rechts-Set fuer Verkaufsstart (Tag 3 – Folge-Aufgaben)

### Was wurde gemacht

- **Stornierte Reservierungen — 7-Tage-Frist nach Stornierung**: Migration `migration-storno-timestamp.sql` fuegt `storniert_am`-Spalte + DB-Trigger `reservierungen_storno_trigger` hinzu, der bei Status-Wechsel auf `'storniert'` automatisch den Zeitstempel setzt. `ReservierungModel.dsgvoAufraeumen()` erweitert: Anonymisierung jetzt nach 30 Tagen ab Reservierungsdatum ODER 7 Tage nach Stornierung (was zuerst eintritt). Statt DELETE wird anonymisiert, damit Statistik-Aggregate erhalten bleiben.
- **Logfile-Rotation Doku** in `legal/logfile-rotation.md`: Coolify Docker-Driver-Konfiguration (json-file, max-size=10m, max-file=14), Hetzner-Snapshot-Policy auf 14 Tage, Traefik-Access-Log-Optionen. Operativ — muss manuell im Coolify-Dashboard gesetzt werden.
- **AVV/AGB-Versions-Banner fuer Bestandskunden**:
  - Backend: zwei neue Endpunkte in `routes/restaurant.ts` — `GET /rechtsdokumente-status` (vergleicht akzeptierte mit aktueller Version) und `POST /rechtsdokumente-akzeptieren` (admin-only, setzt beide Versionen auf aktuell)
  - Frontend: neue Komponente `components/RechtsdokumenteBanner.tsx` — wird in `Layout.tsx` eingebunden, prueft beim Mount ob Akzeptanz noetig, zeigt amber-Banner mit Pflicht-Checkbox + AGB-/AVV-Link, nur Admin sieht ihn (Demo-Modus + Nicht-Admin ausgeschlossen)
  - Wenn `RECHTSDOKUMENT_VERSION` in `auth.ts` hochgezaehlt wird, sehen alle Bestandskunden beim naechsten Login den Banner und muessen erneut akzeptieren — Pflicht aus Art. 7 Abs. 1 DSGVO + § 12 AGB.
- **Content-Security-Policy (CSP)** in `server.ts` aktiviert (nur in Production):
  - Strikt: `default-src 'self'`, `script-src 'self'`, kein externes JS
  - Restaurant-Bilder erlaubt aus beliebigen `https:`-Quellen (Speisekarte mit externen Bildern)
  - `frame-ancestors *` bewusst offen, damit Buchungs-Widget auf fremden Restaurant-Seiten als iframe lauffaehig bleibt
  - `form-action` erlaubt Stripe-Redirect
  - Im Dev (`NODE_ENV != production`) bleibt CSP aus, weil Vite-HMR `unsafe-eval` braucht
  - Vollstaendige Dokumentation der Direktiven + Begruendung in `legal/csp-konfiguration.md`, inkl. Test-Checkliste fuer Production-Deploy

### TypeScript-Status
- Backend: clean
- Frontend: clean
- Smoke-Test: `GET /api/restaurant/rechtsdokumente-status` ohne Auth → HTTP 401 ✅, HSTS aktiv ✅, CSP im Dev wie erwartet aus ✅

### Wichtig fuer den naechsten Production-Deploy
- ⚠️ CSP wird beim ersten Production-Deploy SCHARF — Browser-Console pruefen ob keine Violations geloggt sind (Test-Checkliste in `legal/csp-konfiguration.md`)
- ⚠️ Coolify Docker-Driver-Konfiguration einmalig setzen (siehe `legal/logfile-rotation.md`)
- ⚠️ Bei AGB-Update: `RECHTSDOKUMENT_VERSION` in `auth.ts` hochzaehlen → alle Bestandskunden sehen den Banner

---

## 2026-04-25 – Rechts-Set fuer Verkaufsstart (Tag 2 – Backend-Hardening)

### Was wurde gemacht
- **helmet.js** installiert und in `server.ts` aktiviert. Konfiguration: HSTS (31536000s), X-Content-Type-Options, Referrer-Policy: no-referrer, COOP, COEP-off, CORP cross-origin (fuer Widget-iframes). `frameguard` und `contentSecurityPolicy` bewusst AUS — Widget muss iframe-bar bleiben, CSP folgt in eigenem Task nach Asset-Inventur. Verifiziert via `curl -I /api/health` — HSTS + nosniff + no-referrer aktiv.
- **Passwort-Hash NULL bei Deaktivierung**: `MitarbeiterModel.aktualisieren()` setzt jetzt automatisch `passwort_hash = NULL` wenn `aktiv = false` gesetzt wird. Login-Check in `auth.ts:258` prueft schon `!mitarbeiter.passwort_hash` → ein deaktivierter Account kann sich nicht mehr einloggen, auch wenn das alte Passwort bekannt waere. (Art. 5 Abs. 1 lit. e DSGVO – Speicherbegrenzung).
- **Allergie-Hinweis im Anmerkungs-Feld** (`pages/Buchen.tsx`): Hinweis nach Art. 9 DSGVO unter dem Textarea ergaenzt — Gast wird informiert, dass Eintrag von Gesundheitsdaten als ausdrueckliche Einwilligung gilt.
- **AVV-/AGB-Akzeptanz bei Registrierung**: 
  - Migration `database/migration-rechtsdokumente.sql`: 4 neue Spalten auf `restaurants` (agb_akzeptiert_am, agb_version, avv_akzeptiert_am, avv_version)
  - Backend `auth.ts`: Konstante `RECHTSDOKUMENT_VERSION = '2026-04-25'`, Pflicht-Check + UPDATE in der Registrierungs-Transaktion
  - Frontend `pages/Registrieren.tsx`: Checkbox in Schritt 5, Submit-Button erst aktiv wenn akzeptiert, AVV-Vertrag verlinkt auf `/legal/avv-vertrag.md`
  - AVV/Subunternehmer-Liste/TOM in `frontend/public/legal/` kopiert (statisches Serving)
- **DSGVO-Endpunkte fuer Restaurant-Inhaber** (Art. 15, 17, 20 DSGVO):
  - `GET /api/restaurant/datenexport` (admin-only) → exportiert ALLE personenbezogenen Daten als JSON (25 Tabellen, passwort_hash explizit ausgeschlossen). Tabellen-Whitelist in `EXPORT_TABELLEN` — bei neuen Tabellen mit restaurant_id muss diese erweitert werden!
  - `POST /api/restaurant/loeschungs-anfrage` (admin-only) → sendet strukturierte Email an `kontakt@serve-flow.org` (manueller Loesch-Prozess wegen § 147 AO Aufbewahrungspflicht fuer Rechnungsdaten)
  - Frontend: Neuer Tab "Datenschutz" in Einstellungen mit beiden Aktionen + Pflicht-Bestaetigungs-Checkbox vor Loeschung
  - `kontaktEmailSenden()` Helper in `services/email.ts` ergaenzt
- **Datenpannen-Runbook** in `legal/datenpannen-runbook.md` — 72h-Meldepflicht-Ablauf, Risikoklassifizierung, Aufsichtsbehoerden-Kontakt LfDI BW, Checkliste, Auftraggeber-Benachrichtigung nach § 7 AVV.

### TypeScript-Status
- Backend: `npx tsc --noEmit` clean
- Frontend: `npx tsc --noEmit` clean
- helmet-Headers via `curl -I http://localhost:3001/api/health` verifiziert

### Wichtige offene Punkte fuer Tag 3
- [ ] **CSP konfigurieren** (Folge-Task) — bewusst noch nicht aktiv, weil Asset-Quellen-Inventur noetig (Bilder von beliebigen URLs in Speisekarte? eigene CDN? etc.)
- [ ] **Server-Logfile-Rotation** auf 14 Tage konfigurieren (Coolify oder Hetzner-seitig)
- [ ] **Stornierte Reservierungen nach 7 Tagen automatisch loeschen** (in `services/erinnerungen.ts` oder neuer Cron-Job)
- [ ] **AVV-Versions-Banner**: Wenn `RECHTSDOKUMENT_VERSION` hochgezaehlt wird, alle bestehenden Restaurants mit altem `agb_version` muessen erneut akzeptieren (UI-Banner im Dashboard)
- [ ] **Anwaltsreview**: alle 3 Frontend-Seiten + AVV + TOM + Datenpannen-Runbook vor erstem Verkauf

---

## 2026-04-25 – Rechts-Set fuer Verkaufsstart (Tag 1)

### Was wurde gemacht
Komplett-Umsetzung der rechtlichen Pflicht-Bausteine fuer den Verkauf an Restaurant-Kunden:

**Frontend-Seiten (oeffentlich erreichbar):**
- `restaurant-app/frontend/src/pages/Impressum.tsx` — § 5 TMG, § 2 DL-InfoV, Kleinunternehmer-Hinweis (§ 19 UStG), MStV-Verantwortlicher, OS-Plattform, B2B-Hinweis (§ 36 VSBG)
- `restaurant-app/frontend/src/pages/Datenschutz.tsx` — Art. 13/14 DSGVO mit Trennung Eigen-Verantwortung vs. Auftragsverarbeitung fuer Restaurant-Gaeste, alle Verarbeitungstaetigkeiten + Auftragsverarbeiter, Aufsichtsbehoerde LfDI BW
- `restaurant-app/frontend/src/pages/AGB.tsx` — B2B-SaaS-Vertrag (§ 14 BGB), Stuttgart als Gerichtsstand, Haftungsbeschraenkung auf Jahresgebuehr bei leichter Fahrlaessigkeit, Aenderungs-Klausel mit 6-Wochen-Widerspruchsrecht
- `restaurant-app/frontend/src/components/CookieBanner.tsx` — TTDSG-konformer Hinweis (nur technisch notwendige Speicherung, keine Einwilligung erforderlich)
- `restaurant-app/frontend/src/components/LegalLinks.tsx` — wiederverwendbare Footer-Links
- Routes in `App.tsx` registriert + CookieBanner global eingebunden
- Layout.tsx + Login.tsx haben jetzt Rechts-Links im Footer

**Vertragsdokumente (Markdown, in `legal/`):**
- `legal/avv-vertrag.md` — Auftragsverarbeitungsvertrag nach Art. 28 DSGVO (Kunde = Verantwortlicher, ServeFlow = Auftragsverarbeiter)
- `legal/auftragsverarbeiter-liste.md` — Anlage 2 zum AVV: Hetzner, Stripe, Zoho EU, seven.io (geplant), Google Reserve (geplant)
- `legal/tom-massnahmen.md` — Anlage 1 zum AVV: Technisch-organisatorische Massnahmen nach Art. 32 DSGVO

### DSGVO-relevante Korrekturen am bestehenden Code
- Datenschutzerklaerung listet **Zoho Mail (EU)** statt Gmail als E-Mail-Auftragsverarbeiter — Gmail wurde bereits am 2026-04-25 entfernt (siehe Memory `project_zoho_email_setup.md`)
- Mollie/Stripe-Korrektur: Stripe ist seit 2026-04-16 produktiv, Mollie wurde nie genutzt. `entscheidungen.md` und `projektgrundlage.md` korrigiert.

### Wichtige offene Punkte fuer Tag 2 (Backend-Hardening)
- [ ] `helmet.js` installieren + sichere HTTP-Headers (CSP, X-Frame-Options, HSTS)
- [ ] Passwort-Hash auf NULL setzen bei Mitarbeiter-Deaktivierung
- [ ] Allergie-Hinweis im Anmerkungs-Feld der Buchungsseite ("Bitte keine Gesundheitsdaten ohne Einwilligung")
- [ ] Account-Loeschung + JSON-Export fuer Restaurant-Inhaber (Art. 15, 17, 20 DSGVO)
- [ ] Gast-Selbst-Loeschung per Token-Link
- [ ] Server-Logfile-Rotation 14 Tage konfigurieren

### Wichtige offene Punkte fuer Tag 3 (Doku/Prozesse)
- [ ] Datenpannen-Runbook (72h-Meldepflicht-Ablauf)
- [ ] AVV vor Vertragsschluss in der Registrierung anzeigen + Akzeptanz protokollieren
- [ ] Anwaltsreview der drei Frontend-Seiten + AVV (vor erstem zahlenden Kunden)

### Nicht erledigt — bewusst nicht in Scope
- [ ] Berufshaftpflicht-Versicherung — empfohlen, aber kein Code-Thema
- [ ] Anwaltliche Pruefung — der User soll das vor erstem Verkauf machen lassen

---

## 2026-04-11 – Google Reserve Integration + DSGVO-Check

### Was wurde gemacht
- Google als neue `ReservierungQuelle` hinzugefügt (`'google'`)
- `?quelle=google` URL-Parameter in Buchungs-Route implementiert
- Google Reserve Webhook-Endpunkt (`/api/google-reserve/webhook`) als Infrastruktur angelegt (noch nicht aktiv)
- DSGVO-Check durchgeführt

### Befunde & Fixes

#### ❌ Fix: Fake-Email entfernt (Art. 17 DSGVO)
**Problem:** Google Reserve liefert manchmal keine Email. In `google-reserve.ts` wurde eine Fake-Adresse (`google-XYZ@placeholder.local`) eingesetzt. Das verhindert das Recht auf Löschung, weil der Gast nicht mehr per Email-Suche gefunden werden kann.

**Fix:** `email: email?.toLowerCase() ?? null` — null statt Fake-Adresse. Das DB-Schema erlaubt `email` nullable in Reservierungen.

#### ❌ Fix: Email-Adressen aus Server-Logs entfernt (Art. 5 Abs. 1 lit. e)
**Problem:** `erinnerungen.ts` schrieb `console.log("24h gesendet an user@email.de")`. Bei externer Log-Weiterleitung würden personenbezogene Emails in Log-Dienste fließen.

**Fix:** Ersetzt durch `console.log("24h gesendet (Reservierung ${id})")`.

### Offene Punkte (vor Aktivierung des Google-Webhooks)
- **AVV mit Google** (Art. 28 DSGVO): Wenn Google als Datenquelle aktiv wird, muss ein Auftragsverarbeitungsvertrag mit Google vorliegen. Google Reserve Partner erhalten diesen automatisch.
- **DSGVO-Einwilligung**: Google holt die Einwilligung auf ihrer Seite ein. Im Partnervertrag ist dokumentiert, welche Rechtsbasis gilt.

### Neue personenbezogene Daten (Google-Kanal)
| Quelle | Daten | Rechtsgrundlage | Aufbewahrung |
|---|---|---|---|
| Google Reserve (geplant) | Name, Email (optional), Telefon (optional), Buchungs-ID | Art. 6(1)(b) DSGVO — Vertragserfüllung | 30 Tage (wie alle Reservierungen) |
