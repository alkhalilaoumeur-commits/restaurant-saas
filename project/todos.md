# Todo-Liste

## Jetzt dran
- [x] Node.js installieren (via nvm, Version 20) ✅ erledigt 2026-04-04
- [x] PostgreSQL installieren ✅ erledigt 2026-04-04
- [x] PostgreSQL: Datenbank `restaurant_saas` anlegen ✅ erledigt 2026-04-04
- [x] `.env` konfigurieren und Backend starten (`npm run dev`) ✅ erledigt 2026-04-04
- [x] Datenbank-Migration ausführen (`migration.sql`) ✅ erledigt 2026-04-04

## Phase 1 – Grundstruktur ✅ (Codestruktur fertig)
- [x] Backend-Grundstruktur (Node.js + Express + TypeScript)
- [x] Datenbankschema in PostgreSQL-Migration erstellt
- [x] Multi-Tenant-Logik (restaurant_id überall)
- [x] Authentifizierung (Login, JWT, Rollen)
- [x] Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)
- [x] Socket.io für Live-Updates
- [x] Frontend-Grundstruktur (React + TypeScript + Tailwind)
- [x] Gäste-Bestellseite (QR-Code-basiert)

## Phase 2 – Admin-Dashboard (in Arbeit)
- [x] Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht) ✅ erledigt 2026-04-05
- [x] Speisekarte verwalten (Kategorien + Gerichte CRUD) ✅ erledigt 2026-04-04
- [x] Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link) ✅ erledigt 2026-04-04
- [x] Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken) ✅ erledigt 2026-04-05
- [x] Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern) ✅ erledigt 2026-04-05

## Phase 3 – Gäste-Seite ✅ (komplett)
- [x] Öffentliche Bestellseite mit QR-Code-Parameter
- [x] Speisekarte anzeigen (nach Kategorien)
- [x] Warenkorb + Bestellung abschicken
- [x] QR-Codes generieren & drucken pro Tisch ✅ erledigt 2026-04-05
- [x] Bestellstatus für Gäste (Socket.io) ✅ erledigt 2026-04-05

## Phase 4 – SaaS-Features
- [x] Restaurant-Registrierung & Onboarding ✅ erledigt 2026-04-05
- [x] Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl) ✅ erledigt 2026-04-05
- [x] Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite) ✅ erledigt 2026-04-05
- [x] Abonnement-Verwaltung (Mollie) — Option B (Einzelzahlung + Webhook), Rabattcodes, Paywall ✅ erledigt 2026-04-16

## Phase 5 – Extras
- [x] Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien) ✅ erledigt 2026-04-05
- [x] Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler) ✅ erledigt 2026-04-05
- [x] Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard) ✅ erledigt 2026-04-06
- [x] Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status) ✅ erledigt 2026-04-06
- [ ] Mehrsprachigkeit (DE/EN)

## Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)
- [x] Theme-JSON-Schema + TypeScript-Interface definieren ✅ erledigt 2026-04-06
- [x] 6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal) ✅ erledigt 2026-04-06
- [x] `useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement ✅ erledigt 2026-04-07
- [x] Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen ✅ erledigt 2026-04-07
- [x] Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut ✅ erledigt 2026-04-07
- [x] DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente ✅ erledigt 2026-04-07
- [x] BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid) ✅ erledigt 2026-04-07
- [ ] DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`
- [ ] API: `/api/restaurant/:id/design` um `theme_config` erweitern
- [ ] Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails
- [ ] Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)
- [ ] Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen
- [ ] Paywall-UI: "Design-Builder freischalten" mit Vorschau
- [ ] Mobile-Vorschau im Builder + "Zurueck zum Preset" Reset

## Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)
- [x] Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten) ✅ erledigt 2026-04-09
- [x] Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren) ✅ erledigt 2026-04-09
- [x] ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag) ✅ erledigt 2026-04-09
- [x] Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden) ✅ erledigt 2026-04-09
- [x] Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren) ✅ erledigt 2026-04-09
- [x] Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io) ✅ erledigt 2026-04-09
- [x] Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden) ✅ erledigt 2026-04-12
- [x] Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl) ✅ erledigt 2026-04-09
- [x] Budget-Overlay (Personalkosten live waehrend der Planung anzeigen) ✅ erledigt 2026-04-09
- [x] Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung) ✅ erledigt 2026-04-11
- [ ] Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)
- [ ] Lesebestaetigung fuer veroeffentlichte Dienstplaene

## Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)

### Phase A: Basis-Reservierung (Minimum Viable) ✅ (erledigt 2026-04-07)
- [x] Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße) ✅ erledigt 2026-04-07
- [x] Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten) ✅ erledigt 2026-04-07
- [x] E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron) ✅ erledigt 2026-04-07
- [x] Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail) ✅ erledigt 2026-04-07
- [x] Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen) ✅ erledigt 2026-04-07
- [x] Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung) ✅ erledigt 2026-04-07
- [x] QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package) ✅ erledigt 2026-04-07
- [x] Socket.io Live-Updates bei neuer/geänderter Reservierung ✅ erledigt 2026-04-07
- [x] Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit) ✅ erledigt 2026-04-07
- [x] Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite) ✅ erledigt 2026-04-07

### Phase B: Professionelles Reservierungssystem
- [x] **Räumlicher Tischplan / Floor Plan Editor** ✅ erledigt 2026-04-09
  - [x] DB-Migration: `bereiche`-Tabelle + Positionsfelder (`pos_x`, `pos_y`, `breite`, `hoehe`, `rotation`, `form`) in `tische` ✅
  - [x] Backend: CRUD-Routes für Bereiche + Tisch-Positionierung API ✅
  - [x] Frontend: react-konva Canvas mit Drag & Drop Tischplatzierung ✅
  - [x] Tischformen: Rund, Quadrat, Rechteck, Bar/Theke ✅
  - [x] Bereiche/Zonen: Innen, Terrasse, Bar, Privat (frei benennbar) ✅
  - [x] Grid-Snapping + Rotation für saubere Platzierung ✅
  - [x] Live-Status-Farben (frei=grün, besetzt=rot, zahlung=gelb) ✅
  - [x] Toolbar: Zoom, Tisch-Typen Seitenleiste, Bearbeiten/Live-Modus ✅
  - [x] Verbindung zu Reservierungen (Tisch per Klick zuweisen) ✅ erledigt 2026-04-09
- [x] Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen) ✅ erledigt 2026-04-09
- [ ] Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)
- [ ] No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)
- [ ] SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)
- [x] Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit) ✅ erledigt 2026-04-11

### Phase C: Differenzierung
- [x] Warteliste (Walk-in + Online, automatisches Nachruecken per Email) ✅ erledigt 2026-04-18
- [x] Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung) ✅ erledigt 2026-04-09
- [x] Reservierungs-basierte Personalplanung (Reservierungen → Personalbedarf-Empfehlung) ✅ erledigt 2026-04-09 (Phase 7)
- [x] Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen) ✅ erledigt 2026-04-15
- [x] Erlebnis-Buchung (Erlebnis-Pakete + 3-Schritt-Buchung + Stripe-Prepayment) ✅ erledigt 2026-04-19

## Extras/Modifier-System ✅ (erledigt 2026-04-08)
- [x] DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen ✅
- [x] Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading) ✅
- [x] Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras) ✅
- [x] Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern ✅
- [x] Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra ✅
- [x] useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts) ✅
- [x] GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis ✅
- [x] Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige ✅
- [x] BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt ✅
- [x] Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte) ✅ erledigt 2026-04-08
- [x] DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`) ✅ erledigt 2026-04-08

## Auth-System Umbau ✅ (erledigt 2026-04-06)
- [x] Rate Limiting auf Login (5 Versuche / 15 Min)
- [x] Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)
- [x] Email- und Telefon-Formatvalidierung
- [x] Restaurant-Code (auto-generiert bei Registrierung)
- [x] Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)
- [x] Öffnungszeiten-Tabelle + automatische Tisch-Erstellung
- [x] Email-Verifizierung (Token + Bestätigungslink)
- [x] Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)
- [x] Passwort-vergessen Flow (Reset-Link, 1h gültig)
- [x] Email-Service (Nodemailer)
- [x] DB-Migration (migration-auth.sql)

## Nächstes Todo
- [x] 🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler ✅ erledigt 2026-04-07
- [x] 🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut ✅ erledigt 2026-04-07
- [x] 🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt ✅ erledigt 2026-04-07
- [x] 🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt ✅ erledigt 2026-04-07
- [x] Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow ✅ erledigt 2026-04-07
- [x] DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`) ✅ erledigt 2026-04-06
- [x] SMTP-Daten in `.env` konfigurieren (Gmail) ✅ erledigt 2026-04-06
- [x] Email-Verifizierung inline bei Registrierung (6-stelliger Code) ✅ erledigt 2026-04-06
- [x] SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole) ✅ erledigt 2026-04-06
- [x] Mitarbeiter-Seite im Frontend an Einladungssystem anpassen ✅ erledigt 2026-04-06

## Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)
- [x] Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3) ✅
- [x] Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1) ✅
- [x] "Zum Kalender hinzufuegen" auf Bestaetigungsseite (Google Calendar + iCal-Download) ✅
- [x] DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen` ✅
- [x] Backend + Admin-UI + Detailseite erweitert ✅

## Bugfix + Feature-Session 2026-04-15
- [x] 🟡 Dienstplan MA-Ansicht: `/mitarbeiter/alle`-Endpoint + useMitarbeiter für Nicht-Admins ✅
- [x] 🟡 Bestellung Dankeschön-Screen: `status === 'offen'` zeigt Bestätigungs-Banner ✅
- [x] 🟡 no_show Cronjob: `starteNoShowCron()` in server.ts, alle 15 Min ✅
- [x] 🟡 Speisekarte Reihenfolge: ↑↓ Buttons für Kategorien + Gerichte ✅
- [x] 🟡 Telefon-Validierung Backend (buchung.ts) ✅
- [x] 🟡 Preis ≥ 0 Validierung Backend (speisekarte.ts) ✅
- [x] 🟡 Bestellmenge 1–99 Validierung Backend (bestellungen.ts) ✅
- [x] 🟡 Leere Kategorien in Admin-Speisekarte ausgeblendet ✅
- [x] 🟡 Profilbild-System: foto_url in DB-Schema + Backend-Routes + useMitarbeiter-Hook + MitarbeiterZeile Upload-UI ✅

## Bekannte Bugs (Bugfix-Session 2026-04-13)

- [x] 🔴 **KRITISCH: DB-Schema `quelle` CHECK fehlt `'google'`** — `schema.sql:219` gefixt: `'google'` zur Constraint hinzugefügt. ✅ erledigt 2026-04-13
- [x] 🔴 **KRITISCH: Socket.io Room-Namen falsch in `reservierungen.ts`** — `io.to(restaurantId)` → `io.to(\`restaurant:${restaurantId}\`)` an 3 Stellen. ✅ erledigt 2026-04-13
- [x] 🟡 **MITTEL: Socket.io Room-Namen falsch in `walk-ins.ts`** — Gleicher Fix, 3 Stellen. ✅ erledigt 2026-04-13
- [x] 🔴 **KRITISCH: Registrierung "Email nicht verifiziert" obwohl Code bestätigt** — `verifiedTokens` war eine In-Memory Map, die bei Server-Neustart (nodemon) geleert wurde. Fix: Token jetzt als signiertes JWT ausgestellt (`verifTokenErstellen`/`verifTokenPruefen`) → kein Server-State nötig. ✅ erledigt 2026-04-13

## Vor Release (Pflicht!)
- [x] E-Mail-Vorlagen umgestalten — professionelles ServeFlow-Design mit Dark-Header, Blue/Cyan-Gradient, QR-Code, klaren CTAs ✅ erledigt 2026-04-16
- [x] Email-Benachrichtigung bei Abwesenheits-Konflikt — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind ✅ erledigt 2026-04-23
- [ ] SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus
- [ ] SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)

## Marketing-Website (serve-flow.org)
- [x] Domain serve-flow.org gekauft + auf Coolify/Hetzner verbunden ✅
- [ ] Landing Page bauen: Hero, Features, Preise (3 Pläne), CTA "Jetzt starten"
- [ ] Impressum einbauen (Pflicht für Stripe-Verifizierung)
- [ ] Datenschutzerklärung einbauen
- [ ] AGB einbauen
- [ ] "Jetzt starten" CTA → Registrierung in der App

## Phase 9 – Inventurmanagement ✅ (erledigt 2026-04-18)
- [x] Inventar-Datenbank: Zutaten/Artikel mit Einheit, Mindestbestand, Kategorie ✅
- [x] Lagerbestand erfassen + manuell anpassen (Eingänge, Abgänge, Korrekturen) ✅
- [x] Automatischer Abzug bei Bestellung bezahlt (Rezeptur: Gericht → Zutaten-Verbrauch) ✅
- [x] Mindestbestand-Alarm (Email an Admin wenn Artikel nach Bestellung unter Schwellenwert fällt) ✅
- [x] Lieferanten-Verwaltung (Name, Kontakt, Liefertage) ✅
- [x] Bestellvorschläge (Artikel unter Mindestbestand — rotes Banner im Dashboard) ✅
- [x] Inventur-Auswertung (Verbrauch + Kosten pro 7/14/30/90 Tage) ✅

## Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18
- [x] DB-Migration: `abo_plan` Spalte auf `restaurants` + `plan` auf `zahlungen` ✅
- [x] Backend: `/api/abo/checkout` — Plan als Parameter, Preis aus PLAN_PREISE (29€/59€/99€) ✅
- [x] Backend: `/api/abo/status` gibt `abo_plan` + `plan_preise` zurück ✅
- [x] Backend: `zahlungAbschliessen` setzt `abo_plan` beim Restaurant ✅
- [x] Frontend: `usePlan()` Hook — `hatZugang(feature)` prüft Plan-Rang ✅
- [x] Frontend: `PaywallKarte` Komponente — gesperrtes Feature + Upgrade-Hinweis ✅
- [x] Frontend: Einstellungen Abo-Tab — 3 Plan-Karten (Basis/Standard/Pro) mit Features ✅
- [x] Frontend: Guards auf Inventur (Pro), Erlebnisse (Pro), Gäste-CRM (Standard), Dienstplan (Standard) ✅
- [ ] Stripe: 3 Produkte + Preise anlegen (29€, 59€, 99€) im Stripe-Dashboard (manuell)
- [ ] Backend: Mitarbeiter-Limit pro Plan API-seitig durchsetzen (Basis: 3, Standard: 10)

## Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)

> Code wurde aus der App entfernt. Grund: ready2order nutzt OAuth-Flow (kein einfacher API-Key), orderbird hat keine öffentliche API. Erst echte Partner-Zugänge holen, dann korrekt implementieren.
> DB-Tabellen (`kss_konfiguration`, `kss_log`) bleiben in der DB — kein Datenverlust.

### Vorarbeit erledigt (Konzept + erster Code-Entwurf)
- [x] Architektur definiert: Generic Webhook + Adapter-Pattern + AES-256 Verschlüsselung + 3x Retry + Alert-Email
- [x] Adapter-Entwürfe: orderbird, ready2order, Generic Webhook

### Nächste Schritte wenn wir es angehen
- [ ] **Voraussetzung:** Developer Token bei ready2order beantragen (ready2order.com/en/api/)
- [ ] **Voraussetzung:** ISV-Partner-Antrag bei orderbird stellen (orderbird.com/en/isv-partner-request) + Email an development@orderbird.com
- [ ] **Voraussetzung:** Lightspeed Developer Portal registrieren (developers.lightspeedhq.com)
- [ ] OAuth-Flow für ready2order implementieren (3-Stufen: Developer Token → Grant Token → Account Token)
- [ ] Adapter korrekt nach echten API-Docs bauen (orderbird, ready2order, Lightspeed)
- [ ] Rückrichtung: Zahlungen von Kasse → ServeFlow Status auf 'bezahlt' setzen (Webhooks)
- [ ] Menü-Sync: Speisekarte aus KSS importieren
- [ ] Custom-Integration als Paid Service (299€ einmalig für andere Systeme mit API)
- [ ] Persistent Retry-Queue (DB-basiert, überlebt Server-Neustart)

## Irgendwann
- [ ] Mobile App (falls gewünscht)
- [ ] Kundenbewertungen
- [ ] Wartezeit-Schätzung

## ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)

> ⚠️ Diese Punkte sind NICHT priorisiert. Vor Umsetzung: mit echten Restaurants validieren und gemeinsam entscheiden. Gedacht als ServeFlow 2.0 nach erstem stabilen Release.

### 💰 Umsatz-Features
- [ ] Trinkgeld-System — Gäste können bei Zahlung digital Trinkgeld geben (%, feste Beträge)
- [ ] Split-Bill — Rechnung auf mehrere Personen aufteilen
- [ ] Prepayment bei Reservierung — Anzahlung für große Gruppen (ab 6 Personen) direkt bei Buchung
- [ ] Bon-Drucker-Anbindung — ESC/POS-Protokoll für Küchenbons (Star, Epson)
- [ ] Tagesangebote / Happy Hour — zeitgesteuerte Rabatte auf der Bestellseite

### 📊 Daten & Insights
- [ ] Kassenbuch-Export — Tagesabschluss als PDF/CSV für Steuerberater
- [ ] Personalkosten vs. Umsatz Ratio — live im Dashboard (Ziel: unter 30%)
- [ ] Gerichtanalyse — welche Gerichte werden zusammen bestellt (Cross-Sell-Hinweise)
- [ ] Auslastungs-Heatmap — wann ist das Restaurant voll (nach Wochentag/Stunde)

### 📱 Gäste-Erlebnis
- [ ] Digitale Speisekarte ohne Bestellfunktion — reiner Anzeige-Modus
- [ ] Allergen-Filter auf Bestellseite — Gäste filtern nach Laktose/Gluten etc.
- [ ] Geburtstagsautomatisierung — Email/SMS am Geburtstag mit Rabattcode
- [ ] Loyalty-Punkte — digitale Stempelkarte (10 Besuche → 1 gratis)
- [ ] Gast-Feedback nach Besuch — automatische Email 2h nach Abreise

### 🔧 Operations
- [ ] Küchen-Display-System (KDS) — separater Bildschirm für Küche statt Bon-Drucker
- [ ] Inventur-Warnschwellen — Push wenn Bestand unter X fällt (Echtzeit)
- [ ] Tischstatus-Timeline — wann bestellt, wann geliefert, wann bezahlt
- [ ] Öffnungszeiten-Ausnahmen — Feiertage, Betriebsurlaub automatisch sperren

### 🤝 Integrationen
- [ ] DATEV-Export — Buchhaltungsdaten für deutschen Steuerberater
- [ ] Meta/Google Ads Conversion-Tracking — Reservierungen als Events
- [ ] Zapier/Make-Webhook — für externe Automatisierungen
