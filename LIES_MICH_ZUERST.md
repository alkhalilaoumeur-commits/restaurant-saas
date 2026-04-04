# Restaurant SaaS – Projektzentrale

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
├── CLAUDE.md                   ← Automatische Regeln für Claude (wird immer gelesen)
├── .claude/skills/sync/        ← /sync Skill (Änderungen automatisch einordnen)
├── prompts/
│   ├── assistent.md            ← Projektmanager-Rolle
│   ├── arbeiter.md             ← Entwickler-Rolle
│   └── sync.md                 ← Sync-Regeln (Referenz)
├── project/
│   ├── status.md               ← Aktueller Projektstand
│   ├── todos.md                ← Aufgabenliste
│   ├── entscheidungen.md       ← Wichtige getroffene Entscheidungen
│   └── dsgvo-log.md            ← DSGVO-Prüfprotokoll
├── datenstruktur/
│   ├── datenbank-schema.md     ← Alle Tabellen & Felder
│   ├── api-endpunkte.md        ← API-Routen Übersicht
│   └── rollen.md               ← Nutzerrollen & Berechtigungen
└── app/                        ← Hier kommt später der Code rein
```

---

## DSGVO-Check

Beide Rollen führen bei jeder Session automatisch einen DSGVO-Check durch.
Das Protokoll wird in `project/dsgvo-log.md` gespeichert.
