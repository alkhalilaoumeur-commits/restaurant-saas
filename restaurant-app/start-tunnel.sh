#!/bin/bash
# ─── ServeFlow Tunnel-Start ─────────────────────────────────────────────────
# Startet Backend + ngrok Tunnel für Handy-Zugriff
#
# Voraussetzung: ngrok Account + Auth-Token einmalig einrichten:
#   1. https://dashboard.ngrok.com/signup (kostenlos)
#   2. ngrok config add-authtoken DEIN_TOKEN
#   3. Statische Domain holen: https://dashboard.ngrok.com/domains
#      → "New Domain" klicken → z.B. "mein-restaurant.ngrok-free.app"
#      → Unten in NGROK_DOMAIN eintragen
#
# Nutzung:  ./start-tunnel.sh
# Stoppen:  Ctrl+C
# ─────────────────────────────────────────────────────────────────────────────

# ── Konfiguration ──
NGROK_DOMAIN="prepartisan-noncorrosively-lowell.ngrok-free.dev"
PORT=3001

# ── Farben ──
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")"

# Prüfen ob ngrok konfiguriert ist
if ! ngrok config check >/dev/null 2>&1; then
  echo -e "${RED}ngrok ist nicht konfiguriert!${NC}"
  echo ""
  echo "1. Erstelle einen kostenlosen Account: https://dashboard.ngrok.com/signup"
  echo "2. Kopiere deinen Auth-Token von: https://dashboard.ngrok.com/get-started/your-authtoken"
  echo "3. Führe aus: ngrok config add-authtoken DEIN_TOKEN"
  echo ""
  exit 1
fi

if [ -z "$NGROK_DOMAIN" ]; then
  echo -e "${YELLOW}Keine statische Domain konfiguriert!${NC}"
  echo ""
  echo "Für einen dauerhaften Link:"
  echo "1. Gehe zu: https://dashboard.ngrok.com/domains"
  echo "2. Klicke 'New Domain' (1 gratis Domain pro Account)"
  echo "3. Trage die Domain oben in diesem Script ein (NGROK_DOMAIN=...)"
  echo ""
  echo -e "${YELLOW}Starte trotzdem mit zufälliger URL...${NC}"
  echo ""
fi

# Frontend bauen (falls dist/ nicht existiert oder älter als src/)
if [ ! -d "frontend/dist" ] || [ "frontend/src" -nt "frontend/dist" ]; then
  echo -e "${YELLOW}Frontend wird gebaut...${NC}"
  cd frontend && npm run build && cd ..
  echo ""
fi

# Backend starten
echo -e "${GREEN}Backend wird gestartet (Port $PORT)...${NC}"
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

# Warten bis Backend bereit ist
echo "Warte auf Backend..."
for i in {1..30}; do
  if curl -s http://localhost:$PORT/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}Backend läuft!${NC}"
    break
  fi
  sleep 1
done

# ngrok starten
echo ""
if [ -n "$NGROK_DOMAIN" ]; then
  echo -e "${GREEN}Starte ngrok Tunnel mit statischer Domain: $NGROK_DOMAIN${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}  Dein permanenter Link: https://$NGROK_DOMAIN${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  ngrok http $PORT --domain=$NGROK_DOMAIN
else
  echo -e "${GREEN}Starte ngrok Tunnel (zufällige URL)...${NC}"
  echo -e "${YELLOW}Tipp: Für einen dauerhaften Link, richte eine statische Domain ein (siehe oben)${NC}"
  echo ""
  ngrok http $PORT
fi

# Aufräumen wenn beendet
kill $BACKEND_PID 2>/dev/null
