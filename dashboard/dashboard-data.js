// AUTO-GENERIERT von sync-dashboard.js — 2026-04-11T11:03:30.200Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "nk20vg316",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-c6ze8embk",
      "name": "Restaurants",
      "fields": [
        {
          "id": "ggvm3ofcn",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "7zt70b60u",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "oh5izgpc9",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "jxrs0aswo",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "xclcpap7z",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "x7poinmo1",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "bfv3hui3g",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "hxvunrxtm",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "688yzrhe0",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "kcfid8h5d",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "rmg0i34lz",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "jrbjq5ub4",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "9n79q37cy",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "up5fuf93z",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "h5r5kfvam",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "9r2zxmjot",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "7v5sp4k3h",
          "name": "max_gaeste_pro_slot",
          "type": "Zahl",
          "description": "max_gaeste_pro_slot",
          "required": false
        },
        {
          "id": "9ud6fhgp4",
          "name": "reservierung_puffer_min",
          "type": "Zahl",
          "description": "reservierung_puffer_min",
          "required": true
        },
        {
          "id": "cnfgy5rde",
          "name": "reservierung_vorlauf_tage",
          "type": "Zahl",
          "description": "reservierung_vorlauf_tage",
          "required": true
        },
        {
          "id": "rnh8ot1yz",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-m9b0rbakq",
      "name": "Bereiche",
      "fields": [
        {
          "id": "vhgsa3t30",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ir18iy1uy",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "wf05zo4g6",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "6fdfgroj2",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-god9ggqc4",
      "name": "Kategorien",
      "fields": [
        {
          "id": "4zihwvq8p",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "pl8hlpzmj",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "c512dakdw",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "49iczkxnh",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "8075r8pft",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "5gh7lixf3",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-ng71ayhxr",
      "name": "Unterkategorien",
      "fields": [
        {
          "id": "h4nrmeebq",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "8xo0mm30g",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "9az41o6es",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "5mezqy1ta",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "3h9rt6um8",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": [
        "Kategorien"
      ]
    },
    {
      "id": "dt-7i8eelb77",
      "name": "Tische",
      "fields": [
        {
          "id": "1tf2kaouv",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "llgbnzehd",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "fvxgduhai",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "by513fw5h",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "bmu7n7g5v",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "hrm8lbler",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "jzvj0ez1w",
          "name": "form",
          "type": "Option Set",
          "description": "Moegliche Werte: rechteck, rund, quadrat, bar",
          "required": true
        },
        {
          "id": "x5m9dojy0",
          "name": "pos_x",
          "type": "Zahl",
          "description": "pos_x",
          "required": true
        },
        {
          "id": "lnvt6epon",
          "name": "pos_y",
          "type": "Zahl",
          "description": "pos_y",
          "required": true
        },
        {
          "id": "gnigj3wya",
          "name": "breite",
          "type": "Zahl",
          "description": "breite",
          "required": true
        },
        {
          "id": "nszoqqdby",
          "name": "hoehe",
          "type": "Zahl",
          "description": "hoehe",
          "required": true
        },
        {
          "id": "z71kaw5lc",
          "name": "rotation",
          "type": "Zahl",
          "description": "rotation",
          "required": true
        },
        {
          "id": "egsn3qhab",
          "name": "bereich_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bereiche",
          "required": false
        },
        {
          "id": "onlx309v4",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Bereiche"
      ]
    },
    {
      "id": "dt-us2caueik",
      "name": "Gerichte",
      "fields": [
        {
          "id": "h0q7mazwb",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "7yj7xc7hl",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "w79hnoi3n",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "cw8viaz2q",
          "name": "unterkategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Unterkategorien",
          "required": false
        },
        {
          "id": "9x2j4uwtp",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "r841mp271",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "gda95xbg1",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "zvxdo2i43",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "r0pzvtl00",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "uqb9wprl0",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "9u9bi65o0",
          "name": "modell_3d_url",
          "type": "Text",
          "description": "modell_3d_url",
          "required": false
        },
        {
          "id": "kevtt8kne",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Kategorien",
        "Unterkategorien"
      ]
    },
    {
      "id": "dt-iawqeanoo",
      "name": "Extras_gruppen",
      "fields": [
        {
          "id": "iuao8v8yq",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "jm7k1wpjs",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "fftbxeeqr",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "63rdzow0o",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "z5behyjxi",
          "name": "pflicht",
          "type": "Ja/Nein",
          "description": "pflicht",
          "required": true
        },
        {
          "id": "1dhrx1hui",
          "name": "max_auswahl",
          "type": "Zahl",
          "description": "max_auswahl",
          "required": true
        },
        {
          "id": "op9rjpvpp",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "fe9qcnbtf",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Gerichte"
      ]
    },
    {
      "id": "dt-gdl4a1r4w",
      "name": "Extras",
      "fields": [
        {
          "id": "uab9duvt0",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "5a5f8iyjg",
          "name": "gruppe_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras_gruppen",
          "required": true
        },
        {
          "id": "hw42tv447",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "mb8kvausa",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "kaorctb4q",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        },
        {
          "id": "ar9pj9ggi",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "9v22bfsiy",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "dyfcoylc7",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Extras_gruppen"
      ]
    },
    {
      "id": "dt-vn8yl88og",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "l9ssw3pb7",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ulb3nquj3",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "5yg7qvwov",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "le4tbh52v",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "vtde9rx90",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "1kzoe6mew",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "g2j86ijok",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "0qr67e4pn",
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
      "id": "dt-95uoun3oq",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "8qebj924o",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ycaqd61ui",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "8ll4xb6or",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "3n0q2uhcx",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "507g7wbrb",
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
      "id": "dt-nubkjwfhi",
      "name": "Bestellposition_extras",
      "fields": [
        {
          "id": "at7by2d5u",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "sv79kx9om",
          "name": "position_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellpositionen",
          "required": true
        },
        {
          "id": "p0xpk8f3n",
          "name": "extra_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras",
          "required": true
        },
        {
          "id": "5o00nr0du",
          "name": "extra_name",
          "type": "Text",
          "description": "extra_name",
          "required": true
        },
        {
          "id": "3fdnnckdx",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        }
      ],
      "relationships": [
        "Bestellpositionen",
        "Extras"
      ]
    },
    {
      "id": "dt-aszddw1aq",
      "name": "Gaeste",
      "fields": [
        {
          "id": "4n40zgz7s",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "7nh50qe2u",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "thkivrs1s",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "3xtep0487",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "d8xe9553o",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "6wf1t5del",
          "name": "notizen",
          "type": "Text",
          "description": "notizen",
          "required": false
        },
        {
          "id": "d5xd6wrwo",
          "name": "tags",
          "type": "Text",
          "description": "tags",
          "required": true
        },
        {
          "id": "0i71vtz8b",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "pf9cn7fgj",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        },
        {
          "id": "0xq9n4vmd",
          "name": "loeschen_nach",
          "type": "Datum",
          "description": "loeschen_nach",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-pnlphv03v",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "exmaoflt9",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ng9t73lyp",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "gzyso3sx1",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "xgmpom4ay",
          "name": "tisch_kombiniert_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "sv0pmt5m8",
          "name": "gast_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gaeste",
          "required": false
        },
        {
          "id": "th5p43cwd",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "roxm7r7mt",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "1umqx7568",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "emjbx83lf",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "ysmu4imrf",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "u27tamgbc",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert, abgeschlossen, no_show",
          "required": true
        },
        {
          "id": "2io4cp4zv",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "3bv2z0zc3",
          "name": "anlass",
          "type": "Text",
          "description": "anlass",
          "required": false
        },
        {
          "id": "hhr20rer0",
          "name": "sitzplatz_wunsch",
          "type": "Text",
          "description": "sitzplatz_wunsch",
          "required": false
        },
        {
          "id": "84tt1mwvz",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon, online",
          "required": true
        },
        {
          "id": "4vy9242ut",
          "name": "buchungs_token",
          "type": "Text",
          "description": "buchungs_token",
          "required": false
        },
        {
          "id": "yn7duz9st",
          "name": "dsgvo_einwilligung",
          "type": "Ja/Nein",
          "description": "dsgvo_einwilligung",
          "required": true
        },
        {
          "id": "fngus8bfp",
          "name": "erinnerung_gesendet",
          "type": "Text",
          "description": "erinnerung_gesendet",
          "required": true
        },
        {
          "id": "h26l56hsp",
          "name": "verweilzeit_min",
          "type": "Zahl",
          "description": "verweilzeit_min",
          "required": true
        },
        {
          "id": "zmdev42vw",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Tische",
        "Gaeste"
      ]
    },
    {
      "id": "dt-w8cggf93h",
      "name": "Walk_ins",
      "fields": [
        {
          "id": "xln2an59h",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "88ljf7yx8",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "icua8kury",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "nwltzizyn",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "y2xk0eh4h",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "ca4py28kr",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: wartend, platziert, abgegangen",
          "required": true
        },
        {
          "id": "vpfobqevr",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "zuw3sg1ao",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "ms30osis0",
          "name": "platziert_am",
          "type": "Datum",
          "description": "platziert_am",
          "required": false
        }
      ],
      "relationships": [
        "Tische"
      ]
    },
    {
      "id": "dt-fx0khu8g4",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "4wd22o4d9",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "n7gfacfl4",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "4yrbtqd13",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "9fo424n9a",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "wq3vs3pnl",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "xnb7c9xga",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "e1iaxwxy9",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "amnwi85ev",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "p4nz3hqwk",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "qsrlol3x9",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "xroxt541m",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "8tnh7iirq",
          "name": "stundenlohn",
          "type": "Text",
          "description": "stundenlohn",
          "required": false
        },
        {
          "id": "lvblbfd88",
          "name": "urlaubsanspruch_tage",
          "type": "Zahl",
          "description": "urlaubsanspruch_tage",
          "required": false
        },
        {
          "id": "emus2un8x",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-omqkz3bvi",
      "name": "Schichten",
      "fields": [
        {
          "id": "fwum16lhl",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "93c3iyz8k",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "9v6ph9bmx",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "k22fru4os",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "0fvydrrg5",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "3jkmzrt0v",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "nrinh3h8x",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "0eur1wdpq",
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
      "id": "dt-lpjqtnfxq",
      "name": "Abwesenheiten",
      "fields": [
        {
          "id": "jpybl2w9p",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "2h7r8xre0",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "qp7knjfx8",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "4o3mfeocq",
          "name": "von_datum",
          "type": "Datum",
          "description": "von_datum",
          "required": true
        },
        {
          "id": "tgw06wyau",
          "name": "bis_datum",
          "type": "Datum",
          "description": "bis_datum",
          "required": true
        },
        {
          "id": "0108cclsh",
          "name": "typ",
          "type": "Option Set",
          "description": "Moegliche Werte: urlaub, krank, sonstiges",
          "required": true
        },
        {
          "id": "5gkbnojqz",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "pahwezg5a",
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
      "id": "dt-ddu1gveo9",
      "name": "Schichttausch",
      "fields": [
        {
          "id": "yxyprkt1k",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "3u1p2yjtr",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "ttuzf02vc",
          "name": "anbieter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "8bhmtyj2u",
          "name": "anbieter_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": true
        },
        {
          "id": "zav6odjqq",
          "name": "annehmer_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": false
        },
        {
          "id": "edehfj4y7",
          "name": "annehmer_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": false
        },
        {
          "id": "y2x59pf8f",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, angeboten, genehmigt, abgelehnt",
          "required": true
        },
        {
          "id": "e6la6x6ro",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Mitarbeiter",
        "Schichten"
      ]
    },
    {
      "id": "dt-t94acbjwo",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "0py4kt2ll",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "gojt2qre9",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "sl8gltywu",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "wyxefn4sl",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "gow8ewu40",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "g0x0ojam5",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-5ko346tv6",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "wweu583ki",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "0o9rbpxf3",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "xooqmddyj",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "qxij8eqel",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "6zfrlyya3",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "vl77d3u6l",
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
      "id": "dt-45wvuda29",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "ffn7j9f6o",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "3ts0uw87k",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "nez7kfwk8",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "dxr2lkfud",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "y7ybmgsz9",
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
      "id": "iq7hxsg1n",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "314ok23sb",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "b010d21dl",
      "name": "Tische_Form",
      "values": [
        "rechteck, rund, quadrat, bar"
      ]
    },
    {
      "id": "9l581vkb0",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "tnv3zke39",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert, abgeschlossen, no_show"
      ]
    },
    {
      "id": "a8d22nehr",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon, online"
      ]
    },
    {
      "id": "zwbb52vev",
      "name": "Walk_ins_Status",
      "values": [
        "wartend, platziert, abgegangen"
      ]
    },
    {
      "id": "oftn2fu3k",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    },
    {
      "id": "jxcph0whx",
      "name": "Abwesenheiten_Typ",
      "values": [
        "urlaub, krank, sonstiges"
      ]
    },
    {
      "id": "ocopwyaxg",
      "name": "Schichttausch_Status",
      "values": [
        "offen, angeboten, genehmigt, abgelehnt"
      ]
    }
  ],
  "workflows": [
    {
      "id": "gcojqe1k6",
      "name": "Abwesenheiten abrufen",
      "folder": "Abwesenheiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abwesenheiten-Seite geladen wird",
      "steps": [
        {
          "id": "ujgi3664r",
          "type": "api",
          "desc": "GET /api/abwesenheiten aufrufen"
        },
        {
          "id": "rpbzb7cux",
          "type": "database",
          "desc": "Abwesenheiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "vbp0c30d1",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "tv55xh747",
      "name": "Abwesenheiten erstellen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abwesenheiten abgeschickt wird",
      "steps": [
        {
          "id": "j3tmiqsj2",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "t7ys7lfne",
          "type": "api",
          "desc": "POST /api/abwesenheiten aufrufen"
        },
        {
          "id": "ly0c57pkj",
          "type": "database",
          "desc": "Neuen Abwesenheiten-Datensatz in DB speichern"
        },
        {
          "id": "a7sy1u4ab",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "6lkvvfn4j",
      "name": "Abwesenheiten loeschen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "z93p07oa6",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "o09cm1dqt",
          "type": "api",
          "desc": "DELETE /api/abwesenheiten/:id aufrufen"
        },
        {
          "id": "r9bb4mqpa",
          "type": "database",
          "desc": "Abwesenheiten-Datensatz aus DB entfernen"
        },
        {
          "id": "2eb21x045",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "3ix7omh0l",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "dwkkds65q",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "di3mxcp1r",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "f6rliyja5",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "c2h6ramca",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "m229flbte",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "hgvckvj3p",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "smtzfjgy8",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "le7dv8qjo",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "btwjk87s5",
      "name": "Bereiche abrufen",
      "folder": "Bereiche",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche-Seite geladen wird",
      "steps": [
        {
          "id": "z7lfit7t8",
          "type": "api",
          "desc": "GET /api/bereiche aufrufen"
        },
        {
          "id": "dhbklhldu",
          "type": "database",
          "desc": "Bereiche-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "a15jopmrb",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "mwh2winyf",
      "name": "Bereiche erstellen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bereiche abgeschickt wird",
      "steps": [
        {
          "id": "y6v90g8an",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "pvy48jenq",
          "type": "api",
          "desc": "POST /api/bereiche aufrufen"
        },
        {
          "id": "2eait1362",
          "type": "database",
          "desc": "Neuen Bereiche-Datensatz in DB speichern"
        },
        {
          "id": "9mku6tqzw",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zlw5pluib",
      "name": "Bereiche bearbeiten",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "140sg7ew4",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "0ztcjtbie",
          "type": "api",
          "desc": "PATCH /api/bereiche/:id aufrufen"
        },
        {
          "id": "nhqws8kxm",
          "type": "database",
          "desc": "Bereiche-Datensatz in DB aktualisieren"
        },
        {
          "id": "risi59nqx",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "v5h4myiqb",
      "name": "Bereiche loeschen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "mu60qd3m6",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "6o3fm7unl",
          "type": "api",
          "desc": "DELETE /api/bereiche/:id aufrufen"
        },
        {
          "id": "eoat0dlzt",
          "type": "database",
          "desc": "Bereiche-Datensatz aus DB entfernen"
        },
        {
          "id": "xqx47qeoz",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "jf81vw1vh",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "yh0kjheq8",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "vjfv8au25",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8ble5tf60",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ectq08og2",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "vmcxx5brr",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6f6u9r3kh",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "zs40wqopp",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "axdt56axr",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "awx0xqmnx",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "r2l9c4zr0",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "dgy7twgxt",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "h5z7p18qu",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "smmy3j7qg",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "4tje6jrim",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "58utte7uo",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "su4u883kk",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4izqt33a7",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "tzir0d3rh",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "1vmv9at66",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "yhp5272kd",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "ivdurw0f0",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "0kewj6ukr",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7jjz2ze9h",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "8iv6rk5l1",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "msokqyjaf",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "shohqcesg",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "a7mbzi487",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "b62kvok3v",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "7jv7muy6j",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "5q2ihdbec",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "h497vlil6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "irsadq3q6",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "zchdtw3qp",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "zj3ie857c",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "ukvlrasu5",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "8iibgaeee",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "3860leoup",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "hwosfpt0o",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "ziz7s1u8b",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "4ubyjw5f1",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "7zct7rwj7",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ew6dfo2up",
      "name": "Gaeste abrufen",
      "folder": "Gaeste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste-Seite geladen wird",
      "steps": [
        {
          "id": "jwkyf5dco",
          "type": "api",
          "desc": "GET /api/gaeste aufrufen"
        },
        {
          "id": "s88qb019q",
          "type": "database",
          "desc": "Gaeste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "69krtc67r",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "n0lx21whm",
      "name": "Gaeste erstellen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Gaeste abgeschickt wird",
      "steps": [
        {
          "id": "8hknelzz4",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "drkwlpcxg",
          "type": "api",
          "desc": "POST /api/gaeste aufrufen"
        },
        {
          "id": "k0kpun7j5",
          "type": "database",
          "desc": "Neuen Gaeste-Datensatz in DB speichern"
        },
        {
          "id": "ze7mrmp7s",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "39of39vjy",
      "name": "Gaeste bearbeiten",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "kar0nmjsb",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "kord943v0",
          "type": "api",
          "desc": "PATCH /api/gaeste/:id aufrufen"
        },
        {
          "id": "tujggcs5h",
          "type": "database",
          "desc": "Gaeste-Datensatz in DB aktualisieren"
        },
        {
          "id": "aid8vr4gb",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "rm0ouuig9",
      "name": "Gaeste loeschen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "kng3c88ib",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "kcvj7xpnr",
          "type": "api",
          "desc": "DELETE /api/gaeste/:id aufrufen"
        },
        {
          "id": "vw9gmgows",
          "type": "database",
          "desc": "Gaeste-Datensatz aus DB entfernen"
        },
        {
          "id": "3cdvg7kes",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "z3n1wpt5o",
      "name": "Google-reserve abrufen",
      "folder": "Google-reserve",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Google-reserve-Seite geladen wird",
      "steps": [
        {
          "id": "0ut40jwks",
          "type": "api",
          "desc": "GET /api/google-reserve aufrufen"
        },
        {
          "id": "00jgl8g7r",
          "type": "database",
          "desc": "Google-reserve-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4myfobic9",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "jfnv1tguz",
      "name": "Google-reserve erstellen",
      "folder": "Google-reserve",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Google-reserve abgeschickt wird",
      "steps": [
        {
          "id": "hmpu5it6q",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "f97awmztu",
          "type": "api",
          "desc": "POST /api/google-reserve aufrufen"
        },
        {
          "id": "ry93mxgiv",
          "type": "database",
          "desc": "Neuen Google-reserve-Datensatz in DB speichern"
        },
        {
          "id": "adnqkdupz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "u6qvsr0fd",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "1pqnd1wv6",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "lqamjwwy7",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "112i3l13m",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "iam8qtvcq",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "yjvopbejh",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "szipvyi9t",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "57h4nusd5",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "t70pqfkqs",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "5fl1unbhn",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "8wsg2pzpp",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "6o613ol37",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "259xkwwtw",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "gre2v0zt9",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "p2ye8eo7o",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "3u2slssut",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "oo9s7tclx",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "whkwoa27a",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "atzknsq1k",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "lcsbelhvf",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "kf1op4rag",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "4xr1949oc",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "upi98dne6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "r73zfrb8r",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "lgtkcvgvy",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "ncbgppvan",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "gk2rk4xkw",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "5pt7u2ati",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "0gpbhm9hr",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "wsp07gbfm",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "1nvkp7m7o",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "k47hhbl2i",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "zfp2hmun9",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "b3b8jltn9",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "galhstxnt",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "n01d3980k",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "34nqtyv45",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "lqempanc4",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "z1fs67gox",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "pq02bvcv4",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "g50vy4gpn",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "9cfxw5az7",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "5wvfl0c6y",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "7ab9p9tys",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "i53jz08kl",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "7lstbpwyp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "w7poum3tk",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "quq9dqtlq",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "uagdnpszq",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "b4uc5iuz0",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "wiuzkvb7i",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zy4dbm1z5",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "h1c8euqq2",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "qq2ychi7e",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "hkpr7di8j",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "88hk6fk67",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ub5bobvz4",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "wwrt0r8ab",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "vrepxband",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "p10qzr4r2",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "5m03yth4b",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7pzfnvn5k",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "p0lcciuep",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "pqe2rrbww",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "jthx1rqsp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "c5i6sqw37",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "hu44ix273",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "hwut9tm6v",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ifcqcf5mr",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "6hx0orc0y",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "2kz1g8vgu",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "u6qkwe0yr",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "3y21f1ee2",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "aupu11h4o",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "814uin1m3",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "4ku77rtgi",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "hf5f00psv",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "cb0vzpg7f",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "xbkelach0",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "pghoh076q",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "gwfkl834v",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "x0eq5u8v5",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "is1j0azy9",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "zioplvftg",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "k78b08gzz",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "yliwq1wn1",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "q5y98adyg",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "umg4sony4",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "2tcq8tjpq",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "onxzt6cq8",
      "name": "Verfuegbarkeit abrufen",
      "folder": "Verfuegbarkeit",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Verfuegbarkeit-Seite geladen wird",
      "steps": [
        {
          "id": "u101m7gel",
          "type": "api",
          "desc": "GET /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "f049ioxev",
          "type": "database",
          "desc": "Verfuegbarkeit-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "0ht2rzkb8",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "nvoo6dksw",
      "name": "Verfuegbarkeit erstellen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Verfuegbarkeit abgeschickt wird",
      "steps": [
        {
          "id": "tqwu2sv5u",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "t27rfa1pi",
          "type": "api",
          "desc": "POST /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "u6n9kn9z6",
          "type": "database",
          "desc": "Neuen Verfuegbarkeit-Datensatz in DB speichern"
        },
        {
          "id": "9n8ugt81r",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ayee2vxaw",
      "name": "Verfuegbarkeit loeschen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "w5n9r0lck",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "j2k9lsagd",
          "type": "api",
          "desc": "DELETE /api/verfuegbarkeit/:id aufrufen"
        },
        {
          "id": "cq7j0szxj",
          "type": "database",
          "desc": "Verfuegbarkeit-Datensatz aus DB entfernen"
        },
        {
          "id": "ygadsplhl",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "mbpa8dgoc",
      "name": "Walk-ins abrufen",
      "folder": "Walk-ins",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins-Seite geladen wird",
      "steps": [
        {
          "id": "sr9eeezez",
          "type": "api",
          "desc": "GET /api/walk-ins aufrufen"
        },
        {
          "id": "ffur5o7g4",
          "type": "database",
          "desc": "Walk-ins-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "atohlbb4x",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "za71upms5",
      "name": "Walk-ins erstellen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Walk-ins abgeschickt wird",
      "steps": [
        {
          "id": "wt3uxkdw9",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "xhaflrjmg",
          "type": "api",
          "desc": "POST /api/walk-ins aufrufen"
        },
        {
          "id": "x4g00jctn",
          "type": "database",
          "desc": "Neuen Walk-ins-Datensatz in DB speichern"
        },
        {
          "id": "0x1ghy9ye",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "3d82lci6c",
      "name": "Walk-ins bearbeiten",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "v1d6na4ui",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "p98zrquel",
          "type": "api",
          "desc": "PATCH /api/walk-ins/:id aufrufen"
        },
        {
          "id": "d8j9lpxan",
          "type": "database",
          "desc": "Walk-ins-Datensatz in DB aktualisieren"
        },
        {
          "id": "0c7gfie5j",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "p9c16qfuc",
      "name": "Walk-ins loeschen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "8ajyii9qi",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "mpljc6qsz",
          "type": "api",
          "desc": "DELETE /api/walk-ins/:id aufrufen"
        },
        {
          "id": "r32nkbx7j",
          "type": "database",
          "desc": "Walk-ins-Datensatz aus DB entfernen"
        },
        {
          "id": "yewggd2n2",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "22r19edbl",
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
      "id": "488vxh2ti",
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
      "id": "up1qfse10",
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
      "id": "bgoy5u5lt",
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
      "id": "cylumd8m3",
      "name": "Dashboard",
      "desc": "Seite: Dashboard — Nutzt 4 Hooks, 5 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Bestellungen",
        "Tische",
        "Restaurant",
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
      "id": "724uxc3qj",
      "name": "Dienstplan",
      "desc": "Seite: Dienstplan — Nutzt 5 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Dienstplan",
        "Mitarbeiter",
        "Personalbedarf",
        "AuthStore",
        "Schichttausch"
      ],
      "reusables": [
        "DraggableSchicht",
        "DroppableZelle",
        "SchichtFormular"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "9ucselfuy",
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
      "id": "6vmm7y7hn",
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
      "id": "zm3bdkj99",
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
      "id": "p46tdmnkr",
      "name": "Gaeste",
      "desc": "Seite: Gaeste — Nutzt 2 Hooks, 16 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Gaeste",
        "AuthStore"
      ],
      "reusables": [
        "BestellStatusTracker",
        "GerichtAuswahl",
        "GerichtDetailModal",
        "GerichtKarteEditorial",
        "GerichtKarteOsteria",
        "GerichtKartePro",
        "GerichtKarteShowcase",
        "GerichtZeile",
        "KategorieKarte",
        "KategorieKarteShowcase",
        "KategoriePills",
        "KategorieZeile",
        "KategorieZeileEditorial",
        "Tilt3DKarte",
        "Warenkorb",
        "WarenkorbPro"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "mc2i3ekaf",
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
      "id": "odvmx5yi2",
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
      "id": "0w3oytr64",
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
      "id": "bcz409y4q",
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
      "id": "kom6zbwq6",
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
      "id": "xb8ezobp1",
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
      "id": "cw3l0klk8",
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
      "id": "ywf47fupo",
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
      "id": "wg6s10ffc",
      "name": "Reservierungen",
      "desc": "Seite: Reservierungen — Nutzt 4 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore",
        "Reservierungen",
        "Tische",
        "WalkIns"
      ],
      "reusables": [
        "ReservierungFormular",
        "ReservierungZeile",
        "WalkInZeile"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "xd2y8utvy",
      "name": "Speisekarte",
      "desc": "Seite: Speisekarte — Nutzt 1 Hooks, 4 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte"
      ],
      "reusables": [
        "ExtrasVerwaltung",
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
      "id": "21qas09d3",
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
      "id": "ae0snglon",
      "name": "Tischplan",
      "desc": "Seite: Tischplan — Nutzt 4 Hooks, 2 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Tische",
        "Bereiche",
        "AuthStore",
        "Reservierungen"
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
      "id": "cwq3ud3i3",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "119n4jnyj",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "1vx5y2ml6",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "xmnyud6ht",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "qxh3s6a9z",
      "name": "API: Extras",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Extras",
      "url": "/api/extras"
    },
    {
      "id": "dsswmp2si",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "elu6ktwh9",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "i2lkwjl8w",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "zhh658jhj",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "5msihr645",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "x188ktsjw",
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
        "Bereiche": {
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
        "Unterkategorien": {
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
        "Extras_gruppen": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Extras": {
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
        "Bestellposition_extras": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Gaeste": {
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
        "Walk_ins": {
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
        "Abwesenheiten": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Schichttausch": {
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
        "Bereiche": {
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
        "Unterkategorien": {
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
        "Extras_gruppen": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Extras": {
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
        "Bestellposition_extras": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gaeste": {
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
        "Walk_ins": {
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
        "Abwesenheiten": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichttausch": {
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
        "Bereiche": {
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
        "Unterkategorien": {
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
        "Extras_gruppen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Extras": {
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
        "Bestellposition_extras": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gaeste": {
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
        "Walk_ins": {
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
        "Abwesenheiten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichttausch": {
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
        "Bereiche": {
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
        "Unterkategorien": {
          "read": true,
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
        "Extras_gruppen": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Extras": {
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
        "Bestellposition_extras": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Gaeste": {
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
        "Walk_ins": {
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
        "Abwesenheiten": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schichttausch": {
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
      "id": "5f5hc4xh7",
      "title": "Abonnement-Verwaltung (Mollie)",
      "desc": "Aus Phase 4 – SaaS-Features",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "hqskkd44z",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "ik11wiaym",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "p3gp1v6pl",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "qhlmszlu2",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "kcsfit2mm",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "t3xhmp9zl",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "4qlfba2g2",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "e9ppahqvp",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "gjs2v7qmi",
      "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "0nkvymg96",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "seial94py",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "0f2vvs9mv",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "e2ntgv60n",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "bsl0cvaqi",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "4a7f0fpn7",
      "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "soz3pzy3y",
      "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "9tnoz5v9d",
      "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "p34st9ldf",
      "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "mdzpgyo1w",
      "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "0tcxmhxu8",
      "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "wzj3i2be0",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "hddk7ncst",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "f8aua7489",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "l2ceha3sd",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    },
    {
      "id": "irfn3t0em",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-11"
    }
  ],
  "roadmap": [
    {
      "id": "rddydal9p",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "3r6affevg",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "5msj7r0fk",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "1n55w9ipi",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "om72vzt8v",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "b6j0dc17d",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "z2ygpya8v",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "pg95ilbc8",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "uy54vygvr",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "6nga9qaqa",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "bn0dlt44g",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "ijyt6nvdi",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "9rhq3ojla",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "1ldjmnjmm",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "u78srx4gm",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "kjw36kg4p",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "jyds8k342",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "6pcvu5fp9",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "c0ideltst",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "ovko8sjwl",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "8mqfktrs3",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "8sx36trbl",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "pf7fbqmzp",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "oo20ixb1n",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "8l2u7wky2",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "nhgbkb4uh",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "p6klz5v3t",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "ny8fatkz3",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "7figv7ly3",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "h5qwr9ti0",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "qabjgcz0k",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "zws6y434j",
          "title": "Abonnement-Verwaltung (Mollie)",
          "done": false
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "4snf5xtla",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "svhy8035p",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "lxnajgopd",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "h3z10sh2n",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "o9l8eusqk",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "t8er5p3lr",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "yh1d43ymh",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "7x67s9it6",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "2u8ktbdhq",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "yd331vnmg",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "5zr7c1t2w",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "6j8znqfvr",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "95glu5hwu",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "6q18fsswf",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "jt0uf8iah",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "3xmk8hyln",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "fzp0ofgy9",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "rz0xen6av",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "f1i4z8o2r",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "b9o4dbqct",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "mxz0ifv72",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "r4it7rx00",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "0ejw7an6j",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten)",
          "done": true
        },
        {
          "id": "y9tdcbpqb",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": true
        },
        {
          "id": "0ambiht1j",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": true
        },
        {
          "id": "c3wzblchs",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": true
        },
        {
          "id": "cd2jrxb22",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren)",
          "done": true
        },
        {
          "id": "z33fp2ra3",
          "title": "Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io)",
          "done": true
        },
        {
          "id": "g1b48o6p6",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": false
        },
        {
          "id": "geq0ysgra",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": true
        },
        {
          "id": "b2ezu7eag",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": true
        },
        {
          "id": "adcw8l9vt",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": true
        },
        {
          "id": "7hfq2z39j",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "0fnmboi3h",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 9,
      "total": 12
    },
    {
      "id": "83o0bt3j6",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "9ip7h3rqz",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "frnu6bsjf",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "0gkj24y3h",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "3qvunb5sp",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "8iyzc6jhv",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "dsrs75f65",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "8kvkz0akc",
          "title": "QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package)",
          "done": true
        },
        {
          "id": "rzmtelxt1",
          "title": "Socket.io Live-Updates bei neuer/geänderter Reservierung",
          "done": true
        },
        {
          "id": "wwe19seyj",
          "title": "Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit)",
          "done": true
        },
        {
          "id": "my5uc30x7",
          "title": "Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite)",
          "done": true
        },
        {
          "id": "h10wvmzrk",
          "title": "**Räumlicher Tischplan / Floor Plan Editor**",
          "done": true
        },
        {
          "id": "808850ern",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": true
        },
        {
          "id": "197z5pqzx",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "78cot54fp",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "mgdarudih",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "cjqr1iuqm",
          "title": "Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit)",
          "done": true
        },
        {
          "id": "977msu5xt",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
          "done": false
        },
        {
          "id": "ug2zvqzxg",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": true
        },
        {
          "id": "w0rhgf8ws",
          "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
          "done": false
        },
        {
          "id": "l6mvwsjyc",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": false
        },
        {
          "id": "kzuiwdd9p",
          "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
          "done": false
        }
      ],
      "done": 14,
      "total": 21
    },
    {
      "id": "5q3mvj48s",
      "name": "Extras/Modifier-System ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "4efwwj4gs",
          "title": "DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen",
          "done": true
        },
        {
          "id": "e96cl7erg",
          "title": "Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading)",
          "done": true
        },
        {
          "id": "ke8d8crht",
          "title": "Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras)",
          "done": true
        },
        {
          "id": "664yh9swf",
          "title": "Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern",
          "done": true
        },
        {
          "id": "l9r9d4q9g",
          "title": "Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra",
          "done": true
        },
        {
          "id": "ggj9olct8",
          "title": "useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts)",
          "done": true
        },
        {
          "id": "7cuvptsv8",
          "title": "GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis",
          "done": true
        },
        {
          "id": "l9cvwv91h",
          "title": "Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige",
          "done": true
        },
        {
          "id": "pzq0e6d35",
          "title": "BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt",
          "done": true
        },
        {
          "id": "5i9v12a8z",
          "title": "Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte)",
          "done": true
        },
        {
          "id": "bpt4j33tw",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "eqedx7rlj",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "s33r5nakd",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "wd76gn94g",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "6b8orx7ow",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "pedn9t7ui",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "qc8sawe38",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "jezm8jbd8",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "9irzc4str",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "7ss00putt",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "r0cwnyald",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "spkmndlgf",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "xvdllhbjj",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "tliyp3gb6",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "lqbvp4gew",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "tbvuxp6v5",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "88ugsok8k",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "8usfr0p9s",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "47uxlhqqs",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "q8h535ixx",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "6iezrdfl0",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "bmruvzmiq",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "1viidjiou",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "93fx97zkp",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "2qska6qhm",
      "name": "Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "nvm8bn2ir",
          "title": "Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3)",
          "done": true
        },
        {
          "id": "y3x6576u9",
          "title": "Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1)",
          "done": true
        },
        {
          "id": "oh6lfx1ye",
          "title": "\"Zum Kalender hinzufuegen\" auf Bestaetigungsseite (Google Calendar + iCal-Download)",
          "done": true
        },
        {
          "id": "cawktdoim",
          "title": "DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen`",
          "done": true
        },
        {
          "id": "4h1y744nz",
          "title": "Backend + Admin-UI + Detailseite erweitert",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "ll4spynuy",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "mm73yrk1f",
          "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
          "done": false
        },
        {
          "id": "36p2oqvkn",
          "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
          "done": false
        },
        {
          "id": "q8100w252",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "z3320pbi8",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 0,
      "total": 4
    },
    {
      "id": "53rxre526",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "czkw2td77",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "3dcn0his0",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "31on8wt4h",
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
      "id": "ya866jwmg",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "6uaj2fdgf",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "ysjhbczf0",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "yxdu7clx6",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "emzd6opuz",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "mf355jym9",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "gjx56chu0",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "m145m10fw",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "sl6umg2ha",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "jlg6cipri",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "yposnca1p",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "fx5l7gkn2",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "er9m5kvt2",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "1g92zs76f",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      },
      {
        "id": "zt3oft52x",
        "date": "2026-04-09",
        "title": "Urlaubsverwaltung (Urlaubskonto)"
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
      "id": "3ytrlskxu",
      "text": "Phase 8A Reservierungssystem + Phase 6 Kategorie-Flow + Bugfixes",
      "date": "2026-04-07"
    },
    {
      "id": "48bcmwlf1",
      "text": "Full app update: auth system, dashboard, theme engine, pro order page, and project docs",
      "date": "2026-04-07"
    },
    {
      "id": "msf8req5i",
      "text": "Add dashboard, sync skill, project docs, and restaurant-app codebase",
      "date": "2026-04-04"
    },
    {
      "id": "8zh6c72v6",
      "text": "Initial commit: Restaurant SaaS project",
      "date": "2026-04-04"
    }
  ]
};
