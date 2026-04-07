# Frontend-Gestaltungsrichtlinie

> Diese Datei ist die zentrale Referenz fuer das gesamte Frontend-Design.
> Sie wird bei jeder Aenderung aktualisiert (via `/frontend` Skill).
> **Letzte Aktualisierung:** 2026-04-05

---

## Design-Stil

**Vorbild:** Modernes Admin-Dashboard (Dribbble-Stil) – clean, professionell, mit dunkler Sidebar
**Ansatz:** Kontrastreiche Navigation (dunkle Sidebar) + heller Content-Bereich. Weiche Abrundungen, farbige Icon-Akzente in Stat-Karten, viel Weissraum.

---

## Farbpalette

### Markenfarben
| Zweck | Farbe | Tailwind | Verwendung |
|---|---|---|---|
| Primaer | `#DC2626` | `red-600` / `brand-primary` | Buttons, aktive Elemente, Logo-Akzent |
| Primaer Hover | `#C52222` | – | Button-Hover-State |
| Primaer Leicht | `#FEF2F2` | `red-50` / `brand-bg` | Aktiver Nav-Hintergrund, Highlights |
| Akzent | `#A16207` | `brand-accent` | Spezial-Hervorhebungen |

### Status-Farben
| Status | Hintergrund | Text | Verwendung |
|---|---|---|---|
| Offen / Ausstehend | `yellow-100` | `yellow-800` | Bestellungen, Reservierungen |
| In Zubereitung | `orange-100` | `orange-800` | Kuechen-Status |
| Serviert / Bestaetigt | `green-100` | `green-800` | Erfolg-Status |
| Bezahlt / Storniert | `gray-100` | `gray-500` | Abgeschlossen / Inaktiv |

### Rollen-Farben
| Rolle | Hintergrund | Text |
|---|---|---|
| Admin | `violet-100` | `violet-700` |
| Kellner | `sky-100` | `sky-700` |
| Kueche | `amber-100` | `amber-700` |

### Tisch-Farben
| Status | Hintergrund | Text |
|---|---|---|
| Frei | `green-100` | `green-700` |
| Besetzt | `red-100` | `red-700` |
| Wartet auf Zahlung | `yellow-100` | `yellow-700` |

### Sidebar-Farben
| Zweck | Farbe | Tailwind |
|---|---|---|
| Sidebar-Hintergrund | `#1e293b` | `sidebar` / `slate-800` |
| Sidebar-Text | `#94a3b8` | `sidebar-text` / `slate-400` |
| Sidebar-Hover | `rgba(255,255,255,0.05)` | `sidebar-hover` |
| Sidebar-Aktiv | `rgba(255,255,255,0.10)` | `sidebar-active` |
| Sidebar-Sektions-Titel | `#64748b` | `sidebar-heading` / `slate-500` |

### Graustufen (UI)
| Zweck | Farbe |
|---|---|
| Seitenhintergrund | `#f8f8fa` (custom) |
| Karten-Hintergrund | `white` |
| Primaertext | `gray-900` |
| Sekundaertext | `gray-600` |
| Hinweistext | `gray-400` |
| Rahmen / Trennlinien | `gray-100` bis `gray-200` |

### Dark Mode Farben
| Zweck | Farbe | Tailwind / CSS |
|---|---|---|
| Seiten-Hintergrund | `#0A0F1A` | `dark:bg-[#0A0F1A]` |
| Sidebar-Hintergrund | `#0F1724` | `dark:bg-[#0F1724]` |
| Karten-Hintergrund | `rgba(255,255,255,0.04)` | `dark:bg-white/[0.04]` |
| Karten-Rahmen | `rgba(255,255,255,0.07)` | `dark:border-white/[0.07]` |
| Input-Hintergrund | `rgba(255,255,255,0.05)` | globals.css |
| Input-Rahmen | `rgba(255,255,255,0.12)` | globals.css |
| Primaertext | `#F8FAFC` | `dark:text-slate-50` |
| Sekundaertext | `#E2E8F0` | `dark:text-slate-200` |
| Hinweistext | `#64748B` | `dark:text-slate-500` |
| Label-Text | `#CBD5E1` | `dark:text-slate-300` (globals.css) |
| Trennlinien | `rgba(255,255,255,0.10)` | `dark:bg-white/10` |

---

## Typografie

### Schriftarten
| Typ | Font | Tailwind-Klasse |
|---|---|---|
| Ueberschriften | Playfair Display SC | `font-heading` |
| Fliesstext | Karla | `font-body` |
| System-Fallback | sans-serif | – |

### Groessen
| Element | Groesse | Gewicht | Tracking |
|---|---|---|---|
| Seitentitel (Topbar) | `22px` | `semibold` | `-0.02em` |
| Sidebar-Logo | `15px` | `semibold` | `-0.01em` |
| Sidebar-Sektion | `11px` | `semibold` (uppercase) | `wider` |
| Sidebar-Link | `14px` | `medium` | – |
| Karten-Titel | `sm` (14px) | `semibold` | – |
| Body-Text | `sm` (14px) | `normal` | – |
| Labels | `xs` (12px) | `medium` | – |
| Hinweistexte | `xs` (12px) | `normal` | – |
| Rollen-Badge | `10px` | `semibold` | – |

---

## Abstande & Layout

### Seiten-Layout
- Sidebar: `260px` breit, fixiert links
- Content-Bereich: `flex-1`, max `1400px`
- Seitenpadding: `p-6 lg:p-8`
- Abstand Topbar zu Content: `mb-8`

### Karten
- Abrundung: `rounded-2xl` (16px)
- Innenabstand: `p-4` bis `p-5`
- Schatten: `shadow-sm`
- Hintergrund: `bg-white`

### Buttons
| Typ | Klassen |
|---|---|
| Primaer | `bg-[#dc2626] text-white rounded-lg h-11 font-medium hover:bg-[#c52222]` |
| Sekundaer (orange) | `bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700` |
| Status-Aktion | `text-xs px-2 py-1 rounded bg-{farbe}-50 text-{farbe}-700 hover:bg-{farbe}-100` |
| Gefahr | `text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100` |

### Badges
- Status-Badge: `text-xs px-2 py-0.5 rounded-full font-medium` + Status-Farbe
- Rollen-Badge: `px-1.5 py-0.5 rounded text-[10px] font-semibold` + Rollen-Farbe

### Formulare & Inputs
| Element | Klassen |
|---|---|
| Text-Input | `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-colors` |
| Select | Gleich wie Text-Input |
| Textarea | Gleich wie Text-Input |
| Label | `block text-xs font-medium text-gray-600 mb-1` |
| Input (Login) | `w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm` + Focus: `focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary` |
| Fehlertext | `text-xs text-red-600` |
| Formular-Abstand | `space-y-3` zwischen Feldern |
| Button-Zeile | `flex gap-2 pt-1` |

### Modals / Overlays
| Element | Klassen |
|---|---|
| Backdrop | `fixed inset-0 bg-black/30 flex items-center justify-center z-50` |
| Modal-Karte | `bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4` |
| Modal-Titel | `font-medium text-sm text-gray-700 mb-2` |
| Modal-Text | `text-xs text-gray-500 mb-4` |
| Modal-Buttons | `flex gap-2` |

---

## Komponenten-Uebersicht

### Layout (`src/components/layout/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| Sidebar | `Sidebar.tsx` | Linke Navigation mit Icons, Sektionen, Rollen-Badge |
| Layout | `Layout.tsx` | Wrapper: Sidebar + Content-Outlet |
| Topbar | `Topbar.tsx` | Seitentitel + optionale Aktion (Button rechts) |

### Dashboard (`src/components/dashboard/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| StatKarte | `StatKarte.tsx` | Statistik-Box mit Label, Zahl, farbigem Icon-Badge |
| Auslastung | `Auslastung.tsx` | Tischauslastung mit Fortschrittsbalken |

### Bestellungen (`src/components/bestellungen/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| BestellungKarte | `BestellungKarte.tsx` | Bestellungs-Karte mit Positionen + Status-Button |
| StatusBadge | `StatusBadge.tsx` | Farbiger Status-Badge fuer Bestellungen |

### Speisekarte (`src/components/speisekarte/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| GerichtKarte | `GerichtKarte.tsx` | Gericht mit Bild, Preis, Toggle, Bearbeiten, Loeschen |
| GerichtFormular | `GerichtFormular.tsx` | Formular fuer neues Gericht oder Bearbeitung (Modus via `gericht`-Prop) |
| KategorieVerwaltung | `KategorieVerwaltung.tsx` | Kategorie-CRUD: Hinzufuegen, Umbenennen, Loeschen (nur leere) |

### Tischplan (`src/components/tischplan/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| TischKarte | `TischKarte.tsx` | Tisch-Karte mit Status-Farbe, Klick fuer Status-Wechsel, QR/Bearbeiten/Loeschen-Buttons |
| TischFormular | `TischFormular.tsx` | Formular zum Anlegen oder Bearbeiten (Nummer, Kapazitaet) |

### Reservierungen (`src/components/reservierungen/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| ReservierungZeile | `ReservierungZeile.tsx` | Reservierung mit Name, Datum, Status-Buttons |
| ReservierungFormular | `ReservierungFormular.tsx` | Formular fuer neue Reservierung |

### Mitarbeiter (`src/components/mitarbeiter/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| MitarbeiterZeile | `MitarbeiterZeile.tsx` | Mitarbeiter-Zeile mit Avatar, Rolle-Badge, Aktiv-Status, Bearbeiten/Deaktivieren-Buttons |
| MitarbeiterFormular | `MitarbeiterFormular.tsx` | Formular zum Anlegen (Name, Email, Passwort, Rolle) oder Bearbeiten (Name, Rolle) + Passwort-Reset |

### Dienstplan (`src/components/dienstplan/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| SchichtFormular | `SchichtFormular.tsx` | Formular zum Anlegen/Bearbeiten einer Schicht (Mitarbeiter, Datum, Zeit, Notiz) |

### Gaeste (`src/components/gaeste/`)
| Komponente | Datei | Beschreibung |
|---|---|---|
| GerichtAuswahl | `GerichtAuswahl.tsx` | Gaeste-Ansicht: Gericht waehlen |
| Warenkorb | `Warenkorb.tsx` | Warenkorb-Sidebar fuer Gaeste |
| BestellStatusTracker | `BestellStatusTracker.tsx` | Live-Status-Tracker nach Bestellung (4 Schritte: Offen → Zubereitung → Serviert → Bezahlt) |

---

## Seiten-Uebersicht

| Seite | Datei | Rolle | Status |
|---|---|---|---|
| Login | `pages/Login.tsx` | Oeffentlich | Fertig (Split-Screen-Design) |
| Dashboard | `pages/Dashboard.tsx` | Alle | Fertig (4 Stat-Karten + Auslastung + aktive Bestellungen + heutige Reservierungen) |
| Bestellungen | `pages/Bestellungen.tsx` | Alle | Fertig (Karten-Grid mit Live-Updates) |
| Tischplan | `pages/Tischplan.tsx` | Admin, Kellner | Fertig (Tisch-CRUD, Status-Wechsel, QR-Code-Anzeige + Einzel-/Sammel-Druck, Loeschbestaetigung) |
| Reservierungen | `pages/Reservierungen.tsx` | Admin, Kellner | Fertig (Wochenleiste, Tagesnavigation, Tagesstatistiken, Liste + Formular) |
| Speisekarte | `pages/Speisekarte.tsx` | Admin | Fertig (Kategorien + CRUD) |
| Mitarbeiter | `pages/Mitarbeiter.tsx` | Admin | Fertig (Liste, Anlegen, Bearbeiten, Deaktivieren, Passwort-Reset, Filter-Tabs) |
| Dienstplan | `pages/Dienstplan.tsx` | Admin | Fertig (Wochenansicht, Mitarbeiter-Zeilen, Schicht-CRUD, Rollen-Farben, Stundenzaehler) |
| Statistiken | `pages/Statistiken.tsx` | Admin | Fertig (Zeitraum-Auswahl 7/30/90 Tage, Umsatz-Verlauf, Top-Gerichte, Stosszeiten, Kategorie-Donut) |
| Einstellungen | `pages/Einstellungen.tsx` | Admin | Fertig (Lizenz-Info, Mitarbeiter-Nutzung, Design-Farbauswahl mit Vorschau, Restaurant-Daten, Dark-Mode-Toggle) |
| Bestellen | `pages/Bestellen.tsx` | Gaeste (oeffentlich) | Fertig (QR-Code-Bestellung + Live-Status-Tracker via Socket.io) |

---

## Sidebar-Navigation (Dark-Theme)

### Sektionen
1. **Betrieb** – Dashboard, Bestellungen, Tischplan, Reservierungen, Dienstplan
2. **Verwaltung** – Speisekarte, Mitarbeiter, Statistiken, Einstellungen

### Design-Merkmale
- Dunkler Hintergrund (`#1e293b` / slate-800)
- Icons (inline SVG) vor jedem Menuepunkt, weiss/slate
- Aktiver Punkt: `bg-white/10 text-white`
- Hover: `bg-white/5 text-slate-200`
- Sektions-Titel: `11px` uppercase, `slate-500`, `tracking-wider`
- Benutzer-Info unten: Initialen-Avatar + Name + Rollen-Badge (auf dunklem Grund)
- Abmelden-Button mit Logout-Icon

---

## Design-Regeln

1. **Farben sparsam nutzen** – Nur Primaerfarbe (rot) fuer aktive/wichtige Elemente
2. **Weissraum** – Grosszuegige Abstaende, Karten nie zu eng
3. **Konsistenz** – Gleiche Abrundung (`rounded-2xl`), gleiche Schatten (`shadow-sm`)
4. **Status = Farbe** – Jeder Status hat eine feste Farbe (siehe Tabelle)
5. **Kein Farbchaos** – Maximal 2 Farben pro Komponente (Graustufe + 1 Akzent)
6. **Mobile-first** – Grid passt sich an (responsive Spalten)
7. **Animations sanft** – Nur `transition-colors/all duration-150`, keine wilden Animationen
8. **Text auf Deutsch** – Alle Labels, Buttons, Fehlermeldungen
9. **Dark Mode** – Jede neue Komponente muss `dark:` Varianten mitbringen. Standard-Karten-Muster: `bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07]`. Inputs ueber globals.css abgedeckt. Theme-State in `src/store/theme.ts` (Zustand + persist). Toggle auf Einstellungen-Seite.

---

## Bekannte Verbesserungen (Backlog)

- [x] Dark Mode implementiert (Tailwind `darkMode: 'class'`, Theme-Store, alle Seiten + Komponenten) ✅ erledigt 2026-04-06
- [ ] Sidebar auf Mobile als Overlay/Drawer
- [ ] Skeleton-Loading statt "Wird geladen..."
- [ ] Toast-Benachrichtigungen statt inline-Fehler
- [ ] Breadcrumbs in Topbar
- [ ] Responsive Tischplan (Grid-Anpassung fuer kleine Screens)
- [ ] Animierte Seitenwechsel (Framer Motion)
