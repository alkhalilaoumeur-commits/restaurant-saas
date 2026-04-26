# Datenpannen-Runbook (Art. 33/34 DSGVO)

**Verantwortlich:** Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart
**Stand:** 25. April 2026

> **Kernpflicht:** Eine Datenpanne muss **innerhalb von 72 Stunden** nach Bekanntwerden der zuständigen Aufsichtsbehörde gemeldet werden (Art. 33 DSGVO). Bei hohem Risiko zusätzlich Benachrichtigung der Betroffenen (Art. 34 DSGVO).

---

## Was ist eine Datenpanne?

Eine "Verletzung des Schutzes personenbezogener Daten" gemäß Art. 4 Nr. 12 DSGVO liegt vor, wenn personenbezogene Daten:

- **vernichtet, verloren oder verändert** wurden,
- **unbefugt offengelegt** wurden, oder
- **unbefugt abgerufen** werden konnten.

Beispiele in der ServeFlow-Welt:
- Kunde meldet, dass er die Reservierungen anderer Restaurants sieht (Multi-Tenant-Bruch)
- Backup-Server wurde gehackt, Datenbank-Dump abgegriffen
- Mitarbeiter-Account wurde übernommen (z.B. via Phishing) und Daten exportiert
- Email mit Reservierungsdaten ging an falschen Empfänger
- Server-Log mit Klartext-Passwörtern aufgetaucht
- Stripe-API-Key oder DB-Passwort in einem Public-GitHub-Repo

---

## Wer ist die zuständige Aufsichtsbehörde?

**Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI BW)**
Lautenschlagerstraße 20, 70173 Stuttgart
Tel: 0711 / 615541-0
Online-Meldeformular: [https://www.baden-wuerttemberg.datenschutz.de/online-meldung/](https://www.baden-wuerttemberg.datenschutz.de/online-meldung/)

---

## Sofort-Maßnahmen (Stunde 0–4)

### 1. Erkennen & dokumentieren
- Wer hat den Vorfall bemerkt? Wann genau?
- Was genau ist passiert?
- Welche Datenkategorien sind betroffen? (Namen, E-Mails, Telefonnummern, Reservierungsdaten, Mitarbeiterdaten, Zahlungsdaten?)
- Wie viele Personen sind betroffen? (Schätzung reicht zunächst)
- Welche Restaurants (Tenants) sind betroffen?

→ Notiz in `legal/datenpannen-log.md` (anlegen falls noch nicht vorhanden) mit Zeitstempel.

### 2. Eingrenzen & stoppen
- Bei aktivem Angriff: Server vom Netz nehmen oder per Firewall isolieren (Hetzner Cloud Console)
- Kompromittierte Zugangsdaten sofort rotieren (alle JWT-Secrets, DB-Passwort, Stripe-API-Key, Zoho-App-Passwort)
- Alle aktiven JWT-Sessions invalidieren (JWT-Secret tauschen → alle User müssen sich neu einloggen)
- Backup vom letzten sauberen Stand bereithalten

### 3. Beweise sichern
- Server-Logs der letzten 30 Tage exportieren (NICHT löschen!)
- Hetzner-Snapshot anfertigen (für forensische Analyse)
- Screenshots aller relevanten Dashboards
- Stripe-Dashboard-Audit-Log exportieren

---

## Risikobewertung (Stunde 4–24)

Frage: **Wie hoch ist das Risiko für die betroffenen Personen?**

| Risiko-Stufe | Kriterien | Konsequenz |
|---|---|---|
| **Niedrig** | Nur interne Daten ohne Personenbezug, keine Veröffentlichung | Dokumentieren, ggf. melden, **keine** Betroffenen-Benachrichtigung nötig |
| **Mittel** | Wenige personenbezogene Daten betroffen (Name, E-Mail), kein Identitätsmissbrauch zu erwarten | An LfDI BW melden, Betroffene **bei Bedarf** benachrichtigen |
| **Hoch** | Sensible Daten (Gesundheitsdaten aus Anmerkungs-Feld!), Zahlungsdaten, viele Betroffene, oder bewusster Angriff | An LfDI BW **und** alle Betroffenen direkt benachrichtigen |

---

## Meldung an die Aufsichtsbehörde (Stunde 24–72)

**Frist: 72 Stunden ab Bekanntwerden** (Art. 33 Abs. 1 DSGVO).

**Pflichtinhalt der Meldung** (Art. 33 Abs. 3 DSGVO):
1. **Beschreibung** der Verletzung (Art, ungefähre Anzahl Betroffener, ungefähre Anzahl Datensätze)
2. **Kontaktdaten** des Datenschutzbeauftragten / der Anlaufstelle (in unserem Fall: Al-Khalil Aoumeur direkt — kontakt@serve-flow.org)
3. **Wahrscheinliche Folgen** der Verletzung
4. **Ergriffene oder vorgeschlagene Maßnahmen** zur Behebung und Abmilderung

→ Online-Meldeformular des LfDI BW nutzen (siehe oben).

**Wenn keine Meldung erfolgt:** Begründung zwingend im internen Datenpannen-Log dokumentieren.

---

## Benachrichtigung der Betroffenen (bei hohem Risiko)

**Pflicht nach Art. 34 DSGVO bei voraussichtlich hohem Risiko.**

**Form:** klar und einfach verständlich, in deutscher Sprache.
**Kanäle:** E-Mail (primär), bei großem Vorfall ggf. zusätzlich Restaurant-Webseite + ServeFlow-In-App-Banner.

**Pflichtinhalt:**
- Was ist passiert?
- Welche Daten sind betroffen?
- Welche Folgen sind möglich?
- Welche Maßnahmen wurden ergriffen?
- Was soll der Betroffene jetzt tun? (z.B. Passwort ändern)
- Kontakt für Rückfragen: kontakt@serve-flow.org

**Bei Restaurant-Kunden:** Auch das Restaurant (als Verantwortlicher seiner Gäste) wird benachrichtigt, damit es seinerseits seine Gäste informieren kann.

---

## Auftraggeber (Restaurant-Kunden) informieren

Gemäß § 7 AVV (Anlage 1) sind wir verpflichtet, jedes betroffene Restaurant **unverzüglich, spätestens innerhalb von 24 Stunden** nach Bekanntwerden zu informieren — per E-Mail an die hinterlegte Restaurant-Email.

Inhalt:
1. Kurzbeschreibung
2. Welche Datenkategorien des jeweiligen Restaurants betroffen sind
3. Welche Maßnahmen bereits laufen
4. Empfehlung, ob das Restaurant seinerseits seine Gäste informieren soll

---

## Nach der Meldung

- **Lessons Learned** dokumentieren in `legal/datenpannen-log.md`
- **TOM-Anpassung** prüfen: Was muss technisch geändert werden, damit das nicht wieder passiert?
- **Schulung** der Beteiligten falls organisatorischer Fehler die Ursache war
- **Versicherung** informieren (Berufshaftpflicht / Cyber-Versicherung)

---

## Checkliste — Schnellzugriff

```
[ ] Vorfall in legal/datenpannen-log.md eintragen (Zeitstempel!)
[ ] Angriff stoppen / kompromittierte Credentials rotieren
[ ] Beweise sichern (Logs, Snapshots, Screenshots)
[ ] Risikobewertung — niedrig / mittel / hoch?
[ ] Innerhalb 24h: Restaurant-Kunden per Email informieren (§ 7 AVV)
[ ] Innerhalb 72h: LfDI BW Online-Meldung einreichen
[ ] Bei hohem Risiko: Betroffene direkt benachrichtigen (Art. 34)
[ ] Berufshaftpflicht / Cyber-Versicherung informieren
[ ] Nach Abschluss: Lessons Learned + TOM-Update
```

---

## Wichtige Kontakte

| Wer | Wie | Wofür |
|---|---|---|
| LfDI Baden-Württemberg | Online-Formular | Meldung an Aufsichtsbehörde |
| Hetzner Support | https://accounts.hetzner.com/support | Bei Server-Kompromittierung |
| Stripe Support | https://support.stripe.com | Bei Zahlungsdaten-Vorfall |
| Berufshaftpflicht / Cyber-Versicherung | (Anbieter eintragen sobald abgeschlossen) | Schadensmeldung |
| eigener IT-Anwalt | (Anwalt eintragen sobald engagiert) | Rechtsberatung |
