# Nutzerrollen & Berechtigungen

## Rollen

### admin
- Voller Zugriff auf alles im eigenen Restaurant
- Menü verwalten, Tische anlegen, Mitarbeiter einladen
- Design anpassen, Einstellungen ändern
- Statistiken sehen

### kellner
- Bestellungen sehen & Status ändern
- Tischstatus ändern
- Reservierungen sehen & bestätigen
- Kein Zugriff auf Einstellungen oder Menüverwaltung

### kueche
- Nur Bestellungen sehen
- Bestellstatus auf "in_zubereitung" und "serviert" setzen
- Kein Zugriff auf Tischplan, Reservierungen, Einstellungen

### gast (kein Login)
- Nur Speisekarte des eigenen Restaurants sehen
- Bestellung aufgeben (via QR-Code-Link mit tisch_id)
- Kein Zugriff auf Dashboard oder andere Daten

---

## Lizenz-Logik
- Jedes Restaurant hat `max_mitarbeiter` in der DB
- Beim Einladen eines neuen Mitarbeiters: prüfen ob Limit erreicht
- Bei abgelaufenem Abo: Login für alle außer Admin sperren (Admin kann Abo erneuern)
