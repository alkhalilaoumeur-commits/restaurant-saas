# Sync-Prompt: Änderungen automatisch einordnen

> **Diesen Prompt am Anfang jeder Session nutzen, oder in CLAUDE.md einbinden.**
> Er sorgt dafür, dass Claude alle Änderungen sofort in die richtige Datei schreibt.

---

## Regel: Nichts geht verloren

Bei JEDER Änderung – egal ob Ilias etwas erzählt, eine Entscheidung trifft, eine Aufgabe erledigt wird oder neuer Code geschrieben wird – aktualisiere sofort die passende Datei:

### Was wohin gehört

| Was passiert ist | Datei aktualisieren |
|---|---|
| Aufgabe erledigt | `project/todos.md` → Checkbox auf `[x]` setzen |
| Neue Aufgabe kommt dazu | `project/todos.md` → In die richtige Phase eintragen |
| Projektstand ändert sich | `project/status.md` → "Was bisher erledigt ist" aktualisieren |
| Entscheidung getroffen | `project/entscheidungen.md` → Neue Zeile mit Datum + Begründung |
| Neue DB-Tabelle/Feld | `datenstruktur/datenbank-schema.md` aktualisieren |
| Neue API-Route | `datenstruktur/api-endpunkte.md` aktualisieren |
| Rollen/Berechtigungen ändern sich | `datenstruktur/rollen.md` aktualisieren |
| DSGVO-relevante Änderung | `project/dsgvo-log.md` → Neuen Eintrag hinzufügen |
| Neue Projektdatei erstellt | `LIES_MICH_ZUERST.md` → Ordnerübersicht aktualisieren |
| Tool/Software installiert | `project/status.md` → Bekannte Probleme aktualisieren |
| Preismodell/Business ändert sich | `project/projektgrundlage.md` aktualisieren |
| Neuer Wettbewerber/Marktinfo | `project/marktanalyse.md` aktualisieren |

### So gehst du vor

1. **Zuhören** – Was hat Ilias gesagt oder was wurde gerade gemacht?
2. **Einordnen** – Welche Datei(en) sind betroffen? (siehe Tabelle oben)
3. **Sofort schreiben** – Nicht warten, nicht fragen. Direkt aktualisieren.
4. **Bestätigen** – Kurz sagen: "Habe X in Y aktualisiert."

### Wichtige Regeln

- **Nie vergessen:** Wenn eine Todo erledigt wird → `todos.md` UND `status.md` aktualisieren
- **Datum immer mit:** Einträge in `entscheidungen.md` und `dsgvo-log.md` bekommen immer das aktuelle Datum
- **Phase beachten:** Neue Todos kommen in die richtige Phase (1-5 oder "Irgendwann")
- **Keine Duplikate:** Vor dem Eintragen prüfen, ob es den Eintrag schon gibt
- **Bekannte Probleme:** Wenn ein Problem gelöst wird → aus `status.md` entfernen
- **Dashboard:** Nach größeren Änderungen Ilias fragen: "Soll ich das Dashboard auch aktualisieren?"

### Beispiel

Ilias sagt: "Node.js ist jetzt installiert"

→ Claude macht sofort:
1. `project/todos.md`: `- [x] Node.js installieren (via nvm, Version 20)` 
2. `project/status.md`: "Node.js noch nicht installiert" entfernen
3. Bestätigung: "Node.js in Todos als erledigt markiert und aus den offenen Problemen entfernt."
