# Anlage 2 zum AVV — Liste der Sub-Auftragsverarbeiter

**Stand: 25. April 2026**

Der Auftragnehmer (Al-Khalil Aoumeur, ServeFlow) setzt zur Erbringung der vertraglich
geschuldeten Leistungen die folgenden Sub-Auftragsverarbeiter ein. Mit allen genannten
Dienstleistern besteht ein Vertrag gemäß Art. 28 DSGVO bzw. (bei Drittlandtransfers) eine
geeignete Garantie i.&nbsp;S.&nbsp;d. Kapitel V DSGVO.

---

## Übersicht

| # | Dienstleister | Sitz / Verarbeitungsort | Zweck | Drittlandtransfer | Rechtsgrundlage Transfer |
|---|---|---|---|---|---|
| 1 | Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland | Deutschland (Frankfurt am Main) | Server-Hosting (VPS, Datenbank, Object Storage) | Nein (EU/EWR) | — |
| 2 | Coolify (Self-Hosted auf Hetzner-VPS) — Verantwortlicher: Al-Khalil Aoumeur | Deutschland (Frankfurt) | Deployment-Plattform (auf eigener Hetzner-Infrastruktur) | Nein | — |
| 3 | Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland | Irland (EU); ggf. USA für Karten-Authorization | Zahlungsabwicklung Abo | Standardvertragsklauseln (SCC) für US-Transfers | Art. 46 Abs. 2 lit. c DSGVO + Stripe DPA |
| 4 | Zoho Corporation B.V., Beneluxlaan 4B, 3527 HT Utrecht, Niederlande | EU-Rechenzentrum (Niederlande) | Versand transaktionaler E-Mails (Zoho Mail SMTP) | Nein (EU) | — |
| 5 | seven communications GmbH & Co. KG, Hammerbrookstraße 90, 20097 Hamburg | Deutschland | SMS-Versand (Bestätigungen, Erinnerungen) — geplant | Nein | — |
| 6 | Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland | Irland (EU); USA für Reserve-Backend | Google Reserve mit Google (Restaurant-Reservierungs-Integration) — geplant | Standardvertragsklauseln + Google Cloud DPA | Art. 46 Abs. 2 lit. c DSGVO |

---

## Details je Dienstleister

### 1. Hetzner Online GmbH
- **Verarbeitete Daten:** alle in der Datenbank gespeicherten Daten (siehe AVV § 3)
- **DPA:** [Hetzner Auftragsverarbeitungsvertrag](https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq/)
- **Zertifizierungen:** ISO 27001
- **Serverstandort:** ausschließlich Deutschland (Hetzner FSN1, Frankfurt)

### 2. Stripe Payments Europe, Ltd.
- **Verarbeitete Daten:** Name, E-Mail, Rechnungsadresse, Zahlungsmethode (Kartennummer
  ausschließlich auf Stripe-Servern, **nicht** bei ServeFlow), Zahlungshistorie
- **DPA:** [Stripe Data Processing Agreement](https://stripe.com/legal/dpa)
- **Standardvertragsklauseln:** in DPA enthalten
- **Zertifizierungen:** PCI-DSS Level 1, ISO 27001, SOC 1/2

### 3. Zoho Corporation B.V.
- **Verarbeitete Daten:** Empfänger-E-Mail-Adresse, Inhalt transaktionaler Nachrichten
  (Reservierungs-/Storno-Bestätigungen, Erinnerungen, Mitarbeiter-Einladungen,
  Passwort-Reset)
- **Server:** EU-Rechenzentrum Zoho (smtp.zoho.eu)
- **DPA:** [Zoho Data Processing Addendum](https://www.zoho.com/dpa.html)

### 4. seven communications GmbH & Co. KG (geplant)
- **Verarbeitete Daten:** Empfänger-Telefonnummer, Inhalt der SMS
- **DPA:** [seven.io AVV](https://www.seven.io/dsgvo/)
- **Standort:** ausschließlich Deutschland
- **Status:** geplant — wird aktiviert, sobald die Integration produktiv geht

### 5. Google Ireland Ltd. — Google Reserve (geplant)
- **Verarbeitete Daten:** Reservierungsdaten (Name, Datum, Personenzahl, optional E-Mail/Telefon)
- **DPA:** [Google Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum)
- **Standardvertragsklauseln:** im DPA enthalten
- **Status:** Infrastruktur vorhanden, noch nicht aktiv

---

## Hinweise

- Diese Liste wird laufend aktualisiert. Die jeweils gültige Fassung ist beim Auftragnehmer
  unter `kontakt@serve-flow.org` abrufbar.
- Bei Änderungen wird der Auftraggeber gemäß § 5 Abs. 2 AVV mindestens 30 Tage vor
  Wirksamwerden in Textform informiert.
- **Keine** Übermittlung in Drittländer ohne geeignete Garantie i.&nbsp;S.&nbsp;d. Kapitel V DSGVO.
