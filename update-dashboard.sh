#!/bin/bash
# ============================================
# Dashboard Update Script
# ============================================
# Dieses Script offnet das Dashboard im Browser.
# Wenn du Anderungen an den Markdown-Dateien machst,
# sag Claude einfach: "Update das Dashboard"
# und er generiert die HTML-Datei neu.
#
# Nutzung:
#   ./update-dashboard.sh
# ============================================

DASHBOARD="$(dirname "$0")/dashboard.html"

if [ ! -f "$DASHBOARD" ]; then
  echo "Fehler: dashboard.html nicht gefunden!"
  exit 1
fi

# Dashboard im Browser offnen
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$DASHBOARD"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "$DASHBOARD"
fi

echo "Dashboard geoffnet!"
echo ""
echo "Tipp: Wenn du Anderungen an den Projekt-Dateien machst,"
echo "sag Claude: 'Update das Dashboard' und er aktualisiert es."
