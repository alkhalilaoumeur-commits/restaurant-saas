// AUTO-GENERIERT von sync-dashboard.js — 2026-04-07T20:39:50.203Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "1b0q08yi8",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-hcw33r5du",
      "name": "Restaurants",
      "fields": [
        {
          "id": "ub61zi2xi",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "bzis3mqbb",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "hjjp5dfil",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "tip1rlbwb",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "56dxye87y",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "bg1x8l8ie",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "2oq79pyz3",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "csyq0w5qu",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "16v63wlwy",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "30jb3skif",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "ofoc6oitc",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "dbnnphw0p",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "6sjpex0a0",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "pw1j5smqd",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "jfhbnixq0",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "dc68jbhl2",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "b6zmk8y9e",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-iwy42d5jf",
      "name": "Kategorien",
      "fields": [
        {
          "id": "mdkto5sop",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "9pqucxiwt",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "wch8lk37q",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "c9eieh6ql",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "w1yjn1o04",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "w0scbw097",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-gjfkpnmyy",
      "name": "Tische",
      "fields": [
        {
          "id": "tcg7dv0uf",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "n1mkvqone",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "dtwfeq4zh",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "y4q5i5ird",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "iad3i7s1h",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "zp7dz66i5",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "afdd4sbsx",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-ddgk3g2de",
      "name": "Gerichte",
      "fields": [
        {
          "id": "j5q8xu9id",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "vkdowhx6a",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "fcozoy6wu",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "2qhmadnuh",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "qfmckcyi5",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "94j2ehuhc",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "8iu62ibzs",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "4fzaxch5a",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "ml8m1cvvg",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "c73i81qxp",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Kategorien"
      ]
    },
    {
      "id": "dt-5ekvd5jc5",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "qrld1zzmr",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "poubxqpbu",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "yxo1r9356",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "vazl8tutk",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "u0dla9lhp",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "q4l90yqfu",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "3hae88kzs",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "j5rxaosjh",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        }
      ],
      "relationships": [
        "Tische"
      ]
    },
    {
      "id": "dt-28xex01zt",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "8jqnci8pa",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "7grghtzw9",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "o0hfd9e2m",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "aezspg6t4",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "d8ql0enlp",
          "name": "einzelpreis",
          "type": "Zahl",
          "description": "einzelpreis",
          "required": true
        }
      ],
      "relationships": [
        "Bestellungen",
        "Gerichte"
      ]
    },
    {
      "id": "dt-dmgdevh34",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "ohkrmj6io",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "5w19n728s",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "75rxcidjc",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "svjw22fa7",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "0tqanivbc",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "8q4djwp5r",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "v8yajyyby",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "g8ok6yvhr",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert",
          "required": true
        },
        {
          "id": "ubp7plsps",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "482mfuc58",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon",
          "required": true
        },
        {
          "id": "zv3wfkbcc",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Tische"
      ]
    },
    {
      "id": "dt-kc51lqfyp",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "135bxxzqq",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "l96cgu9g0",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "2plys67f3",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "96wen1thh",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "6rptxbkov",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "owmch61r8",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "9o6c6lpv4",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "tcq9vq36x",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "xv1z07d6h",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "gptvkv1w7",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "sqsm8wd4s",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "avvl7mxa3",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-yja7wm9m4",
      "name": "Schichten",
      "fields": [
        {
          "id": "7e6woklu8",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "vc9ci6nop",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "2ndgls3cl",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "4ql9jjpmh",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "wawg7p46i",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "nvylwyt7a",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "m82dn67ad",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "qexwbsqoh",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Mitarbeiter"
      ]
    },
    {
      "id": "dt-rh02au1wy",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "2wwsmenmw",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "pue8uqfxb",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "d97zytawg",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "q1bdyqj4d",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "b2c5slglw",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "p7gkwxdes",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-o0l3tq4yb",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "4ly81d6be",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "tktuj2okw",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "oc4zjucu0",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "qr6b1uj3w",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "2mg829cb8",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "kz99tr9ci",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Mitarbeiter"
      ]
    },
    {
      "id": "dt-fadc486qc",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "wsqzpbicj",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "vnvh43lsw",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "hrdwwgt7a",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "baew10g8b",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "40msnjlz9",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    }
  ],
  "optionSets": [
    {
      "id": "k9oxxtg00",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "pxeztzr8q",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "db2c9xdr3",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "2fuq089yw",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert"
      ]
    },
    {
      "id": "186tq7bfg",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon"
      ]
    },
    {
      "id": "ssr7sxvgm",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    }
  ],
  "workflows": [
    {
      "id": "zfa34uenm",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "epdhmjorh",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "6e03jsuwy",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "sb5bfdgil",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "dtrq3y9va",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "8ozsg7db0",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "q1pzvotpn",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "gxt3rs4nl",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "lmyppblls",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ndh3nwg1r",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "5t6rzsguy",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "9k14u97z9",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "gc1yllc37",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "85fpxosb9",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "rrswjoxx6",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "am1xswbfv",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "e0au4x8h4",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "4nos4ex9n",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "divawbwuo",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "838xtj0vn",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "ls2p220h3",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "6e2jt8glt",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "62fh7h5qx",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "g39n0tqn7",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "nww1z7iei",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "s45wj7f08",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "7yfhy7paw",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "w5h04qyw8",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "326gt6dyg",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "jl2cpjhq0",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "zu7zmnlub",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "0ysbqlodx",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "o6xxqwkbf",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "at354b2uj",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "qdn2se0b8",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "z3lj8ymro",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "fhez0wjv5",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "ixpuhzx8h",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "a7hoap1g9",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "k9qa52a4q",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "azm4lk2zc",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "m8o0lvzkb",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "5mfdoqs60",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "uebyoydgj",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "czzzm6qod",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "vf0mpmc3z",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "9yk52k4fo",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "q70uh06e3",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "m3mo9rbme",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "1a5ob0v5y",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "j8htv1z9p",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "24bi9q41v",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "79bsxiv94",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "3hh9ug3al",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8glg967ka",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "7nnlqxp5e",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "rhxacwtqa",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "sk58pvknf",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "zaf779bsd",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "tbgwdw44a",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "l95werbo0",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "0rjviww2s",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "ocjzc23qh",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "x3b987eas",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "0v8fi80ek",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "fpn0b9k6x",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "jytupm7xx",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "rhe9urw3z",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "kjlwvnmh1",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ye5r7hlfi",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "zqj923otl",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "hnpcx4nmv",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "zdjbnppbj",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "k34smq302",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7bz643bka",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "gy80j52b0",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "n8jckmooe",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "hopntr8au",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "pcyfs29gi",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "yvlhkw6ek",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "97riykxv0",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "nbgx3knrd",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "rpc39d7h3",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "prnncn2pb",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "oaaxkgmpl",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "gfo6jt7us",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "rq6hw3j59",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4terslahr",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "dj08krz90",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "zirpk9va9",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "e11z1w2bp",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "zbtwqzk05",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "le5bjpnm4",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "si1vxxjfh",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "526hsbsmq",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "k1kltnw3t",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "jpfm0wvu8",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "4uwuwefg2",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "jahmdw3hq",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "i9ifc4ene",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "03pama1gu",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "ypnhcfvh5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zxw2bolg6",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "3lrdorjkv",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "vzhek5z85",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "hfhhpqfv5",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "e4uhe4v20",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "by47kmu10",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "z6mj7yldy",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "7y1nfsmn3",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "ty27umga7",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "oomez7l48",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "2ee7yw2yl",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "lce4eve67",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "y1sh2bzq0",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "7xhbywcnt",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "eo8yolf0g",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "ml0klgyid",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "2rttw6csh",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "fpcskgj2l",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "gs78sbueq",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "tbr2s29ig",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "grddq8k4o",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "k0uzj9ok2",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "9hexln6qy",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "hpi470iom",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "9jn8m4cy0",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "ly3lfrqvt",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "y6yws0vbk",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "e4bafb6zd",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "qh8l0c1li",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "w2db0saqc",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "ew4k3yz52",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "3x6ctpxtg",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "08enrflcc",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "3z6pi5hyb",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "75pn54725",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "ls4uj6gti",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "l93474qb8",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "f41h4c180",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "cft4y4n8f",
      "name": "Bestellen",
      "desc": "Seite: Bestellen — Nutzt 4 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte",
        "RestaurantDesign",
        "GastroTheme",
        "GaesteSocket"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "e6pu370iu",
      "name": "BestellenPro",
      "desc": "Seite: BestellenPro — Nutzt 4 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte",
        "RestaurantDesign",
        "GastroTheme",
        "GaesteSocket"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "6smhl1xi1",
      "name": "Bestellungen",
      "desc": "Seite: Bestellungen — Nutzt 1 Hooks, 2 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Bestellungen"
      ],
      "reusables": [
        "BestellungKarte",
        "StatusBadge"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "zn3295u62",
      "name": "Buchen",
      "desc": "Seite: Buchen — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "d14zgswbj",
      "name": "Dashboard",
      "desc": "Seite: Dashboard — Nutzt 3 Hooks, 5 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Bestellungen",
        "Tische",
        "Reservierungen"
      ],
      "reusables": [
        "Auslastung",
        "AuslastungDonut",
        "BestellVerteilung",
        "StatKarte",
        "UmsatzChart"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "85eq7bhog",
      "name": "Dienstplan",
      "desc": "Seite: Dienstplan — Nutzt 2 Hooks, 1 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Dienstplan",
        "Mitarbeiter"
      ],
      "reusables": [
        "SchichtFormular"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "kauqatzll",
      "name": "Einladung",
      "desc": "Seite: Einladung — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "7gxn8cd8q",
      "name": "Einstellungen",
      "desc": "Seite: Einstellungen — Nutzt 2 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Restaurant",
        "ThemeStore"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "04h6h251g",
      "name": "EmailVerifizieren",
      "desc": "Seite: EmailVerifizieren — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "izc8spl5x",
      "name": "Login",
      "desc": "Seite: Login — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "bj691bp7u",
      "name": "Mitarbeiter",
      "desc": "Seite: Mitarbeiter — Nutzt 3 Hooks, 2 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore",
        "Mitarbeiter",
        "Restaurant"
      ],
      "reusables": [
        "MitarbeiterFormular",
        "MitarbeiterZeile"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "qdgdqd9r7",
      "name": "PasswortVergessen",
      "desc": "Seite: PasswortVergessen — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "zc4s4kzoq",
      "name": "PasswortZuruecksetzen",
      "desc": "Seite: PasswortZuruecksetzen — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "1icxilhd6",
      "name": "Registrieren",
      "desc": "Seite: Registrieren — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "h2tfehzus",
      "name": "ReservierungDetail",
      "desc": "Seite: ReservierungDetail — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "2t5v5bnhb",
      "name": "ReservierungStornieren",
      "desc": "Seite: ReservierungStornieren — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "gjx4wc4sp",
      "name": "ReservierungUmbuchen",
      "desc": "Seite: ReservierungUmbuchen — Nutzt 0 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "3yhqdpvl3",
      "name": "Reservierungen",
      "desc": "Seite: Reservierungen — Nutzt 2 Hooks, 2 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore",
        "Reservierungen"
      ],
      "reusables": [
        "ReservierungFormular",
        "ReservierungZeile"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "w0ka8qkha",
      "name": "Speisekarte",
      "desc": "Seite: Speisekarte — Nutzt 1 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte"
      ],
      "reusables": [
        "GerichtFormular",
        "GerichtKarte",
        "KategorieVerwaltung"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "fb26tdzl7",
      "name": "Statistiken",
      "desc": "Seite: Statistiken — Nutzt 2 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Statistiken",
        "ThemeStore"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "jr0kbb4yg",
      "name": "Tischplan",
      "desc": "Seite: Tischplan — Nutzt 2 Hooks, 2 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Tische",
        "AuthStore"
      ],
      "reusables": [
        "TischFormular",
        "TischKarte"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    }
  ],
  "integrations": [
    {
      "id": "ext-1",
      "name": "QR-Code API",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "Generiert QR-Codes fuer Tische (qrserver.com)",
      "url": "api.qrserver.com"
    },
    {
      "id": "ext-2",
      "name": "Stripe / Mollie",
      "typ": "REST API",
      "status": "Nicht eingerichtet",
      "desc": "Online-Zahlungen (noch offen: Phase 4)",
      "url": ""
    },
    {
      "id": "ext-3",
      "name": "WhatsApp Business",
      "typ": "REST API",
      "status": "Nicht eingerichtet",
      "desc": "Reservierungsbestaetigungen (noch offen: Phase 5)",
      "url": ""
    },
    {
      "id": "ext-4",
      "name": "Socket.io",
      "typ": "WebSocket",
      "status": "Verbunden",
      "desc": "Echtzeit-Updates fuer Bestellungen und Tischstatus",
      "url": "ws://localhost:3001"
    },
    {
      "id": "hwjf5j8fx",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "a3n6ewxqy",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "4p1nip7gk",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "u0kefochh",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "u1k6dgoef",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "ymbqs76fa",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "esamj1z9y",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "0xmpa1gf9",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "5mt9ww6oy",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "9vmigiqxm",
      "name": "API: Mitarbeiter",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Mitarbeiter",
      "url": "/api/mitarbeiter"
    }
  ],
  "roles": [
    {
      "id": "r-1",
      "name": "Admin",
      "perms": {
        "Restaurants": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Kategorien": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Tische": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Gerichte": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Bestellungen": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Bestellpositionen": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Reservierungen": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Mitarbeiter": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Schichten": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Oeffnungszeiten": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Passwort_resets": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Login_versuche": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        }
      }
    },
    {
      "id": "r-2",
      "name": "Kellner",
      "perms": {
        "Restaurants": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Kategorien": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Tische": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gerichte": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellungen": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellpositionen": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Reservierungen": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Mitarbeiter": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichten": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Oeffnungszeiten": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Passwort_resets": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Login_versuche": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        }
      }
    },
    {
      "id": "r-3",
      "name": "Kueche",
      "perms": {
        "Restaurants": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Kategorien": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Tische": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gerichte": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellungen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellpositionen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Reservierungen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Mitarbeiter": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Oeffnungszeiten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Passwort_resets": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Login_versuche": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        }
      }
    },
    {
      "id": "r-4",
      "name": "Gast (nicht eingeloggt)",
      "perms": {
        "Restaurants": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Kategorien": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Tische": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gerichte": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellungen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Bestellpositionen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Reservierungen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Mitarbeiter": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Oeffnungszeiten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Passwort_resets": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Login_versuche": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        }
      }
    }
  ],
  "issues": [
    {
      "id": "vfhnz7zlc",
      "title": "Abonnement-Verwaltung (Mollie)",
      "desc": "Aus Phase 4 – SaaS-Features",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "jzw706uux",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "nwcz2mjp6",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "k7u1c0h22",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "7mvpzjq7f",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "tejnou7it",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "dyifmpbvr",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "xcvt55r2o",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "vzqsyssx8",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "td3jxbzf2",
      "title": "Dienstplan fuer Mitarbeiter sichtbar machen (aktuell nur Admin — Kellner/Kueche muessen eigene Schichten sehen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "rwy3nxvqb",
      "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "fquwmxv7c",
      "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "044otdtjd",
      "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "xj5yrkuxf",
      "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "i2kslt1gs",
      "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "coxau773i",
      "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "hn4wxikip",
      "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "xnnkfyv7y",
      "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "8cdb8pxjl",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "y5410oonc",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "h6eknik5n",
      "title": "**Räumlicher Tischplan / Floor Plan Editor** (Priorität!)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "m7j3r0pim",
      "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "cojd3vyg9",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "3n7b35dzf",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "0cz6t04xu",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "g130aomvd",
      "title": "Google Reserve Integration (>50% aller Reservierungen in DE kommen ueber Google Maps)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "xe51aiidl",
      "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "ciacsp2lc",
      "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "di13ddm5z",
      "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "i3p3unmi6",
      "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "rf9ydonxz",
      "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "53j6z6zc4",
      "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "ob22nf984",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "sjqgxdtpo",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "t6k4knldg",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "0h2hpf6hu",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "fszcbggdn",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    }
  ],
  "roadmap": [
    {
      "id": "ma26htrq1",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "rqx8dkjjy",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "v2flya56e",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "htnl7f7f7",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "wx7hib5rk",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "8z92u9rk5",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "gsen070jj",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "iw11s2bp3",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "ffld8yy8d",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "1x9jmk85w",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "aevw0ibms",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "10db7o8he",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "mrlaektak",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "j6w54twf8",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "fgsrjiwuf",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "70n4gko6m",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "mv5umzzi0",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "3itoovwzl",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "i6u31d1km",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "5h2o7ujul",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "2ed2kyh9i",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "ij6d670al",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "stq1jk93x",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "x8fll6c6c",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "oex61yqye",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "z9o1nlwpx",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "9o8d1b2ln",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "txn2auo11",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "q95ne9ag2",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "02wqxu2px",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "q4l736lch",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "d52qoqgzv",
          "title": "Abonnement-Verwaltung (Mollie)",
          "done": false
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "0x96ponie",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "ldq1z7e1u",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "kzdlystuo",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "333ft6wc3",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "1134be9es",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "3rma1lp1d",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "yonwa8aj5",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "ecovhhjh9",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "yhfcph5am",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "jcqx2rg5y",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "i9dwin92t",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "lnlf2ifpg",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "mtk9g3t2n",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "k8b9qiyaf",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "eyexvexj5",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "34ic83pfe",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "bvb9dj3jm",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "1uyerafk0",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "shufiw5ih",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "fcfmgn854",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "657tak4kh",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "fily2cxo5",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "4condewt4",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (aktuell nur Admin — Kellner/Kueche muessen eigene Schichten sehen)",
          "done": false
        },
        {
          "id": "k9zeplpl1",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": false
        },
        {
          "id": "kekghtwzk",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": false
        },
        {
          "id": "jnxri5tjs",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": false
        },
        {
          "id": "yvmagpf9a",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen)",
          "done": false
        },
        {
          "id": "d9tob05xn",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": false
        },
        {
          "id": "f4xw3izfb",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": false
        },
        {
          "id": "jqebygo91",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": false
        },
        {
          "id": "7zjt2t5z4",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": false
        },
        {
          "id": "8s9thjwx0",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "8m6c8jja5",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 0,
      "total": 11
    },
    {
      "id": "yzq0eyf7x",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "g97nbe9y3",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "o6mk1mi6p",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "8wvr0thkw",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "wbc160pc3",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "3zv8g832x",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "16vn2dvgz",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "vyuy1ce3m",
          "title": "**Räumlicher Tischplan / Floor Plan Editor** (Priorität!)",
          "done": false
        },
        {
          "id": "myb8aes8j",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": false
        },
        {
          "id": "3ncxn49wu",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "rvuov3v8j",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "7hlq2je1y",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "q5rp4dxii",
          "title": "Google Reserve Integration (>50% aller Reservierungen in DE kommen ueber Google Maps)",
          "done": false
        },
        {
          "id": "xpzqcsz17",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
          "done": false
        },
        {
          "id": "ajukhs181",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": false
        },
        {
          "id": "loep1w4bx",
          "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
          "done": false
        },
        {
          "id": "v16j1negf",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": false
        },
        {
          "id": "0iwz4hpym",
          "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
          "done": false
        }
      ],
      "done": 6,
      "total": 17
    },
    {
      "id": "5hgnm8p50",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "qcyulw5jp",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "z85jdjk9u",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "9nh7x8ptw",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "u1fs9417y",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "l6ktadd39",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "nlw134fiy",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "4k27fcoa5",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "daiwuddqp",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "8fyqke49o",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "kh8af4to2",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "80sc1linz",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "chkpy0ywl",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "d1m5265ul",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "ivdxc3for",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "e5seis360",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "1c5krttnr",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "xotcb3htf",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "7qvy7yjfi",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "6hmq3j5dh",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "m2zzdk5zm",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "m9wteucx0",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "m7fivi88j",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "4i2oxqhms",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "iy97bh0n9",
          "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
          "done": false
        },
        {
          "id": "ay67ykwpv",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "6if984pe5",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    },
    {
      "id": "z4jj8n804",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "ifzlpktq3",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "1ogync26c",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "eq94rffp6",
          "title": "Wartezeit-Schätzung",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    }
  ],
  "decisions": [
    {
      "id": "9apsxoya6",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "ms9ewui10",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "44n1gw3ok",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "y7gtj2z3i",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "h0malmzqn",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "d2ccvqufm",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "92a2etf1w",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "c08c9h05q",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "npex0aflb",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "w734hmkgn",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "ockbviock",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "uvxsv7to4",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "g5znbcd9f",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "ylzfrjpp8",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      }
    ],
    "tomDone": 28,
    "tomOpen": 13,
    "tomPartial": 3,
    "openCritical": [
      "Datenschutzerklaerung erstellen und auf Webseite einbinden",
      "Impressum erstellen",
      "AV-Vertrag mit Supabase abschliessen (Serverstandort pruefen: EU?)",
      "AV-Vertrag mit Hetzner abschliessen",
      "HTTPS / TLS auf Produktionsserver konfigurieren",
      "Hinweis im Anmerkungsfeld: \"Bitte keine Gesundheitsdaten ohne Einwilligung\""
    ],
    "openImportant": [
      "Sichere HTTP-Headers (helmet.js) einbinden",
      "Passwort-Hash bei Mitarbeiter-Deaktivierung auf NULL setzen",
      "Art. 15 Auskunftsrecht: Export-Funktion (JSON) implementieren",
      "Art. 17 Loeschrecht: Loeschfunktion fuer Gaeste-Daten",
      "Art. 20 Datenuebertragbarkeit: JSON-Export aller Daten einer Person"
    ]
  },
  "changelog": [
    {
      "id": "xd0oz6y0f",
      "text": "Full app update: auth system, dashboard, theme engine, pro order page, and project docs",
      "date": "2026-04-07"
    },
    {
      "id": "z1m41bvq2",
      "text": "Add dashboard, sync skill, project docs, and restaurant-app codebase",
      "date": "2026-04-04"
    },
    {
      "id": "khy4zfwud",
      "text": "Initial commit: Restaurant SaaS project",
      "date": "2026-04-04"
    }
  ]
};
