#!/usr/bin/env python3
"""Generiert eine PDF-Projektübersicht für das Restaurant SaaS Projekt."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# Farben
BLAU = HexColor("#1e40af")
GRUEN = HexColor("#16a34a")
GRAU = HexColor("#6b7280")
HELLGRAU = HexColor("#f3f4f6")
WEISS = HexColor("#ffffff")
SCHWARZ = HexColor("#111827")
ORANGE = HexColor("#ea580c")

doc = SimpleDocTemplate(
    "/Users/ilias/restaurant-saas/Projekt_Uebersicht.pdf",
    pagesize=A4,
    topMargin=2*cm,
    bottomMargin=2*cm,
    leftMargin=2.5*cm,
    rightMargin=2.5*cm,
)

styles = getSampleStyleSheet()

# Custom Styles
styles.add(ParagraphStyle(
    "Titel",
    parent=styles["Title"],
    fontSize=22,
    textColor=BLAU,
    spaceAfter=6,
    fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Untertitel",
    parent=styles["Normal"],
    fontSize=11,
    textColor=GRAU,
    spaceAfter=20,
    fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "Ueberschrift",
    parent=styles["Heading2"],
    fontSize=15,
    textColor=BLAU,
    spaceBefore=18,
    spaceAfter=8,
    fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Ueberschrift3",
    parent=styles["Heading3"],
    fontSize=12,
    textColor=SCHWARZ,
    spaceBefore=10,
    spaceAfter=4,
    fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Text",
    parent=styles["Normal"],
    fontSize=10,
    textColor=SCHWARZ,
    spaceAfter=6,
    fontName="Helvetica",
    leading=14,
))
styles.add(ParagraphStyle(
    "TextKlein",
    parent=styles["Normal"],
    fontSize=9,
    textColor=GRAU,
    spaceAfter=4,
    fontName="Helvetica",
    leading=12,
))
styles.add(ParagraphStyle(
    "Aufgabe",
    parent=styles["Normal"],
    fontSize=10,
    textColor=SCHWARZ,
    spaceAfter=3,
    fontName="Helvetica",
    leftIndent=15,
    leading=13,
))

story = []

# ============================================================
# TITELSEITE
# ============================================================
story.append(Spacer(1, 3*cm))
story.append(Paragraph("Restaurant SaaS", styles["Titel"]))
story.append(Paragraph("Projektübersicht &amp; Aufgabenplan", styles["Untertitel"]))
story.append(HRFlowable(width="100%", thickness=1, color=BLAU))
story.append(Spacer(1, 1*cm))

# Kurzinfo-Box
info_data = [
    ["Stand:", "04. April 2026"],
    ["Aktuelle Phase:", "Phase 1 abgeschlossen – Phase 2 steht an"],
    ["Tech-Stack:", "React + Node.js + PostgreSQL"],
    ["Hosting:", "Hetzner Cloud Frankfurt (DSGVO)"],
    ["Geschäftsmodell:", "SaaS Abo ab 49 €/Monat"],
    ["Zielmarkt:", "DACH (Deutschland, Österreich, Schweiz)"],
]
info_table = Table(info_data, colWidths=[4*cm, 11*cm])
info_table.setStyle(TableStyle([
    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
    ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("TEXTCOLOR", (0, 0), (0, -1), GRAU),
    ("TEXTCOLOR", (1, 0), (1, -1), SCHWARZ),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (-1, -1), HELLGRAU),
    ("BOX", (0, 0), (-1, -1), 0.5, GRAU),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
]))
story.append(info_table)

# ============================================================
# WAS IST DAS PROJEKT?
# ============================================================
story.append(Paragraph("Was ist das Projekt?", styles["Ueberschrift"]))
story.append(Paragraph(
    "Eine Software für Restaurants, mit der sie Bestellungen, Tische, Reservierungen "
    "und Mitarbeiter verwalten können. Gäste bestellen über einen QR-Code am Tisch. "
    "Das Ganze läuft als Webanwendung – also im Browser, ohne App-Installation.",
    styles["Text"]
))
story.append(Paragraph(
    "Jedes Restaurant bekommt seinen eigenen Bereich (Multi-Tenant). "
    "Die Daten liegen auf deutschen Servern (Hetzner Frankfurt), damit alles DSGVO-konform ist. "
    "Vorher war das Projekt auf Bubble.io (US-Server), jetzt wird es selbst programmiert.",
    styles["Text"]
))

# ============================================================
# WAS WURDE BISHER GEMACHT?
# ============================================================
story.append(Paragraph("Was wurde bisher gemacht?", styles["Ueberschrift"]))

story.append(Paragraph("Planung (erledigt)", styles["Ueberschrift3"]))
erledigt_planung = [
    "Tech-Stack festgelegt (React, Node.js, PostgreSQL, Tailwind CSS)",
    "Datenbankschema entworfen – 8 Tabellen für alle Funktionen",
    "API-Schnittstellen geplant (wie Frontend und Backend kommunizieren)",
    "Rollen definiert: Admin, Kellner, Küche",
    "Entscheidung: Von Bubble.io auf eigenen Code umgestiegen (wegen DSGVO)",
]
for item in erledigt_planung:
    story.append(Paragraph(f"✅  {item}", styles["Aufgabe"]))

story.append(Paragraph("Phase 1 – Grundstruktur (erledigt)", styles["Ueberschrift3"]))
erledigt_phase1 = [
    "Backend aufgesetzt – Server läuft mit Express + TypeScript",
    "Datenbank eingerichtet – PostgreSQL mit 8 Tabellen + Testdaten",
    "Login-System mit JWT-Token und verschlüsselten Passwörtern",
    "Multi-Tenant: Jede Abfrage filtert automatisch nach Restaurant",
    "7 API-Routen: Auth, Restaurants, Tische, Gerichte, Bestellungen, Reservierungen, Mitarbeiter",
    "Live-Updates über Socket.io (z.B. neue Bestellungen erscheinen sofort)",
    "Frontend aufgesetzt – React mit Tailwind CSS und Vite",
    "Login-Seite fertig implementiert",
    "Dashboard mit Live-Statistiken",
    "Bestellungen-Seite mit Echtzeit-Updates",
    "Tischplan-Seite",
    "Gäste-Bestellseite (öffnet sich über QR-Code, Speisekarte + Warenkorb)",
]
for item in erledigt_phase1:
    story.append(Paragraph(f"✅  {item}", styles["Aufgabe"]))

story.append(Paragraph("Entwicklungsumgebung (erledigt)", styles["Ueberschrift3"]))
erledigt_env = [
    "Node.js installiert (Version 20)",
    "PostgreSQL installiert und Datenbank angelegt",
    ".env-Datei konfiguriert",
    "Datenbank-Migration ausgeführt (alle Tabellen erstellt)",
]
for item in erledigt_env:
    story.append(Paragraph(f"✅  {item}", styles["Aufgabe"]))

# ============================================================
# WAS STEHT NOCH AN?
# ============================================================
story.append(Paragraph("Was steht noch an?", styles["Ueberschrift"]))

story.append(Paragraph("Phase 2 – Admin-Dashboard (als Nächstes)", styles["Ueberschrift3"]))
story.append(Paragraph(
    "Hier wird das Herzstück für Restaurant-Besitzer gebaut:",
    styles["TextKlein"]
))
todo_phase2 = [
    "Dashboard mit echten Daten (Umsatz, offene Bestellungen, belegte Tische)",
    "Speisekarte verwalten – Kategorien und Gerichte anlegen, bearbeiten, löschen",
    "Tischplan visuell – Tische per Drag &amp; Drop anordnen, QR-Codes drucken",
    "Reservierungen mit Kalenderansicht verwalten",
    "Mitarbeiter anlegen, Rollen vergeben, deaktivieren",
]
for item in todo_phase2:
    story.append(Paragraph(f"⬚  {item}", styles["Aufgabe"]))

story.append(Paragraph("Phase 3 – Gäste-Seite (Rest)", styles["Ueberschrift3"]))
story.append(Paragraph(
    "Die Gäste-Bestellseite funktioniert schon grundlegend. Es fehlt noch:",
    styles["TextKlein"]
))
todo_phase3 = [
    "QR-Codes generieren und drucken (pro Tisch)",
    "Bestellstatus für Gäste anzeigen (z.B. 'Wird zubereitet')",
]
for item in todo_phase3:
    story.append(Paragraph(f"⬚  {item}", styles["Aufgabe"]))

story.append(Paragraph("Phase 4 – SaaS-Features", styles["Ueberschrift3"]))
story.append(Paragraph(
    "Damit sich andere Restaurants anmelden und bezahlen können:",
    styles["TextKlein"]
))
todo_phase4 = [
    "Restaurant-Registrierung und Einrichtungsassistent",
    "Lizenzcode-System (pro Restaurant, begrenzte Mitarbeiteranzahl)",
    "Design-Anpassung pro Restaurant (eigene Farben, Logo)",
    "Abo-Verwaltung mit Mollie (Zahlungsanbieter aus NL, DSGVO-freundlich)",
]
for item in todo_phase4:
    story.append(Paragraph(f"⬚  {item}", styles["Aufgabe"]))

story.append(Paragraph("Phase 5 – Extras (Zukunft)", styles["Ueberschrift3"]))
todo_phase5 = [
    "Dienstplan für Mitarbeiter",
    "WhatsApp-Bot (z.B. für Reservierungen)",
    "Mehrsprachigkeit (Deutsch / Englisch)",
    "Statistiken und Berichte",
    "Mobile App (falls gewünscht)",
]
for item in todo_phase5:
    story.append(Paragraph(f"⬚  {item}", styles["Aufgabe"]))

# ============================================================
# DATENBANK
# ============================================================
story.append(Paragraph("Datenbank-Übersicht", styles["Ueberschrift"]))
story.append(Paragraph(
    "Die Datenbank hat 8 Tabellen. Jede Tabelle (außer 'restaurants') hat eine "
    "restaurant_id, damit die Daten verschiedener Restaurants strikt getrennt sind.",
    styles["Text"]
))

db_data = [
    ["Tabelle", "Beschreibung", "Wichtige Felder"],
    ["restaurants", "Stammdaten jedes Restaurants", "Name, Logo, Lizenzcode, Abo-Status"],
    ["kategorien", "Speisekarten-Kategorien", "Name, Reihenfolge"],
    ["gerichte", "Einzelne Gerichte", "Name, Preis, Beschreibung, Allergene"],
    ["tische", "Tische im Restaurant", "Nummer, Kapazität, Status, QR-Code"],
    ["bestellungen", "Bestellungen von Gästen", "Tisch, Status, Gesamtpreis"],
    ["bestellpositionen", "Einzelne Gerichte einer Bestellung", "Gericht, Menge, Einzelpreis"],
    ["reservierungen", "Tischreservierungen", "Gastname, Telefon, Datum, Personen"],
    ["mitarbeiter", "Team-Mitglieder", "Name, E-Mail, Rolle, Aktiv-Status"],
]
db_table = Table(db_data, colWidths=[3.5*cm, 5.5*cm, 6*cm])
db_table.setStyle(TableStyle([
    # Header
    ("BACKGROUND", (0, 0), (-1, 0), BLAU),
    ("TEXTCOLOR", (0, 0), (-1, 0), WEISS),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, 0), 9),
    # Body
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ("FONTSIZE", (0, 1), (-1, -1), 9),
    ("TEXTCOLOR", (0, 1), (-1, -1), SCHWARZ),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WEISS, HELLGRAU]),
    # Grid
    ("GRID", (0, 0), (-1, -1), 0.5, GRAU),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(db_table)

# ============================================================
# ROLLEN
# ============================================================
story.append(Paragraph("Benutzerrollen", styles["Ueberschrift"]))

rollen_data = [
    ["Rolle", "Darf..."],
    ["Admin", "Alles: Speisekarte, Tische, Mitarbeiter, Reservierungen, Statistiken"],
    ["Kellner", "Bestellungen sehen/bearbeiten, Tischstatus ändern"],
    ["Küche", "Bestellungen sehen, Status ändern (z.B. 'fertig')"],
]
rollen_table = Table(rollen_data, colWidths=[3*cm, 12*cm])
rollen_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), BLAU),
    ("TEXTCOLOR", (0, 0), (-1, 0), WEISS),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WEISS, HELLGRAU]),
    ("GRID", (0, 0), (-1, -1), 0.5, GRAU),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(rollen_table)

# ============================================================
# DSGVO
# ============================================================
story.append(Paragraph("DSGVO-Status", styles["Ueberschrift"]))
story.append(Paragraph(
    "Das Projekt wird von Anfang an auf DSGVO-Konformität ausgelegt. "
    "Alle Daten liegen auf deutschen Servern (Hetzner Frankfurt).",
    styles["Text"]
))

story.append(Paragraph("Erledigt:", styles["Ueberschrift3"]))
dsgvo_done = [
    "Umzug von Bubble.io (US-Server) auf eigenen Code mit Hetzner Frankfurt",
    "Passwörter werden nur als Hash gespeichert (bcrypt), nie im Klartext",
    "Personenbezogene Daten markiert (Telefon, E-Mail)",
]
for item in dsgvo_done:
    story.append(Paragraph(f"✅  {item}", styles["Aufgabe"]))

story.append(Paragraph("Noch offen:", styles["Ueberschrift3"]))
dsgvo_todo = [
    "Datenschutzerklärung erstellen",
    "Impressum erstellen",
    "Cookie-Banner implementieren",
    "Recht auf Auskunft (Art. 15 DSGVO) einbauen",
    "Recht auf Löschung (Art. 17 DSGVO) einbauen",
    "Aufbewahrungsfristen für Bestelldaten festlegen",
]
for item in dsgvo_todo:
    story.append(Paragraph(f"⬚  {item}", styles["Aufgabe"]))

# ============================================================
# FORTSCHRITT
# ============================================================
story.append(Paragraph("Fortschritt auf einen Blick", styles["Ueberschrift"]))

fortschritt_data = [
    ["Phase", "Status", "Fortschritt"],
    ["Planung", "Abgeschlossen", "100 %"],
    ["Phase 1 – Grundstruktur", "Abgeschlossen", "100 %"],
    ["Phase 2 – Admin-Dashboard", "Offen", "0 %"],
    ["Phase 3 – Gäste-Seite", "Teilweise fertig", "60 %"],
    ["Phase 4 – SaaS-Features", "Offen", "0 %"],
    ["Phase 5 – Extras", "Offen", "0 %"],
]
fort_table = Table(fortschritt_data, colWidths=[5.5*cm, 4.5*cm, 3*cm])
fort_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), BLAU),
    ("TEXTCOLOR", (0, 0), (-1, 0), WEISS),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ("TEXTCOLOR", (0, 1), (-1, -1), SCHWARZ),
    # Grün für abgeschlossen
    ("TEXTCOLOR", (1, 1), (1, 2), GRUEN),
    ("TEXTCOLOR", (2, 1), (2, 2), GRUEN),
    # Orange für teilweise
    ("TEXTCOLOR", (1, 4), (1, 4), ORANGE),
    ("TEXTCOLOR", (2, 4), (2, 4), ORANGE),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WEISS, HELLGRAU]),
    ("GRID", (0, 0), (-1, -1), 0.5, GRAU),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("ALIGN", (2, 0), (2, -1), "CENTER"),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(fort_table)

# ============================================================
# FOOTER
# ============================================================
story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="100%", thickness=0.5, color=GRAU))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph(
    "Erstellt am 04.04.2026 – Restaurant SaaS Projektübersicht",
    styles["TextKlein"]
))

# Build
doc.build(story)
print("PDF erstellt: Projekt_Uebersicht.pdf")
