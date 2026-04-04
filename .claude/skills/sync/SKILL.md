---
name: sync
description: Synchronisiert Änderungen in die Projektdateien. Nutze diesen Skill wenn sich etwas am Projekt ändert, eine Aufgabe erledigt wurde, eine Entscheidung getroffen wurde, oder neue Infos dazukommen.
allowed-tools: Read Edit Write Grep Glob
argument-hint: [was hat sich geändert]
---

# Sync: Änderungen in Projektdateien einordnen

Der Nutzer hat dir eine Änderung mitgeteilt. Ordne sie sofort in die richtigen Projektdateien ein.

## Was der Nutzer gesagt hat

$ARGUMENTS

## Schritt 1: Aktuelle Dateien lesen

Lies zuerst die Dateien, die betroffen sein könnten:

- `project/status.md` – Aktueller Projektstand
- `project/todos.md` – Aufgabenliste
- `project/entscheidungen.md` – Entscheidungslog
- `project/dsgvo-log.md` – DSGVO-Protokoll
- `project/projektgrundlage.md` – Vision, Features, Preismodell
- `project/marktanalyse.md` – Wettbewerber
- `datenstruktur/datenbank-schema.md` – DB-Tabellen
- `datenstruktur/api-endpunkte.md` – API-Routen
- `datenstruktur/rollen.md` – Nutzerrollen
- `LIES_MICH_ZUERST.md` – Ordnerübersicht

## Schritt 2: Einordnen nach dieser Tabelle

| Art der Änderung | Datei(en) aktualisieren |
|---|---|
| Aufgabe erledigt | `project/todos.md` → `[x]` setzen + Datum, `project/status.md` → aktualisieren |
| Neue Aufgabe | `project/todos.md` → In richtige Phase eintragen |
| Entscheidung getroffen | `project/entscheidungen.md` → Neue Zeile mit Datum + Begründung |
| Projektstand ändert sich | `project/status.md` → Abschnitt aktualisieren |
| Neue DB-Tabelle oder Feld | `datenstruktur/datenbank-schema.md` |
| Neue API-Route | `datenstruktur/api-endpunkte.md` |
| Rollen/Berechtigungen | `datenstruktur/rollen.md` |
| DSGVO-relevante Änderung | `project/dsgvo-log.md` → Neuen Eintrag mit Datum |
| Neue Datei/Ordner erstellt | `LIES_MICH_ZUERST.md` → Ordnerübersicht erweitern |
| Problem gelöst | `project/status.md` → Aus "Bekannte Probleme" entfernen |
| Feature/Vision ändert sich | `project/projektgrundlage.md` |
| Preis/Business ändert sich | `project/projektgrundlage.md` |
| Neuer Wettbewerber | `project/marktanalyse.md` |
| Tool/Software installiert | `project/status.md` → Probleme aktualisieren, `project/todos.md` → abhaken |

## Schritt 3: Schreiben

- Aktualisiere ALLE betroffenen Dateien (oft sind es mehrere gleichzeitig)
- Setze bei Einträgen in `entscheidungen.md` und `dsgvo-log.md` immer das heutige Datum
- Prüfe vor dem Eintragen, ob der Eintrag schon existiert (keine Duplikate)
- Wenn eine Todo erledigt wird: IMMER sowohl `todos.md` als auch `status.md` aktualisieren

## Schritt 4: Bestätigung

Gib eine kurze Zusammenfassung auf Deutsch:
- Welche Dateien wurden aktualisiert
- Was genau wurde geändert
- Was der nächste logische Schritt wäre
