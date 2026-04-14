#!/bin/sh
# BACKEND_URL Umgebungsvariable → nginx config einsetzen
# Beispiel: BACKEND_URL=http://mein-backend.domain.com
BACKEND_URL="${BACKEND_URL:-http://dbrxz53b3lq3sfv2sp918cof.178.104.147.61.sslip.io}"
sed "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL}|g" \
  /etc/nginx/nginx.template.conf > /etc/nginx/conf.d/default.conf
exec "$@"
