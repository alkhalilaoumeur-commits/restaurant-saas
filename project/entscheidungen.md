# Getroffene Entscheidungen

## Tech-Stack
**Entschieden:** 2026-04-04
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Datenbank: PostgreSQL
- Echtzeit: Socket.io (WebSockets)
- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)
- Auth: JWT + bcrypt
- Zahlungen: Mollie (NL, DSGVO-freundlich)

## Geschäftsmodell
- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium
- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)
- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode

## Plattform
- Umstieg von Bubble.io auf Custom Code
- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle

## Supabase entfernt (2026-04-05)
- Frontend lief doppelt: teils über Express API, teils direkt über Supabase
- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht
- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend
- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)
- DB-Visualisierung: TablePlus statt Supabase-Dashboard

## Multi-Tenancy Absicherung (2026-04-05)
- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id
- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)
- Reservierungen: Restaurant muss existieren (DB-Check)

## Produktname: ServeFlow (2026-04-06)
- App heißt ab jetzt **ServeFlow** (vorher "Restaurant App")
- Eigenständiger Produktname statt DRVN Sub-Brand
- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)
- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt
- Grund: "ServeFlow" klingt professionell, international, kommuniziert Service + Effizienz
- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise
- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json

## Dashboard Auto-Sync via Claude Code Hook (2026-04-06)
- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt
- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`
- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status
- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell
- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen
