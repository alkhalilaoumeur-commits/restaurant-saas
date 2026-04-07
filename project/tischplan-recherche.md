# Recherche: Räumlicher Tischplan / Floor Plan Editor

> Erstellt: 2026-04-06 | Zweck: Referenz für die Implementierung des visuellen Tischplan-Editors in ServeFlow

## 1. Anbieter-Vergleich

### Tier 1: Vollwertige visuelle Editoren

| Anbieter | Editor-Typ | Tisch-Formen | Zonen/Bereiche | Besonderheiten |
|---|---|---|---|---|
| **OpenTable** | Freeform Drag & Drop | Rund, Quadrat, Rechteck, Bar, Booth | Dining Areas (Hauptraum, Terrasse, Bar, Privat) | Tische skalierbar per Edge-Drag, Kombinationen erstellbar, Reservierungen direkt auf Floor Plan |
| **SevenRooms** | Drag & Drop + KI-Seating | Rund, Quadrat, Rechteck | Frei konfigurierbare Bereiche | KI prüft 10.000+ Kombinationen/Sek, VIP-Tische mit farbiger Umrandung, Live-Spend pro Tisch aus POS |
| **TouchBistro** | Drag & Drop (iPad-nativ) | Rund, Quadrat, Rechteck, Barhocker | Sections (Dining Room, Bar, Patio, beliebig) | Wände platzierbar + rotierbar, POS-Kassenstandort markierbar, mehrere Etagen |
| **Lightspeed** | Drag & Drop | Rund, Quadrat | Namenskonventionen ("B" für Bar, "D" für Dining) | Max 150 Tische pro Grundriss, NFC/RFID-Tags pro Tisch |

### Tier 2: Einfache Editoren

| Anbieter | Editor-Typ | Tisch-Formen | Zonen/Bereiche | Besonderheiten |
|---|---|---|---|---|
| **Resy** | Drag & Drop (Web + iPad) | Rund, Quadrat, Rechteck | Gäste wählen Bereich bei Buchung | Floor Plans kopierbar für verschiedene Saisons |
| **Toast POS** | Drag & Drop | Anpassbare Formen + Größen | Service Areas (Dining Room, Bar, Patio) | Floor-Plan-Templates als Starthilfe |
| **Square** | Click-and-Drag auf Grid | Größe + Form änderbar | Sections (frei benennbar) | Farbkodierte Wartezeit, verschiedene Layouts für Mittag/Abend |
| **Yelp Guest Manager** | Drag & Drop (nur Web) | Vordefinierte Table Types | Rooms (eigene Räume erstellbar) | Nur am Desktop editierbar, iPad zeigt nur an |

### Tier 3: Limitierte Editoren

| Anbieter | Editor-Typ | Tisch-Formen | Zonen/Bereiche | Besonderheiten |
|---|---|---|---|---|
| **Quandoo** | Einfaches Drag & Drop | Grundformen | Indoor, Outdoor, Terrasse, Bar | Reservierungsphasen visualisierbar (Vorspeise, Hauptgang, Dessert) |
| **TheFork** | Drag & Drop | Standard, Hoch, Niedrig, Gemeinschaftstisch, Theke | Inside, Terrasse, Outside, Rooftop, Patio, Garden | Gäste wählen Bereichs- und Tischtyp bei Buchung |

---

## 2. Gemeinsames Muster aller Anbieter

1. **Canvas/Arbeitsfläche** — User sieht Grundriss von oben
2. **Drag & Drop** — Tische aus Seitenleiste auf die Fläche ziehen
3. **Positionierung** — Freeform (OpenTable, SevenRooms) oder Grid-Snapping (Square, Lightspeed)
4. **Skalierung** — Tischgröße per Edge-Drag ändern
5. **Rotation** — explizit bei TouchBistro (Wände), implizit bei anderen
6. **Speichern** — expliziter Save-Button
7. **Multi-Layout** — verschiedene Layouts für verschiedene Schichten (Mittag vs. Abend)
8. **Live-Status** — Farben zeigen Belegung in Echtzeit

---

## 3. Tischformen — Was wird gebraucht?

| Form | Verbreitung | Fazit |
|---|---|---|
| **Rund** | Alle 10 Anbieter | Pflicht |
| **Quadrat** | Alle 10 Anbieter | Pflicht |
| **Rechteck** | 5 von 10 | Pflicht |
| **Bar/Theke** | 4 von 10 | Pflicht |
| **Booth** | 2 von 10 | Nice-to-have (als Tischtyp/Tag, keine eigene Form) |
| **L-förmig** | 0 von 10 | Nicht nötig |

**Fazit:** Rund + Quadrat + Rechteck + Bar decken 95% der Anwendungsfälle ab.

---

## 4. Zonen/Bereiche — Zwei Ansätze

### Ansatz A: Benannte Sections (häufiger)
Tische werden einer benannten Gruppe zugeordnet. Die Zone hat kein visuelles Polygon auf der Karte.
- Verwendet von: OpenTable, Toast, Square, TouchBistro, Lightspeed, Quandoo

### Ansatz B: Visuelle Räume (seltener)
Separate "Rooms" oder Etagen, zwischen denen man wechselt.
- Verwendet von: Yelp, SevenRooms, Resy

**Für ServeFlow:** Ansatz A starten (einfacher), später optional Ansatz B.

**Typische Zonen:** Innen, Terrasse, Bar, Privat-Dining, Garten, Rooftop, Chef's Table.

---

## 5. Technologie-Entscheidung: react-konva

### Library-Vergleich

| Kriterium | **react-konva** | **Fabric.js** | **SVG + react-dnd** | **tldraw SDK** |
|---|---|---|---|---|
| React-Integration | Nativ (deklarativ) | Imperativ (Wrapper nötig) | Nativ | Nativ |
| TypeScript | Vollständig | Teilweise | Vollständig | Vollständig |
| Drag & Drop | Built-in (`draggable` Prop) | Manuell | Manuell | Built-in |
| Resize/Rotate | Transformer-Komponente | Built-in | Manuell | Built-in |
| Performance (500+ Elemente) | Sehr gut (Canvas) | Gut (Canvas) | Mäßig (DOM) | Gut |
| Bundle-Größe | ~150 KB | ~300 KB | Minimal | ~500 KB |
| Community | 8.4k Stars, 20.7k Used By | 23.2k Stars | — | Gut |

### Warum react-konva?

- **Deklarativ**: Tische sind React-Komponenten (`<Rect>`, `<Circle>`, `<Group>`)
- **`draggable` Prop**: Ein Wort macht einen Tisch verschiebbar
- **Transformer**: Fertiges Resize + Rotation Tool (keine eigene Logik nötig)
- **Canvas-basiert**: Kein DOM-Overhead bei vielen Tischen
- **Grid-Snapping**: 5 Zeilen Code mit `dragBoundFunc`
- **Serialisierung**: Positionen sind plain JS-Objekte → direkt als JSON in DB speicherbar

### Installation

```bash
npm install react-konva konva
```

---

## 6. Architektur-Plan

### State-Trennung

| State-Typ | Beschreibung | Speicherort |
|---|---|---|
| **Document State** | Tische, Positionen, Formen, Zonen | PostgreSQL (wird gespeichert) |
| **Interaction State** | Selektierter Tisch, Drag-Zustand, Tool | React State (flüchtig) |
| **Viewport State** | Zoom-Level, Pan-Position | React State (pro Session) |

### Komponenten-Hierarchie

```
GrundrissEditor (neue Seite, ersetzt aktuelles Tisch-Grid)
├── Stage (Konva Canvas — die Zeichenfläche)
│   ├── Layer: Hintergrund (Grid-Raster, optional Grundriss-Bild)
│   ├── Layer: Tische
│   │   └── TischGruppe[] (je Tisch: Form + Nummer + Kapazität)
│   └── Layer: UI (Selection-Handles, Transformer)
├── Seitenleiste (Tisch-Typen zum Reinziehen)
│   ├── Runder Tisch (2er, 4er)
│   ├── Quadratischer Tisch (4er)
│   ├── Rechteckiger Tisch (6er, 8er)
│   └── Bar-Platz (1er, 2er)
└── Toolbar
    ├── Speichern
    ├── Undo/Redo
    ├── Zoom +/-
    ├── Bereich wechseln (Tabs: Innen / Terrasse / Bar)
    └── Ansichtsmodus (Editieren vs. Live-Status)
```

---

## 7. DB-Schema-Erweiterung

### Neue Tabelle: `bereiche`

```sql
CREATE TABLE IF NOT EXISTS bereiche (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,           -- z.B. "Terrasse", "Bar", "Innen"
  reihenfolge   INTEGER NOT NULL DEFAULT 0,
  erstellt_am   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Neue Felder in `tische`

```sql
ALTER TABLE tische ADD COLUMN form      TEXT NOT NULL DEFAULT 'rechteck'
  CHECK (form IN ('rechteck', 'rund', 'quadrat', 'bar'));
ALTER TABLE tische ADD COLUMN pos_x     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tische ADD COLUMN pos_y     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tische ADD COLUMN breite    INTEGER NOT NULL DEFAULT 100;
ALTER TABLE tische ADD COLUMN hoehe     INTEGER NOT NULL DEFAULT 100;
ALTER TABLE tische ADD COLUMN rotation  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tische ADD COLUMN bereich_id UUID REFERENCES bereiche(id) ON DELETE SET NULL;
```

---

## 8. Verbindung zu Reservierungen

So machen es die Großen:

1. **Bei Reservierung**: System prüft welche Tische zur gewünschten Zeit frei sind (Kapazität >= Personenanzahl)
2. **Automatische Zuweisung**: Exakte Kapazität matchen → nächstgrößerer Tisch → Tisch-Kombination
3. **Manuelle Zuweisung**: Host zieht Reservierung per Drag & Drop auf Tisch im Floor Plan
4. **Live-Status**: Tischfarben zeigen aktuellen Status (frei=grün, besetzt=rot, reserviert=gelb, wartet=orange)
5. **Zeitfenster**: System kennt geschätzte Verweildauer → erkennt "Lücken"

**Für ServeFlow Phase 1:**
- Tische haben `kapazitaet` und `status` (bereits vorhanden)
- Reservierung hat `tisch_id` (bereits vorhanden)
- Floor Plan speichert Position, Form, Größe pro Tisch (neu)
- Host sieht live den Status und weist Reservierung per Klick zu

---

## 9. Implementierungsreihenfolge

| Schritt | Was | Aufwand |
|---|---|---|
| 1 | DB-Migration (`bereiche` + neue Felder in `tische`) | Klein |
| 2 | Backend: CRUD für `bereiche` + Update-Route für Tisch-Positionen | Klein |
| 3 | `npm install react-konva konva` | Minimal |
| 4 | GrundrissEditor: Tische als Formen auf Canvas anzeigen (read-only) | Mittel |
| 5 | Drag & Drop: Tische verschieben + Position speichern | Mittel |
| 6 | Seitenleiste: Neue Tische per Drag auf Canvas erstellen | Mittel |
| 7 | Transformer: Resize + Rotation | Klein |
| 8 | Bereiche/Zonen: Tabs + Tisch-Zuordnung | Klein |
| 9 | Live-Status: Farben + Socket.io Updates | Klein |
| 10 | Reservierungs-Verbindung: Tisch per Klick zuweisen | Mittel |

---

## Quellen

- OpenTable: support.opentable.com — Floor Plans in GuestCenter
- SevenRooms: sevenrooms.com — Table Management + AI Seating
- Resy: helpdesk.resy.com — Floor Plan Editor
- Toast POS: central.toasttab.com — Service Areas and Table Setup
- Lightspeed: k-series-support.lightspeedhq.com — Floor Plans and Tables
- TouchBistro: help.touchbistro.com — Setting Floor Plan
- Square: squareup.com — Building Your Floor Plan
- Yelp Guest Manager: yelp-support.com — Floor Map Editor
- Quandoo: restaurants.quandoo.com — Table Management
- TheFork: theforkmanager.com — Floor Plan Management
- Konva.js vs Fabric.js: dev.to Vergleich
- react-konva: github.com/konvajs/react-konva
- Canvas Editor Best Practices: alikaraki.me/blog/canvas-editors-konva
