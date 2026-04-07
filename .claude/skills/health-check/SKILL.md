---
name: health-check
description: Fuehrt einen vollstaendigen Health Check des ServeFlow-Projekts durch. Prueft Backend, Frontend, TypeScript-Kompilierung, Datenbank, Auth und alle API-Endpunkte. Sendet Ergebnisse per Telegram.
allowed-tools: Bash Read Grep Glob
argument-hint: [optional: nur bestimmten Bereich pruefen, z.B. "api" oder "typescript"]
---

# Health Check: ServeFlow Systemtest

Fuehre einen vollstaendigen Health Check des Projekts durch und berichte die Ergebnisse.

## Schritt 1: Health-Check Script ausfuehren

Fuehre das Script aus:

```bash
bash restaurant-app/scripts/health-check.sh
```

Das Script prueft automatisch:
- **Abhaengigkeiten:** node_modules vorhanden (Backend + Frontend)
- **TypeScript:** Kompiliert fehlerfrei (Backend + Frontend)
- **Erreichbarkeit:** Backend Health-Endpunkt + Frontend
- **Auth:** Login mit Test-Account funktioniert
- **API-Endpunkte:** Speisekarte, Bestellungen, Tische, Reservierungen, Statistiken, Restaurant, Mitarbeiter, Dienstplan
- **Projektdateien:** Schema, Seed, .env vorhanden
- **Telegram:** Sendet Ergebnis automatisch (wenn konfiguriert)

## Schritt 2: Ergebnisse analysieren

Falls das Script Fehler meldet:

1. **TypeScript-Fehler:** Lies die betroffenen Dateien und erklaere den Fehler
2. **API-Fehler:** Pruefe ob Backend laeuft (`curl localhost:3001/api/health`)
3. **Login-Fehler:** Pruefe DB-Verbindung und ob Seed-Daten geladen sind
4. **Erreichbarkeit:** Pruefe ob die Services gestartet sind

## Schritt 3: Bericht auf Deutsch

Fasse zusammen:
- Wie viele Checks bestanden / fehlgeschlagen
- Was genau kaputt ist (mit Datei + Zeile wenn moeglich)
- Konkreter Fix-Vorschlag fuer jedes Problem
- Ob die Telegram-Nachricht gesendet wurde

Falls der Nutzer nur einen bestimmten Bereich pruefen will ($ARGUMENTS), fuehre nur die relevanten Checks aus.
