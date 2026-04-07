# Reservierungssystem-Analyse: Marktvergleich & Upgrade-Plan

*Erstellt: 2026-04-06 | Detaillierte Recherchen: `project/reservierungssysteme-vergleich.md` + `~/vault/research/restaurant-reservierungssysteme-analyse.md`*

---

## Aktueller Stand unseres Reservierungssystems

| Feature | Status |
|---------|--------|
| Reservierung erstellen (Name, Telefon, Datum, Personen, Anmerkung) | Vorhanden |
| Status-Workflow: ausstehend → bestaetigt → storniert | Vorhanden |
| Tagesansicht mit Wochenleiste + Tagesnavigation | Vorhanden |
| Tages-Statistiken (Anzahl, Personen, Status-Zaehler) | Vorhanden |
| Quellen-Tracking (app / whatsapp / telefon) | Vorhanden |
| Multi-Tenant (restaurant_id) | Vorhanden |
| DSGVO (Telefon markiert, Loeschfrist 30 Tage) | Vorhanden |
| Tisch-Zuweisung (manuell, tisch_id Feld existiert) | Teilweise |
| **Online-Buchung durch Gaeste** | **Fehlt** |
| **E-Mail-Bestaetigung + Erinnerung** | **Fehlt** |
| **Gast-Self-Service (Stornierung/Umbuchung)** | **Fehlt** |
| **Grafischer Tischplan (Floor Plan)** | **Fehlt** |
| **Automatische Tischzuweisung** | **Fehlt** |
| **Buchungswidget fuer Restaurant-Website** | **Fehlt** |
| **Google Reserve Integration** | **Fehlt** |
| **No-Show-Management** | **Fehlt** |
| **Gaeste-CRM / Stammgast-Erkennung** | **Fehlt** |
| **SMS/WhatsApp-Erinnerungen** | **Fehlt** |
| **Warteliste (Walk-in + Online)** | **Fehlt** |
| **Zeitslot-System** | **Fehlt** |
| **Kapazitaetsmanagement** | **Fehlt** |

---

## Was die Konkurrenz macht

### Die 8 analysierten Systeme

| System | Hauptmarkt | Staerke | Preis |
|--------|-----------|---------|-------|
| **OpenTable** | USA, global | Groesstes Netzwerk (60.000+ Restaurants), staerkstes CRM | $149-449/Mo + $0.25-1.50/Cover |
| **Resy** (AmEx) | USA Premium | Bestes Tischmanagement (ResyOS), Prepaid Dining, 2-Way SMS | $249-899/Mo flat |
| **TheFork** (Tripadvisor) | Europa | Kostenloses Basispaket, Yums-Treueprogramm, Rabatt-Deals | €0-300/Mo + €2-4/Cover |
| **Quandoo** | DACH (sinkend) | Google Reserve Pioneer, internationaler Marktplatz | €49-149/Mo + €2-3.50/Cover |
| **resmio** | Deutschland (steigend) | Flat-Fee, kein Marktplatz, Feedback-vor-Bewertung | €0-149/Mo flat |
| **DISH by METRO** | DACH | Kostenlose Website, METRO-Oekosystem, Google-Partnerschaft | €39-59/Mo |
| **Yelp Guest Manager** | USA | Beste Warteliste am Markt, 2-Way SMS, Kiosk | $249-449/Mo flat |
| **SevenRooms** | Global Premium | Staerkstes CRM + Marketing-Automatisierung | $500+/Mo |

### DACH-Relevanz-Score

| System | Relevanz | Trend |
|--------|----------|-------|
| Google Reserve (als Kanal) | 9/10 | → Pflicht |
| resmio | 9/10 | ↑ steigend |
| DISH by METRO | 8/10 | → stabil |
| Quandoo | 5/10 | ↓ sinkend |
| TheFork | 4/10 | → stabil (mehr Suedeuropa) |
| OpenTable | 3/10 | → stabil (eher USA) |
| Yelp | 1/10 | → irrelevant fuer DACH |

**Fazit:** resmio ist unser gefaehrlichster Wettbewerber im DACH-Markt. Flat-Fee, DSGVO-konform, waechst stark. ABER: Hat kein QR-Ordering, kein KDS, kein Bestellsystem.

---

## Feature-Matrix: Wir vs. Konkurrenz

| Feature | Wir | resmio | Quandoo | DISH | OpenTable | Resy |
|---------|-----|--------|---------|------|-----------|------|
| Online-Reservierung | Ja (nur intern) | Ja (Gaeste) | Ja (Gaeste) | Ja (Gaeste) | Ja (Gaeste) | Ja (Gaeste) |
| Grafischer Tischplan | **Nein** | Ja | Ja | Basis | Ja | Ja (beste) |
| Auto-Tischzuweisung | **Nein** | Ja | Ja | Einfach | Ja | Ja |
| No-Show Kreditkarte | **Nein** | Ja | Ja | Nein | Ja | Ja |
| Warteliste | **Nein** | Ja | Ja | Nein | Ja | Notify |
| CRM / Gaesteprofile | **Nein** | Ja | Ja | Basis | Ja | Ja |
| E-Mail-Erinnerung | **Nein** | Ja | Ja | Ja | Ja | Ja |
| SMS-Erinnerung | **Nein** | Ja ($) | Ja ($) | Nein | Ja | Ja |
| Website-Widget | **Nein** | Ja | Ja | Ja | Ja | Ja |
| Google Reserve | **Nein** | Ja | Ja | Ja | Ja | Ja |
| Gast-Self-Service | **Nein** | Ja | Ja | Ja | Ja | Ja |
| Walk-in-Management | **Nein** | Ja | Ja | Nein | Ja | Ja |
| **QR-Tischbestellung** | **Ja** | Nein | Nein | Nein | Nein | Nein |
| **Echtzeit-KDS** | **Ja** | Nein | Nein | Nein | Nein | Nein |
| **Bestellsystem** | **Ja** | Nein | Nein | Nein | Nein | Nein |
| **Dienstplan** | **Ja** | Nein | Nein | Nein | Nein | Nein |
| DSGVO-konform | Ja | Ja | Ja | Ja | Problematisch | Besser |

---

## Was uns fehlt — nach Prioritaet

### Prio 1: Kritisch (ohne diese kein ernstzunehmendes Reservierungssystem)

| # | Feature | Was es macht | Aufwand | Warum kritisch |
|---|---------|-------------|---------|----------------|
| 1 | **Zeitslot-System** | 15-Min-Intervalle statt freie Uhrzeitwahl, Kapazitaet pro Slot | Mittel | Ohne Slots keine Kapazitaetssteuerung — Restaurant wird ueberbucht oder verschenkt Plaetze |
| 2 | **Online-Buchung fuer Gaeste** | Gaeste buchen selbst: 3-Schritt-Flow (Datum+Personen → Slot waehlen → Kontaktdaten) | Hoch | 80%+ der Reservierungen kommen heute online — ohne Self-Service bucht niemand |
| 3 | **E-Mail-Bestaetigung + Erinnerung** | Automatische E-Mail bei Buchung + 24h vorher + 2h vorher | Mittel | Absolutes Minimum. Reduziert No-Shows um 40-50%. JEDER Wettbewerber hat das |
| 4 | **Gast-Self-Service** | Stornierung + Umbuchung per Link in der E-Mail (1-Klick) | Niedrig | Ohne das rufen Gaeste an oder erscheinen einfach nicht (= No-Show) |
| 5 | **Buchungswidget** | Einbettbarer JS-Widget fuer die Restaurant-Website ("Jetzt reservieren") | Mittel | Ohne Widget gibt es keinen Buchungskanal ausser unser Backend-Dashboard |
| 6 | **Kapazitaetsmanagement** | Max. Covers pro Zeitslot, Turn-Times pro Tischgroesse, Pufferzeiten | Mittel | Ohne Kapazitaetsgrenzen akzeptiert das System mehr Gaeste als reinpassen |

### Prio 2: Wichtig (Wettbewerbsfaehigkeit)

| # | Feature | Was es macht | Aufwand | Warum wichtig |
|---|---------|-------------|---------|---------------|
| 7 | **Grafischer Tischplan** | Drag & Drop Floor Plan Editor, Tische positionieren, Bereiche (Terrasse etc.) | Hoch | Jeder ernsthafte Wettbewerber hat das. Ohne visuellen Plan wirkt die App amateurhaft |
| 8 | **Automatische Tischzuweisung** | Algorithmus: kleinster passender Tisch, Kombinationen, Puffer, Zonen | Hoch | Manuelles Zuweisen skaliert nicht bei 50+ Reservierungen/Tag |
| 9 | **Gaeste-CRM mit Tags** | Gastprofile (Name, E-Mail, Besuchshistorie), Tags (VIP, Stammgast, Allergie) | Mittel | Stammgast-Erkennung ist DER Grund warum Restaurants fuer ein System zahlen |
| 10 | **No-Show-Management** | Kreditkartengarantie (optional), No-Show-Tracking, Gaeste-Score, Blacklist | Mittel | 15-20% No-Show-Rate = 25.000-80.000 EUR Verlust/Jahr pro Restaurant |
| 11 | **SMS/WhatsApp-Erinnerungen** | Erinnerung per SMS (95% Oeffnungsrate) oder WhatsApp (80-90%) | Mittel | E-Mail hat nur 20-30% Oeffnungsrate — SMS ist der effektivere Kanal |
| 12 | **Google Reserve Integration** | "Tisch reservieren"-Button direkt in Google Maps | Hoch | >50% aller Reservierungen in DE kommen ueber Google. Ohne das verlieren wir den groessten Kanal |

### Prio 3: Differenzierung (hebt uns ab)

| # | Feature | Was es macht | Unser Vorteil |
|---|---------|-------------|---------------|
| 13 | **Warteliste** (Walk-in + Online) | Digitale Warteschlange, Auto-Nachruecken bei Stornierung, SMS-Benachrichtigung | Kein DACH-System macht das richtig gut |
| 14 | **Walk-in-Management** | Laufkundschaft digital erfassen, in Warteliste einreihen | Bessere Daten fuer Personalplanung |
| 15 | **Reservierungs-basierte Personalplanung** | "40 Reservierungen Freitag → 5 Service noetig" | KEIN Wettbewerber hat das — wir haben Reservierungs- UND Bestelldaten |
| 16 | **Bewertungsmanagement** | Feedback intern sammeln, bei positivem → Google-Bewertung vorschlagen | resmio's Killer-Feature — koennten wir besser |
| 17 | **Erlebnis-Buchung** | Menue + Tisch als Paket (Prepaid), z.B. "5-Gang-Menue am Fensterplatz — 89 EUR" | Groesster Trend 2024-2026, eliminiert No-Shows |

---

## Unser unkopierbarer Vorteil

**Kein einziges Reservierungssystem bietet QR-Tischbestellung, Echtzeit-KDS oder ein integriertes Bestellsystem.**

Das bedeutet: Ein Restaurant das bei uns Reservierungen macht, bekommt automatisch auch:
- Gaeste bestellen per QR-Code am Tisch
- Kueche sieht Bestellungen in Echtzeit
- Kellner sehen Bestellstatus live
- Dienstplan-Management
- Statistiken ueber Umsatz, Top-Gerichte, Stosszeiten

**resmio + Orderbird + Gastromatic = 3 Tools, 3 Vertraege, ~300+ EUR/Mo**
**Wir = 1 Tool, 1 Vertrag, ~49-149 EUR/Mo**

Das ist unser Pitch: **Alles in einem, fuer weniger Geld.**

---

## Best Practices: Was wir uebernehmen sollten

### Online-Buchungsflow (3 Schritte — Branchenstandard)

```
Schritt 1: Datum + Personen + gewuenschte Uhrzeit (1 Screen)
Schritt 2: Verfuegbare Zeitslots anzeigen (max 6-8 Slots)
Schritt 3: Kontaktdaten + DSGVO-Checkbox + Bestaetigen
→ Sofortige E-Mail-Bestaetigung
```

- 15-Minuten-Slots als Standard (konfigurierbar)
- Nur verfuegbare Slots zeigen (kein "ausgebucht"-Frust)
- Speisekarte NICHT im Buchungsflow (nur als optionaler Link)
- Bei >8 Personen: Anfrage statt Direktbuchung

### Erinnerungen (optimales Timing)

| Zeitpunkt | Kanal | Inhalt |
|-----------|-------|--------|
| Sofort | E-Mail | Buchungsbestaetigung mit allen Details + Stornierungslink |
| 24h vorher | SMS/WhatsApp | Erinnerung + "Bestaetigen / Stornieren"-Buttons |
| 2-3h vorher | SMS/WhatsApp | "Wir freuen uns auf Sie! Anfahrt: [Link]" |
| 24h danach | E-Mail | Feedback-Anfrage → bei positiv → Google-Bewertung |

### No-Show-Reduktion (Ranking nach Kosten-Nutzen)

1. **SMS-Erinnerung + 1-Klick-Stornierung** — kostet fast nichts, reduziert No-Shows um 40-50%
2. **Einfache Stornierung** — klingt kontraintuitiv, aber Gaeste stornieren statt nicht zu erscheinen
3. **Kreditkartengarantie** (nur Wochenende/Feiertage/Gruppen 6+) — reduziert No-Shows um 75%
4. **Warteliste mit Auto-Nachruecken** — stornierter Platz wird sofort gefuellt
5. **Gaeste-Score** — langfristig am wertvollsten, braucht Datenhistorie

### No-Show-Benchmarks

| Ohne Massnahmen | Mit SMS-Erinnerung | Mit Kreditkarte | Mit Prepaid |
|-----------------|--------------------|--------------------|-------------|
| 15-20% | 8-12% | 3-5% | 1-2% |

### Turn-Time-Benchmarks (Verweildauer)

| Personenzahl | Casual Dining | Fine Dining |
|-------------|---------------|-------------|
| 1-2 Personen | 60-75 Min | 90-120 Min |
| 3-4 Personen | 75-90 Min | 120-150 Min |
| 5-6 Personen | 90-105 Min | 150-180 Min |
| 7+ Personen | 105-120 Min | 180+ Min |

### Gaeste-CRM (3 Tiers)

- **Tier 1 — Basisdaten (automatisch):** Name, E-Mail, Telefon, Buchungshistorie, No-Show-Historie
- **Tier 2 — Praeferenzen (manuell + Gast):** Allergien (ACHTUNG: Art. 9 DSGVO = explizite Einwilligung!), Lieblingsgericht, Sitzplatz-Praeferenz, VIP-Status
- **Tier 3 — Marketing (nur mit Opt-in):** Geburtstag, Marketing-E-Mails, SMS/WhatsApp

### Automatische Gast-Tags

| Kategorie | Kriterium | Tag |
|-----------|-----------|-----|
| Neugast | 1. Besuch | `neu` |
| Wiederkommer | 2-3 Besuche in 6 Monaten | `wiederkommer` |
| Stammgast | 4+ Besuche in 6 Monaten | `stammgast` |
| VIP | 8+ Besuche ODER Umsatz > 100 EUR/Besuch | `vip` |
| Inaktiv | Kein Besuch seit 3+ Monaten | `inaktiv` |
| No-Show-Risiko | 2+ No-Shows | `risiko` |

---

## Empfohlene Implementierungs-Reihenfolge

### Phase A: Basis-Reservierung (Prio 1 — Minimum Viable)

1. Zeitslot-System (Kapazitaet pro 15-Min-Slot konfigurierbar)
2. Oeffentliche Buchungsseite fuer Gaeste (3-Schritt-Flow)
3. E-Mail-Bestaetigung + Erinnerung (24h + 2h vorher)
4. Gast-Self-Service (Stornierung + Umbuchung per Link)
5. Einbettbares Buchungswidget (JS-Snippet fuer Restaurant-Website)
6. Kapazitaetsmanagement (Max Covers pro Slot, Turn-Times, Puffer)

### Phase B: Professionelles Reservierungssystem (Prio 2)

7. Grafischer Tischplan (Floor Plan Editor mit Drag & Drop)
8. Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen)
9. Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien)
10. No-Show-Management (Kreditkartengarantie, Tracking, Score)
11. SMS/WhatsApp-Erinnerungen
12. Google Reserve Integration

### Phase C: Differenzierung (Prio 3)

13. Warteliste (Walk-in + Online, Auto-Nachruecken)
14. Walk-in-Management
15. Reservierungs-basierte Personalplanung (unser Alleinstellungsmerkmal!)
16. Bewertungsmanagement (Feedback → Google-Review-Pipeline)
17. Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket)

---

## Quellen

- Wettbewerbsanalyse DACH-Markt: → `project/reservierungssysteme-vergleich.md`
- Best Practices & Innovationen: → `~/vault/research/restaurant-reservierungssysteme-analyse.md`
