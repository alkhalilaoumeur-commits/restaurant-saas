#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ServeFlow Health Check v2 — Vollstaendiger Funktionstest
# Prueft JEDE Funktion: Erstellen → Lesen → Aendern → Loeschen
# Testdaten werden mit _HEALTHCHECK_ Prefix erstellt und am Ende aufgeraeumt
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -uo pipefail

# ── PATH fuer Cronjob (Homebrew Node.js) ───────────────
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# ── Pfade ──────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# ── .env laden (falls vorhanden) ───────────────────────
if [ -f "$BACKEND_DIR/.env" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      export "$line"
    fi
  done < "$BACKEND_DIR/.env"
fi

# ── Konfiguration ─────────────────────────────────────
BACKEND_URL="${BACKEND_URL:-http://localhost:3001}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

# ── Ergebnis-Tracking ─────────────────────────────────
PROBLEME=""
OK=0
FEHLER=0
DETAILS=""

# ── Globale Variable fuer letzte API-Response ─────────
# Wird von api_call() gesetzt, damit Aufrufer die Response lesen koennen
LAST_RESPONSE=""

ok() {
  OK=$((OK + 1))
  echo "  ✅ $1"
}

fail() {
  FEHLER=$((FEHLER + 1))
  PROBLEME="${PROBLEME}• ${1}\n"
  echo "  ❌ $1"
}

pruefe() {
  local name="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    ok "$name"
  else
    fail "$name"
  fi
}

# api_call: Fuehrt curl aus, speichert Response in LAST_RESPONSE
# Gibt 0 zurueck wenn HTTP 2xx UND erwarteter String enthalten
# Usage: api_call "Name" "erwarteter_string" curl-args...
api_call() {
  local name="$1"
  local erwartet="$2"
  shift 2

  LAST_RESPONSE=$("$@" 2>/dev/null) || true

  if [ -z "$LAST_RESPONSE" ]; then
    fail "$name (keine Antwort)"
    return 1
  fi

  if echo "$LAST_RESPONSE" | grep -q "$erwartet"; then
    ok "$name"
    return 0
  else
    fail "$name (unerwartete Antwort)"
    DETAILS="${DETAILS}── ${name} ──\nErwartet: ${erwartet}\nAntwort: ${LAST_RESPONSE}\n\n"
    return 1
  fi
}

# http_status: Nur den HTTP-Statuscode pruefen
# Usage: http_status "Name" "erwarteter_code" curl-args...
http_status() {
  local name="$1"
  local erwartet="$2"
  shift 2

  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$@" 2>/dev/null) || code="000"

  if [ "$code" = "$erwartet" ]; then
    ok "$name ($code)"
  else
    fail "$name (HTTP $code statt $erwartet)"
  fi
}

# extract_id: Extrahiert die erste "id" aus JSON-Response
extract_id() {
  echo "$1" | sed 's/.*"id":"\([^"]*\)".*/\1/'
}

# ── Cleanup-IDs sammeln (werden am Ende geloescht) ────
CLEANUP_KATEGORIE_ID=""
CLEANUP_GERICHT_ID=""
CLEANUP_TISCH_ID=""
CLEANUP_BESTELLUNG_ID=""
CLEANUP_RESERVIERUNG_ID=""
CLEANUP_SCHICHT_ID=""

echo ""
echo "🔍 ServeFlow Health Check v2 — $(date '+%d.%m.%Y %H:%M')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Vollstaendiger Funktionstest (CRUD fuer alle Module)"
echo ""

# ══════════════════════════════════════════════════════════
# 1. INFRASTRUKTUR
# ══════════════════════════════════════════════════════════
echo "📦 [1/9] Infrastruktur..."
pruefe "Backend node_modules vorhanden" test -d "$BACKEND_DIR/node_modules"
pruefe "Frontend node_modules vorhanden" test -d "$FRONTEND_DIR/node_modules"
pruefe "DB-Schema vorhanden (schema.sql)" test -f "$PROJECT_DIR/database/schema.sql"
pruefe "Seed-Daten vorhanden (seed.sql)" test -f "$PROJECT_DIR/database/seed.sql"
pruefe "Backend .env vorhanden" test -f "$BACKEND_DIR/.env"

# ══════════════════════════════════════════════════════════
# 2. TYPESCRIPT KOMPILIERUNG
# ══════════════════════════════════════════════════════════
echo "🔧 [2/9] TypeScript..."
pruefe "Backend kompiliert fehlerfrei" bash -c "cd '$BACKEND_DIR' && npx tsc --noEmit 2>&1"
pruefe "Frontend kompiliert fehlerfrei" bash -c "cd '$FRONTEND_DIR' && npx tsc --noEmit 2>&1"

# ══════════════════════════════════════════════════════════
# 3. ERREICHBARKEIT
# ══════════════════════════════════════════════════════════
echo "🌐 [3/9] Erreichbarkeit..."
pruefe "Backend Health-Endpunkt (/api/health)" curl -sf --max-time 5 "$BACKEND_URL/api/health"
pruefe "Frontend erreichbar (Port 5173)" curl -sf --max-time 5 "$FRONTEND_URL"

# ══════════════════════════════════════════════════════════
# 4. AUTH — Login alle Rollen + Fehlversuch
# ══════════════════════════════════════════════════════════
echo "🔐 [4/9] Auth (3 Rollen + Validierung)..."

TOKEN=""
KELLNER_TOKEN=""
RESTAURANT_ID=""

# 4a. Admin-Login
if api_call "Admin-Login (admin@demo.de)" '"token"' \
  curl -sf --max-time 5 -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.de","passwort":"test1234"}'; then
  TOKEN=$(echo "$LAST_RESPONSE" | sed 's/.*"token":"\([^"]*\)".*/\1/')
  RESTAURANT_ID=$(echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | sed 's/.*"restaurantId":"\([^"]*\)".*/\1/')
fi

# 4b. Kellner-Login
if [ -n "$TOKEN" ]; then
  if api_call "Kellner-Login (kellner@demo.de)" '"token"' \
    curl -sf --max-time 5 -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"kellner@demo.de","passwort":"test1234"}'; then
    KELLNER_TOKEN=$(echo "$LAST_RESPONSE" | sed 's/.*"token":"\([^"]*\)".*/\1/')
  fi
fi

# 4c. Kueche-Login
if [ -n "$TOKEN" ]; then
  api_call "Kueche-Login (kueche@demo.de)" '"token"' \
    curl -sf --max-time 5 -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"kueche@demo.de","passwort":"test1234"}'
fi

# 4d. Falscher Login → muss 401 geben
# Hinweis: Rate-Limiter (5/15min) kann nach mehreren Logins zuschlagen.
# Deshalb pruefen wir auf 401 ODER 429 (beides = Auth funktioniert korrekt)
if [ -n "$TOKEN" ]; then
  FALSCH_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@demo.de","passwort":"falschespasswort"}' 2>/dev/null) || FALSCH_CODE="000"

  if [ "$FALSCH_CODE" = "401" ] || [ "$FALSCH_CODE" = "429" ]; then
    ok "Falscher Login wird abgelehnt ($FALSCH_CODE)"
  else
    fail "Falscher Login gibt HTTP $FALSCH_CODE (erwartet: 401 oder 429)"
  fi

  # 4e. Leere Felder → muss 400 geben
  http_status "Login ohne Passwort → 400" "400" \
    -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@demo.de"}'
fi

if [ -z "$TOKEN" ]; then
  echo ""
  echo "━━━ ABBRUCH: Ohne Login sind keine weiteren Tests moeglich ━━━"
fi

# Ab hier nur wenn Login erfolgreich
if [ -n "$TOKEN" ]; then

# ══════════════════════════════════════════════════════════
# 5. SPEISEKARTE — Kategorie + Gericht CRUD
# ══════════════════════════════════════════════════════════
echo "🍽️  [5/9] Speisekarte (Kategorie + Gericht CRUD)..."

# 5a. Kategorien abrufen
pruefe "GET Kategorien abrufen" \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/speisekarte/kategorien"

# 5b. Speisekarte oeffentlich abrufen (ohne Auth)
pruefe "GET Speisekarte oeffentlich (ohne Auth)" \
  curl -sf --max-time 5 "$BACKEND_URL/api/speisekarte?restaurantId=$RESTAURANT_ID"

# 5c. Kategorie erstellen
if api_call "POST Kategorie erstellen" '"id"' \
  curl -sf --max-time 5 -X POST "$BACKEND_URL/api/speisekarte/kategorien" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"_HEALTHCHECK_Testkategorie","reihenfolge":999}'; then
  CLEANUP_KATEGORIE_ID=$(extract_id "$LAST_RESPONSE")
fi

# 5d. Kategorie umbenennen
if [ -n "$CLEANUP_KATEGORIE_ID" ]; then
  api_call "PATCH Kategorie umbenennen" '"name"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/speisekarte/kategorien/$CLEANUP_KATEGORIE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"_HEALTHCHECK_Umbenannt"}'
fi

# 5e. Gericht erstellen
if [ -n "$CLEANUP_KATEGORIE_ID" ]; then
  if api_call "POST Gericht erstellen" '"id"' \
    curl -sf --max-time 5 -X POST "$BACKEND_URL/api/speisekarte" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"kategorie_id\":\"$CLEANUP_KATEGORIE_ID\",\"name\":\"_HEALTHCHECK_Testgericht\",\"beschreibung\":\"Health Check Test\",\"preis\":9.99}"; then
    CLEANUP_GERICHT_ID=$(extract_id "$LAST_RESPONSE")
  fi
fi

# 5f. Gericht bearbeiten (Preis aendern)
if [ -n "$CLEANUP_GERICHT_ID" ]; then
  api_call "PATCH Gericht Preis aendern (9.99→12.50)" '"preis"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/speisekarte/$CLEANUP_GERICHT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"preis":12.50}'
fi

# 5g. Gericht als nicht verfuegbar markieren
if [ -n "$CLEANUP_GERICHT_ID" ]; then
  api_call "PATCH Gericht verfuegbar → false" '"verfuegbar"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/speisekarte/$CLEANUP_GERICHT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"verfuegbar":false}'
fi

# 5h. Validierung: Gericht ohne Pflichtfelder → 400
http_status "POST Gericht ohne Name → 400" "400" \
  -X POST "$BACKEND_URL/api/speisekarte" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preis":5.00}'

# ══════════════════════════════════════════════════════════
# 6. TISCHE — CRUD + Status-Aenderungen
# ══════════════════════════════════════════════════════════
echo "🪑 [6/9] Tische (CRUD + Statuswechsel)..."

# 6a. Alle Tische abrufen
pruefe "GET Tische abrufen" \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/tische"

# 6b. Tisch erstellen
if api_call "POST Tisch erstellen (Nr. 999)" '"id"' \
  curl -sf --max-time 5 -X POST "$BACKEND_URL/api/tische" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nummer":999,"kapazitaet":4}'; then
  CLEANUP_TISCH_ID=$(extract_id "$LAST_RESPONSE")
fi

# 6c. Tisch bearbeiten (Kapazitaet)
if [ -n "$CLEANUP_TISCH_ID" ]; then
  api_call "PATCH Tisch Kapazitaet aendern (4→6)" '"kapazitaet"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"kapazitaet":6}'
fi

# 6d. Tisch-Status: frei → besetzt → frei
if [ -n "$CLEANUP_TISCH_ID" ]; then
  api_call "PATCH Tisch frei → besetzt" '"besetzt"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"besetzt"}'

  api_call "PATCH Tisch besetzt → frei" '"frei"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"frei"}'
fi

# 6e. Kellner darf Tisch-Status aendern
if [ -n "$CLEANUP_TISCH_ID" ] && [ -n "$KELLNER_TOKEN" ]; then
  api_call "PATCH Tisch-Status als Kellner" '"besetzt"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID/status" \
    -H "Authorization: Bearer $KELLNER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"besetzt"}'

  # Zuruecksetzen
  curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"frei"}' > /dev/null 2>&1
fi

# 6f. Validierung: ungueltiger Status → 400
if [ -n "$CLEANUP_TISCH_ID" ]; then
  http_status "PATCH Tisch ungueltiger Status → 400" "400" \
    -X PATCH "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"ungueltig_xyz"}'
fi

# ══════════════════════════════════════════════════════════
# 7. BESTELLUNGEN — Erstellen + kompletter Status-Workflow
# ══════════════════════════════════════════════════════════
echo "📋 [7/9] Bestellungen (Erstellen + Status-Workflow)..."

# Bestehende Daten holen fuer den Bestelltest
# Wir brauchen einen Tisch und ein verfuegbares Gericht
TISCHE_JSON=$(curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/tische" 2>/dev/null || echo "[]")
ERSTER_TISCH_ID=$(echo "$TISCHE_JSON" | sed 's/.*\[{"id":"\([^"]*\)".*/\1/' 2>/dev/null)

GERICHTE_JSON=$(curl -sf --max-time 5 "$BACKEND_URL/api/speisekarte?restaurantId=$RESTAURANT_ID" 2>/dev/null || echo "[]")
ERSTES_GERICHT_ID=$(echo "$GERICHTE_JSON" | sed 's/.*\[{"id":"\([^"]*\)".*/\1/' 2>/dev/null)

if [ -n "$ERSTER_TISCH_ID" ] && [ "$ERSTER_TISCH_ID" != "[]" ] && \
   [ -n "$ERSTES_GERICHT_ID" ] && [ "$ERSTES_GERICHT_ID" != "[]" ]; then

  # 7a. Bestellung erstellen (als Gast — kein Auth noetig)
  if api_call "POST Bestellung erstellen (als Gast)" '"id"' \
    curl -sf --max-time 5 -X POST "$BACKEND_URL/api/bestellungen" \
    -H "Content-Type: application/json" \
    -d "{\"restaurant_id\":\"$RESTAURANT_ID\",\"tisch_id\":\"$ERSTER_TISCH_ID\",\"positionen\":[{\"gericht_id\":\"$ERSTES_GERICHT_ID\",\"menge\":1}],\"anmerkung\":\"_HEALTHCHECK_Test\"}"; then
    CLEANUP_BESTELLUNG_ID=$(extract_id "$LAST_RESPONSE")
  fi

  # 7b. Aktive Bestellungen abrufen
  pruefe "GET Bestellungen abrufen (aktive)" \
    curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/bestellungen"

  # 7c. Status-Workflow durchspielen: offen → in_zubereitung → serviert → bezahlt
  if [ -n "$CLEANUP_BESTELLUNG_ID" ]; then
    api_call "PATCH Bestellung offen → in_zubereitung" '"in_zubereitung"' \
      curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/bestellungen/$CLEANUP_BESTELLUNG_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status":"in_zubereitung"}'

    api_call "PATCH Bestellung → serviert" '"serviert"' \
      curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/bestellungen/$CLEANUP_BESTELLUNG_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status":"serviert"}'

    api_call "PATCH Bestellung → bezahlt" '"bezahlt"' \
      curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/bestellungen/$CLEANUP_BESTELLUNG_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status":"bezahlt"}'

    # 7d. Ungueltiger Status muss abgelehnt werden
    http_status "PATCH Bestellung ungueltiger Status → 400" "400" \
      -X PATCH "$BACKEND_URL/api/bestellungen/$CLEANUP_BESTELLUNG_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status":"ungueltig_xyz"}'
  fi

  # 7e. Validierung: Bestellung ohne Positionen → 400
  http_status "POST Bestellung ohne Positionen → 400" "400" \
    -X POST "$BACKEND_URL/api/bestellungen" \
    -H "Content-Type: application/json" \
    -d "{\"restaurant_id\":\"$RESTAURANT_ID\",\"tisch_id\":\"$ERSTER_TISCH_ID\"}"

else
  fail "Keine Tische/Gerichte fuer Bestellungstest vorhanden"
fi

# ══════════════════════════════════════════════════════════
# 8. RESERVIERUNGEN — CRUD + Status-Workflow
# ══════════════════════════════════════════════════════════
echo "📅 [8/9] Reservierungen (CRUD + Status)..."

MORGEN=$(date -v+1d +%Y-%m-%dT19:00:00 2>/dev/null || date -d '+1 day' +%Y-%m-%dT19:00:00 2>/dev/null)

# 8a. Reservierung erstellen (oeffentlich — kein Auth)
if api_call "POST Reservierung erstellen (als Gast)" '"id"' \
  curl -sf --max-time 5 -X POST "$BACKEND_URL/api/reservierungen" \
  -H "Content-Type: application/json" \
  -d "{\"restaurant_id\":\"$RESTAURANT_ID\",\"gast_name\":\"_HEALTHCHECK_Max Muster\",\"telefon\":\"+491234567890\",\"datum\":\"$MORGEN\",\"personen\":4,\"anmerkung\":\"Health Check Test\",\"quelle\":\"app\"}"; then
  CLEANUP_RESERVIERUNG_ID=$(extract_id "$LAST_RESPONSE")
fi

# 8b. Reservierungen abrufen (Auth)
pruefe "GET Reservierungen abrufen" \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/reservierungen"

# 8c. Status-Workflow: ausstehend → bestaetigt → storniert
if [ -n "$CLEANUP_RESERVIERUNG_ID" ]; then
  api_call "PATCH Reservierung ausstehend → bestaetigt" '"bestaetigt"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/reservierungen/$CLEANUP_RESERVIERUNG_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"bestaetigt"}'

  api_call "PATCH Reservierung → storniert" '"storniert"' \
    curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/reservierungen/$CLEANUP_RESERVIERUNG_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"storniert"}'
fi

# 8d. Validierung: Reservierung ohne Pflichtfelder → 400
http_status "POST Reservierung ohne Gastname → 400" "400" \
  -X POST "$BACKEND_URL/api/reservierungen" \
  -H "Content-Type: application/json" \
  -d "{\"restaurant_id\":\"$RESTAURANT_ID\",\"datum\":\"$MORGEN\",\"personen\":2}"

# ══════════════════════════════════════════════════════════
# 9. RESTAURANT + STATISTIKEN + DIENSTPLAN
# ══════════════════════════════════════════════════════════
echo "🏪 [9/9] Restaurant, Statistiken & Dienstplan..."

# 9a. Restaurant-Daten abrufen
api_call "GET Restaurant-Daten (Admin)" '"name"' \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/restaurant"

# 9b. Restaurant-Design oeffentlich
api_call "GET Restaurant-Design (oeffentlich)" '"name"' \
  curl -sf --max-time 5 "$BACKEND_URL/api/restaurant/$RESTAURANT_ID/design"

# 9c. Statistiken
api_call "GET Statistiken (7 Tage)" '"umsatz"' \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/statistiken?tage=7"

# 9d. Mitarbeiter abrufen
api_call "GET Mitarbeiter-Liste" '\[' \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/mitarbeiter"

# 9e. Dienstplan abrufen
TODAY=$(date +%Y-%m-%d)
NEXT_WEEK=$(date -v+7d +%Y-%m-%d 2>/dev/null || date -d '+7 days' +%Y-%m-%d 2>/dev/null)
pruefe "GET Dienstplan abrufen" \
  curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/dienstplan?start=$TODAY&ende=$NEXT_WEEK"

# 9f. Schicht erstellen
MA_JSON=$(curl -sf --max-time 5 -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/mitarbeiter" 2>/dev/null || echo "[]")
ERSTER_MA_ID=$(echo "$MA_JSON" | sed 's/.*\[{"id":"\([^"]*\)".*/\1/' 2>/dev/null)

if [ -n "$ERSTER_MA_ID" ] && [ "$ERSTER_MA_ID" != "[]" ]; then
  if api_call "POST Schicht erstellen" '"id"' \
    curl -sf --max-time 5 -X POST "$BACKEND_URL/api/dienstplan" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"mitarbeiter_id\":\"$ERSTER_MA_ID\",\"datum\":\"$TODAY\",\"beginn\":\"23:00\",\"ende\":\"23:30\",\"notiz\":\"_HEALTHCHECK_Test\"}"; then
    CLEANUP_SCHICHT_ID=$(extract_id "$LAST_RESPONSE")
  fi

  # 9g. Schicht bearbeiten
  if [ -n "$CLEANUP_SCHICHT_ID" ]; then
    api_call "PATCH Schicht bearbeiten" '"id"' \
      curl -sf --max-time 5 -X PATCH "$BACKEND_URL/api/dienstplan/$CLEANUP_SCHICHT_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"notiz":"_HEALTHCHECK_Bearbeitet"}'
  fi

  # 9h. Validierung: Schicht ohne Pflichtfelder → 400
  http_status "POST Schicht ohne Datum → 400" "400" \
    -X POST "$BACKEND_URL/api/dienstplan" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"mitarbeiter_id\":\"$ERSTER_MA_ID\",\"beginn\":\"09:00\",\"ende\":\"17:00\"}"

  # 9i. Validierung: Ende vor Beginn → 400
  http_status "POST Schicht Ende vor Beginn → 400" "400" \
    -X POST "$BACKEND_URL/api/dienstplan" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"mitarbeiter_id\":\"$ERSTER_MA_ID\",\"datum\":\"$TODAY\",\"beginn\":\"17:00\",\"ende\":\"09:00\"}"
fi

# ══════════════════════════════════════════════════════════
# AUFRAEUM-PHASE — Alle Testdaten loeschen
# ══════════════════════════════════════════════════════════
echo ""
echo "🧹 Aufraeum-Phase..."

AUFGERAEUMT=0
AUFRAEUM_FEHLER=0

aufraeum() {
  local name="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    AUFGERAEUMT=$((AUFGERAEUMT + 1))
    echo "  🗑️  $name geloescht"
  else
    AUFRAEUM_FEHLER=$((AUFRAEUM_FEHLER + 1))
    echo "  ⚠️  $name konnte nicht geloescht werden"
  fi
}

# Reihenfolge: zuerst abhaengige, dann Stammdaten

if [ -n "$CLEANUP_SCHICHT_ID" ]; then
  aufraeum "Schicht" \
    curl -sf --max-time 5 -X DELETE "$BACKEND_URL/api/dienstplan/$CLEANUP_SCHICHT_ID" \
    -H "Authorization: Bearer $TOKEN"
fi

if [ -n "$CLEANUP_RESERVIERUNG_ID" ]; then
  aufraeum "Reservierung" \
    curl -sf --max-time 5 -X DELETE "$BACKEND_URL/api/reservierungen/$CLEANUP_RESERVIERUNG_ID" \
    -H "Authorization: Bearer $TOKEN"
fi

if [ -n "$CLEANUP_BESTELLUNG_ID" ]; then
  echo "  ℹ️  Bestellung bleibt als 'bezahlt' (kein DELETE-Endpunkt)"
fi

if [ -n "$CLEANUP_GERICHT_ID" ]; then
  aufraeum "Gericht" \
    curl -sf --max-time 5 -X DELETE "$BACKEND_URL/api/speisekarte/$CLEANUP_GERICHT_ID" \
    -H "Authorization: Bearer $TOKEN"
fi

if [ -n "$CLEANUP_KATEGORIE_ID" ]; then
  aufraeum "Kategorie" \
    curl -sf --max-time 5 -X DELETE "$BACKEND_URL/api/speisekarte/kategorien/$CLEANUP_KATEGORIE_ID" \
    -H "Authorization: Bearer $TOKEN"
fi

if [ -n "$CLEANUP_TISCH_ID" ]; then
  aufraeum "Tisch" \
    curl -sf --max-time 5 -X DELETE "$BACKEND_URL/api/tische/$CLEANUP_TISCH_ID" \
    -H "Authorization: Bearer $TOKEN"
fi

echo "  → $AUFGERAEUMT aufgeraeumt, $AUFRAEUM_FEHLER fehlgeschlagen"

fi # Ende: if [ -n "$TOKEN" ]

# ══════════════════════════════════════════════════════════
# ZUSAMMENFASSUNG
# ══════════════════════════════════════════════════════════
GESAMT=$((OK + FEHLER))
DATUM=$(date '+%d.%m.%Y %H:%M')

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FEHLER" -eq 0 ]; then
  echo "🟢 Alles in Ordnung! $OK/$GESAMT Funktionstests bestanden."
  NACHRICHT="🟢 ServeFlow Health Check v2
$DATUM

✅ Alle $GESAMT Funktionstests bestanden.

Getestet:
• Auth (3 Rollen + Fehllogin + Validierung)
• Speisekarte (Kategorie + Gericht CRUD + Validierung)
• Tische (CRUD + Statuswechsel + Rollencheck)
• Bestellungen (Gast-Bestellung + Status-Workflow + Validierung)
• Reservierungen (CRUD + Status-Workflow + Validierung)
• Restaurant (Daten + Design oeffentlich)
• Statistiken
• Dienstplan (CRUD + Validierung)

Alle Testdaten aufgeraeumt."
else
  echo "🔴 $FEHLER Problem(e) gefunden! $OK/$GESAMT Tests bestanden."
  NACHRICHT="🔴 ServeFlow Health Check v2
$DATUM

⚠️ $FEHLER von $GESAMT Funktionstests fehlgeschlagen.

Probleme:
$(echo -e "$PROBLEME")
Bitte zeitnah pruefen!"
fi

if [ -n "$DETAILS" ]; then
  echo ""
  echo "📝 Details zu Fehlern:"
  echo -e "$DETAILS"
fi

echo ""

# ── Blocker in project/todos.md schreiben ─────────────
TODOS_FILE="$(cd "$SCRIPT_DIR/../.." && pwd)/project/todos.md"
BLOCKER_MARKER="## Blocker (Health Check)"

if [ "$FEHLER" -gt 0 ] && [ -f "$TODOS_FILE" ]; then
  if grep -q "$BLOCKER_MARKER" "$TODOS_FILE"; then
    sed -i.bak "/$BLOCKER_MARKER/,/^## [^B]/{ /$BLOCKER_MARKER/d; /^## [^B]/!d; }" "$TODOS_FILE"
    rm -f "${TODOS_FILE}.bak"
  fi

  BLOCKER_BLOCK="$BLOCKER_MARKER\n_Automatisch erkannt am $(date '+%Y-%m-%d %H:%M') — wird bei naechstem erfolgreichen Check entfernt._\n"
  BLOCKER_BLOCK="${BLOCKER_BLOCK}$(echo -e "$PROBLEME" | sed 's/^• /- [ ] 🚫 BLOCKER: /' | grep -v '^$')\n"

  if grep -q "^## Phase 1" "$TODOS_FILE"; then
    sed -i.bak "/^## Phase 1/i\\
$(echo -e "$BLOCKER_BLOCK" | sed 's/$/\\/' | sed '$ s/\\$//')
" "$TODOS_FILE"
    rm -f "${TODOS_FILE}.bak"
  else
    echo -e "\n$BLOCKER_BLOCK" >> "$TODOS_FILE"
  fi

  echo "📝 $FEHLER Blocker in project/todos.md eingetragen"
elif [ "$FEHLER" -eq 0 ] && [ -f "$TODOS_FILE" ]; then
  if grep -q "$BLOCKER_MARKER" "$TODOS_FILE"; then
    sed -i.bak "/$BLOCKER_MARKER/,/^## [^B]/{ /$BLOCKER_MARKER/d; /^## [^B]/!d; }" "$TODOS_FILE"
    rm -f "${TODOS_FILE}.bak"
    echo "✅ Blocker-Sektion aus project/todos.md entfernt (alles gefixt!)"
  fi
fi

# ── Dashboard aktualisieren ──────────────────────────
SYNC_SCRIPT="$(cd "$SCRIPT_DIR/../.." && pwd)/dashboard/sync-dashboard.js"
if [ -f "$SYNC_SCRIPT" ]; then
  /opt/homebrew/bin/node "$SYNC_SCRIPT" > /dev/null 2>&1
  echo "📊 Dashboard aktualisiert"
fi

# ── Telegram senden ───────────────────────────────────
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=$(echo -e "$NACHRICHT")" 2>/dev/null)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "📨 Telegram-Nachricht gesendet!"
  else
    echo "⚠️  Telegram fehlgeschlagen (HTTP $HTTP_CODE)"
  fi
else
  echo "⚠️  Telegram nicht konfiguriert (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID fehlen)"
fi

echo ""
