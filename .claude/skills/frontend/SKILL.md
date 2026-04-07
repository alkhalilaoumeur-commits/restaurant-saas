---
name: frontend
description: Prueft und optimiert das Frontend gegen die Gestaltungsrichtlinie (FRONTEND.md). Findet Inkonsistenzen, schlaegt Verbesserungen vor und haelt die Richtlinie aktuell.
allowed-tools: Read Edit Write Grep Glob Bash Agent
argument-hint: [was pruefen oder verbessern – leer = komplett-check]
---

# Frontend-Check: Pruefen, Optimieren, Aktualisieren

Du bist der Frontend-Waechter fuer dieses Projekt. Deine Aufgabe: Sicherstellen, dass das Frontend konsistent, modern und sauber ist – immer orientiert an der zentralen Gestaltungsrichtlinie.

## Was der Nutzer gesagt hat

$ARGUMENTS

---

## WICHTIG: Design-Vorlage zuerst lesen

**Vor jeder Aenderung MUSS `restaurant-app/frontend/FRONTEND.md` gelesen werden.**
Das ist die einzige Wahrheit fuer das Design. Jede Abweichung davon ist ein Fehler.

### Design-Stil: Modernes Admin-Dashboard (Dribbble-Stil)

Das Vorbild ist ein professionelles, cleanes Admin-Dashboard:
- **Dunkle Sidebar** (`#1e293b` / slate-800) mit weissen Icons und semi-transparenten Hover/Active-States
- **Heller Content-Bereich** (`#f8f8fa`) mit viel Weissraum
- **Weisse Karten** mit `rounded-2xl` (16px), `shadow-sm`, grosszuegigem Padding (`p-5`)
- **Farbige Icon-Badges** in Stat-Karten (amber, orange, emerald, blue auf `rounded-xl`)
- **Kontrastreiche Navigation** – dunkle Sidebar vs. heller Content
- **Gradient-Fortschrittsbalken** (`bg-gradient-to-r from-blue-500 to-blue-400`)
- **Benutzer-Avatar** (Initialen-Kreis) in der Topbar rechts oben
- **Schriften:** Playfair Display SC fuer Ueberschriften, Karla fuer Fliesstext
- **Primaerfarbe Rot** (`#DC2626`) nur fuer wichtige Aktionen, ansonsten Graustufen
- **Status = Farbe** – Jeder Status hat eine feste, konsistente Farbe

### Formular-Stil
- Inputs: `border border-gray-200 rounded-lg px-3 py-2 text-sm`
- Focus: `focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400`
- Labels: `text-xs font-medium text-gray-600 mb-1`
- Primaer-Button: `bg-[#dc2626] text-white rounded-lg font-medium hover:bg-[#c52222]`
- Sekundaer-Button: `bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700`

---

## Modus bestimmen

Entscheide anhand der Nutzer-Eingabe, welchen Modus du ausfuehrst:

### Modus A: Komplett-Check (kein Argument oder "check" / "pruefen")
Fuehre ALLE Schritte 1-5 aus.

### Modus B: Gezielter Check (z.B. "Bestellungen", "Farben", "Sidebar")
Fuehre nur die relevanten Schritte fuer den genannten Bereich aus.

### Modus C: Verbesserung umsetzen (z.B. "mach Skeleton-Loading", "fuege Dark Mode hinzu")
Setze die Verbesserung um, pruefe gegen die Richtlinie, aktualisiere FRONTEND.md.

---

## Schritt 1: Richtlinie lesen

Lies die zentrale Gestaltungsrichtlinie:
- `restaurant-app/frontend/FRONTEND.md`

Das ist deine Referenz fuer alles. Jede Abweichung davon ist ein Problem.

## Schritt 2: Frontend-Code scannen

Lies die relevanten Dateien:

**Layout & Navigation:**
- `restaurant-app/frontend/src/components/layout/Sidebar.tsx`
- `restaurant-app/frontend/src/components/layout/Layout.tsx`
- `restaurant-app/frontend/src/components/layout/Topbar.tsx`

**Seiten:**
- `restaurant-app/frontend/src/pages/*.tsx` (alle Seiten)

**Komponenten:**
- `restaurant-app/frontend/src/components/**/*.tsx` (alle Komponenten)

**Konfiguration:**
- `restaurant-app/frontend/tailwind.config.ts`
- `restaurant-app/frontend/src/lib/utils.ts`

## Schritt 3: Probleme finden

Pruefe auf diese Kategorien:

### 3a. Farb-Konsistenz
- Werden die richtigen Markenfarben verwendet (rot `#DC2626` fuer primaere Aktionen)?
- Sind Status-Farben konsistent (gleicher Status = gleiche Farbe ueberall)?
- Werden Graustufen einheitlich genutzt?
- Sidebar: Alles auf dunklem Grund (slate-800), Text in slate-400/500, aktiv = white/10

### 3b. Typografie-Konsistenz
- Sind Schriftgroessen konsistent (Seitentitel `22px`, Body `sm/14px`, Labels `xs/12px`)?
- Werden Gewichte einheitlich verwendet?
- Heading-Font nur fuer Ueberschriften, Body-Font fuer alles andere?

### 3c. Komponenten-Konsistenz
- Haben ALLE Karten `rounded-2xl` und `shadow-sm`?
- Ist der Innenabstand einheitlich (`p-4` bis `p-5`)?
- Sind Button-Styles konsistent (siehe Formular-Stil oben)?
- Haben ALLE Inputs einheitliche Focus-States (`focus:ring-2 focus:ring-red-100 focus:border-red-400`)?
- Sind Modals/Overlays einheitlich (`bg-black/30`, `rounded-2xl`, `shadow-lg`)?

### 3d. Layout-Konsistenz
- Sidebar: 260px, fixiert, dunkler Hintergrund
- Content: flex-1, max 1400px, Padding p-6 lg:p-8
- Seitenhintergrund: #f8f8fa

### 3e. UX & Zugaenglichkeit
- Haben alle Buttons einen Hover-State?
- Haben interaktive Elemente `cursor-pointer`?
- Sind Lade-Zustaende vorhanden?
- Haben Formulare Labels und Platzhalter?

## Schritt 4: Probleme beheben

Fuer jedes gefundene Problem:

1. **Erklaere kurz** was falsch ist (auf Deutsch, einfach)
2. **Zeige die Stelle** (Datei + Zeile)
3. **Behebe es** direkt im Code (Edit-Tool)
4. **Teste** ob der TypeScript-Compiler zufrieden ist:
   ```bash
   export PATH="/opt/homebrew/bin:$PATH" && cd restaurant-app/frontend && npx tsc --noEmit
   ```

## Schritt 5: FRONTEND.md aktualisieren

Nach jeder Aenderung MUSS `FRONTEND.md` aktualisiert werden:

- **Datum** oben anpassen (heutiges Datum)
- **Neue Komponenten** in die Uebersicht eintragen
- **Geaenderte Farben/Groessen** in den Tabellen aktualisieren
- **Erledigte Verbesserungen** im Backlog abhaken `[x]`
- **Neue Verbesserungsideen** ins Backlog eintragen

## Schritt 6: Zusammenfassung

Gib eine kurze Zusammenfassung auf Deutsch:

```
Frontend-Check Ergebnis:
- X Probleme gefunden
- X Probleme behoben
- X Verbesserungen vorgeschlagen

Geaenderte Dateien:
- ...

Naechste empfohlene Verbesserung:
- ...
```

---

## Wichtige Regeln

- **Niemals** Features entfernen oder Logik aendern – nur Design/Konsistenz verbessern
- **Immer** TypeScript-Check laufen lassen nach Aenderungen
- **Immer** FRONTEND.md am Ende aktualisieren
- **Einfach erklaeren** – Ilias hat keine Programmiererfahrung
- **Kleine Schritte** – Lieber 3 sichere Fixes als 10 riskante
- **Modernes Admin-Dashboard (Dribbble-Stil) ist das Vorbild** – Clean, professionell, kontrastreiche Navigation, farbige Icon-Akzente
- **Keine Deko-Effekte** – Keine unnoetigen Animationen, Schatten oder Verzierungen
- **Tailwind Default Scale** – Immer die Standard-Tailwind-Werte verwenden wo moeglich
