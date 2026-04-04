# Restaurant App – Claude-Anweisungen

## Projektüberblick
Multi-Tenant Restaurant-SaaS. Jedes Restaurant ist ein Tenant (restaurant_id überall).

## Struktur
```
restaurant-app/
├── backend/   Node.js + Express + TypeScript  (Port 3001)
├── frontend/  React + TypeScript + Tailwind   (Port 5173)
└── database/  schema.sql + seed.sql
```

## Wichtige Konventionen

### Backend
- Alle DB-Queries laufen über `src/models/db.ts` (Funktionen `q` und `q1`)
- Modelle liegen in `src/models/` – jede Entität hat ihr eigenes File
- Routes importieren nur aus Models, nie direkt `db.ts`
- Fehlermeldungen auf Deutsch, Schlüssel `fehler` (nicht `error`)
- Preise **niemals** vom Client übernehmen – immer aus DB holen

### Frontend
- TypeScript-Typen zentral in `src/types/index.ts`
- API-Aufrufe nur über `src/lib/api.ts` – nie direktes `fetch` in Komponenten
- Hilfsfunktionen (Labels, Farben, Formatierung) in `src/lib/utils.ts`
- Jede Entität hat einen eigenen Hook in `src/hooks/`
- Komponenten bekommen Daten via Props, keine API-Calls in Komponenten

### Sicherheit
- JWT-Token läuft über `requireAuth` Middleware
- Multi-Tenant: `restaurant_id` immer aus `req.auth`, nie aus Body/Params
- Passwörter: bcrypt mit mindestens 12 Runden

### DSGVO
- `telefon` in Reservierungen: personenbezogen, Löschfrist 30 Tage
- `email` in Mitarbeiter: personenbezogen
- Niemals Passwort-Hashes in API-Responses zurückgeben

## Starten
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Datenbank
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql
```

## Test-Accounts (nach seed.sql)
| Email | Passwort | Rolle |
|---|---|---|
| admin@demo.de | test1234 | admin |
| kellner@demo.de | test1234 | kellner |
| kueche@demo.de | test1234 | kueche |
