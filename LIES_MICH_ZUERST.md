# Restaurant SaaS – Projektzentrale

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

---

## Ordnerübersicht

```
restaurant-saas/
├── LIES_MICH_ZUERST.md         ← diese Datei
├── prompts/
│   ├── assistent.md            ← Projektmanager-Rolle
│   └── arbeiter.md             ← Entwickler-Rolle
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
