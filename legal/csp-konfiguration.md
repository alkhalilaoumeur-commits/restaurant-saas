# Content-Security-Policy (CSP) — Begründung der gewählten Direktiven

**Stand:** 25. April 2026
**Konfiguriert in:** `restaurant-app/backend/src/server.ts` (helmet-Block)

CSP-Header schützen vor Cross-Site-Scripting (XSS) und Clickjacking. Sie sagen dem Browser:
"Lade Skripte/Bilder/Styles **nur** aus diesen Quellen." Falsch konfiguriert → App bricht.

CSP ist **nur in Production aktiv** (`NODE_ENV=production`), weil Vite im Dev-Modus
`unsafe-eval` und Inline-Skripte für Hot-Module-Replacement braucht.

---

## Direktiven & Begründung

| Direktive | Wert | Warum |
|---|---|---|
| `default-src` | `'self'` | Default-Fallback: nur eigene Domain. |
| `script-src` | `'self'` | Keine externen Skripte. Stripe wird per Redirect genutzt, NICHT als Embed. Falls künftig Stripe-Elements eingebaut wird → `https://js.stripe.com` ergänzen. |
| `style-src` | `'self' 'unsafe-inline'` | Tailwind und React injecten zur Laufzeit Inline-Styles. Strikter geht ohne Refactor nicht. |
| `img-src` | `'self' data: blob: https:` | Restaurant-Bilder können aus beliebigen Quellen kommen (Speisekarte). `data:` für SVG-Icons, `blob:` für Datei-Uploads, `https:` für externe Bilder. |
| `font-src` | `'self' data:` | Lokale Webfonts + ggf. inline base64. |
| `connect-src` | `'self' ws: wss:` | Eigene API + Socket.io WebSockets. |
| `form-action` | `'self' https://*.stripe.com` | Stripe-Redirect (PlanAuswählen → Stripe-Checkout). |
| `frame-ancestors` | `*` | **Bewusst offen!** Das Buchungs-Widget muss in beliebige Restaurant-Webseiten als `<iframe>` eingebettet werden können. Ohne diese Lockerung würde das Widget nicht laden. |
| `object-src` | `'none'` | Verbietet Flash/PDF-Plugins (legacy XSS-Vektor). |
| `base-uri` | `'self'` | Verhindert Base-Tag-Injection. |
| `upgrade-insecure-requests` | (an) | Erzwingt HTTPS für alle Subressourcen. |

---

## Sicherheits-Trade-offs

**`frame-ancestors *`** ist bewusst offen, damit das öffentliche Buchungs-Widget funktioniert.
Konsequenz: Theoretisch wäre Click-Jacking auf den App-Login-Bereich möglich, wenn jemand
ServeFlow in einem unsichtbaren iframe einbettet und User darauf klickt.

**Mitigationen:**
- Login-Seite hat Rate-Limiting (5 Versuche / 15 Min)
- JWT statt Session-Cookies → kein CSRF-Risiko bei iframe-Klicks
- Restaurant-Admin-Bereich ist hinter Login + RBAC

**Härtere Variante (für späteres Refactor):** Per-Route-CSP — `frame-ancestors *` nur für
`/buchen/*`, `/bestellen/*`, `/reservierung/*`, `/erlebnis/*`, `/bewertung/*`. Alle anderen
Routes bekommen `frame-ancestors 'none'`. Erfordert Express-Middleware-Routing-Magic.

---

## Was tun bei kaputtem Frontend nach Deploy?

1. **Browser-Console öffnen** → CSP-Verstöße werden mit konkreter Direktive geloggt
2. **Welche Quelle wurde geblockt?** → in obiger Tabelle ergänzen
3. **Notfall-Rollback:** in `server.ts` temporär `contentSecurityPolicy: false` setzen → deployen
4. **Bug fixen** → CSP wieder anschalten

---

## Test-Checkliste vor Production-Deploy

```
[ ] Login funktioniert
[ ] Dashboard lädt alle Karten + Charts
[ ] Bilder in Speisekarte werden angezeigt
[ ] QR-Bestellseite funktioniert (auch in iframe-Test)
[ ] Buchungs-Widget per <iframe src=".../buchen/RESTAURANT_ID"> in fremder HTML-Seite testen
[ ] Stripe-Checkout-Redirect funktioniert
[ ] Socket.io live-Updates kommen an (neue Bestellung im Toast)
[ ] Browser-Console zeigt KEINE CSP-Violations
```

---

## Ausgeschlossene Quellen (mit Begründung)

| Domain | Warum nicht erlaubt |
|---|---|
| `https://js.stripe.com` | Wir nutzen Stripe **Redirect**, nicht Stripe.js Embed. Bei Wechsel: ergänzen. |
| `https://www.google-analytics.com` | Kein Tracking — bewusst kein Analytics eingebaut. |
| `https://fonts.googleapis.com` | Wir hosten Schriften lokal, kein Google Fonts Pull (DSGVO-Risiko in DE). |
| `https://*.youtube.com` | Keine Videos eingebettet. |
