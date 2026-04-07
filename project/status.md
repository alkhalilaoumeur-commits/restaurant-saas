# Projektstatus

**Letzte Aktualisierung:** 2026-04-07
**Aktuelle Phase:** Phase 6 Design-System in Arbeit — Theme-Hook + Tailwind + Komponenten-Umbau fertig
**Dashboard:** Auto-Sync Hook aktiv — Dashboard aktualisiert sich bei jeder Dateiänderung automatisch

---

## Was bisher erledigt ist

### Planung (abgeschlossen)
- [x] Tech-Stack entschieden (Node.js + Express + TypeScript, React + Tailwind, PostgreSQL)
- [x] Datenbankschema entworfen (7 Tabellen, Multi-Tenant via restaurant_id)
- [x] API-Endpunkte geplant
- [x] Rollen & Berechtigungen definiert (admin / kellner / kueche)

### Phase 1 – Grundstruktur (abgeschlossen)
- [x] Backend-Struktur angelegt (`app/backend/`)
  - Express + TypeScript Setup
  - JWT-Authentifizierung
  - Multi-Tenant-Middleware
  - Alle 7 API-Routen implementiert
  - Socket.io für Live-Updates
  - PostgreSQL-Anbindung
- [x] Datenbank-Migration erstellt (`app/backend/src/db/migration.sql`)
- [x] Frontend-Struktur angelegt (`app/frontend/`)
  - React + TypeScript + Tailwind + Vite
  - React Router (Admin-Bereich + Gäste-Bereich)
  - Auth-Store (Zustand + LocalStorage)
  - API-Client mit automatischem JWT-Header
  - LoginPage vollständig implementiert
  - Dashboard mit Live-Stats
  - Bestellungen-Page mit Socket.io-Live-Updates
  - Tischplan-Page
  - Gäste-Bestellseite (QR-Code-basiert) vollständig implementiert

---

### Phase 3 – Gäste-Seite (abgeschlossen)
- [x] QR-Codes generieren & drucken (qrcode.react, Einzel- & Sammel-Druck)
- [x] Bestellstatus für Gäste (Socket.io Live-Updates, Status-Tracker)

---

### Phase 4 – SaaS-Features (in Arbeit)
- [x] Restaurant-Registrierung & Onboarding ✅ erledigt 2026-04-05
- [x] Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl) ✅ erledigt 2026-04-05
- [x] Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite) ✅ erledigt 2026-04-05
- [ ] Abonnement-Verwaltung (Mollie)

### Phase 5 – Extras (in Arbeit)
- [x] Statistiken & Berichte ✅ erledigt 2026-04-05
- [x] Dienstplan ✅ erledigt 2026-04-05
- [x] Dark Mode (alle Seiten + Komponenten, Toggle in Einstellungen) ✅ erledigt 2026-04-06
- [x] Dashboard Auto-Sync Hook (PostToolUse → sync-dashboard.js bei jeder Dateiänderung) ✅ erledigt 2026-04-06
- [x] Dashboard erweitert: Roadmap & Todos Tab, Entscheidungen Tab, DSGVO-Status ✅ erledigt 2026-04-06
- [ ] Mehrsprachigkeit (DE/EN)

### Phase 6 – Design-System Bestellseite (in Arbeit)
Basierend auf Marktanalyse (2026-04-06, siehe `project/design-system-analyse.md`):
- [x] Theme-JSON-Schema + TypeScript-Interface definieren ✅ erledigt 2026-04-06
- [x] 6 Preset-Konstanten (Modern, Eleganz, Trattoria, Fresh, Street, Rustikal) ✅ erledigt 2026-04-06
- [x] `useGastroTheme` Hook: Theme → CSS Custom Properties auf `<html>` ✅ erledigt 2026-04-07
- [x] Tailwind-Config: `gastro-*` Farbpalette + `rounded-theme` + `shadow-theme-card` ✅ erledigt 2026-04-07
- [x] Bestellen-Seite + 3 Komponenten (GerichtAuswahl, Warenkorb, BestellStatusTracker) umgebaut ✅ erledigt 2026-04-07
- [ ] DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`
- [ ] API: `/api/restaurant/:id/design` um `theme_config` erweitern
- [ ] Preset-Galerie in Einstellungen
- [ ] Premium Custom-Builder (einmalig 20 EUR)
- [ ] Zahlungsintegration fuer Design-Builder

### Phase 7 – Schichtplan Pro (geplant)
Basierend auf Marktanalyse (2026-04-05, siehe `project/schichtplan-analyse.md`):
- [ ] Drag & Drop Schichtplanung
- [ ] ArbZG-Compliance (Ruhezeiten, Pausen, Max-Stunden)
- [ ] Konflikterkennung (Gelb/Rot-Warnungen)
- [ ] Mitarbeiter-Verfuegbarkeit
- [ ] Schicht-Templates
- [ ] Reservierungs-basierter Personalbedarf (Alleinstellungsmerkmal!)
- [ ] Budget-Overlay
- [ ] Schichttausch (3-Tap-Flow)
- [ ] Push-Benachrichtigungen + Lesebestaetigung

### Phase 8 – Reservierungssystem Pro (geplant)
Basierend auf Marktanalyse (2026-04-06, siehe `project/reservierungssystem-analyse.md`):
- 8 Systeme verglichen: OpenTable, Resy, TheFork, Quandoo, resmio, DISH, Yelp, SevenRooms
- resmio ist gefaehrlichster DACH-Wettbewerber (Flat-Fee, DSGVO, waechst stark)
- Unser Vorteil: QR-Ordering + KDS + Bestellsystem — kein Wettbewerber hat das
- **Phase A (Basis):** Zeitslots, Online-Buchung, E-Mail-Bestaetigung, Self-Service, Widget, Kapazitaet
- **Phase B (Profi):** Floor Plan, Auto-Tischzuweisung, CRM, No-Show, SMS/WhatsApp, Google Reserve
- **Phase C (Differenzierung):** Warteliste, Walk-in, Reservierungs-basierte Personalplanung, Bewertungen

### Architektur-Bereinigung (2026-04-05)
- [x] Supabase komplett entfernt — alle Frontend-Hooks/Seiten auf Express API migriert
- [x] `lib/supabase.ts` gelöscht, `@supabase/supabase-js` aus package.json entfernt
- [x] Multi-Tenancy-Fix: Öffentliche Bestellungen prüfen jetzt Tisch-Restaurant-Zugehörigkeit
- [x] Multi-Tenancy-Fix: Öffentliche Reservierungen prüfen jetzt Restaurant-Existenz

### Dashboard & Tooling (2026-04-06)
- [x] Claude Code PostToolUse Hook erstellt — Dashboard synchronisiert sich automatisch bei jeder Write/Edit-Aktion
- [x] `sync-dashboard.js` erweitert: Roadmap (alle Phasen + Todos), Entscheidungen, DSGVO-Status
- [x] Dashboard: 2 neue Tabs (Roadmap & Todos, Entscheidungen) + Übersichtsseite komplett überarbeitet
- [x] `loadData()` gefixt: SYNCED_DATA hat jetzt immer Priorität über DEFAULT_DATA/localStorage
- [x] DATA_VERSION auf 3 erhöht, Search-Funktion für neue Tabs aktualisiert

### Auth-System Umbau (2026-04-06)
- [x] Rate Limiting auf Login (5 Versuche / 15 Min, express-rate-limit)
- [x] Passwort-Anforderungen verschärft (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)
- [x] Email- und Telefon-Formatvalidierung (Frontend + Backend)
- [x] Restaurant-Code bei Registrierung (auto-generiert, eindeutig, z.B. REST-A7K39M2P)
- [x] Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)
- [x] Öffnungszeiten-Tabelle (pro Wochentag) bei Registrierung
- [x] Automatische Tisch-Erstellung bei Registrierung
- [x] Email-Verifizierung (Token + Bestätigungslink)
- [x] Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort, Chef kennt Passwort nicht)
- [x] Passwort-vergessen Flow (Reset-Link, 1h gültig)
- [x] Email-Service eingerichtet (Nodemailer, Dev: Konsolen-Output)
- [x] 4 neue Frontend-Seiten (Einladung, PasswortVergessen, PasswortZuruecksetzen, EmailVerifizieren)
- [x] Login-Seite: api-Helper statt direktes fetch, Passwort-vergessen Link
- [x] DB-Migration erstellt (migration-auth.sql)

## Nächster Schritt
~~DB-Migration ausführen~~ ✅ erledigt 2026-04-06 → Mitarbeiter-Seite anpassen → Abonnement-Verwaltung (Mollie) → Hosting (Hetzner + Coolify).

---

## Bekannte Probleme / Offene Fragen
- ~~Node.js~~ ✅ installiert (2026-04-04)
- ~~PostgreSQL~~ ✅ installiert (2026-04-04)
- ~~PostgreSQL: Datenbank `restaurant_saas`~~ ✅ existierte bereits (2026-04-04)
- ~~`.env`-Datei~~ ✅ bereits konfiguriert (2026-04-04)
- ~~Datenbank-Migration~~ ✅ alle 8 Tabellen + Seed-Daten vorhanden (2026-04-04)
- Hosting-Setup (Hetzner + Coolify) steht noch aus
- `npm install` im Frontend ausführen (package-lock.json nicht synchron nach Supabase-Entfernung)
