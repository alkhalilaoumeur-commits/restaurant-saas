# Projektgrundlage – Restaurant SaaS

> Diese Datei ist das Fundament des gesamten Projekts. Alle Entscheidungen, Features und Entwicklungsschritte orientieren sich an diesem Dokument.

---

## Vision

Eine **All-in-One Restaurant-Management-Plattform** als SaaS, die alles abdeckt, was ein Restaurant braucht – von Bestellungen über Reservierungen bis zum Dienstplan. Die App ersetzt mehrere Einzellösungen durch eine einzige, die auf jedem Gerät perfekt funktioniert.

---

## Zielgruppe

- Restaurants, Cafés, Bars – **alle Größen** (von 2 bis 100+ Mitarbeiter)
- Verschiedene Abo-Pakete je nach Bedarf und Größe

---

## USP (Was uns besonders macht)

- **Alles in einem:** Andere Anbieter decken nur Teilbereiche ab (nur Kasse, nur Bestellung, nur Dienstplan). Wir bieten alles in einer App
- **Einfach & flexibel:** Durch das Onboarding wird die App auf jedes Restaurant zugeschnitten
- **Günstiger Preis:** Weil alles in einer Lösung steckt, spart der Kunde mehrere Einzelabos

---

## Preismodell

- **Monatliches Abo** mit verschiedenen Paketen (Details werden noch definiert)
- Zahlungsanbieter: Stripe (aktiv seit 2026-04-16)

---

## Kernfunktionen (Tabs)

### 1. Dashboard
- Kurzübersicht über alle wichtigen Daten auf einen Blick
- Aktive Bestellungen, heutige Reservierungen, besetzte Tische, Mitarbeiter im Dienst

### 2. Bestellungen
- **Live-Bestellungen** der Gäste in Echtzeit sehen
- Gäste bestellen über eine Webseite, die sie per QR-Code am Tisch aufrufen
- Jede Bestellung zeigt automatisch den zugehörigen Tisch an
- Status-Verwaltung: bestellt → in Zubereitung → serviert → bezahlt

### 3. QR-Codes
- Pro Tisch ein eigener QR-Code
- QR-Codes werden in der App angezeigt und können ausgedruckt werden
- Beim Scannen wird der Gast automatisch dem richtigen Tisch zugeordnet

### 4. Speiseplan / Gäste-Seite
- Gerichte verwalten: hinzufügen, bearbeiten, entfernen
- Kategorien erstellen und verwalten
- Gerichte als "ausverkauft" markieren
- **Direkte Bearbeitung der Gäste-Seite** (die Seite, die Kunden nach dem QR-Scan sehen)
- Was hier eingestellt wird, sehen die Gäste sofort

### 5. Tischplan
- Eigene Tischstruktur visuell erstellen und bearbeiten
- Auf einen Blick sehen: welche Tische besetzt, frei oder reserviert sind
- Tisch-Status: frei → reserviert → besetzt → bestellt → serviert → bezahlt
- Klick auf einen Tisch zeigt: aktuelle Bestellung, Reservierungszeit, Status

### 6. Reservierungen
- Reservierungen hinzufügen und stornieren
- Übersicht über alle Reservierungen

### 7. Dienstplan (orientiert an Marktführern)
- Schichten erstellen und Mitarbeiter zuweisen
- Mitarbeiter tragen Verfügbarkeit ein
- Schicht-Tausch-Anfragen zwischen Mitarbeitern
- Urlaubsverwaltung
- Stundenerfassung
- Wochenübersicht

---

## Rollen & Berechtigungen

### Prinzip: Feste Rollen + anpassbar durch den Chef

Es gibt **Standard-Rollen** mit vordefinierten Berechtigungen. Der Chef kann die Berechtigungen jeder Rolle anpassen.

| Rolle | Standard-Berechtigungen |
|-------|------------------------|
| **Chef** | Vollzugriff auf alles, vergibt Rollen, verwaltet Abo |
| **Kellner** | Bestellungen, Tischplan, Reservierungen |
| **Küche** | Eingehende Bestellungen (Live-Ansicht) |

Der Chef kann:
- Rollen zuweisen und ändern
- Berechtigungen pro Rolle anpassen (z.B. Kellner darf auch Dienstplan sehen)
- Neue Mitarbeiter einladen

---

## Login & Zugang

1. Restaurant kauft ein Abo
2. Restaurant bekommt einen **einmaligen Login-Code per E-Mail**
3. Chef registriert sich mit dem Code und erstellt seine Benutzerdaten
4. Chef lädt Mitarbeiter ein – jeder erstellt eigene Benutzerdaten
5. Benutzernamen dürfen nicht doppelt vorkommen

---

## Onboarding (Ersteinrichtung)

Nach dem ersten Login beantwortet der Chef Fragen:
- **Restaurantart** (Restaurant, Café, Bar, etc.)
- **Größe** (Anzahl Tische, Anzahl Mitarbeiter)

Darauf basierend wird die App eingerichtet:
- Tische werden vorerstellt
- Passende Standard-Kategorien im Speiseplan
- Rollen werden vorbereitet

---

## Gäste-Bestellseite (öffentlich, kein Login nötig)

- Gast scannt QR-Code am Tisch
- Sieht die Speisekarte des Restaurants (nach Kategorien)
- Kann Gerichte auswählen und bestellen
- Tisch wird automatisch erkannt
- Bestellung erscheint live im Dashboard des Restaurants
- Bezahlung: vorerst klassisch am Tisch (Online-Zahlung wird später ergänzt)

---

## Technische Anforderungen

- **Responsive Design:** Perfekt auf Handy, Tablet und Laptop
- **Live-Updates:** Bestellungen erscheinen in Echtzeit (Socket.io)
- **Multi-Tenant:** Jedes Restaurant hat eigene, isolierte Daten
- **DSGVO-konform:** Datenschutz von Anfang an mitgedacht

---

## Ziel: 1 Jahr

- **5-10 zahlende Restaurants** nutzen die App aktiv
- App ist stabil und vollständig nutzbar
- Feedback von echten Kunden eingearbeitet
