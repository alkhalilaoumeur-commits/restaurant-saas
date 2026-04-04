# Restaurant SaaS – Claude Anweisungen

## Sync-Regel (IMMER befolgen)

Bei JEDER Änderung sofort die passende Projektdatei aktualisieren:

| Änderung | Datei |
|---|---|
| Aufgabe erledigt | `project/todos.md` (Checkbox `[x]`) + `project/status.md` |
| Neue Aufgabe | `project/todos.md` (richtige Phase) |
| Entscheidung getroffen | `project/entscheidungen.md` (mit Datum) |
| DB-Tabelle/Feld neu | `datenstruktur/datenbank-schema.md` |
| API-Route neu | `datenstruktur/api-endpunkte.md` |
| Rollen ändern sich | `datenstruktur/rollen.md` |
| DSGVO-relevant | `project/dsgvo-log.md` |
| Problem gelöst | `project/status.md` → aus "Bekannte Probleme" entfernen |
| Neue Datei erstellt | `LIES_MICH_ZUERST.md` → Ordnerübersicht aktualisieren |

**Skill:** Nutzer kann `/sync` tippen um Änderungen einzuordnen
**Vollständiger Sync-Prompt:** `prompts/sync.md`

## Kontext

- Ilias hat keine Programmiererfahrung – alles auf Deutsch erklären, einfach halten
- Tech-Stack: Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io
- Zwei Codebases: `app/` (alt) und `restaurant-app/` (neu, bevorzugt)
- Multi-Tenant: Jede DB-Query filtert nach `restaurant_id`
- DSGVO-konform: Bei jeder Änderung prüfen, in `project/dsgvo-log.md` dokumentieren

## Rollen

- `prompts/assistent.md` – Projektmanager-Rolle
- `prompts/arbeiter.md` – Entwickler-Rolle
- `prompts/sync.md` – Sync-Regeln (was wohin geschrieben wird)
