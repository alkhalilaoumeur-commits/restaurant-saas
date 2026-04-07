# Design-System Analyse: Bestellseite Customization

*Erstellt: 2026-04-06 | Detaillierte Recherche: ~/vault/research/theme-system-recherche.md*

---

## Aktueller Stand

**Was existiert:**
- 1 Primärfarbe pro Restaurant (hex, z.B. `#ea580c`)
- 9 Farbvorlagen + Custom-Color-Picker in Einstellungen
- Farbe wird per `style={{ color: farbe }}` inline auf Buttons, Preise, Statusleiste angewendet
- Logo + Name werden angezeigt
- Kein Theme-System, keine Layout-Varianten, keine Schriftart-Auswahl

**Technisch:** Alles ist hardcoded Tailwind + inline-styles. Kein CSS-Variablen-System.

---

## Was die Konkurrenz macht

| Plattform | Ansatz | Fazit fuer uns |
|-----------|--------|----------------|
| **Shopify** | 23 Free Themes + 245 Premium (70-500 EUR einmalig). Presets = JSON-Config-Varianten desselben Codes. CSS-Variablen fuer Live-Preview. | Gold-Standard. Unser Vorbild fuer die Architektur |
| **Orderbird** | 3 Layout-Varianten (Default, Kacheln, Switch) + Farben + Fonts | Beweis: Layouts muessen sich UNTERSCHEIDEN, nicht nur Farben |
| **Toast** | Nur 1 Primaerfarbe + Logo + Font. Kein Theme-System | Zu wenig — das haben wir schon fast |
| **GloriaFood** | Farben/Fonts NICHT aenderbar. Philosophie: "Fokus auf Essen + Checkout" | Zu restriktiv, aber guter Punkt: Bestellseite muss primaar funktionieren |
| **Squarespace** | Alle Templates teilen eine Grundstruktur. Template-Wechsel ohne Inhaltsverlust | Unser Ansatz: 1 Code-Basis, 6 Preset-Konfigurationen |
| **Ecwid** | Stufensystem: Free = Automatische Farben, Premium = CSS-Editor + API | Genau unser Modell: Free = Presets, Premium = Builder |

### Wichtigste Erkenntnis

**Themes muessen sich in 5 Dimensionen unterscheiden, nicht nur Farben:**
1. **Layout** — Grid vs. Liste vs. grosse Karten
2. **Typografie** — Modern (Inter) vs. Elegant (Playfair) vs. Rustikal (Caveat)
3. **Farbwelt** — Nicht nur Primaerfarbe, sondern ganzes Farbschema
4. **Bildstil** — Rund vs. eckig, mit/ohne Schatten, Overlay
5. **Mikro-Interaktionen** — Hover-Effekte, Button-Styles, Uebergaenge

---

## Die 6 kostenlosen Preset-Designs

| # | Name | Layout | Schrift | Farbwelt | Zielgruppe |
|---|------|--------|---------|----------|------------|
| 1 | **Modern** | Grid 3 Spalten | Inter / DM Sans | Weiss + Gruen-Akzent | Trendige Restaurants |
| 2 | **Klassisch** | Liste mit Seitenbildern | Playfair Display + Lora | Creme + Gold | Gehobene Kueche |
| 3 | **Rustikal** | Grosse Karten (1 Spalte) | Caveat + Nunito | Beige + Holz-Braun | Cafes, Brauhaeuser |
| 4 | **Bold** | Grid 2 Spalten gross | Oswald + Roboto | Schwarz + Gelb | Burger, Pizza, Street Food |
| 5 | **Minimal** | Textliste, kleine Bilder | Space Grotesk + IBM Plex | Fast nur Schwarz-Weiss | Sushi, Bowls |
| 6 | **Bunt** | Grid 2 Spalten + Tabs | Poppins + Quicksand | Pastell + bunter Akzent | Eisdiele, Family |

### Warum genau diese 6?

- **Modern** = Default, funktioniert fuer 70% aller Restaurants
- **Klassisch** = gehobene Kueche braucht Eleganz (Serif-Fonts, Gold, dezent)
- **Rustikal** = Cafes/Brauhaeuser wollen Waerme und Gemuetlichkeit
- **Bold** = Fast Food / Street Food braucht Energie und Kontrast
- **Minimal** = Design-affine Betriebe (Sushi, Bowl-Laeden) wollen Reduktion
- **Bunt** = Eis, Smoothies, Family — darf verspielt sein

---

## Premium Custom-Builder (einmalig 20 EUR)

### Was der Kunde bekommt

**Farben (10 Regler):**
- Primaerfarbe, Hover-Farbe, Hintergrund, Oberflaeche (Karten), Haupttext, Nebentext, Raender, Erfolg, Warnung, Warenkorb

**Typografie (4 Regler):**
- Headline-Font (Google Fonts Auswahl), Body-Font, Schriftgroesse, Headline-Staerke

**Layout (5 Regler):**
- Modus (Grid / Liste / Karten), Spaltenanzahl, Eckenrundung, Schatten, Header-Stil (Banner / Logo-only / Minimal)

**Bilder (3 Regler):**
- Seitenverhaeltnis (1:1, 4:3, 16:9), Eckenrundung, Hero-Banner hochladen

**Extras:**
- Live-Preview (Aenderungen sofort sichtbar)
- Undo/Redo
- "Zurueck zum Preset" Reset-Button
- Mobile-Vorschau

### Warum 20 EUR der richtige Preis ist

- Shopify nimmt 70-500 EUR einmalig fuer Premium-Themes → 20 EUR ist Impulskauf
- Kein Abo = kein Widerstand bei Gastronomen (die haben schon 5 Abos)
- Upsell-Bruecke: Wer 20 EUR zahlt, zahlt spaeter auch fuer andere Features
- Gastromatic/Papershift: Bieten keine Design-Customization → wir sind allein

---

## Technische Umsetzung (Kurzfassung)

### Architektur

```
Restaurant waehlt Preset oder baut Custom
        ↓
Theme-Config als JSON in DB (restaurants.theme_config JSONB)
        ↓
Frontend laedt JSON via /api/restaurant/:id/design
        ↓
useTheme-Hook setzt CSS Custom Properties auf document.documentElement
        ↓
Tailwind-Utilities referenzieren CSS-Variablen (bg-theme-primary etc.)
        ↓
Komponenten brauchen keine inline-styles mehr
```

### Was sich aendern muss

| Bereich | Aktuell | Neu |
|---------|---------|-----|
| DB | `primaerfarbe TEXT` | + `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` |
| API | `/api/restaurant/:id/design` gibt name + logo + farbe | + gibt `theme_config` JSON zurueck |
| Frontend Hook | `useRestaurantDesign` gibt 1 Farbe | `useTheme` setzt 26 CSS-Variablen |
| Tailwind Config | Hardcoded `brand.*` Farben | `theme.*` auf `var(--color-*)` gemappt |
| Komponenten | `style={{ color: farbe }}` | `className="text-theme-primary"` |
| Einstellungen | 9 Farbbuttons + Picker | Preset-Galerie + Builder (hinter Paywall) |

### Theme-JSON Schema (Beispiel: "Modern" Preset)

```json
{
  "preset": "modern",
  "custom": false,
  "colors": {
    "primary": "#22c55e",
    "primaryHover": "#16a34a",
    "background": "#ffffff",
    "surface": "#f9fafb",
    "textPrimary": "#111827",
    "textSecondary": "#6b7280",
    "border": "#e5e7eb",
    "cart": "#22c55e"
  },
  "typography": {
    "headlineFont": "Inter",
    "bodyFont": "Inter",
    "baseFontSize": "16px",
    "headlineWeight": "700"
  },
  "layout": {
    "mode": "grid",
    "gridColumns": 3,
    "borderRadius": "12px",
    "shadowCard": "0 1px 3px rgba(0,0,0,0.1)",
    "headerStyle": "banner"
  },
  "images": {
    "imageRatio": "4/3",
    "imageRadius": "12px",
    "heroImage": null
  }
}
```

---

## Implementierungs-Reihenfolge

### Schritt 1: Preset-System
1. Theme-JSON-Schema als TypeScript-Interface definieren
2. 6 Preset-Konstanten als `src/lib/themes.ts`
3. `useTheme`-Hook: JSON → CSS Custom Properties
4. Tailwind-Config auf CSS-Variablen umstellen
5. Bestellen-Seite + Komponenten auf `theme-*` Klassen umbauen
6. DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN`
7. API: Design-Endpoint erweitern
8. Einstellungen: Preset-Galerie mit Vorschau-Thumbnails

### Schritt 2: Premium-Builder
1. Builder-UI: Farb-Picker, Font-Dropdown, Layout-Toggle, Slider
2. Live-Preview mit Zustand-Store
3. Undo/Redo-System
4. Zahlungsintegration (Mollie/Stripe fuer 20 EUR einmalig)
5. `theme_premium_unlocked` Flag nach Zahlung setzen
6. Paywall-UI: "Premium freischalten" mit Vorschau was man bekommt

### Schritt 3: Polish
1. Thumbnail-Previews fuer Preset-Galerie generieren
2. Mobile-Vorschau im Builder
3. Font-Loading optimieren (Google Fonts Preload)
4. "Zurueck zum Preset" Reset-Button

---

## Quellen

Vollstaendige Recherche mit Code-Beispielen:
→ `~/vault/research/theme-system-recherche.md`
