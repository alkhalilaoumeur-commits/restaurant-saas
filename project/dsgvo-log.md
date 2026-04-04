# DSGVO-Prüfprotokoll

## Wie dieser Log funktioniert
Bei jeder Session und jeder neuen Funktion wird hier eingetragen was geprüft wurde.

---

## 2026-04-04 – Initiale Bewertung

### Bubble.io (alt)
- ❌ Server in USA (AWS us-east-1) → nicht DSGVO-konform ohne zusätzliche Maßnahmen
- ❌ Wenig Kontrolle über Datenspeicherung
- ⚠️ DPA vorhanden, aber US-Recht greift

### Custom Code (neu geplant)
- ✅ Hetzner Frankfurt → Server in Deutschland
- ✅ Volle Kontrolle über alle Daten
- ✅ Löschfunktionen planbar von Anfang an
- ⬜ Datenschutzerklärung noch zu erstellen
- ⬜ Impressum noch zu erstellen
- ⬜ Cookie-Banner noch zu implementieren
- ⬜ Recht auf Auskunft (Art. 15 DSGVO) noch zu implementieren
- ⬜ Recht auf Löschung (Art. 17 DSGVO) noch zu implementieren

### Offene DSGVO-Punkte
- Welche Gästedaten werden gespeichert? (Name/Telefon bei Reservierungen)
- Wie lange werden Bestelldaten aufbewahrt?
- Brauchen wir einen Datenschutzbeauftragten?
