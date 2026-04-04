# Todo-Liste

## Jetzt dran
- [x] Node.js installieren (via nvm, Version 20) ✅ erledigt 2026-04-04
- [x] PostgreSQL installieren ✅ erledigt 2026-04-04
- [ ] PostgreSQL: Datenbank `restaurant_saas` anlegen
- [ ] `.env` konfigurieren und Backend starten (`npm run dev`)
- [ ] Datenbank-Migration ausführen (`migration.sql`)

## Phase 1 – Grundstruktur ✅ (Codestruktur fertig)
- [x] Backend-Grundstruktur (Node.js + Express + TypeScript)
- [x] Datenbankschema in PostgreSQL-Migration erstellt
- [x] Multi-Tenant-Logik (restaurant_id überall)
- [x] Authentifizierung (Login, JWT, Rollen)
- [x] Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)
- [x] Socket.io für Live-Updates
- [x] Frontend-Grundstruktur (React + TypeScript + Tailwind)
- [x] Gäste-Bestellseite (QR-Code-basiert)

## Phase 2 – Admin-Dashboard (offen)
- [ ] Dashboard Live-Stats (echte Daten nach DB-Setup)
- [ ] Speisekarte verwalten (Kategorien + Gerichte CRUD)
- [ ] Tischplan visuell (Drag & Drop, QR-Code drucken)
- [ ] Reservierungsverwaltung mit Kalenderansicht
- [ ] Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren)

## Phase 3 – Gäste-Seite (teilweise fertig)
- [x] Öffentliche Bestellseite mit QR-Code-Parameter
- [x] Speisekarte anzeigen (nach Kategorien)
- [x] Warenkorb + Bestellung abschicken
- [ ] QR-Codes generieren & drucken pro Tisch
- [ ] Bestellstatus für Gäste (Socket.io)

## Phase 4 – SaaS-Features
- [ ] Restaurant-Registrierung & Onboarding
- [ ] Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)
- [ ] Design-Anpassung pro Restaurant
- [ ] Abonnement-Verwaltung (Mollie)

## Phase 5 – Extras
- [ ] Dienstplan
- [ ] WhatsApp-Bot (Twilio/360dialog)
- [ ] Mehrsprachigkeit (DE/EN)
- [ ] Statistiken & Berichte

## Irgendwann
- [ ] Mobile App (falls gewünscht)
- [ ] Kundenbewertungen
- [ ] Wartezeit-Schätzung
