# Projektstatus

**Letzte Aktualisierung:** 2026-04-04
**Aktuelle Phase:** Phase 1 – Grundstruktur fertig, bereit für lokale Entwicklung

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

## Nächster Schritt
Node.js installieren und Entwicklungsumgebung starten:
```bash
# 1. Node.js installieren (empfohlen via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20

# 2. PostgreSQL starten und DB anlegen
createdb restaurant_saas

# 3. Backend
cd app/backend
cp .env.example .env   # DB-Zugangsdaten eintragen
npm install
npm run db:migrate     # SQL-Schema einmalig ausführen
npm run dev

# 4. Frontend (neues Terminal)
cd app/frontend
npm install
npm run dev
```

---

## Bekannte Probleme / Offene Fragen
- Node.js noch nicht installiert
- PostgreSQL noch nicht installiert/konfiguriert
- Hosting-Setup (Hetzner) steht noch aus
