# Restaurant SaaS – Projektzentrale

## Projekt-Dashboard

→ **[PROJEKT-DASHBOARD.md](PROJEKT-DASHBOARD.md)** – Deine zentrale Übersicht über alles:
Fortschritt, Todos, alle Funktionen, Speicherorte, Dateien-Karte

---

## Schnellbefehl

Tippe `/sync` gefolgt von deiner Änderung, und Claude ordnet alles automatisch in die richtigen Dateien ein:
```
/sync PostgreSQL Datenbank wurde angelegt
/sync Neues Feature: Kellner kann Tische tauschen
/sync Entscheidung: Wir nutzen Stripe statt Mollie
```

---

## Wie du eine neue Session startest

Kopiere eine der folgenden Zeilen und schick sie am Anfang jeder Session:

```
Lies prompts/assistent.md und übernimm diese Rolle.
```
```
Lies prompts/arbeiter.md und übernimm diese Rolle.
```

---

## Die zwei Rollen

| Rolle | Datei | Wofür |
|---|---|---|
| Assistent | `prompts/assistent.md` | Planung, Todos, was als nächstes kommt |
| Arbeiter | `prompts/arbeiter.md` | Code schreiben, Features bauen, Änderungen ausführen |
| Sync | `prompts/sync.md` | Änderungen automatisch in die richtigen Dateien schreiben |

---

## Ordnerübersicht

```
restaurant-saas/
├── LIES_MICH_ZUERST.md         ← diese Datei
├── PROJEKT-DASHBOARD.md        ← Zentrale Übersicht (Fortschritt, Todos, Funktionen, Speicherorte)
├── README.md                   ← Vollständige Funktionsübersicht (alle Features, Logins, Speicherorte)
├── CLAUDE.md                   ← Automatische Regeln für Claude (wird immer gelesen)
├── .claude/skills/sync/        ← /sync Skill (Änderungen automatisch einordnen)
├── .claude/skills/frontend/    ← /frontend Skill (Frontend prüfen & optimieren)
├── .claude/skills/dsgvo/       ← /dsgvo Skill (DSGVO-Konformität prüfen)
├── .claude/skills/health-check/ ← /health-check Skill (Systemtest + Telegram-Bericht)
├── prompts/
│   ├── assistent.md            ← Projektmanager-Rolle
│   ├── arbeiter.md             ← Entwickler-Rolle
│   └── sync.md                 ← Sync-Regeln (Referenz)
├── project/
│   ├── status.md               ← Aktueller Projektstand
│   ├── todos.md                ← Aufgabenliste
│   ├── entscheidungen.md       ← Wichtige getroffene Entscheidungen
│   ├── marktanalyse.md         ← Wettbewerbsanalyse Restaurant-SaaS
│   ├── reservierungssysteme-vergleich.md  ← Detailvergleich Reservierungssysteme DACH
│   ├── dsgvo-log.md            ← DSGVO-Prüfprotokoll
│   ├── dsgvo-datenkatalog.md   ← Verarbeitungsverzeichnis (Art. 30 DSGVO)
│   └── tischplan-recherche.md  ← Marktanalyse Floor Plan Editor (react-konva, 10 Anbieter)
├── datenstruktur/
│   ├── datenbank-schema.md     ← Alle Tabellen & Felder
│   ├── api-endpunkte.md        ← API-Routen Übersicht
│   └── rollen.md               ← Nutzerrollen & Berechtigungen
├── dashboard/
│   ├── index.html              ← Interaktives Projekt-Dashboard (im Browser öffnen)
│   ├── sync-dashboard.js       ← Sync-Script: liest Projektdateien → generiert dashboard-data.js
│   └── dashboard-data.js       ← Generierte Daten (wird automatisch aktualisiert via Hook)
├── restaurant-app/
│   ├── backend/                ← Node.js + Express + TypeScript (Port 3001)
│   ├── frontend/               ← React + TypeScript + Tailwind (Port 5173)
│   │   └── FRONTEND.md         ← Zentrale Gestaltungsrichtlinie (immer aktuell)
│   ├── scripts/
│   │   └── health-check.sh     ← Täglicher Systemtest (Cronjob, Telegram)
│   └── database/               ← schema.sql + seed.sql
└── app/                        ← Alte Codebase (nicht mehr aktiv)
```

---

## DSGVO-Check

Beide Rollen führen bei jeder Session automatisch einen DSGVO-Check durch.
Das Protokoll wird in `project/dsgvo-log.md` gespeichert.
