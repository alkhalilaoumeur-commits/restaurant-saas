# Schichtplan-Analyse: Marktvergleich & Upgrade-Plan

*Erstellt: 2026-04-05 | Detaillierte Recherche: vault/research/schichtplanung-wettbewerbsanalyse.md*

---

## Aktueller Stand unserer Schichtplan-Seite

| Feature | Status |
|---------|--------|
| Wochenansicht (Mo-So Grid) | Vorhanden |
| Schicht-CRUD (erstellen, bearbeiten, loeschen) | Vorhanden |
| Stundenzaehler pro Mitarbeiter/Woche | Vorhanden |
| Rollen-Farbcodierung (Admin/Kellner/Kueche) | Vorhanden |
| Klick auf leere Zelle = neue Schicht | Vorhanden |
| Wochennavigation (vor/zurueck/heute) | Vorhanden |
| Schicht-Notizen | Vorhanden |
| Ueberstunden-Warnung (>40h rot) | Vorhanden |
| Demo-Modus | Vorhanden |

---

## Was den Top-Apps fehlt, was wir haben

Unser Vorteil: **Reservierungsdaten + Bestelldaten im selben System**. Kein einziger Wettbewerber hat das. Die brauchen teure POS-Integrationen fuer Personalprognosen — wir haben die Daten schon.

---

## Was uns fehlt (nach Prioritaet)

### Prio 1 — Muss-Features (ohne diese ist es kein ernsthafter Schichtplaner)

| Feature | Was es macht | Wer hat es |
|---------|-------------|-----------|
| **Drag & Drop** | Schichten per Ziehen verschieben/kopieren | 7shifts, Deputy, Papershift, alle |
| **ArbZG-Compliance** | Automatische Pruefung: 11h Ruhezeit, Pausen (30min ab 6h, 45min ab 9h), Max 10h/Tag | gastromatic, Papershift, Staffomatic |
| **Konflikterkennung** | Warnung VOR Speichern bei Doppelbuchung, Ruhezeitverstoss, Ueberstunden | Alle Top-Apps |
| **Mitarbeiter-Verfuegbarkeit** | MA tragen ein wann sie koennen/nicht koennen | Alle Top-Apps |
| **Schicht-Templates** | Wiederkehrende Wochen als Vorlage speichern + anwenden | 7shifts, Deputy, Planday |
| **Push-Benachrichtigungen** | Neue Schicht, Aenderung, Erinnerung vor Schichtbeginn | Alle Top-Apps |

### Prio 2 — Differenzierung (das macht uns besser als die Konkurrenz)

| Feature | Was es macht | Unser Vorteil |
|---------|-------------|--------------|
| **Reservierungs-basierter Personalbedarf** | "40 Reservierungen Freitag → 5 Service noetig" | Kein Wettbewerber hat das — wir haben die Daten |
| **Budget-Overlay** | Personalkosten WAEHREND der Planung sichtbar | 7shifts, Deputy — aber ohne unsere Reservierungsdaten |
| **Schichttausch (3-Tap)** | MA postet "kann nicht" → System benachrichtigt passende MA → Manager genehmigt | 7shifts, Homebase, Staffomatic |
| **Lesebestaetigung** | Manager sieht wer den neuen Plan gelesen hat | Homebase |

### Prio 3 — Nice-to-have (spaeter)

| Feature | Was es macht |
|---------|-------------|
| Auto-Scheduling / KI-Vorschlaege | System erstellt kompletten Plan automatisch |
| DATEV-Export | Stunden + Zuschlaege direkt an Steuerberater |
| Trinkgeld-Management | Automatische Verteilung nach Stunden (fehlt komplett am DACH-Markt!) |
| Mobile-App mit "Naechste Schicht" Startscreen | Gastro-MA sitzen nie am Schreibtisch |
| Woche kopieren | Letzte Woche mit einem Klick als Vorlage |
| Monatsansicht (nur Ueberblick) | Neben der Wochenansicht |

---

## Vergleich: Unsere App vs. Wettbewerb

| Feature | Wir | gastromatic | Papershift | Staffomatic | 7shifts |
|---------|-----|-------------|------------|-------------|---------|
| Wochenansicht | Ja | Ja | Ja | Ja | Ja |
| Schicht-CRUD | Ja | Ja | Ja | Ja | Ja |
| Stundenzaehler | Ja | Ja | Ja | Ja | Ja |
| Rollen-Farben | Ja | Ja | Ja | Ja | Ja |
| **Drag & Drop** | Nein | Unklar | Ja | Ja | Ja |
| **ArbZG-Compliance** | Nein | Ja (nativ) | Ja (nativ) | Ja (nativ) | Nein |
| **Konflikterkennung** | Nein | Ja | Ja | Ja | Ja |
| **Verfuegbarkeit** | Nein | Ja | Ja | Ja | Ja |
| **Templates** | Nein | Ja | Ja | Nein | Ja |
| **Schichttausch** | Nein | Ja | Ja | Ja | Ja |
| **Push-Notifications** | Nein | Ja | Ja | Ja | Ja |
| **Budget-Overlay** | Nein | Ja | Ja | Nein | Ja |
| **Reservierungs-Forecast** | Nein* | Nein | Nein | Nein | Nein |
| DSGVO | Ja | Ja | Ja | Ja | Nein |

*\* = Daten vorhanden, Feature noch nicht gebaut — das ist unser groesster Differenzierer*

---

## Empfohlene Reihenfolge

1. **Drag & Drop** — Ohne das fuehlt sich die App "alt" an
2. **ArbZG-Validierung** — Pflicht fuer deutschen Markt (11h Ruhezeit, Pausenregeln, Max-Stunden)
3. **Konflikterkennung** — Gelb/Rot-Warnungen waehrend der Planung
4. **Mitarbeiter-Verfuegbarkeit** — DB-Tabelle + UI fuer MA-Eingabe
5. **Schicht-Templates** — Woche speichern + anwenden
6. **Reservierungs-basierter Personalbedarf** — UNSER Alleinstellungsmerkmal
7. **Budget-Overlay** — Personalkosten live in der Wochenansicht
8. **Schichttausch** — 3-Tap-Flow
9. **Push-Benachrichtigungen** — Neue Schicht, Aenderungen, Erinnerungen

---

## Quellen

Detaillierte App-Analysen mit Preisen, Features und UX-Erkenntnissen:
→ `~/vault/research/schichtplanung-wettbewerbsanalyse.md`
