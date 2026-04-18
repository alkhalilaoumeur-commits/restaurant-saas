# Spec: Kassensystem-Integration (POS Bridge)

**Status:** DRAFT — wartet auf Freigabe  
**Erstellt:** 2026-04-18  
**Feature-Slug:** `kassensystem-integration`  
**Autor:** Ilias + Claude

---

## 1. Problem & Ziel

**Problem:**  
Wenn ein Gast über die ServeFlow-App (QR-Menü) bestellt, erscheint die Bestellung nur in der ServeFlow-Oberfläche. Restaurantbetreiber, die ein physisches Kassensystem (z.B. orderbird, GASTROFIX, SumUp POS) nutzen, müssen jede Bestellung **manuell nochmal in die Kasse eintippen** — doppelter Aufwand, Fehlerquelle, Personalkosten.

**Ziel:**  
Neue Bestellungen aus ServeFlow werden **automatisch und in Echtzeit** an das Kassensystem des Restaurants weitergeleitet. Das Personal muss nichts mehr manuell eintippen. Die Kasse bleibt die buchhalterische Quelle (TSE, Tagesabschluss), ServeFlow ist die Bestell-Schnittstelle.

**KPI für Erfolg:**
- Bestellung in ServeFlow → erscheint in < 3 Sekunden auf dem Kassensystem
- 0 manuelle Einträge nötig nach Integration
- Fehler werden geloggt, Personal wird bei Fehlern benachrichtigt

---

## 2. Zielnutzer

| Nutzer | Kontext |
|--------|---------|
| **Restaurantbetreiber (Admin)** | Richtet die KSS-Integration in den Einstellungen ein (API-Key, Endpoint) |
| **Kassierer / Servicepersonal** | Sieht Bestellungen automatisch auf der Kasse — muss nichts tun |
| **Küche** | Keine Änderung — Küche arbeitet weiter mit ServeFlow-Küchenansicht |

---

## 3. Was gebaut wird (Scope IN)

### A — KSS-Konfiguration pro Restaurant
- Admin kann in den Einstellungen ein Kassensystem konfigurieren:
  - **Anbieter wählen** (Dropdown: Generic Webhook, orderbird, SumUp, Lightspeed, Manuell/Deaktiviert)
  - **Webhook-URL** (für Generic: wohin sollen wir POSTen?)
  - **API-Key / Secret** (für authentifizierte Endpunkte)
  - **Test-Button** — sendet eine Test-Bestellung zum Prüfen
- Konfiguration ist pro Restaurant gespeichert (Multi-Tenant)
- Credentials werden verschlüsselt in der DB gespeichert (nicht im Klartext)

### B — Outbound Webhook bei neuer Bestellung
- Sobald `POST /api/bestellungen` erfolgreich ist → **asynchroner Push** ans KSS
- Payload: normalisiertes JSON (Bestellung + Positionen + Extras + Tisch)
- Push ist **non-blocking**: Scheitert der KSS-Push, bleibt die Bestellung in ServeFlow trotzdem gespeichert
- Retry-Logik: 3 Versuche mit exponential backoff (1s, 5s, 30s)

### C — Audit-Log pro Integration
- Jeder Push wird geloggt: Timestamp, Status (success/failed), HTTP-Response-Code, Payload-Hash
- Log ist im Admin-Dashboard einsehbar (letzte 50 Einträge)
- Bei 3 aufeinanderfolgenden Fehlern → Email-Alert an Admin

### D — Spezifische Adapter (Phase 2, nach MVP)
- orderbird REST API Adapter
- SumUp POS API Adapter
- Lightspeed Restaurant API Adapter
- Jeder Adapter übersetzt ServeFlow-Format → KSS-natives Format

---

## 4. Was NICHT gebaut wird (Scope OUT)

- ❌ Pull-Mechanismus (KSS fragt ab) — zu komplex für MVP
- ❌ Synchronisation in Gegenrichtung (Zahlungen von Kasse → ServeFlow) — Phase 3
- ❌ Stornierungen automatisch an KSS weiterleiten — Phase 2
- ❌ Menü-Sync (Speisekarte aus KSS importieren) — separates Feature
- ❌ Fiscalisation / TSE-Anbindung — bleibt beim KSS-Anbieter
- ❌ Native KSS-Adapter in Phase 1 (nur Generic Webhook)

---

## 5. Datenmodell-Änderungen

### Neue Tabelle: `kss_konfiguration`

```sql
CREATE TABLE kss_konfiguration (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  anbieter        VARCHAR(50) NOT NULL DEFAULT 'deaktiviert',
  -- 'deaktiviert' | 'generic_webhook' | 'orderbird' | 'sumup' | 'lightspeed'
  webhook_url     TEXT,
  api_key_enc     TEXT,           -- AES-256 verschlüsselt, niemals im Klartext
  aktiv           BOOLEAN NOT NULL DEFAULT false,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ON kss_konfiguration(restaurant_id); -- max 1 KSS pro Restaurant
```

### Neue Tabelle: `kss_log`

```sql
CREATE TABLE kss_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  bestellung_id   UUID NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  anbieter        VARCHAR(50) NOT NULL,
  status          VARCHAR(20) NOT NULL, -- 'success' | 'failed' | 'retrying'
  http_status     INTEGER,
  fehler_meldung  TEXT,
  versuche        INTEGER NOT NULL DEFAULT 1,
  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
  naechster_versuch TIMESTAMPTZ
);

CREATE INDEX ON kss_log(restaurant_id, erstellt_am DESC);
CREATE INDEX ON kss_log(bestellung_id);
```

---

## 6. API-Endpunkte (Neu)

### KSS-Konfiguration verwalten

```
GET    /api/kss/konfiguration
       → { anbieter, webhook_url, aktiv, hat_api_key: boolean }
       Auth: Admin

POST   /api/kss/konfiguration
       Body: { anbieter: string, webhook_url?: string, api_key?: string }
       → { id, anbieter, aktiv }
       Auth: Admin

POST   /api/kss/test
       → { erfolg: boolean, http_status?: number, fehler?: string }
       Auth: Admin
       Sendet eine Demo-Bestellung an den konfigurierten Endpunkt
```

### KSS-Log einsehen

```
GET    /api/kss/log?limit=50
       → { logs: KssLog[], gesamt_fehler_heute: number }
       Auth: Admin
```

### Interner Webhook-Trigger (kein öffentlicher Endpunkt)

```
Intern: kssService.bestellungSenden(bestellung: Bestellung): Promise<void>
        Wird aufgerufen von bestellungen.ts nach erfolgreichem INSERT
```

---

## 7. Webhook-Payload (Generic Format)

Was ServeFlow an das Kassensystem sendet:

```typescript
interface KssBestellungPayload {
  event: 'neue_bestellung'
  serveflow_version: '1.0'
  timestamp: string                    // ISO 8601
  bestellung: {
    id: string                         // UUID
    tisch_nummer: number
    anmerkung: string | null
    gesamtpreis: number                // EUR, z.B. 24.50
    positionen: Array<{
      name: string                     // Gericht-Name
      menge: number
      einzelpreis: number              // inkl. Extras
      extras: Array<{
        name: string
        aufpreis: number
      }>
    }>
  }
}
```

HTTP-Headers die mitgesendet werden:
```
Content-Type: application/json
X-ServeFlow-Signature: HMAC-SHA256(payload, api_key)  // für Authentizität
X-ServeFlow-Event: neue_bestellung
X-ServeFlow-Restaurant-ID: <restaurant_id>
```

---

## 8. Akzeptanzkriterien (testbar)

| # | Kriterium | Test-Typ |
|---|-----------|----------|
| AC1 | Admin kann Webhook-URL + API-Key speichern; API-Key wird verschlüsselt in DB gespeichert, niemals im Klartext zurückgegeben | Unit + Integration |
| AC2 | Nach einer neuen Bestellung wird innerhalb von 3s ein HTTP-POST an die Webhook-URL gesendet | Integration |
| AC3 | Wenn KSS-Endpunkt nicht erreichbar: Bestellung wird trotzdem in ServeFlow gespeichert (non-blocking) | Integration |
| AC4 | Bei HTTP-Fehler: 3 Retry-Versuche (1s, 5s, 30s Delay) | Unit |
| AC5 | Jeder Push-Versuch (Erfolg + Fehler) wird in `kss_log` gespeichert | Integration |
| AC6 | Nach 3 aufeinanderfolgenden Fehlern: Email-Alert an Admin | Integration |
| AC7 | Test-Button sendet Demo-Payload und gibt Ergebnis zurück | Integration |
| AC8 | HMAC-Signatur im Header ist korrekt berechnet | Unit |
| AC9 | Multi-Tenant: KSS-Konfiguration ist per restaurant_id isoliert | Integration |
| AC10 | Bei deaktivierter Integration: kein Push, kein Log-Eintrag | Unit |

---

## 9. Technische Architektur

```
Gast bestellt
    ↓
POST /api/bestellungen
    ↓
DB-Transaction (INSERT bestellungen + positionen + extras)
    ↓
Socket.io emit 'neue_bestellung' (Küche/Service sehen es)
    ↓
kssService.bestellungSenden(bestellung)  ← NEU (async, non-blocking)
    ↓
KSS-Konfiguration für restaurant_id laden
    ↓
    ├── Deaktiviert? → abbrechen
    ├── Generic Webhook? → HTTP-POST mit KssBestellungPayload
    ├── orderbird? → orderbird-Adapter (Phase 2)
    └── SumUp? → SumUp-Adapter (Phase 2)
         ↓
    Retry-Logic (3x) → kss_log speichern
         ↓
    Bei 3 Fehlern → Email via email.ts
```

---

## 10. Neue Dateien

```
restaurant-app/backend/src/
├── services/
│   └── kss.ts              ← Haupt-Service (Push-Logik, Retry, Log)
├── routes/
│   └── kss.ts              ← REST-Endpunkte für Konfig + Log
├── models/
│   └── KssKonfiguration.ts ← DB-Queries für kss_konfiguration + kss_log
restaurant-app/database/
└── migration-kss.sql       ← DB-Migration

restaurant-app/frontend/src/
├── pages/
│   └── KassensystemEinstellungen.tsx  ← Admin-Einstellungsseite
├── hooks/
│   └── useKss.ts           ← API-Calls (Konfig lesen/schreiben, Logs)
```

---

## 11. Geänderte Dateien

| Datei | Änderung |
|-------|---------|
| `backend/src/server.ts` | `kssRouter` registrieren |
| `backend/src/routes/bestellungen.ts` | Nach erfolgreichem INSERT: `kssService.bestellungSenden()` aufrufen |
| `frontend/src/pages/Einstellungen.tsx` | Link zur neuen KSS-Einstellungsseite |
| `frontend/src/App.tsx` | Route für `KassensystemEinstellungen` |

---

## 12. Offene Fragen (vor Implementierung klären)

1. **Welches Kassensystem hat das Pilot-Restaurant?**  
   → Bestimmt welchen Adapter wir in Phase 1 zusätzlich zum Generic Webhook bauen
   
2. **Verschlüsselung der API-Keys:**  
   Nutzen wir einen Umgebungsvariablen-basierten Encryption-Key (`KSS_ENCRYPTION_KEY`) oder eine Key-Management-Lösung?  
   → Empfehlung: AES-256-GCM mit Env-Variable für MVP

3. **Retry-Queue:**  
   Soll die Retry-Logik in-memory (einfacher, geht verloren bei Server-Neustart) oder persistent (DB-Queue, robuster) sein?  
   → Empfehlung: In-memory für MVP, DB-Queue in Phase 2

4. **Welcher KSS-Anbieter soll in Phase 1 unterstützt werden?**  
   Optionen: Generic Webhook only / orderbird / SumUp POS / Lightspeed

---

## 13. Implementierungs-Reihenfolge (Tasks)

1. `migration-kss.sql` — DB-Tabellen anlegen
2. `KssKonfiguration.ts` — Model (DB-Queries)
3. `kss.ts` (Service) — Push-Logik + Retry + Log
4. `kss.ts` (Route) — REST-Endpunkte
5. `bestellungen.ts` — Service-Aufruf einbauen
6. `server.ts` — Router registrieren
7. `useKss.ts` — Frontend Hook
8. `KassensystemEinstellungen.tsx` — Admin UI
9. `Einstellungen.tsx` + `App.tsx` — Routing einbauen
10. Manuelle Tests: Test-Button, echte Bestellung → Webhook empfangen

---

*Spec-Version: 1.0 — DRAFT*
