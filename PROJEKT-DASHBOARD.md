# Projekt-Dashboard – Restaurant SaaS

> **Letzte Aktualisierung:** 2026-04-06 (Dashboard Auto-Sync Hook + Roadmap/Entscheidungen Tabs + Dark Mode)
> **Schnellbefehl:** Tippe `/sync` nach jeder Änderung – Claude aktualisiert dieses Dashboard automatisch

---

## Gesamtfortschritt

```
Phase 1 – Grundstruktur       ████████████████████ 100%  ✅
Phase 2 – Admin-Dashboard     ████████████████████ 100%  ✅
Phase 3 – Gäste-Seite         ████████████████████ 100%  ✅
Phase 4 – SaaS-Features       ███████████████░░░░░  75%  🔧
Phase 5 – Extras              ████████████████░░░░  80%  🔧
```

**Aktueller Stand:** Phase 4 + 5 parallel (Dark Mode + Dashboard-Erweiterung fertig, Mollie + Mehrsprachigkeit offen)
**Nächster Schritt:** Abonnement-Verwaltung (Mollie)

---

## Was ist erledigt? Was fehlt noch?

### Phase 1 – Grundstruktur ✅
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Backend-Grundstruktur (Node.js + Express + TypeScript) | ✅ Erledigt |
| 2 | Datenbankschema in PostgreSQL (8 Tabellen) | ✅ Erledigt |
| 3 | Multi-Tenant-Logik (restaurant_id überall) | ✅ Erledigt |
| 4 | Authentifizierung (Login, JWT, Rollen) | ✅ Erledigt |
| 5 | Alle 7 API-Routen | ✅ Erledigt |
| 6 | Socket.io für Live-Updates | ✅ Erledigt |
| 7 | Frontend-Grundstruktur (React + Tailwind) | ✅ Erledigt |
| 8 | Gäste-Bestellseite (QR-Code-basiert) | ✅ Erledigt |

### Phase 2 – Admin-Dashboard ✅
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Dashboard mit Live-Stats (Umsatz, Bestellungen, Tische) | ✅ Erledigt |
| 2 | Speisekarte verwalten (Kategorien + Gerichte CRUD) | ✅ Erledigt |
| 3 | Tischplan visuell (Status-Wechsel, QR-Link) | ✅ Erledigt |
| 4 | Reservierungsverwaltung mit Kalenderansicht | ✅ Erledigt |
| 5 | Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren) | ✅ Erledigt |

### Phase 3 – Gäste-Seite ✅
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Öffentliche Bestellseite mit QR-Code | ✅ Erledigt |
| 2 | Speisekarte anzeigen (nach Kategorien) | ✅ Erledigt |
| 3 | Warenkorb + Bestellung abschicken | ✅ Erledigt |
| 4 | QR-Codes generieren & drucken pro Tisch | ✅ Erledigt |
| 5 | Bestellstatus für Gäste (Socket.io Live) | ✅ Erledigt |

### Phase 4 – SaaS-Features 🔧 (in Arbeit)
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Restaurant-Registrierung & Onboarding | ✅ Erledigt |
| 2 | Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl) | ✅ Erledigt |
| 3 | Design-Anpassung pro Restaurant (Primärfarbe) | ✅ Erledigt |
| 4 | **Abonnement-Verwaltung (Mollie)** | ⬚ Offen |

### Phase 5 – Extras 🔧 (in Arbeit)
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten) | ✅ Erledigt |
| 2 | Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler) | ✅ Erledigt |
| 3 | Dark Mode (Toggle, alle Seiten + Komponenten) | ✅ Erledigt |
| 4 | Dashboard Auto-Sync + Erweiterung (Hook, Roadmap, Entscheidungen, DSGVO) | ✅ Erledigt |
| 5 | Mehrsprachigkeit (DE/EN) | ⬚ Offen |

### Irgendwann
| # | Aufgabe | Status |
|---|---------|--------|
| 1 | Mobile App | ⬚ Offen |
| 2 | Kundenbewertungen | ⬚ Offen |
| 3 | Wartezeit-Schätzung | ⬚ Offen |

---

## Alle Funktionen der App

### Übersicht (was kann die App?)

| Funktion | Seite | Wer nutzt es | Status |
|----------|-------|-------------|--------|
| Login & Authentifizierung | `/login` | Alle Mitarbeiter | ✅ Fertig |
| Demo-Modus (ohne Datenbank) | `/login` | Jeder | ✅ Fertig |
| Dashboard mit Live-Stats | `/dashboard` | Admin, Kellner | ✅ Fertig |
| Bestellungen verwalten | `/bestellungen` | Alle Mitarbeiter | ✅ Fertig |
| Tischplan & QR-Codes | `/tischplan` | Admin, Kellner | ✅ Fertig |
| Speisekarte verwalten | `/speisekarte` | Admin | ✅ Fertig |
| Reservierungen | `/reservierungen` | Admin, Kellner | ✅ Fertig |
| Mitarbeiterverwaltung | `/mitarbeiter` | Admin | ✅ Fertig |
| Gäste-Bestellseite (QR) | `/bestellen/:id/:id` | Gäste | ✅ Fertig |
| Live-Bestellstatus | (nach Bestellung) | Gäste | ✅ Fertig |
| Restaurant-Registrierung | `/registrieren` | Neue Restaurants | ✅ Fertig |
| Einstellungen | `/einstellungen` | Admin | ✅ Fertig |
| Statistiken | `/statistiken` | Admin | ✅ Fertig |
| Dienstplan | `/dienstplan` | Admin | ✅ Fertig |
| Projekt-Dashboard (HTML) | `dashboard/index.html` | Entwickler | ✅ Fertig |
| Abonnement-Verwaltung | – | Admin | ⬚ Geplant |

### Funktionen im Detail

<details>
<summary><strong>Login & Rollen</strong></summary>

- Email + Passwort Login
- 3 Rollen: Admin (alles), Kellner (Bestellungen/Tische/Reservierungen), Küche (nur Bestellungen)
- JWT-Token (7 Tage gültig)
- Demo-Modus ohne Datenbank
- Passwörter: bcrypt (12 Runden)

**Test-Logins:** `admin@demo.de` / `kellner@demo.de` / `kueche@demo.de` (alle: `test1234`)
</details>

<details>
<summary><strong>Dashboard</strong></summary>

- 5 Statistik-Karten: Offene Bestellungen, In Zubereitung, Tagesumsatz, Reservierungen, Tische belegt
- Umsatz-Chart (Balkendiagramm)
- Auslastung-Donut (Tischbelegung)
- Bestellungs-Verteilung (Kreisdiagramm)
- Aktive Bestellungen (letzte 5)
- Heutige Reservierungen (nächste 5)
</details>

<details>
<summary><strong>Bestellungen</strong></summary>

- Karten-Grid mit allen aktiven Bestellungen
- Status-Workflow: Offen → In Zubereitung → Serviert → Bezahlt
- Live-Updates über Socket.io
- Tischnummer, Gerichte, Mengen, Preis, Anmerkung
</details>

<details>
<summary><strong>Tischplan & QR-Codes</strong></summary>

- Grid-Ansicht aller Tische (responsive)
- Status-Wechsel per Klick: Frei → Besetzt → Wartet auf Zahlung
- Tisch anlegen/bearbeiten/löschen (Admin)
- QR-Code pro Tisch (scanbar, druckbar)
- Alle QR-Codes auf einmal drucken (3er-Raster)
- URL-Format: `/bestellen/{restaurantId}/{tischId}`
</details>

<details>
<summary><strong>Speisekarte</strong></summary>

- Kategorien verwalten (anlegen, umbenennen, löschen)
- Gerichte: Name, Beschreibung, Preis, Kategorie, Allergene
- Verfügbarkeit ein/aus Toggle
- Preise immer serverseitig validiert
</details>

<details>
<summary><strong>Reservierungen</strong></summary>

- Wochenleiste + Tagesnavigation
- Gastname, Telefon, Datum/Uhrzeit, Personen, Tisch, Anmerkung
- Status: Ausstehend → Bestätigt / Storniert
- Tagesstatistiken (Anzahl + Personen)
</details>

<details>
<summary><strong>Mitarbeiterverwaltung</strong></summary>

- Anlegen: Name, Email, Passwort, Rolle
- Bearbeiten: Name, Rolle ändern
- Passwort zurücksetzen
- Deaktivieren/Aktivieren
- Filter: Aktiv / Inaktiv / Alle
</details>

<details>
<summary><strong>Gäste-Bestellseite</strong></summary>

- QR-Code scannen → Speisekarte öffnet sich
- Nur verfügbare Gerichte, nach Kategorien gruppiert
- Mengen wählen (+/- Buttons)
- Warenkorb mit Gesamtpreis
- Optionale Anmerkung
- Nach Bestellung: Live-Status-Tracker (4 Schritte)
- Tisch wird automatisch "besetzt"
</details>

<details>
<summary><strong>SaaS-Features</strong></summary>

- Restaurant-Registrierung (Name, Email, Passwort)
- Automatischer Lizenzcode pro Restaurant
- Mitarbeiter-Limit pro Lizenz
- Primärfarbe für Gäste-Seite anpassbar
- Abo-Status: active / expired / trial
</details>

---

## Wo wird was gespeichert?

### Datenbank (PostgreSQL – 8 Tabellen)

| Tabelle | Speichert | Wichtige Felder |
|---------|-----------|-----------------|
| `restaurants` | Restaurant-Daten (Tenant) | Name, Logo, Farbe, Lizenzcode, Abo-Status |
| `mitarbeiter` | Login-Accounts | Email, Passwort-Hash, Rolle, aktiv |
| `tische` | Tische | Nummer, Kapazität, Status, QR-URL |
| `kategorien` | Speisekarte-Kategorien | Name, Reihenfolge |
| `gerichte` | Gerichte | Name, Preis, Beschreibung, Allergene, verfügbar |
| `bestellungen` | Bestellungen | Tisch, Status, Gesamtpreis, Anmerkung |
| `bestellpositionen` | Gerichte pro Bestellung | Gericht, Menge, Einzelpreis |
| `reservierungen` | Gast-Reservierungen | Name, Telefon, Datum, Personen, Status |

### Browser (localStorage)

| Schlüssel | Inhalt |
|-----------|--------|
| `restaurant-auth` | JWT-Token + Mitarbeiter-Daten (Name, Rolle, Restaurant) |

### Backend (.env)

| Variable | Zweck |
|----------|-------|
| `DATABASE_URL` | PostgreSQL Connection String |
| `JWT_SECRET` | Geheimschlüssel für Token |
| `JWT_EXPIRES_IN` | Token-Gültigkeit (Standard: 7d) |
| `PORT` | Backend-Port (Standard: 3001) |
| `FRONTEND_URL` | Frontend-URL für CORS |

---

## Dateien-Karte (wo finde ich was?)

### Dashboard & Tooling (`dashboard/`)

| Datei | Zweck |
|-------|-------|
| `index.html` | Interaktives Projekt-Dashboard (10 Tabs: Übersicht, Roadmap, Entscheidungen, Data Editor, Workflows, Seiten, API, Privacy, Issues, Einstellungen) |
| `sync-dashboard.js` | Sync-Script: liest alle Projektdateien und generiert `dashboard-data.js` |
| `dashboard-data.js` | Generierte Daten (wird automatisch via Claude Code Hook aktualisiert) |
| `.claude/settings.json` | PostToolUse Hook: führt `sync-dashboard.js` bei jeder Write/Edit-Aktion aus |

### Backend (`restaurant-app/backend/src/`)

| Datei | Zweck |
|-------|-------|
| `server.ts` | Express + Socket.io Server-Setup |
| `middleware/auth.ts` | JWT-Prüfung + Rollen-Check |
| `models/db.ts` | Datenbank-Verbindung (PostgreSQL Pool) |
| `routes/auth.ts` | Login + Registrierung |
| `routes/tische.ts` | Tisch-CRUD + Status |
| `routes/speisekarte.ts` | Gerichte + Kategorien CRUD |
| `routes/bestellungen.ts` | Bestellungen + Status-Updates |
| `routes/reservierungen.ts` | Reservierungen CRUD |
| `routes/mitarbeiter.ts` | Mitarbeiter-Verwaltung |
| `routes/restaurant.ts` | Restaurant-Einstellungen + Design |
| `routes/statistiken.ts` | Dashboard-Statistiken |
| `routes/dienstplan.ts` | Schicht-CRUD (Wochenansicht) |

### Frontend – Seiten (`restaurant-app/frontend/src/pages/`)

| Datei | Seite | URL |
|-------|-------|-----|
| `Login.tsx` | Login + Demo | `/login` |
| `Registrieren.tsx` | Restaurant-Registrierung | `/registrieren` |
| `Dashboard.tsx` | Dashboard | `/dashboard` |
| `Bestellungen.tsx` | Bestellungen | `/bestellungen` |
| `Tischplan.tsx` | Tischplan & QR | `/tischplan` |
| `Speisekarte.tsx` | Speisekarte | `/speisekarte` |
| `Reservierungen.tsx` | Reservierungen | `/reservierungen` |
| `Mitarbeiter.tsx` | Mitarbeiterverwaltung | `/mitarbeiter` |
| `Einstellungen.tsx` | Restaurant-Einstellungen | `/einstellungen` |
| `Statistiken.tsx` | Statistiken | `/statistiken` |
| `Dienstplan.tsx` | Dienstplan | `/dienstplan` |
| `Bestellen.tsx` | Gäste-Bestellseite | `/bestellen/:id/:id` |

### Frontend – Komponenten (`restaurant-app/frontend/src/components/`)

| Ordner | Komponenten | Gehört zu |
|--------|-------------|-----------|
| `layout/` | Layout, Sidebar, Topbar, Modal | Alle Seiten |
| `dashboard/` | StatKarte, UmsatzChart, AuslastungDonut, BestellVerteilung, Auslastung | Dashboard |
| `bestellungen/` | BestellungKarte, StatusBadge | Bestellungen |
| `tischplan/` | TischKarte, TischFormular | Tischplan |
| `speisekarte/` | GerichtKarte, GerichtFormular, KategorieVerwaltung | Speisekarte |
| `reservierungen/` | ReservierungZeile, ReservierungFormular | Reservierungen |
| `mitarbeiter/` | MitarbeiterZeile, MitarbeiterFormular | Mitarbeiter |
| `gaeste/` | GerichtAuswahl, Warenkorb, BestellStatusTracker | Gäste-Bestellseite |

### Frontend – Hooks (`restaurant-app/frontend/src/hooks/`)

| Hook | Lädt Daten für |
|------|---------------|
| `useBestellungen.ts` | Bestellungen (CRUD + Status) |
| `useTische.ts` | Tische (CRUD + Status) |
| `useSpeisekarte.ts` | Gerichte + Kategorien |
| `useReservierungen.ts` | Reservierungen |
| `useMitarbeiter.ts` | Mitarbeiter |
| `useStatistiken.ts` | Dashboard-Statistiken |
| `useRestaurant.ts` | Restaurant-Einstellungen |
| `useRestaurantDesign.ts` | Öffentliches Design (Gäste-Seite) |
| `useDienstplan.ts` | Dienstplan-Schichten |
| `useSocket.ts` | Socket.io (Mitarbeiter) |
| `useGaesteSocket.ts` | Socket.io (Gäste-Bestellstatus) |

### Frontend – Sonstiges

| Datei | Zweck |
|-------|-------|
| `store/auth.ts` | Zustand-Store (Login-Status, persistiert in localStorage) |
| `lib/api.ts` | API-Client (fügt JWT automatisch an) |
| `lib/utils.ts` | Hilfsfunktionen (Preise, Status-Labels, Farben) |
| `lib/demo-daten.ts` | Demo-Daten für Demo-Modus |
| `types/index.ts` | TypeScript-Typen |

### Datenbank-Dateien

| Datei | Zweck |
|-------|-------|
| `restaurant-app/database/schema.sql` | Alle Tabellen-Definitionen |
| `restaurant-app/database/seed.sql` | Demo-Daten (Testrestaurant + Testnutzer) |

---

## API-Endpunkte (Kurzübersicht)

| Bereich | Routes | Auth | Datei |
|---------|--------|------|-------|
| Login/Registrierung | POST login, POST registrieren | Nein | `routes/auth.ts` |
| Restaurant | GET/PUT eigenes Restaurant, GET Design | Ja (Admin) | `routes/restaurant.ts` |
| Tische | GET/POST/PATCH/DELETE | Ja | `routes/tische.ts` |
| Speisekarte | GET/POST/PATCH/DELETE + Kategorien | Teilweise | `routes/speisekarte.ts` |
| Bestellungen | GET/POST/PUT Status | Teilweise | `routes/bestellungen.ts` |
| Reservierungen | GET/POST/PUT/DELETE | Teilweise | `routes/reservierungen.ts` |
| Mitarbeiter | GET/POST/PATCH + Passwort | Ja (Admin) | `routes/mitarbeiter.ts` |
| Statistiken | GET | Ja (Admin) | `routes/statistiken.ts` |
| Dienstplan | GET/POST/PATCH/DELETE | Ja (Admin) | `routes/dienstplan.ts` |

**Vollständige API-Doku:** → [datenstruktur/api-endpunkte.md](datenstruktur/api-endpunkte.md)

---

## Projektdokumentation (wo steht was?)

| Datei | Inhalt | Wann aktualisieren? |
|-------|--------|---------------------|
| [PROJEKT-DASHBOARD.md](PROJEKT-DASHBOARD.md) | **Diese Datei** – Gesamtübersicht | Bei jeder Änderung (via `/sync`) |
| [project/status.md](project/status.md) | Aktueller Projektstand | Nach jeder erledigten Aufgabe |
| [project/todos.md](project/todos.md) | Todo-Liste nach Phasen | Neue Aufgabe / Aufgabe erledigt |
| [project/entscheidungen.md](project/entscheidungen.md) | Getroffene Entscheidungen | Bei wichtigen Entscheidungen |
| [project/dsgvo-log.md](project/dsgvo-log.md) | DSGVO-Prüfprotokoll | Bei DSGVO-relevanten Änderungen |
| [project/dsgvo-datenkatalog.md](project/dsgvo-datenkatalog.md) | Verarbeitungsverzeichnis | Bei neuen personenbezogenen Daten |
| [datenstruktur/datenbank-schema.md](datenstruktur/datenbank-schema.md) | Alle DB-Tabellen & Felder | Bei Schema-Änderungen |
| [datenstruktur/api-endpunkte.md](datenstruktur/api-endpunkte.md) | Alle API-Routen | Bei neuen/geänderten Routen |
| [datenstruktur/rollen.md](datenstruktur/rollen.md) | Nutzerrollen & Berechtigungen | Bei Rollen-Änderungen |
| [README.md](README.md) | Vollständige Funktionsübersicht | Bei neuen Features |
| [FRONTEND.md](restaurant-app/frontend/FRONTEND.md) | Design-Richtlinie (Farben, Abstände) | Bei Design-Änderungen |
| [LIES_MICH_ZUERST.md](LIES_MICH_ZUERST.md) | Schnellstart & Rollen | Bei neuen Dateien/Ordnern |

---

## Technik auf einen Blick

| Bereich | Technologie | Version/Details |
|---------|-------------|-----------------|
| Backend | Node.js + Express + TypeScript | Port 3001 |
| Frontend | React 18 + TypeScript + Tailwind + Vite | Port 5173 |
| Datenbank | PostgreSQL | 8 Tabellen, Multi-Tenant |
| Echtzeit | Socket.io | WebSocket |
| Auth | JWT + bcrypt | 7 Tage Token, 12 Runden Hash |
| State | Zustand | Frontend-Store |
| Charts | Recharts | Dashboard |
| QR-Codes | qrcode.react | Tischplan |
| Hosting | Hetzner Cloud Frankfurt | Geplant (DSGVO-konform) |
| Zahlungen | Mollie | Geplant |

---

## Geschäftsmodell

| Detail | Wert |
|--------|------|
| Modell | SaaS-Abo |
| Einstiegspreis | €49/Monat |
| Premium | €99–129/Monat (geplant) |
| Zielmarkt | DACH (Deutschland, Österreich, Schweiz) |
| Multi-Tenant | Jedes Restaurant = eigene UUID + Lizenzcode |

---

## Sicherheit & Multi-Tenancy

| Bereich | Schutz | Status |
|---------|--------|--------|
| Authentifizierte Routen | `restaurant_id` kommt aus JWT-Token, nie aus Body/Params | ✅ Sicher |
| Öffentliche Bestellungen | Tisch-Restaurant-Zugehörigkeit wird geprüft (`tisch_id` ↔ `restaurant_id`) | ✅ Gefixt (2026-04-05) |
| Öffentliche Reservierungen | Restaurant-Existenz wird geprüft vor Anlage | ✅ Gefixt (2026-04-05) |
| Passwörter | bcrypt, 12 Runden | ✅ Sicher |
| Preise | Immer serverseitig aus DB — nie vom Client | ✅ Sicher |
| Socket.io Räume | Nur eigenes Restaurant (Token-Prüfung) | ✅ Sicher |
| Supabase | Komplett entfernt — alles läuft über Express API | ✅ Entfernt (2026-04-05) |

---

## Projekt starten

```bash
# Backend
cd restaurant-app/backend && npm install && npm run dev
# → http://localhost:3001

# Frontend
cd restaurant-app/frontend && npm install && npm run dev
# → http://local
host:5173

# Datenbank einrichten
psql $DATABASE_URL -f restaurant-app/database/schema.sql
psql $DATABASE_URL -f restaurant-app/database/seed.sql
```

**Test-Logins nach seed.sql:**
| Email | Passwort | Rolle |
|-------|----------|-------|
| admin@demo.de | test1234 | Admin |
| kellner@demo.de | test1234 | Kellner |
| kueche@demo.de | test1234 | Küche |
