# Restaurant SaaS – Claude Anweisungen

## Sync-Regel (IMMER befolgen)

Bei JEDER Änderung sofort die passende Projektdatei aktualisieren:

| Änderung | Datei |
|---|---|
| Aufgabe erledigt | `project/todos.md` (Checkbox `[x]`) + `project/status.md` + `PROJEKT-DASHBOARD.md` (Fortschritt) |
| Neue Aufgabe | `project/todos.md` (richtige Phase) |
| Entscheidung getroffen | `project/entscheidungen.md` (mit Datum) |
| DB-Tabelle/Feld neu | `datenstruktur/datenbank-schema.md` |
| API-Route neu | `datenstruktur/api-endpunkte.md` |
| Rollen ändern sich | `datenstruktur/rollen.md` |
| DSGVO-relevant | `project/dsgvo-log.md` + `project/dsgvo-datenkatalog.md` |
| Neues personenbezogenes Feld | `project/dsgvo-datenkatalog.md` (Verarbeitungsverzeichnis) + `/dsgvo` Skill ausfuehren |
| Problem gelöst | `project/status.md` → aus "Bekannte Probleme" entfernen |
| Neue Datei erstellt | `LIES_MICH_ZUERST.md` → Ordnerübersicht aktualisieren + `PROJEKT-DASHBOARD.md` (Dateien-Karte) |
| Neue Seite/Funktion | `PROJEKT-DASHBOARD.md` (Funktionsübersicht + Dateien-Karte) |
| Frontend-Komponente neu/geändert | `restaurant-app/frontend/FRONTEND.md` (Komponenten-Übersicht + Design) |
| Design-Änderung (Farben, Abstände, Typo) | `restaurant-app/frontend/FRONTEND.md` (entsprechende Tabelle) |
| **JEDE Code-Änderung (Schema, Routes, Seiten, Todos)** | `node dashboard/sync-dashboard.js` ausfuehren → Dashboard aktualisieren |

### HTML-Dashboard Pflicht (IMMER)

Nach **jeder** Code-Änderung muss `dashboard/index.html` aktualisiert werden:

1. **`node dashboard/sync-dashboard.js`** ausführen → generiert `dashboard-data.js`
2. **`DEFAULT_DATA` in `dashboard/index.html`** manuell aktualisieren, wenn sich etwas geändert hat an:
   - Seiten/Pages (neue Seite, Status-Änderung)
   - Issues/Bugs (neuer Bug, Bug gelöst)
   - Integrationen (neue Integration, Status-Änderung)
   - Workflows (neuer Workflow, Status-Änderung)
   - Option Sets (neue Werte, geänderte Werte)
   - Rollen (neue Rolle, Berechtigungen geändert)
   - Changelog (neuer Eintrag für die Änderung)
   - Fortschritt (Prozent-Berechnung)
3. **`DATA_VERSION`** in `index.html` hochzählen → erzwingt Cache-Invalidierung beim Nutzer

Das HTML-Dashboard ist die zentrale Projekt-Übersicht. Es muss IMMER den aktuellen Stand widerspiegeln.

**Skills:**
- `/sync` – Änderungen in Projektdateien einordnen
- `/frontend` – Frontend prüfen und optimieren (gegen `FRONTEND.md`)
- `/dsgvo` – DSGVO-Konformität prüfen, Verarbeitungsverzeichnis pflegen

## Kontext

- Ilias hat keine Programmiererfahrung – alles auf Deutsch erklären, einfach halten
- Tech-Stack: Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io
- Zwei Codebases: `app/` (alt) und `restaurant-app/` (neu, bevorzugt)
- Multi-Tenant: Jede DB-Query filtert nach `restaurant_id`
- DSGVO-konform: Bei jeder Änderung prüfen, in `project/dsgvo-log.md` + `project/dsgvo-datenkatalog.md` dokumentieren
- DSGVO-Regel: Bei JEDEM neuen Feature das personenbezogene Daten betrifft → `/dsgvo` Skill ausfuehren

## Rollen

- `prompts/assistent.md` – Projektmanager-Rolle
- `prompts/arbeiter.md` – Entwickler-Rolle
- `prompts/sync.md` – Sync-Regeln (was wohin geschrieben wird)
