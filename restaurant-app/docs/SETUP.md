# Setup-Anleitung

## Voraussetzungen
- Node.js 20+
- PostgreSQL 15+

## 1. Node.js installieren
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20 && nvm use 20
```

## 2. PostgreSQL einrichten
```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Datenbank anlegen
createdb restaurant_app
```

## 3. Backend starten
```bash
cd backend
cp .env.example .env      # Werte anpassen
npm install
npm run dev               # http://localhost:3001
```

## 4. Datenbank-Schema + Testdaten
```bash
psql restaurant_app -f ../database/schema.sql
psql restaurant_app -f ../database/seed.sql
```

## 5. Frontend starten
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Test-Login
| Email | Passwort | Rolle |
|---|---|---|
| admin@demo.de | test1234 | Admin |
| kellner@demo.de | test1234 | Kellner |
| kueche@demo.de | test1234 | Küche |

## Gäste-Bestellseite testen
Nach dem seed.sql ist Tisch 1 erreichbar unter:
```
http://localhost:5173/bestellen/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0003-000000000001
```
