# Vendor-Liste (Auftragsverarbeiter) — Art. 28 DSGVO

**Stand:** 2026-04-25
**Verantwortlich:** Al-Khalil Aoumeur (Einzelunternehmen, Stuttgart)

> Diese Datei wird vom `/dsgvo`-Skill geprueft und ist Quelle der Wahrheit fuer Schritt 5.
> Die kunden-sichtbare Variante liegt in `legal/auftragsverarbeiter-liste.md` (Anlage 2 zum AVV).

---

## Aktive Vendoren

### Hetzner Online GmbH
- **Zweck:** Server-Hosting (VPS, PostgreSQL, Object Storage)
- **Standort:** Deutschland (Frankfurt FSN1)
- **Datenkategorie:** ALLE personenbezogenen Daten (DB-Hosting)
- **AV-Vertrag:** ✅ via Hetzner Account aktiviert
- **Drittlandtransfer:** Nein (EU)
- **DPF/SCCs:** Nicht noetig
- **Sub-Vendoren:** keine relevanten
- **DPA-Link:** https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq/
- **Risiko:** 🟢 niedrig
- **Letzter Check:** 2026-04-25

### Stripe Payments Europe, Ltd.
- **Zweck:** Zahlungsabwicklung Abo + ggf. Erlebnis-Buchungen
- **Standort:** Irland (Dublin) — Mutterkonzern: Stripe Inc., USA
- **Datenkategorie:** Restaurant-Inhaber Stammdaten, Zahlungsdaten (Karten NUR auf Stripe-Servern, NICHT bei ServeFlow)
- **AV-Vertrag:** ✅ Stripe DPA standardmaessig aktiv
- **Drittlandtransfer:** Ja (Karten-Authorization in USA)
- **DPF:** ✅ Stripe Inc. ist DPF-zertifiziert (Stand 2026, EuG bestaetigt 09.2025)
- **SCCs:** ✅ in Stripe DPA enthalten (Backup falls DPF kippt)
- **Sub-Vendoren:** AWS, Cloudflare (in Stripe-AVV gelistet)
- **DPA-Link:** https://stripe.com/legal/dpa
- **Risiko:** 🟡 mittel — DPF politisch wackelig, SCCs sichern ab
- **Letzter Check:** 2026-04-25

### Resend (Resend, Inc.)
- **Zweck:** Versand transaktionaler Emails (SMTP-Relay fuer Auth-Mails, Reservierungsbestaetigungen, etc.)
- **Standort:** EU-Region (Ireland) — Mutterkonzern: Resend, Inc., USA (San Francisco)
- **Datenkategorie:** Empfaenger-Email + Mail-Inhalt (Name, Reservierungsdaten, QR-Code-Link)
- **AV-Vertrag:** ⏳ Resend DPA pruefen + akzeptieren (https://resend.com/legal/dpa)
- **Drittlandtransfer:** Ja (Mutterkonzern USA, Logs/Analytics ggf. in USA)
- **DPF:** ⚠️ pruefen — Resend Inc. DPF-Status verifizieren
- **SCCs:** ✅ Standard in Resend DPA
- **Sub-Vendoren:** AWS (EU-Region), Cloudflare
- **DPA-Link:** https://resend.com/legal/dpa
- **Risiko:** 🟡 mittel — EU-Region ausgewaehlt, Mutterkonzern-Drittlandbezug minimiert
- **Letzter Check:** 2026-04-25 (live geschaltet)

### Cloudflare, Inc. (Email Routing + DNS + Domain-Registrar)
- **Zweck:** Empfang von Emails an `@serve-flow.org` (Routing → Forward an a.aoumeur@drvnorganisations.com), DNS, Domain-Registrierung
- **Standort:** USA (San Francisco) — EU-Edge-Nodes
- **Datenkategorie:** Empfaenger-Email + Mail-Header + Inhalt (durchgereicht, kein Storage in CF)
- **AV-Vertrag:** ✅ Cloudflare Customer DPA standardmaessig aktiv
- **Drittlandtransfer:** Ja (USA)
- **DPF:** ✅ Cloudflare DPF-zertifiziert (privacy-shield-list.com)
- **SCCs:** ✅ in Cloudflare DPA enthalten
- **Sub-Vendoren:** in CF DPA gelistet
- **DPA-Link:** https://www.cloudflare.com/cloudflare-customer-dpa/
- **Risiko:** 🟡 mittel — DPF-zertifiziert, weltweit etabliert
- **Letzter Check:** 2026-04-25

### seven communications GmbH & Co. KG (geplant)
- **Zweck:** SMS-Versand (Bestaetigungen, Erinnerungen)
- **Standort:** Deutschland (Hamburg)
- **Datenkategorie:** Empfaenger-Telefonnummer + Inhalt SMS
- **AV-Vertrag:** ⏳ noch nicht abgeschlossen — wird vor Live-Versand geholt
- **Drittlandtransfer:** Nein
- **DPF/SCCs:** Nicht noetig
- **Sub-Vendoren:** Mobilfunk-Carrier (technisch unvermeidbar)
- **DPA-Link:** https://www.seven.io/dsgvo/
- **Risiko:** 🟢 niedrig (sobald AVV aktiv)
- **Status:** geplant — wird aktiviert sobald SMS-Integration produktiv geht

### Google Ireland Ltd. — Google Reserve (geplant)
- **Zweck:** Restaurant-Reservierungen via Google Search/Maps
- **Standort:** Irland — Backend USA
- **Datenkategorie:** Reservierungs-Stammdaten (Name, optional Email/Tel)
- **AV-Vertrag:** ⏳ via Google Cloud DPA bei Aktivierung
- **Drittlandtransfer:** Ja (Backend USA)
- **DPF:** ✅ Google LLC DPF-zertifiziert
- **SCCs:** ✅ in Google Cloud DPA enthalten
- **DPA-Link:** https://cloud.google.com/terms/data-processing-addendum
- **Risiko:** 🟡 mittel — DPF-Abhaengigkeit
- **Status:** geplant — Webhook-Endpunkt vorhanden, noch nicht aktiv

---

## Coolify (Self-Hosted)
- **Zweck:** Deployment-Plattform (auf eigenem Hetzner-VPS)
- **Standort:** Deutschland (laeuft auf Hetzner)
- **Klassifikation:** **KEIN** Auftragsverarbeiter — eigene Infrastruktur, Open-Source-Tool
- **Datenkategorie:** Deployment-Metadaten, KEINE Endkundendaten
- **Risiko:** 🟢 niedrig

---

## NICHT Auftragsverarbeiter

| Stelle | Warum kein AVV |
|---|---|
| Steuerberater | Eigene Verantwortlichkeit, Berufsrecht (§ 203 StGB), Rechtsgrundlage AO |
| Banken (eigenes Konto) | Vertragsbeziehung, eigene Verantwortliche |
| Finanzamt | Hoheitliche Stelle, Rechtsgrundlage AO |
| Krankenkasse / Sozialversicherung | Rechtsgrundlage SGB |

---

## Risiko-Schwerpunkte

| Risiko | Vendor | Massnahme |
|---|---|---|
| 🟡 DPF politisch wackelig | Stripe, Google | SCCs als Backup im DPA, in Datenschutzerklaerung beide nennen |
| 🟡 Sub-Vendor-Aenderungen | alle | 30-Tage-Vorab-Notification an Restaurant-Kunden gemaess AVV § 5 |
| 🟢 Konzentrationsrisiko Hetzner | Hetzner | Bei Wachstum: Multi-Cloud erwaegen (z.B. IONOS als Backup) |

---

## Naechste Pruefungen

- **Quartalsweise:** DPF-Status Stripe + Google + Zoho (offizielle Listen pruefen)
- **Bei jedem neuen Vendor:** Eintrag hier + AVV-Liste Kunden + Update-Notification
- **Jaehrlich:** Hetzner ISO-27001-Bestaetigung pruefen
