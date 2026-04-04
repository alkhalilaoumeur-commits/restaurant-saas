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
