# Projektstatus

**Letzte Aktualisierung:** 2026-04-11
**Aktuelle Phase:** Phase 7 Schichtplan Pro — Schichttausch 3-Tap-Flow ✅
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

### Phase 8A – Reservierungssystem Pro Basis ✅ (erledigt 2026-04-07)
- [x] DB-Migration (neue Felder auf reservierungen + restaurants)
- [x] Verfügbarkeits-Logik (On-the-fly Slot-Berechnung, Verweilzeit nach Gruppengröße)
- [x] Öffentliche Buchungs-API (6 Endpunkte, kein Auth nötig)
- [x] Email-Templates (Bestätigung, Erinnerung, Stornierung, Umbuchung)
- [x] Erinnerungs-Cron (node-cron, alle 15 Min, 24h + 3h vorher)
- [x] Öffentliche Buchungsseite (3-Schritt-Flow: Datum → Slot → Kontakt)
- [x] Gast-Self-Service (Stornieren + Umbuchen per Buchungs-Token)
- [x] Admin-Verbesserungen (Quelle-Badge, Email-Anzeige, Kapazität)
- [x] Buchungswidget (iframe-Snippet in Einstellungen)
- Health Check: 50/50 bestanden ✅

### Phase 8B – Floor Plan Editor ✅ (erledigt 2026-04-09)
Visueller Tischplan-Editor basierend auf Marktrecherche (project/tischplan-recherche.md):
- [x] DB-Migration: `bereiche`-Tabelle + 7 Positionsfelder auf `tische` (form, pos_x/y, breite/hoehe, rotation, bereich_id) ✅
- [x] Backend: Bereich-Model + CRUD-Routes + Tisch-Batch-Position-Update ✅
- [x] react-konva + konva installiert (Canvas-basierter Editor) ✅
- [x] GrundrissEditor: Tische als Formen auf Canvas (Rund, Quadrat, Rechteck, Bar) ✅
- [x] Drag & Drop mit Grid-Snapping (20px) + Position speichern ✅
- [x] Transformer: Resize + Rotation (Eck-Handles, Min-Größe 40px) ✅
- [x] Seitenleiste: 6 Tisch-Vorlagen (Rund 2er/4er, Quadrat 4er, Rechteck 6er/8er, Bar 2er) ✅
- [x] Bereiche/Zonen: Tab-Filter, Erstellen/Löschen, Tisch-Zuordnung per Dropdown ✅
- [x] Live-Modus: Status-Farben (grün/rot/gelb) + Klick zum Status wechseln ✅
- [x] Zwei Ansichten: Grundriss (Canvas) + Liste (Karten-Grid) ✅
- [x] QR-Code-System beibehalten (Einzel-/Sammel-Druck) ✅
- [x] Tisch-Zuweisung per Klick im Tischplan (Live-Modus: freien Tisch → Reservierung zuweisen) ✅ erledigt 2026-04-09
- [ ] Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen)
- [ ] Gäste-CRM (Profile, Tags, Besuchshistorie, Allergien)
- [ ] No-Show-Management (Tracking, Score, optional Kreditkartengarantie)
- [ ] SMS/WhatsApp-Erinnerungen
- [ ] Google Reserve Integration

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
Automatische Tischzuweisung, Phase 6 (Design-System Custom-Builder), oder Hosting (Hetzner + Coolify).

---

### Phase 6 – Editorial Design Redesign (2026-04-08)
Basierend auf tiefgruendiger Marktrecherche (Uber Eats, Wolt, Michelin-Restaurants, Dribbble):
- [x] GerichtKarteEditorial komplett ueberarbeitet: kursive Beschreibungen, Fine-Dining-Preis (ohne EUR), Dietary Icons, Drop-Cap fuer Gerichte ohne Bild, 4:3 Aspect-Ratio ✅
- [x] KategorieZeileEditorial verbessert: groessere Nummern (Signature-Element), Hover-Animation, besseres Spacing ✅
- [x] Sticky Kategorie-Header (bleibt beim Scrollen sichtbar + Backdrop-Blur) ✅
- [x] Staggered Entry-Animationen mit Framer Motion (Kategorien + Gerichte faden nacheinander ein) ✅
- [x] Editorial Header redesigned (groesserer Restaurantname, dekorative Trennelemente, Uppercase-Label) ✅
- [x] formatPreisEditorial Hilfsfunktion (Fine-Dining: "12,50" statt "12,50 EUR") ✅
- [x] Framer Motion installiert (v12.38.0) ✅

### Restaurant-Logo Feature (2026-04-08)
- [x] Backend: PUT /api/restaurant akzeptiert jetzt logo_url (Model + Route erweitert) ✅
- [x] Frontend Hook: useRestaurant aktualisieren() unterstützt logo_url ✅
- [x] Einstellungen: Logo-Upload-Bereich mit Vorschau, Hochladen & Entfernen ✅
- [x] Registrierung: Hinweis auf Logo-Upload in Erfolgs-Schritt ✅
- [x] Dashboard: Restaurant-Logo + Name im Topbar-Header ✅
- [x] Bestellseite: Logo in allen 4 Layout-Headern (Editorial, Pills, Grid, Liste) ✅

### Extras/Modifier-System (2026-04-08)
Ermöglicht Zusatzoptionen pro Gericht (z.B. "Extra Käse +2€", "Größe: Klein/Mittel/Groß"):
- [x] DB-Schema: 3 neue Tabellen (extras_gruppen, extras, bestellposition_extras) ✅
- [x] Backend: ExtrasModel + 8 neue API-Endpunkte (Admin CRUD + öffentlich) ✅
- [x] Bestell-API: Extras-Aufpreise serverseitig aus DB + eingefroren in bestellposition_extras ✅
- [x] Frontend: GerichtDetailModal (Bottom-Sheet, Radio/Checkbox Extras, Live-Preis) ✅
- [x] Frontend: Key-basierter Warenkorb (gleiches Gericht + versch. Extras = getrennte Zeilen) ✅
- [x] Frontend: useGerichtExtras Hook (Lazy-Loading, erst beim Antippen) ✅
- [x] Alle 5 Layouts (Editorial, Showcase, Osteria, Grid, Liste) umgebaut ✅
- [x] Admin-UI: ExtrasVerwaltung Komponente (Gruppen + Extras CRUD, Inline-Bearbeitung, Pflicht/Max-Auswahl) ✅
- [x] Admin-UI: "Extras"-Button (violet) in GerichtKarte + Modal in Speisekarte-Seite ✅
- [x] DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`) ✅ erledigt 2026-04-08

### Buchungs-Quick-Wins (2026-04-08)
Drei Verbesserungen auf der oeffentlichen Buchungsseite (Buchen.tsx):
- [x] Anlass-Auswahl: 6 Optionen als Chips (Geburtstag, Jubilaeum, Date Night, Geschaeft, Feier, Sonstiges) ✅
- [x] Sitzplatzwunsch: 6 Optionen als Chips (Egal, Innen, Terrasse, Bar, Fenster, Ruhig) ✅
- [x] "Zum Kalender hinzufuegen": Google Calendar Link + iCal-Download (.ics) auf Bestaetigungsseite ✅
- [x] DB-Migration: `anlass` + `sitzplatz_wunsch` Spalten auf `reservierungen` ✅
- [x] Backend: Buchungs-Route + Model erweitert ✅
- [x] Admin: ReservierungZeile zeigt Anlass/Sitzplatz-Badges ✅
- [x] Oeffentliche Detailseite (ReservierungDetail) zeigt Anlass/Sitzplatz ✅

### Bugfixes (2026-04-07)
- [x] Speisekarte GET-Routes fehlte Auth → `optionalAuth` Middleware erstellt + eingebaut ✅
- [x] `schema.sql` war veraltet (fehlten `restaurant_code`, `oeffnungszeiten`, Einladungsfelder, etc.) → mit migration-auth.sql zusammengeführt ✅
- [x] BestellenPro.tsx nutzte direktes `fetch()` statt `api.post()` → auf zentralen API-Client umgestellt ✅

## Bekannte Probleme / Offene Fragen
- ~~Node.js~~ ✅ installiert (2026-04-04)
- ~~PostgreSQL~~ ✅ installiert (2026-04-04)
- ~~PostgreSQL: Datenbank `restaurant_saas`~~ ✅ existierte bereits (2026-04-04)
- ~~`.env`-Datei~~ ✅ bereits konfiguriert (2026-04-04)
- ~~Datenbank-Migration~~ ✅ alle 8 Tabellen + Seed-Daten vorhanden (2026-04-04)
- Hosting-Setup (Hetzner + Coolify) steht noch aus
- `npm install` im Frontend ausführen (package-lock.json nicht synchron nach Supabase-Entfernung)
