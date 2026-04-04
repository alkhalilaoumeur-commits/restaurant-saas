# Restaurant App

Multi-Tenant Restaurant-SaaS. Mitarbeiter verwalten Bestellungen, Tische und Reservierungen. Gäste bestellen per QR-Code am Tisch.

## Stack
- **Backend:** Node.js + Express + TypeScript + Socket.io
- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Datenbank:** PostgreSQL

## Schnellstart
Siehe [docs/SETUP.md](docs/SETUP.md)

## Architektur
```
restaurant-app/
├── backend/src/
│   ├── models/      Datenbankzugriff pro Entität
│   ├── routes/      API-Endpunkte
│   ├── middleware/  Auth + Fehlerbehandlung
│   └── server.ts   Einstiegspunkt
├── frontend/src/
│   ├── pages/       Eine Datei pro Seite
│   ├── components/  Wiederverwendbare UI-Bausteine
│   ├── hooks/       Daten laden + mutieren
│   ├── types/       Zentrale TypeScript-Typen
│   └── lib/         API-Client + Hilfsfunktionen
└── database/
    ├── schema.sql   Tabellenstruktur
    └── seed.sql     Testdaten
```
