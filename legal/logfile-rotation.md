# Logfile-Rotation (DSGVO Art. 5 Abs. 1 lit. e)

**Stand:** 25. April 2026

Server-Logs enthalten technische Daten, die unter Umständen einen Personenbezug ermöglichen
(IP-Adressen, User-Agent, Request-Pfade mit IDs). Sie dürfen nicht unbegrenzt aufbewahrt werden.

**Festgelegte Aufbewahrungsfrist:** 14 Tage. Danach automatische Löschung.

---

## 1. Application-Logs (Express, console.log/console.error)

**Aktueller Zustand:** stdout/stderr → Coolify übernimmt automatisch via Docker-Logging-Driver.

### Coolify-Konfiguration setzen

1. Im Coolify-Dashboard → Projekt **ServeFlow** → Service **backend** öffnen
2. Tab **Configuration** → **Logging**
3. Driver: `json-file`
4. Optionen setzen:
   ```
   max-size = 10m
   max-file = 14
   ```
   (10 MB pro Log-Datei × max. 14 Dateien = ca. 140 MB Rolling-Window, genug für 14 Tage normalen Traffic)
5. Speichern → Service neustarten, damit die Driver-Optionen greifen.

### Verifikation

Auf dem Hetzner-VPS prüfen:
```bash
docker inspect <container-name> --format='{{.HostConfig.LogConfig}}'
# Erwartete Ausgabe:
# {json-file map[max-file:14 max-size:10m]}
```

---

## 2. Datenbank (PostgreSQL Logs)

**Aktueller Zustand:** PostgreSQL läuft als Container, schreibt Logs nach stdout → ebenfalls Docker-Driver.
Gleiche Konfiguration wie oben anwenden für den **postgres**-Service in Coolify.

Falls eine externe PostgreSQL-Konfiguration genutzt wird, in `postgresql.conf`:
```
log_rotation_age = 1d
log_rotation_size = 100MB
log_truncate_on_rotation = on
```

---

## 3. Reverse Proxy (Traefik)

Coolify nutzt Traefik als eingebauten Reverse-Proxy. Access-Logs enthalten IP-Adressen!

In Coolify → Settings → **Traefik** → Konfiguration prüfen:
- `accesslog.bufferingsize` aktiv lassen
- `accesslog.fields.headers.defaultMode = drop` setzen, damit User-Agent etc. **nicht** geloggt werden
- Log-Driver: `json-file` mit `max-file=14` (siehe oben)

Alternativ: Access-Logs **komplett deaktivieren** in der Traefik-Konfiguration, wenn nicht für Debugging nötig:
```yaml
accesslog: false
```

---

## 4. Backups

Backup-Dateien auf Hetzner Object Storage:
- **Tägliches Backup:** automatisch via Hetzner Snapshot
- **Aufbewahrungsdauer:** 14 Tage (Hetzner-Default überprüfen, ggf. anpassen)
- **Verschlüsselung:** Backups sind serverseitig at-rest verschlüsselt (Hetzner Standard)

Hetzner-Console → Volumes → Snapshot-Policy:
- Backup-Plan: **daily**
- Aufbewahrung: **14 days**

---

## 5. Application-eigene Logs

Falls in Zukunft eine Logging-Library (winston, pino) eingebaut wird:
- Niemals personenbezogene Daten in Logs schreiben (siehe `dsgvo-log.md` Eintrag 2026-04-11)
- Logfile-Rotation auf 14 Tage konfigurieren (winston-daily-rotate-file mit `maxFiles: '14d'`)
- Log-Level: in Produktion `info`, niemals `debug` mit potenziell sensiblen Inhalten

---

## 6. Verantwortliche Aktion

Diese Konfiguration muss **einmalig** im Coolify-Dashboard gesetzt werden. Eine Wiederholung
ist nur nötig, wenn die Container neu erstellt werden (z.B. beim Wechsel auf einen neuen Server).

**Zu prüfen alle 6 Monate:** stichprobenhaft via `docker inspect` ob die Log-Konfiguration noch greift.

---

## Begründung der 14-Tage-Frist

- Gängige Praxis bei vergleichbaren SaaS-Anbietern (zwischen 7 und 30 Tagen)
- Reicht aus für nachträgliche Debugging-Sessions bei Incidents
- Kurz genug, um DSGVO-Art. 5 Abs. 1 lit. e (Speicherbegrenzung) zu erfüllen
- Bei Datenpanne: Logs sind während des 72h-Meldezeitraums noch verfügbar (Art. 33 DSGVO)
