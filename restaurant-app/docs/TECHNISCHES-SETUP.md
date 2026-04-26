# Restaurant SaaS — Technisches Setup: Auth, Realtime & Storage

> Letzte Aktualisierung: 06.04.2026

## Überblick

Wir nutzen **kein Supabase** und keine BaaS-Plattform. Stattdessen bauen wir alles selbst mit bewährten Open-Source-Libraries. Das gibt uns volle Kontrolle über Daten, DSGVO-Konformität und Multi-Tenant-Logik.

| Bereich | Technologie | Status |
|---|---|---|
| **Auth** | JWT + bcrypt + eigene Middleware | Fertig |
| **Realtime** | Socket.io | Fertig |
| **Storage** | multer + S3-kompatibel (geplant) | Offen |
| **Email** | Nodemailer (SMTP) | Fertig |
| **Datenbank** | PostgreSQL direkt (pg Library) | Fertig |

### Tech-Stack

- **Backend:** Node.js + Express + TypeScript (Port 3001)
- **Frontend:** React + TypeScript + Tailwind + Vite (Port 5173)
- **Datenbank:** PostgreSQL
- **Realtime:** Socket.io
- **State Management:** Zustand (Frontend)

---

## 1. Authentication (Auth)

### Ablauf-Diagramm

```
[Frontend]                           [Backend]                        [PostgreSQL]
    │                                    │                                │
    │── POST /api/auth/login ───────────>│                                │
    │   { email, passwort }              │── SELECT * FROM mitarbeiter ──>│
    │                                    │<── Mitarbeiter-Datensatz ──────│
    │                                    │                                │
    │                                    │  1. bcrypt.compare(passwort, hash)
    │                                    │  2. jwt.sign({ mitarbeiterId,
    │                                    │       restaurantId, rolle })
    │                                    │                                │
    │<── { token, mitarbeiter } ─────────│                                │
    │                                    │                                │
    │  Token wird in localStorage        │                                │
    │  gespeichert (Zustand Store)       │                                │
    │                                    │                                │
    │── GET /api/bestellungen ──────────>│                                │
    │   Header: Authorization:           │                                │
    │   Bearer <token>                   │  jwt.verify() → auth-Objekt   │
    │                                    │  restaurantId aus Token nehmen │
    │                                    │── SELECT WHERE restaurant_id──>│
    │<── Bestellungen ───────────────────│<──────────────────────────────│
```

### Beteiligte Dateien

| Datei | Aufgabe |
|---|---|
| `backend/src/routes/auth.ts` | Alle Auth-Endpunkte (Login, Registrierung, Passwort-Reset, Email-Verifizierung, Einladungen) |
| `backend/src/middleware/auth.ts` | `requireAuth` prüft JWT-Token, `requireRolle` prüft Benutzer-Rolle |
| `backend/src/services/email.ts` | Versendet Verifizierungs-, Einladungs- und Reset-Emails |
| `frontend/src/store/auth.ts` | Zustand-Store — speichert Token + User-Daten persistent im localStorage |
| `frontend/src/lib/api.ts` | Hängt den Bearer-Token automatisch an jeden API-Request an |

### Auth-Flows im Detail

#### Registrierung (`POST /api/auth/registrieren`)

1. Frontend schickt Admin-Daten + Restaurant-Daten in **einem** Request
2. Backend validiert alles (Email-Format, Passwort-Stärke, Duplikat-Check)
3. Innerhalb einer **DB-Transaktion** (alles oder nichts):
   - Restaurant anlegen (mit auto-generiertem Code)
   - Admin-Mitarbeiter anlegen (Passwort wird mit bcrypt gehasht, 12 Runden)
   - Tische anlegen (falls Anzahl angegeben)
   - Öffnungszeiten speichern (falls angegeben)
4. Verifizierungs-Email wird **asynchron** gesendet (blockiert nicht die Response)
5. JWT wird sofort zurückgegeben → User ist direkt eingeloggt

#### Login (`POST /api/auth/login`)

1. Email + Passwort kommen rein
2. Backend sucht Mitarbeiter in DB (`WHERE email = $1 AND aktiv = true`)
3. bcrypt vergleicht Passwort mit gespeichertem Hash
4. Bei Erfolg: JWT mit `{ mitarbeiterId, restaurantId, rolle }` wird generiert und zurückgegeben
5. **Sicherheit:** Bei Fehler immer die gleiche Meldung ("Ungültige Anmeldedaten") — egal ob User nicht existiert oder Passwort falsch ist. Verhindert User-Enumeration.

#### Passwort-Reset (`POST /api/auth/passwort-vergessen`)

1. User gibt Email ein
2. Backend generiert zufälligen Token (32 Bytes → 64 Hex-Zeichen)
3. Token wird in `passwort_resets`-Tabelle gespeichert (gültig: 1 Stunde)
4. Email mit Reset-Link wird gesendet
5. User klickt Link → setzt neues Passwort → alle offenen Reset-Tokens werden invalidiert

#### Mitarbeiter-Einladung (`POST /api/auth/einladung-annehmen`)

1. Admin erstellt Mitarbeiter → Einladungs-Token wird generiert
2. Email mit Einladungs-Link wird versendet (gültig: 48 Stunden)
3. Mitarbeiter klickt Link → sieht Restaurant-Name + eigene Rolle
4. Setzt eigenes Passwort → ist sofort eingeloggt (JWT wird zurückgegeben)

### Geschützte Routes

```typescript
// So wird eine Route geschützt:
router.get('/bestellungen', requireAuth, requireRolle('admin', 'kellner'), handler);

// In der Route: restaurant_id IMMER aus dem Token, NIE vom Client:
const restaurantId = req.auth!.restaurantId;
```

### JWT-Struktur

```json
{
  "mitarbeiterId": "uuid-des-mitarbeiters",
  "restaurantId": "uuid-des-restaurants",
  "rolle": "admin | kellner | kueche",
  "iat": 1712345678,
  "exp": 1712950478
}
```

- **Algorithmus:** HS256
- **Signiert mit:** `process.env.JWT_SECRET`
- **Gültigkeit:** `process.env.JWT_EXPIRES_IN` (Standard: 7 Tage)

### Frontend Auth-Store

```typescript
// Zustand Store mit automatischer localStorage-Persistenz
// Key im localStorage: "restaurant-auth"
// Enthält: { token, mitarbeiter, demo }

// Nach Login:
useAuthStore.getState().login(token, mitarbeiter);

// Logout (löscht alles):
useAuthStore.getState().logout();

// api.ts liest den Token automatisch aus dem Store
// und hängt ihn als "Authorization: Bearer <token>" an jeden Request.
// Bei 401-Response → automatischer Redirect zu /login + Token löschen.
```

### Rollen-System

| Rolle | Zugriff |
|---|---|
| `admin` | Alles — Mitarbeiter verwalten, Einstellungen, Statistiken, Speisekarte |
| `kellner` | Bestellungen, Tische, Reservierungen |
| `kueche` | Bestellungen einsehen + Status ändern |

### Sicherheits-Features

- **Rate-Limiting:** Max 5 Login-Versuche / 15 Min, Max 3 Registrierungen / Stunde, Max 5 Passwort-Resets / Stunde
- **Passwort-Anforderungen:** Min. 8 Zeichen, 1 Großbuchstabe, 1 Zahl
- **bcrypt:** 12 Salt-Runden (branchenüblich für Production)
- **Anti-User-Enumeration:** Identische Fehlermeldung egal ob User existiert oder nicht
- **Multi-Tenant-Isolation:** `restaurant_id` kommt IMMER aus dem JWT, nie vom Client
- **Token-Invalidierung:** Bei Passwort-Reset werden alle offenen Tokens invalidiert

### Auth-Endpunkte (komplett)

| Methode | Route | Funktion | Rate-Limit |
|---|---|---|---|
| POST | `/api/auth/login` | Login → JWT zurück | 5/15min |
| POST | `/api/auth/registrieren` | Restaurant + Admin anlegen → JWT zurück | 3/Stunde |
| GET | `/api/auth/email-verifizieren/:token` | Email-Adresse bestätigen | — |
| POST | `/api/auth/verifizierung-erneut` | Neue Verifizierungs-Email senden | — |
| POST | `/api/auth/passwort-vergessen` | Reset-Link per Email senden | 5/Stunde |
| POST | `/api/auth/passwort-zuruecksetzen` | Neues Passwort mit Token setzen | — |
| POST | `/api/auth/einladung-annehmen` | Eingeladener Mitarbeiter setzt Passwort | — |
| GET | `/api/auth/einladung/:token` | Einladungs-Details anzeigen (Name, Rolle, Restaurant) | — |

---

## 2. Realtime (Socket.io)

### Ablauf-Diagramm

```
[Kellner-Browser]          [Server (Socket.io)]          [Küchen-Display]
      │                           │                            │
      │── raum_beitreten ────────>│                            │
      │   (restaurantId)          │<── raum_beitreten ─────────│
      │                           │                            │
      │── POST /api/bestellungen─>│                            │
      │   (neue Bestellung)       │                            │
      │                           │── emit('neue_bestellung')─>│
      │                           │   an alle im Restaurant    │
      │                           │                            │
      │<── 'neue_bestellung' ─────│                            │

[Gast-Handy]               [Server (Socket.io)]
      │                           │
      │── tisch_beitreten ───────>│    (kein Auth nötig)
      │   { restaurantId,         │
      │     tischId }             │
      │                           │
      │<── 'bestellung_          │
      │     aktualisiert' ────────│    (Gast sieht Status-Updates)
```

### Beteiligte Dateien

| Datei | Aufgabe |
|---|---|
| `backend/src/server.ts` | Socket.io Server-Setup, JWT-Prüfung bei Verbindung, Raum-Beitritt-Logik |
| `backend/src/routes/bestellungen.ts` | Emittiert Realtime-Events nach DB-Writes |
| `frontend/src/hooks/useSocket.ts` | Singleton Socket-Verbindung, liest Token aus localStorage |

### Raum-Konzept

Socket.io nutzt "Räume" — ein Raum ist eine Gruppe von Verbindungen die gemeinsam Events empfangen.

```
restaurant:abc123          ← Alle Mitarbeiter von Restaurant abc123
tisch:abc123:tisch456      ← Gäste an Tisch 456 von Restaurant abc123
```

**Mitarbeiter-Räume** — nur mit gültigem JWT:
```typescript
// Server prüft: gehört der Mitarbeiter zu diesem Restaurant?
socket.on('raum_beitreten', (restaurantId) => {
  if (socket.data.auth?.restaurantId === restaurantId) {
    socket.join(`restaurant:${restaurantId}`);
  }
});
```

**Gäste-Räume** — kein Auth nötig (Gast hat QR-Code gescannt):
```typescript
socket.on('tisch_beitreten', (data) => {
  socket.join(`tisch:${data.restaurantId}:${data.tischId}`);
});
```

### Events die gesendet werden

Aktuell implementiert:

```typescript
// Nach Bestellung erstellen (bestellungen.ts):
io.to(`restaurant:${restaurant_id}`).emit('neue_bestellung', { bestellungId, tisch_id });

// Nach Bestell-Status-Änderung:
io.to(`restaurant:${restaurantId}`).emit('bestellung_aktualisiert', bestellung);
io.to(`tisch:${restaurantId}:${tischId}`).emit('bestellung_aktualisiert', bestellung);
```

Noch einzubauen:

| Event | Auslöser | Empfänger |
|---|---|---|
| `tisch_status` | Tisch wird frei/besetzt | Restaurant-Raum |
| `neue_reservierung` | Reservierung erstellt | Restaurant-Raum |
| `kellner_ruf` | Gast drückt "Kellner rufen" | Restaurant-Raum |
| `speisekarte_aktualisiert` | Gericht wird geändert | Restaurant-Raum + alle Tisch-Räume |

### Frontend Socket-Verbindung

```typescript
// useSocket.ts — Singleton-Pattern
// Es gibt nur EINE WebSocket-Verbindung pro Browser-Tab.
// Token wird beim Verbindungsaufbau mitgeschickt.
// Transport: nur WebSocket (kein HTTP Long-Polling Fallback).

// Nutzung in einer Komponente:
const socket = useSocket();
useEffect(() => {
  if (!socket) return;
  socket.on('neue_bestellung', (data) => {
    // UI aktualisieren
  });
}, [socket]);
```

### Wichtig: Manuelles Event-Emitting

Anders als Supabase Realtime (das automatisch auf DB-Änderungen lauscht) muss bei uns **nach jedem relevanten DB-Write manuell ein Event emittiert werden**. Das passiert in den Route-Handlern:

```typescript
// In jeder Route die Realtime braucht:
import { io } from '../server';

// Nach dem DB-Write:
io.to(`restaurant:${restaurantId}`).emit('event_name', daten);
```

**Vorteil:** Wir kontrollieren exakt welche Events wann an wen gehen. Kein versehentliches Leaken von Daten.

---

## 3. Storage (Datei-Uploads) — noch offen

### Was gebraucht wird

Das DB-Schema hat bereits Felder für Bild-URLs:
- `gerichte.bild_url` — Fotos der Speisekarten-Gerichte
- `restaurants.logo_url` — Restaurant-Logo

### Geplantes Setup

#### Dev-Phase: Lokaler Upload mit multer

```
Frontend                        Backend                          Dateisystem
    │                               │                                │
    │── POST /api/upload ──────────>│                                │
    │   (multipart/form-data)       │── multer middleware ──────────>│
    │                               │   Validierung (Typ, Größe)     │── /uploads/uuid.webp
    │                               │   sharp (Resize → max 800px)   │
    │                               │                                │
    │<── { url: "/uploads/..." } ───│                                │
```

#### Production: S3-kompatibel (Hetzner Object Storage)

```
Frontend                        Backend                          S3 Bucket
    │                               │                                │
    │── POST /api/upload ──────────>│                                │
    │   (multipart/form-data)       │── multer (Memory-Storage) ────>│
    │                               │   sharp (Resize)               │── PutObject
    │                               │   @aws-sdk/client-s3           │
    │                               │                                │
    │<── { url: "https://..." } ────│                                │
```

### Benötigte Packages

```bash
npm install multer sharp            # Upload-Handling + Bild-Resize
npm install @aws-sdk/client-s3      # Nur für Production (S3/Hetzner)
npm install @types/multer --save-dev
```

### Sicherheits-Anforderungen

| Regel | Grund |
|---|---|
| Nur Bilder erlauben (`image/jpeg`, `image/png`, `image/webp`) | Verhindert Upload von ausführbaren Dateien |
| Max. Dateigröße: 5 MB | Server-Schutz vor überdimensionierten Uploads |
| Bilder automatisch resizen (max 800px Breite) mit `sharp` | Bandbreite sparen, schnellere Ladezeiten |
| Dateinamen: UUID generieren, **nie** den Original-Namen verwenden | Verhindert Path-Traversal-Angriffe |
| Auth erforderlich (`requireAuth`) | Nur eingeloggte Mitarbeiter dürfen hochladen |
| `restaurant_id` aus JWT, nicht vom Client | Multi-Tenant-Isolation |

---

## 4. Email-System

### Ablauf

```
[Backend-Route]              [email.ts]                  [SMTP Server]
    │                            │                            │
    │── emailVerifizierung       │                            │
    │   Senden(email, token) ───>│                            │
    │                            │── nodemailer.sendMail() ──>│
    │                            │                            │── Email an User
```

### Dev-Modus vs. Production

| | Dev-Modus | Production |
|---|---|---|
| **Trigger** | Keine SMTP-Variablen gesetzt | `SMTP_HOST` etc. in `.env` |
| **Verhalten** | Email wird in die **Konsole** geloggt (inkl. klickbarem Link) | Email wird über SMTP-Server gesendet |
| **Setup** | Nichts nötig | SMTP-Zugangsdaten konfigurieren |

### Email-Typen

| Email | Wann | Gültigkeit |
|---|---|---|
| Email-Verifizierung | Nach Registrierung | 24 Stunden |
| Mitarbeiter-Einladung | Admin lädt MA ein | 48 Stunden |
| Passwort-Reset | User klickt "Vergessen" | 1 Stunde |

---

## 5. Datenbank-Zugriff

### Hilfsfunktionen (`backend/src/models/db.ts`)

```typescript
q<T>(sql, params)              // Mehrere Zeilen zurück (Array)
q1<T>(sql, params)             // Eine Zeile oder null
transaction(async (client) => { ... })  // Alles oder nichts
```

### Wichtige Auth-Tabellen

```sql
-- Mitarbeiter (= User-Tabelle)
mitarbeiter (
  id, restaurant_id, name, email, passwort_hash,
  rolle ['admin'|'kellner'|'kueche'],
  aktiv, email_verifiziert,
  verifizierung_token, einladung_token, einladung_gueltig_bis
)

-- Passwort-Resets
passwort_resets (
  id, mitarbeiter_id, token, gueltig_bis, benutzt
)

-- Restaurants (= Tenants)
restaurants (
  id, name, abo_status ['trial'|'active'|'expired'],
  logo_url, strasse, plz, stadt, telefon, email, waehrung, ...
)
```

### Multi-Tenant-Regel

**JEDE Query filtert nach `restaurant_id`.** Die ID kommt **immer** aus dem JWT-Token (`req.auth.restaurantId`), **nie** vom Client (Body, Query-Parameter, URL). Das stellt sicher, dass Restaurant A niemals Daten von Restaurant B sehen kann.

---

## 6. Environment-Variablen

```env
# ── Pflicht ──────────────────────────────────────────

# PostgreSQL-Verbindung
DATABASE_URL=postgresql://user:pass@localhost:5432/restaurant_db

# JWT-Signierung (min. 32 zufällige Zeichen!)
JWT_SECRET=ein-langes-zufaelliges-geheimnis-min-32-zeichen

# Frontend-URL (für CORS-Konfiguration + Links in Emails)
FRONTEND_URL=http://localhost:5173

# ── Optional ─────────────────────────────────────────

# Server-Port (Standard: 3001)
PORT=3001

# JWT-Gültigkeit (Standard: 7d)
JWT_EXPIRES_IN=7d

# Email/SMTP (ohne = Dev-Modus, Emails in Konsole)
# Versand via Resend (3000/Monat gratis), Empfang via Cloudflare Email Routing
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_xxxxx
EMAIL_FROM=ServeFlow <noreply@serve-flow.org>

# Storage/S3 (noch nicht implementiert)
S3_ENDPOINT=https://fsn1.your-objectstorage.com
S3_BUCKET=restaurant-uploads
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=eu-central-1
```

---

## 7. Projekt starten

```bash
# 1. Datenbank aufsetzen
psql $DATABASE_URL -f restaurant-app/database/schema.sql
psql $DATABASE_URL -f restaurant-app/database/seed.sql

# 2. Backend starten
cd restaurant-app/backend
cp .env.example .env     # Env-Variablen anpassen
npm install
npm run dev              # → http://localhost:3001

# 3. Frontend starten
cd restaurant-app/frontend
npm install
npm run dev              # → http://localhost:5173
```

### Test-Accounts (nach seed.sql)

| Email | Passwort | Rolle |
|---|---|---|
| admin@demo.de | test1234 | admin |
| kellner@demo.de | test1234 | kellner |
| kueche@demo.de | test1234 | kueche |

---

## 8. Vergleich: Unsere Lösung vs. Supabase

| Supabase | Unsere Lösung | Vorteil |
|---|---|---|
| `supabase.auth` | JWT + bcrypt + eigene Routes | Volle Kontrolle, Multi-Tenant, Einladungs-System, Rollen |
| Supabase Realtime | Socket.io mit Räumen | Gezieltes Event-Routing pro Restaurant/Tisch |
| Supabase Storage | multer + S3 (geplant) | DSGVO-konform auf EU-Servern, keine Vendor-Abhängigkeit |
| Supabase DB | PostgreSQL direkt (pg) | Keine Plattform-Abhängigkeit, volle SQL-Kontrolle |
| Row Level Security | `requireAuth` + `requireRolle` Middleware | Einfacher zu debuggen, explizit im Code sichtbar |
| Dashboard/UI | — | Brauchen wir nicht — wir haben eigenes Admin-Panel |

### Warum kein Supabase?

1. **Multi-Tenant:** Supabase hat kein eingebautes Multi-Tenant-Konzept. Wir bräuchten RLS-Policies für jede Tabelle — fehleranfällig und schwer zu debuggen.
2. **Kontrolle:** Auth-Flows (Einladungen, Rollen, Email-Verifizierung) sind zu spezifisch für generische Lösungen.
3. **DSGVO:** Volle Kontrolle über Datenhaltung — wir wissen genau wo jedes Byte liegt.
4. **Kosten:** PostgreSQL + Express + Socket.io = kostenlose Open-Source-Tools. Skaliert auf jedem Server.
5. **Kein Lock-in:** Wir können den Server überall deployen (Hetzner, AWS, eigener Server).
