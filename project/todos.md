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
- [ ] Abonnement-Verwaltung (Mollie)

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
- [ ] Dienstplan fuer Mitarbeiter sichtbar machen (aktuell nur Admin — Kellner/Kueche muessen eigene Schichten sehen)
- [ ] Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)
- [ ] ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)
- [ ] Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)
- [ ] Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen)
- [ ] Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)
- [ ] Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)
- [ ] Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)
- [ ] Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)
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

### Phase B: Professionelles Reservierungssystem
- [ ] **Räumlicher Tischplan / Floor Plan Editor** (Priorität!)
  - [ ] DB-Migration: `bereiche`-Tabelle + Positionsfelder (`pos_x`, `pos_y`, `breite`, `hoehe`, `rotation`, `form`) in `tische`
  - [ ] Backend: CRUD-Routes für Bereiche + Tisch-Positionierung API
  - [ ] Frontend: react-konva Canvas mit Drag & Drop Tischplatzierung
  - [ ] Tischformen: Rund, Quadrat, Rechteck, Bar/Theke
  - [ ] Bereiche/Zonen: Innen, Terrasse, Bar, Privat (frei benennbar)
  - [ ] Grid-Snapping + Rotation für saubere Platzierung
  - [ ] Live-Status-Farben (frei=grün, besetzt=rot, reserviert=gelb)
  - [ ] Toolbar: Zoom, Undo, Speichern, Tisch-Typen Seitenleiste
  - [ ] Verbindung zu Reservierungen (Tisch per Klick zuweisen)
- [ ] Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)
- [ ] Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)
- [ ] No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)
- [ ] SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)
- [ ] Google Reserve Integration (>50% aller Reservierungen in DE kommen ueber Google Maps)

### Phase C: Differenzierung
- [ ] Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)
- [ ] Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)
- [ ] Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)
- [ ] Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)
- [ ] Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)

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

## Vor Release (Pflicht!)
- [ ] E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)
- [ ] SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus
- [ ] SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)

## Irgendwann
- [ ] Mobile App (falls gewünscht)
- [ ] Kundenbewertungen
- [ ] Wartezeit-Schätzung
