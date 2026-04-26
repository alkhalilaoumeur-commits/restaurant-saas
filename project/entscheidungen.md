# Getroffene Entscheidungen

## Tech-Stack
**Entschieden:** 2026-04-04
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Datenbank: PostgreSQL
- Echtzeit: Socket.io (WebSockets)
- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)
- Auth: JWT + bcrypt
- Zahlungen: Stripe (DSGVO-konform mit EU-Datenverarbeitung, Standardvertragsklauseln)

## Geschäftsmodell
- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium
- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)
- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode

## Plattform
- Umstieg von Bubble.io auf Custom Code
- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle

## Supabase entfernt (2026-04-05)
- Frontend lief doppelt: teils über Express API, teils direkt über Supabase
- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht
- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend
- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)
- DB-Visualisierung: TablePlus statt Supabase-Dashboard

## Multi-Tenancy Absicherung (2026-04-05)
- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id
- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)
- Reservierungen: Restaurant muss existieren (DB-Check)

## Produktname: ServeFlow (2026-04-06)
- App heißt ab jetzt **ServeFlow** (vorher "Restaurant App")
- Eigenständiger Produktname statt DRVN Sub-Brand
- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)
- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt
- Grund: "ServeFlow" klingt professionell, international, kommuniziert Service + Effizienz
- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise
- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json

## Dashboard Auto-Sync via Claude Code Hook (2026-04-06)
- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt
- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`
- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status
- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell
- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen

## asyncHandler für Express 4 (2026-04-07)
- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)
- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf
- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet
- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)

## Reservierungssystem Pro — Architektur (2026-04-07)
- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)
- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell
- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override
- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste
- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service
- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig
- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)

## Abo-Modell: 3 Pläne (2026-04-18)
- Kein Freemium — alle 3 Pläne sind vollwertige Bezahl-Pläne
- Zahlungsanbieter: Stripe (bereits integriert)
- **Basis (29€/Monat):** Reservierungen (unbegrenzt), Online-Buchungsseite, Speisekarte, Tischplan, Walk-ins, Öffnungszeiten, E-Mail-Bestätigung, bis 3 Mitarbeiter
- **Standard (59€/Monat):** Alles aus Basis + QR-Bestellung, Gästebuch/CRM, Bewertungsmanagement, Warteliste, erweiterte Statistiken, SMS-Erinnerungen, bis 10 Mitarbeiter
- **Pro (99€/Monat):** Alles aus Standard + Dienstplan (inkl. Templates + Excel-Import), Inventur, Kassensystem, unbegrenzt Mitarbeiter
- Technisch umzusetzen: `abo_plan` Spalte (basis/standard/pro) auf `restaurants`, Feature-Guard Middleware im Backend, Paywall-Komponente im Frontend


## Email-Versand: Resend + Cloudflare statt Zoho (2026-04-25)
- **Versand**: Resend (smtp.resend.com, EU-Region, 3000 Mails/Monat gratis) statt Zoho/Gmail
- **Empfang**: Cloudflare Email Routing (kostenlos) statt eigener Zoho-Mailbox auf serve-flow.org — leitet kontakt@/support@ → a.aoumeur@drvnorganisations.com weiter
- **Aliase im Code**: noreply@ (Absender), support@ (Footer), kontakt@ (Impressum/Datenschutz) — alle auf serve-flow.org
- **Code-Änderung**: nur `.env`-Werte, kein Code-Refactor (nodemailer SMTP bleibt)
- **DSGVO**: dsgvo-vendoren.md aktualisiert (Zoho raus, Resend + Cloudflare rein, AVV/DPF-Status hinterlegt)
- **Begruendung**: Resend ist fuer SaaS-Transaktionsmails optimiert (Deliverability, Analytics, Multi-Domain). Cloudflare-Routing ist gratis und sofort verfuegbar weil Domain dort liegt. Zoho-Mailbox waere ueberteuert fuer ein Empfangs-Postfach, das nur 1× pro Woche jemand checkt
- **Skalierbarkeit**: gleicher Resend-Account kann spaeter CaterBase, CleanBase, HandBase, etc. mit-versorgen — nur Domain hinzufuegen, kein neuer Account
- **Offen**: API-Key rotieren (wurde im Chat geteilt), Resend DPA pruefen + akzeptieren

## Mitarbeiter-Limit pro Abo-Plan im Backend (2026-04-26)
- Limits: Basis = 3, Standard = 10, Pro = 999 (praktisch unbegrenzt)
- Single Source of Truth: `restaurant-app/backend/src/services/plan-limits.ts`
- Mechanik: `restaurants.max_mitarbeiter` wird automatisch aus `abo_plan` abgeleitet — bei jedem Plan-Wechsel mit-aktualisiert (3 Stellen in abo.ts: Helper + checkout.session.completed + customer.subscription.updated; 1 Stelle in models/Abo.ts: zahlungAbschliessen)
- Migration: `migration-plan-limits.sql` synchronisiert bestehende Restaurants (2 Restaurants betroffen, default in schema.sql von 5 auf 3 angepasst)
- Grandfather-Fall: Restaurants mit mehr Mitarbeitern als das neue Limit (z.B. Trattoria Demo: 4 MA bei Basis-Limit 3) verlieren NIEMANDEN — bestehende bleiben aktiv, aber kein weiterer Mitarbeiter kann angelegt werden bis Plan-Upgrade
- Fehler-Response bei Limit: HTTP 403 mit Plan-Name + konkretem Upgrade-Hinweis ("Upgrade auf Standard (10 Mitarbeiter) oder Pro (unbegrenzt)")
- Begruendung: Bisher entwertete fehlende Limit-Logik die hoeheren Plaene — ein Restaurant im 19€-Basis-Plan konnte unbegrenzt Mitarbeiter anlegen, was Standard (39€) und Pro (69€) wirtschaftlich sinnlos macht

## Erlebnis-Buchungen ohne Online-Zahlung — "Option B" (2026-04-26)
- Status: Ursprünglicher Stripe-Prepayment-Flow für Erlebnisse entfernt
- Ablauf neu: Gast bucht online → Status `ausstehend` (Vor-Ort-Zahlung offen) → Restaurant-Admin setzt nach Bezahlung manuell auf `bezahlt`
- Code-Änderungen: `restaurant-app/backend/src/routes/erlebnisse.ts` (Stripe-Import + getStripe + Checkout-Logik entfernt) + `ErlebnisDetail.tsx` (kein Stripe-Redirect, direkt zur Bestätigungsseite) + `ErlebnisBestaetigung.tsx` (3 Status-Varianten: storniert/bezahlt/ausstehend)
- DB-Spalte `erlebnis_buchungen.stripe_session_id` bleibt als Karteileiche (kein Datenverlust, wird wiederverwendet wenn Stripe Connect kommt)
- Begründung: Aktueller Stripe-Account fließt auf Ilias' Konto — Erlebnis-Geld gehört rechtlich/steuerlich aber zum Restaurant. Korrekte Lösung wäre Stripe Connect (Express Account mit Restaurant-Onboarding), aber das ist 1-2 Tage Zusatzaufwand. Vor-Ort-Zahlung ist der pragmatische Zwischenstand bis 5+ zahlende Restaurants existieren
- Folge-Schritt (später): Stripe Connect "Express Account" einbauen → Plattformgebühr-Modell möglich (z.B. 2-3% von jeder Erlebnis-Buchung als Aufpreis zum Abo)

## Stripe Promo-Code-System für Test-Restaurants (2026-04-26)
- Stripe API-Version: `2026-03-25.dahlia` — neue Struktur `promotion.coupon` (Coupon ist NICHT mehr direkt an `promotionCode.coupon` gebunden, sondern unter `promotion.coupon`)
- Bug-Fix: `expand: ['data.promotion.coupon']` muss explizit gesetzt werden, sonst kommt Coupon als String-ID zurück und Backend wirft "Cannot read properties of undefined"
- Coupon-Logik gesäubert: `coupon.duration_in_months` direkt aus Stripe lesen (nicht mehr über Custom-Metadata `monate`)
- Aktiver Test-Code: `PIZZASERVICE` (100% Rabatt, 3 Monate, max 1 Einlösung, Erstkunden-only) — verknüpft mit Coupon `gratis-3-monate`
- Workflow für neue Test-Restaurants: pro Restaurant einen separaten Promotion Code auf demselben Coupon erstellen (z.B. `PIZZERIA-MARIO-3M`) → max_redemptions=1, expires_at=+30 Tage
- KEIN automatischer 30-Tage-Trial in Checkout — User-Entscheidung: Volle Kontrolle über wer wie lange gratis bekommt, statt automatisch jedem Trial-Zugang
- Folge-Schritt: Stripe-Webhook im Live-Dashboard prüfen (Endpoint URL + 4 Events abonniert)

## Tischplan v2 — Resmio-Style Floor Plan (2026-04-26)
- Strikte Bereich-Trennung: jeder Bereich (Innen, Terrasse, Bar) ist EIGENER Floor Plan mit eigenen Koordinaten + eigener Deko. Kein "Alle"-View mehr
- Default-Verhalten: erster Bereich automatisch aktiv beim Laden — Tische ohne `bereich_id` (Legacy) sind unsichtbar bis Admin sie zuweist
- Neue Komponente: Split-View mit `ReservierungsTimeline` (links 340px) + Floor Plan Canvas (rechts) im Live-Modus
- Live-Features: Live-Uhr mit "Auf jetzt wechseln"-Scroll, Live-Zeit-Badges auf Tischen ("19:00", "5m"-Countdown, "JETZT"-Overdue), pulsierender Cyan-Dot in Topbar
- Diamond-Tische mit Stuhl-Indikatoren (kleine Kreise rund um Tisch je nach Form/Kapazität — verteilt auf 4 Kanten bei eckig, kreisförmig bei rund, einreihig bei Bar)
- Deko-System: 6 Typen (Pflanze, Theke, Eingang, Servicestation, Wand, Tür) — eigener Konva-Layer unter Tischen, Drag&Drop im Edit-Modus, Rotation in 15°-Schritten
- Tag-System: `reservierungen.tags TEXT[]` (max 10 Tags pro Reservierung) + 14 vordefinierte (`Vegan`, `Geburtstag`, `Allergie`, `Fensterplatz`, ...) + Custom-Eingabe via Modal
- Backend: `ReservierungModel.alle` mit LEFT JOIN auf `gaeste` → liefert Gast-Stats (`gast_besuche`, `gast_no_shows`, `gast_tags`) in jeder Reservierung
- DRVN-konformes Design: Dark-Theme behalten (kein Holzboden-Look von Resmio), aber Funktionalität 1:1 — Floor-Background als feines Punkt-Raster + Cyan-Vignette von oben
- Migration: `migration-floorplan-erweitert.sql` (idempotent, läuft via `runAllMigrations` automatisch beim Server-Start)
- Begründung User-Wunsch: Resmio macht das so, jeder Bereich hat eigene Realität, klarere mentale Modelle für Restaurant-Inhaber + verhindert Tisch-Überlappungen über Bereiche hinweg

## EuGH C-654/23 Newsletter-Widerspruch — Bestandskundenwerbung (2026-04-26)
- Rechtsgrundlage: § 7 Abs. 3 UWG + EuGH-Urteil C-654/23 vom 26.09.2024 (Bestandskundenwerbung ueber aehnliche eigene Produkte)
- Mechanik: Opt-out-Modell mit HMAC-signiertem Widerspruchs-Token (kein DB-Token-Storage noetig). Token = `<restaurant_id>.<HMAC-SHA256-32hex>` mit JWT_SECRET signiert
- DB-Felder: `restaurants.newsletter_aktiv BOOLEAN DEFAULT TRUE` + `newsletter_widerspruch_am TIMESTAMPTZ` (Migration `migration-newsletter.sql`)
- Endpunkt: `POST /api/restaurant/newsletter-widerspruch/:token` (oeffentlich, validiert Token, setzt newsletter_aktiv=FALSE)
- Frontend-Route: `/newsletter-widerspruch/:token` zeigt Erfolg/Fehler-Feedback
- Hinweis bei Datenerhebung: kleiner Text unter Submit-Button auf der Registrierungs-Seite (kein Opt-In-Haekchen — UWG erlaubt Opt-out-Modell fuer Bestandskunden)
- Hinweis in jeder Werbe-Mail: `werbeFooterHtml()` Helper in email.ts mit Erklaerung + Widerspruchs-Link (NICHT in transaktionalen Mails verwenden)
- Datenschutzerklaerung: neuer Abschnitt 6 ("Direktwerbung fuer eigene aehnliche Produkte") mit Verweis auf EuGH C-654/23
- Begruendung: Rechtssicherheit fuer zukuenftige Multi-Produkt-Strategie (CaterBase, CleanBase, etc.) — Bestandskunden duerfen ohne Einwilligung ueber neue ServeFlow-Module/Schwesterprodukte informiert werden, solange Hinweise an beiden Stellen + funktionierender Widerspruchsweg vorhanden sind
