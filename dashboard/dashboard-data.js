// AUTO-GENERIERT von sync-dashboard.js — 2026-04-14T17:33:17.923Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "ad9n6q29z",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-4ldt25890",
      "name": "Restaurants",
      "fields": [
        {
          "id": "rgi9mrujt",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xwtb5suou",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "0vfre75av",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "8wk8j4h41",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "f6aqsylbr",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "m8q5swyet",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "9vqabk8gn",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "grbdtki31",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "0umlt9no4",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "jv3pom59r",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "lkvqejj6m",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "jqnwpt63x",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "o24kzorfu",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "pjp3v1wje",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "fif155d5u",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "yj00m3q9m",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "yb6lho2wp",
          "name": "max_gaeste_pro_slot",
          "type": "Zahl",
          "description": "max_gaeste_pro_slot",
          "required": false
        },
        {
          "id": "tmzutom64",
          "name": "reservierung_puffer_min",
          "type": "Zahl",
          "description": "reservierung_puffer_min",
          "required": true
        },
        {
          "id": "h46f5kbwi",
          "name": "reservierung_vorlauf_tage",
          "type": "Zahl",
          "description": "reservierung_vorlauf_tage",
          "required": true
        },
        {
          "id": "1yfr39mls",
          "name": "buchungsintervall_min",
          "type": "Zahl",
          "description": "buchungsintervall_min",
          "required": true
        },
        {
          "id": "9dpb9u1ij",
          "name": "tisch_dauer_min",
          "type": "Zahl",
          "description": "tisch_dauer_min",
          "required": true
        },
        {
          "id": "zegi1x3et",
          "name": "max_gleichzeitige_reservierungen",
          "type": "Zahl",
          "description": "max_gleichzeitige_reservierungen",
          "required": false
        },
        {
          "id": "ai4x4g337",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-kzl08i5h3",
      "name": "Bereiche",
      "fields": [
        {
          "id": "i9k1cq5da",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "1mcuu330f",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "fzqo68xpg",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "03jjh2s68",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-d094jeb5l",
      "name": "Kategorien",
      "fields": [
        {
          "id": "m40fcykmp",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "bb9edgkh7",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "pku7ie7wt",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "z9fvehd2y",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "sfrkyzu1s",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "yakmrgwem",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-fc0oi28ox",
      "name": "Unterkategorien",
      "fields": [
        {
          "id": "4l09b2mju",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "yadt8u83y",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "rrk73qy5t",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "xiucugxeu",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "ihe3ycabc",
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
      "id": "dt-81yvb7yxf",
      "name": "Tische",
      "fields": [
        {
          "id": "fopfy6el0",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "98ak6awae",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "zmci7iiew",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "8xhjmocfd",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "xydwhhugg",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "f73ujqfeq",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "5dasqxhdj",
          "name": "form",
          "type": "Option Set",
          "description": "Moegliche Werte: rechteck, rund, quadrat, bar",
          "required": true
        },
        {
          "id": "ygn2yi6c3",
          "name": "pos_x",
          "type": "Zahl",
          "description": "pos_x",
          "required": true
        },
        {
          "id": "mzz9rpd6l",
          "name": "pos_y",
          "type": "Zahl",
          "description": "pos_y",
          "required": true
        },
        {
          "id": "zjxdn03tn",
          "name": "breite",
          "type": "Zahl",
          "description": "breite",
          "required": true
        },
        {
          "id": "g11fwub7p",
          "name": "hoehe",
          "type": "Zahl",
          "description": "hoehe",
          "required": true
        },
        {
          "id": "13o8i03an",
          "name": "rotation",
          "type": "Zahl",
          "description": "rotation",
          "required": true
        },
        {
          "id": "svqod5fk6",
          "name": "bereich_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bereiche",
          "required": false
        },
        {
          "id": "qfsoym3p6",
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
      "id": "dt-c73xbnvr4",
      "name": "Gerichte",
      "fields": [
        {
          "id": "93dt3m8ad",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "spmvfp9kf",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "ehhp9h647",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "ap99x7t7k",
          "name": "unterkategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Unterkategorien",
          "required": false
        },
        {
          "id": "egu5jqmuh",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "8nj1cg19t",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "yx5cxrao1",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "0gfwdznp1",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "0x07ue5h5",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "2g0u2yoj7",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "r1j509i8p",
          "name": "modell_3d_url",
          "type": "Text",
          "description": "modell_3d_url",
          "required": false
        },
        {
          "id": "rdn2jypr4",
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
      "id": "dt-w2tp2y4zu",
      "name": "Extras_gruppen",
      "fields": [
        {
          "id": "tr5oeb9xe",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "2afu0ro1y",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "3z168zdcl",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "1yyd48swv",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "u99qrsmus",
          "name": "pflicht",
          "type": "Ja/Nein",
          "description": "pflicht",
          "required": true
        },
        {
          "id": "2rudpb0mt",
          "name": "max_auswahl",
          "type": "Zahl",
          "description": "max_auswahl",
          "required": true
        },
        {
          "id": "5vuj1sd8d",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "z08hoa7d4",
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
      "id": "dt-3wmsmi22n",
      "name": "Extras",
      "fields": [
        {
          "id": "73jh61mpx",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "5plpxocis",
          "name": "gruppe_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras_gruppen",
          "required": true
        },
        {
          "id": "4btxsbo07",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "0u0u4jm27",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "3y0olk0m6",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        },
        {
          "id": "okrmms4k2",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "36i6i4p9n",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "9o3k81kwn",
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
      "id": "dt-68qe979ur",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "z5oqmbbxb",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "tfa30nf3v",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "6xzdtsoz5",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "crgsphfgs",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "jwri9tg14",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "moto2f5mu",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "kzgem6syg",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "g06zaka5g",
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
      "id": "dt-w4grpexql",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "rud5i6bys",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "6bc0gcvvs",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "b9peryawf",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "pctw9lv1i",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "0u2o4wyi7",
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
      "id": "dt-clc19on6n",
      "name": "Bestellposition_extras",
      "fields": [
        {
          "id": "bijioox9w",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "x0ja6v90b",
          "name": "position_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellpositionen",
          "required": true
        },
        {
          "id": "sv8erpmhw",
          "name": "extra_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras",
          "required": true
        },
        {
          "id": "nlr5lyy6z",
          "name": "extra_name",
          "type": "Text",
          "description": "extra_name",
          "required": true
        },
        {
          "id": "woklqc079",
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
      "id": "dt-j1dnbniot",
      "name": "Gaeste",
      "fields": [
        {
          "id": "dv6m1avox",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "fsz256wvv",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "c9xon74j9",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "dinet0ocd",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "76rau5ysc",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "whd48gpap",
          "name": "notizen",
          "type": "Text",
          "description": "notizen",
          "required": false
        },
        {
          "id": "f866tna43",
          "name": "tags",
          "type": "Text",
          "description": "tags",
          "required": true
        },
        {
          "id": "rnl550fgu",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "wjrw2tvth",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        },
        {
          "id": "1wg3or311",
          "name": "loeschen_nach",
          "type": "Datum",
          "description": "loeschen_nach",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-jz7b6l14i",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "9of623ryi",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "6d2f0qcdo",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "8a0wp38f3",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "hndr8m0cz",
          "name": "tisch_kombiniert_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "as8qdpls9",
          "name": "gast_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gaeste",
          "required": false
        },
        {
          "id": "4or72v5o8",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "4f7beg8uy",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "ib1vpa5gk",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "hnfw7vaa7",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "24f8wcg56",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "jofsxufkg",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert, abgeschlossen, no_show",
          "required": true
        },
        {
          "id": "yuzqgjssq",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "5qyxsu6gg",
          "name": "anlass",
          "type": "Text",
          "description": "anlass",
          "required": false
        },
        {
          "id": "ty53cxpzt",
          "name": "sitzplatz_wunsch",
          "type": "Text",
          "description": "sitzplatz_wunsch",
          "required": false
        },
        {
          "id": "8355yck5b",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon, online, google",
          "required": true
        },
        {
          "id": "xpiddyi46",
          "name": "buchungs_token",
          "type": "Text",
          "description": "buchungs_token",
          "required": false
        },
        {
          "id": "jqzzrbut6",
          "name": "dsgvo_einwilligung",
          "type": "Ja/Nein",
          "description": "dsgvo_einwilligung",
          "required": true
        },
        {
          "id": "8xnc18jxt",
          "name": "erinnerung_gesendet",
          "type": "Text",
          "description": "erinnerung_gesendet",
          "required": true
        },
        {
          "id": "byy3phwob",
          "name": "verweilzeit_min",
          "type": "Zahl",
          "description": "verweilzeit_min",
          "required": true
        },
        {
          "id": "df9vghbsj",
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
      "id": "dt-ubmr07vvq",
      "name": "Walk_ins",
      "fields": [
        {
          "id": "rqcb4casd",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "o614iwn8x",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "j69wz473s",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "9euylia5x",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "9ajf41uqr",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "868qpt2gd",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: wartend, platziert, abgegangen",
          "required": true
        },
        {
          "id": "s09g4e28t",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "bjtaxzb3x",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "63tw2wx77",
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
      "id": "dt-m9mqid1lx",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "70fscueuq",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "4todf6sx6",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "vnuur1dq6",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "0ia82rtil",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "sw3x6zjd3",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "n08rioejq",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "ia6i3apfn",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "ugdytdj7e",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "zqvf6qkx5",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "5zrr0aa21",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "q2v8ge2kj",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "2hqgvbzlg",
          "name": "stundenlohn",
          "type": "Text",
          "description": "stundenlohn",
          "required": false
        },
        {
          "id": "qe9t979yn",
          "name": "urlaubsanspruch_tage",
          "type": "Zahl",
          "description": "urlaubsanspruch_tage",
          "required": false
        },
        {
          "id": "kry1xst47",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-ebltc9bu0",
      "name": "Schichten",
      "fields": [
        {
          "id": "1c1nu0xb2",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "nwmd1ke8e",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "2jrlvlnaf",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "3ynbudo4y",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "1960fdq18",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "v1f8ixkns",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "7yjh12vet",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "28yc47a45",
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
      "id": "dt-md2yi33rn",
      "name": "Abwesenheiten",
      "fields": [
        {
          "id": "xna4va0e2",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ikf7nw36e",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "722s9fk0m",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "gqzm5o48h",
          "name": "von_datum",
          "type": "Datum",
          "description": "von_datum",
          "required": true
        },
        {
          "id": "zw4ah0l3j",
          "name": "bis_datum",
          "type": "Datum",
          "description": "bis_datum",
          "required": true
        },
        {
          "id": "11ww2i75h",
          "name": "typ",
          "type": "Option Set",
          "description": "Moegliche Werte: urlaub, krank, sonstiges",
          "required": true
        },
        {
          "id": "zpof5xphx",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "qcefyfiwt",
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
      "id": "dt-cebgy2x7a",
      "name": "Schichttausch",
      "fields": [
        {
          "id": "8dksrcwro",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xws7ir6gv",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "mx3pyi7u1",
          "name": "anbieter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "hfpb5uwoo",
          "name": "anbieter_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": true
        },
        {
          "id": "n50p59gtb",
          "name": "annehmer_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": false
        },
        {
          "id": "89mzg23r9",
          "name": "annehmer_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": false
        },
        {
          "id": "pebj7gzo1",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, angeboten, genehmigt, abgelehnt",
          "required": true
        },
        {
          "id": "6a2zzf0m7",
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
      "id": "dt-3s9k98q9p",
      "name": "Schicht_templates",
      "fields": [
        {
          "id": "xkmneov8d",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "pgxhwmaoz",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "sqf0r7i31",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "jl7f0bcmo",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-i2kuz2fgu",
      "name": "Schicht_template_eintraege",
      "fields": [
        {
          "id": "gkjcyd9jt",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "gzp8k532e",
          "name": "template_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schicht_templates",
          "required": true
        },
        {
          "id": "r0mt33wgf",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "6zc9wdruk",
          "name": "wochentag",
          "type": "Text",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "k0umsdh3w",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "l1xbiiqh3",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "2gydu3sbd",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        }
      ],
      "relationships": [
        "Schicht_templates",
        "Mitarbeiter"
      ]
    },
    {
      "id": "dt-shwmf0sv6",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "wj93cfv4q",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "f3v2znqhx",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "g7ab06wkb",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "xxjhcd5un",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "2hv0va573",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "r83sh1ryp",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-dzo1zxxe0",
      "name": "Ausnahmetage",
      "fields": [
        {
          "id": "l0iny4wtx",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "3ivs4g4xl",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "53cl4zya2",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "lwrsi1231",
          "name": "grund",
          "type": "Text",
          "description": "grund",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-zu3gwafsu",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "8bau8zrbo",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "p12dp2lvo",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "0l5wuiwqu",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "7v4hybsxz",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "g8gdd4lcw",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "698wxkwqn",
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
      "id": "dt-u4oh7n201",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "3xbtxvzet",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "4js5yjlip",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "k9iq3ect3",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "larnu5qtm",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "s041xqfe8",
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
      "id": "ysg9dn4gb",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "qie9kek3l",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "ovbg5b5rg",
      "name": "Tische_Form",
      "values": [
        "rechteck, rund, quadrat, bar"
      ]
    },
    {
      "id": "46vjqkvn4",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "ho9xh2pz0",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert, abgeschlossen, no_show"
      ]
    },
    {
      "id": "0qt4zdtbg",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon, online, google"
      ]
    },
    {
      "id": "euiwt9wv4",
      "name": "Walk_ins_Status",
      "values": [
        "wartend, platziert, abgegangen"
      ]
    },
    {
      "id": "6a9pis302",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    },
    {
      "id": "pxsj6ssuw",
      "name": "Abwesenheiten_Typ",
      "values": [
        "urlaub, krank, sonstiges"
      ]
    },
    {
      "id": "36mvo86j2",
      "name": "Schichttausch_Status",
      "values": [
        "offen, angeboten, genehmigt, abgelehnt"
      ]
    }
  ],
  "workflows": [
    {
      "id": "x5g8h28tv",
      "name": "Abwesenheiten abrufen",
      "folder": "Abwesenheiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abwesenheiten-Seite geladen wird",
      "steps": [
        {
          "id": "bzyy96yn7",
          "type": "api",
          "desc": "GET /api/abwesenheiten aufrufen"
        },
        {
          "id": "4m3rq1p9m",
          "type": "database",
          "desc": "Abwesenheiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ac18261io",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "yefekg2hg",
      "name": "Abwesenheiten erstellen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abwesenheiten abgeschickt wird",
      "steps": [
        {
          "id": "xdp2m7asp",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "t6itjocxu",
          "type": "api",
          "desc": "POST /api/abwesenheiten aufrufen"
        },
        {
          "id": "aq87naj1p",
          "type": "database",
          "desc": "Neuen Abwesenheiten-Datensatz in DB speichern"
        },
        {
          "id": "t29c09i96",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ydegmynwo",
      "name": "Abwesenheiten loeschen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "m66inkitc",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "l521nou81",
          "type": "api",
          "desc": "DELETE /api/abwesenheiten/:id aufrufen"
        },
        {
          "id": "0yg8yvmge",
          "type": "database",
          "desc": "Abwesenheiten-Datensatz aus DB entfernen"
        },
        {
          "id": "q5jvq4x1d",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ufhf6i73u",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "u9sgpy7ka",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "42am9bkuf",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "xleb1fdv6",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "vkgd02vpe",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "ydhggnw30",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "a0qnrpnxc",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "44vrrflc9",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "ncuphuh9h",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "g4dap7a7q",
      "name": "Bereiche abrufen",
      "folder": "Bereiche",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche-Seite geladen wird",
      "steps": [
        {
          "id": "sf4qkbjsg",
          "type": "api",
          "desc": "GET /api/bereiche aufrufen"
        },
        {
          "id": "p79r6xu38",
          "type": "database",
          "desc": "Bereiche-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "bw0bguz7y",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "g1n7h5kbt",
      "name": "Bereiche erstellen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bereiche abgeschickt wird",
      "steps": [
        {
          "id": "yw7t7zrhf",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6wksp69xu",
          "type": "api",
          "desc": "POST /api/bereiche aufrufen"
        },
        {
          "id": "kayxy7nwx",
          "type": "database",
          "desc": "Neuen Bereiche-Datensatz in DB speichern"
        },
        {
          "id": "y7knhnnpu",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ncl0nqh8j",
      "name": "Bereiche bearbeiten",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "nlmlwxs03",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "c22ski29f",
          "type": "api",
          "desc": "PATCH /api/bereiche/:id aufrufen"
        },
        {
          "id": "dko3ezvqy",
          "type": "database",
          "desc": "Bereiche-Datensatz in DB aktualisieren"
        },
        {
          "id": "j4uc8yhyq",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ykkm1soz9",
      "name": "Bereiche loeschen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "lp0a02mnu",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "q12t4d0z2",
          "type": "api",
          "desc": "DELETE /api/bereiche/:id aufrufen"
        },
        {
          "id": "b730vu2ly",
          "type": "database",
          "desc": "Bereiche-Datensatz aus DB entfernen"
        },
        {
          "id": "u7cmfprju",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "drs034ksk",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "8idu5r5i8",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "ze96cf155",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "vukb705xf",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "5jku6fz9f",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "nkvzx6yh2",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fcvncf5jf",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "pbrnuu5or",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "70nzpm783",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "v3gstq10c",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "uovroillg",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "gyscpe41d",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "sp5x86auu",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "ldvawcp8v",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "i9pod5def",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "t5ggsf37r",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "5i7elsizl",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "wyv19s2ws",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "cu9508w31",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "3tfstxb7i",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "5optiswyu",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "ej23fnbwz",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "uavah1nq8",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "4jk56xfp0",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "i03z9630n",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "pjrjv4085",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "eghshicbv",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "amm802m33",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "g3i2jrcnx",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "s2zpztbue",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "8szl9d4ve",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "nk4p7krw3",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "r17q8tshv",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "bhnmamdmk",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "s25d13n0f",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "spzb9pdxj",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "yqs2hwvq1",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "uk3smrbuz",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "zd788ne2g",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "6z4gouswi",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "7iwrzw8a6",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "4nh71adlq",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "oarjev1ji",
      "name": "Gaeste abrufen",
      "folder": "Gaeste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste-Seite geladen wird",
      "steps": [
        {
          "id": "9yh7yft8c",
          "type": "api",
          "desc": "GET /api/gaeste aufrufen"
        },
        {
          "id": "8ddcvwnpp",
          "type": "database",
          "desc": "Gaeste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "vjjysmgyn",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "w3s7w3o53",
      "name": "Gaeste erstellen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Gaeste abgeschickt wird",
      "steps": [
        {
          "id": "92tcroine",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "lajw4r3j2",
          "type": "api",
          "desc": "POST /api/gaeste aufrufen"
        },
        {
          "id": "q1j8wo9hu",
          "type": "database",
          "desc": "Neuen Gaeste-Datensatz in DB speichern"
        },
        {
          "id": "u9q7hbbw6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zeqrughpv",
      "name": "Gaeste bearbeiten",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "8ko405g3k",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "04msj0yod",
          "type": "api",
          "desc": "PATCH /api/gaeste/:id aufrufen"
        },
        {
          "id": "heuyyeeyg",
          "type": "database",
          "desc": "Gaeste-Datensatz in DB aktualisieren"
        },
        {
          "id": "9396054z0",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "bfqdbnx5t",
      "name": "Gaeste loeschen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "aegk871uz",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "s2jxq9k53",
          "type": "api",
          "desc": "DELETE /api/gaeste/:id aufrufen"
        },
        {
          "id": "7ospchk7i",
          "type": "database",
          "desc": "Gaeste-Datensatz aus DB entfernen"
        },
        {
          "id": "4ffwnac6y",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "5tlye5ni6",
      "name": "Google-reserve abrufen",
      "folder": "Google-reserve",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Google-reserve-Seite geladen wird",
      "steps": [
        {
          "id": "desost2fi",
          "type": "api",
          "desc": "GET /api/google-reserve aufrufen"
        },
        {
          "id": "t8jzw8fdy",
          "type": "database",
          "desc": "Google-reserve-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "bv2jext10",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "8hd73e1sh",
      "name": "Google-reserve erstellen",
      "folder": "Google-reserve",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Google-reserve abgeschickt wird",
      "steps": [
        {
          "id": "4f3p23d67",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "sl1nrmqn3",
          "type": "api",
          "desc": "POST /api/google-reserve aufrufen"
        },
        {
          "id": "j3h3rmmon",
          "type": "database",
          "desc": "Neuen Google-reserve-Datensatz in DB speichern"
        },
        {
          "id": "gq2g3sppt",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "g42n7nq3n",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "9wrb4vwlg",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "k7qypu1i7",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "jirlpfzdl",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "gvb5ethv0",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "7gke4ld91",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "uetv1pzk7",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "tjixr44kc",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "bj3wg3p5w",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7x5zdrbp3",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "r42lonns2",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "syc79amti",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "914cwcz58",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "rjtq8oe50",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "me4zdlw9m",
      "name": "Oeffnungszeiten abrufen",
      "folder": "Oeffnungszeiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten-Seite geladen wird",
      "steps": [
        {
          "id": "4hy5z7i43",
          "type": "api",
          "desc": "GET /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "ytriyftc1",
          "type": "database",
          "desc": "Oeffnungszeiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "wywzy91go",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "q006baww9",
      "name": "Oeffnungszeiten erstellen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Oeffnungszeiten abgeschickt wird",
      "steps": [
        {
          "id": "2xwfgbgme",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "p2kvy86ht",
          "type": "api",
          "desc": "POST /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "8qf648wq2",
          "type": "database",
          "desc": "Neuen Oeffnungszeiten-Datensatz in DB speichern"
        },
        {
          "id": "vmupdmkny",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ju98442yz",
      "name": "Oeffnungszeiten bearbeiten",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "9sttkjp31",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "y98pwt8g2",
          "type": "api",
          "desc": "PATCH /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "bbrltolxr",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz in DB aktualisieren"
        },
        {
          "id": "trb3ulmjg",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "l6x9ek718",
      "name": "Oeffnungszeiten loeschen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "78be7cyf3",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "rr0iyoolv",
          "type": "api",
          "desc": "DELETE /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "5duoiss7x",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz aus DB entfernen"
        },
        {
          "id": "abskleh7h",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "14a35s5r0",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "uqvaghcop",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "gze80torr",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "6ue4h1h7x",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "c2ur284vy",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "jxkloedpl",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "b9ysbhh1q",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "1tdkq6eo9",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "mcnaxe2h5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "y19uoxdz2",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "lgfhvhav1",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "rxm62kwlz",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "4zeijbgbt",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "o6ipq34um",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "vdxhpwuc8",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "agp0vhwge",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "ms08o1yfr",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "z1e00tb4l",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "f9y8bif2k",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "lk05imkry",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "64dvx1i4s",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "zk8809e79",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "41fry7r40",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "t3y492i87",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "chrhqope5",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "w8r1e4hqk",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "r3t026o6d",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "y8uj20upy",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "prwv9cwjo",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "ckrf8ka3x",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "vr7f9p893",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "78z0kvk7r",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "gog1f0gmd",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "czi4kzivo",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "m2ilb5847",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "aefef33ni",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "mcrt0nb0y",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ccl3s5wu6",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "b1g5b9fl0",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "cijem7oox",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "rtubl48zh",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "8nqbe3d7m",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "5nyqi54z6",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "212imojf9",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "z134xvx9m",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "n5fvbv7k8",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "ep5xqj4oe",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "mflbjnf5c",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "1bcmeuk8n",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "qnjt8hmwq",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "puhb41yxr",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ssobhr46w",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "asyde1amg",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "6dzniolyn",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "kyv474b9m",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9es8emnrc",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "mvqad0gpk",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "lerpcl2kc",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "8v0kpwbio",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "e449om76t",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "2r5268s6s",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "moc2mm4u4",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "dmz0tzswy",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "10r9onmbw",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "q0fgdo4av",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "y1xnueqe0",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "oqtlbh83y",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "o3xnvm07f",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "fuzoiw6qe",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "a1a7md0oo",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ghasw8qlm",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "88agawohh",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "d0qpse1el",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "xgrr5nrhk",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "l165enhkj",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ca46agbis",
      "name": "Verfuegbarkeit abrufen",
      "folder": "Verfuegbarkeit",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Verfuegbarkeit-Seite geladen wird",
      "steps": [
        {
          "id": "2495mgmdy",
          "type": "api",
          "desc": "GET /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "j747l6jji",
          "type": "database",
          "desc": "Verfuegbarkeit-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "657toznue",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "izaumpa13",
      "name": "Verfuegbarkeit erstellen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Verfuegbarkeit abgeschickt wird",
      "steps": [
        {
          "id": "nn2z97s6s",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "cy5do92nc",
          "type": "api",
          "desc": "POST /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "22v5880pc",
          "type": "database",
          "desc": "Neuen Verfuegbarkeit-Datensatz in DB speichern"
        },
        {
          "id": "xi5zu2gme",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "0dff7e69m",
      "name": "Verfuegbarkeit loeschen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "ydusml7r9",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "08zwy1pun",
          "type": "api",
          "desc": "DELETE /api/verfuegbarkeit/:id aufrufen"
        },
        {
          "id": "so65loyn2",
          "type": "database",
          "desc": "Verfuegbarkeit-Datensatz aus DB entfernen"
        },
        {
          "id": "9eu1shdtm",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "yl2w2eo60",
      "name": "Walk-ins abrufen",
      "folder": "Walk-ins",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins-Seite geladen wird",
      "steps": [
        {
          "id": "2eb83e12l",
          "type": "api",
          "desc": "GET /api/walk-ins aufrufen"
        },
        {
          "id": "bhxdl9ic3",
          "type": "database",
          "desc": "Walk-ins-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "v4plp5bwt",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "qkjrgah0p",
      "name": "Walk-ins erstellen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Walk-ins abgeschickt wird",
      "steps": [
        {
          "id": "bur91m5wz",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "dp58jvz7p",
          "type": "api",
          "desc": "POST /api/walk-ins aufrufen"
        },
        {
          "id": "i8dbdiojx",
          "type": "database",
          "desc": "Neuen Walk-ins-Datensatz in DB speichern"
        },
        {
          "id": "c2dy3iskd",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "k3vsshvv2",
      "name": "Walk-ins bearbeiten",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "iaigmwyk9",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "vhdtv4mw3",
          "type": "api",
          "desc": "PATCH /api/walk-ins/:id aufrufen"
        },
        {
          "id": "grz7qeqpg",
          "type": "database",
          "desc": "Walk-ins-Datensatz in DB aktualisieren"
        },
        {
          "id": "prfc75jrd",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "8ejemk3e0",
      "name": "Walk-ins loeschen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "hqwcaa21h",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "tlbmj4hrc",
          "type": "api",
          "desc": "DELETE /api/walk-ins/:id aufrufen"
        },
        {
          "id": "irxb92ju8",
          "type": "database",
          "desc": "Walk-ins-Datensatz aus DB entfernen"
        },
        {
          "id": "n7ishurrd",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "oi8181s0y",
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
      "id": "37353n4gr",
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
      "id": "crcxmvbma",
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
      "id": "rcoh8uukj",
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
      "id": "u8luwr8vn",
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
      "id": "ne0vcn4o3",
      "name": "Dienstplan",
      "desc": "Seite: Dienstplan — Nutzt 6 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Dienstplan",
        "Mitarbeiter",
        "Personalbedarf",
        "AuthStore",
        "Schichttausch",
        "SchichtTemplates"
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
      "id": "2k1zu5pfr",
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
      "id": "3v25syyor",
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
      "id": "xzmytjtl4",
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
      "id": "k7jjqzezg",
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
      "id": "kjvx3irfc",
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
      "id": "f2fzech1t",
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
      "id": "wxv2jhvno",
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
      "id": "j2shyzt3u",
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
      "id": "853lhxzrk",
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
      "id": "1itdo0whx",
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
      "id": "2fw2arpx0",
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
      "id": "n494a0kiq",
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
      "id": "pmr60p4nd",
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
      "id": "vznssyebl",
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
      "id": "mkdyhcepk",
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
      "id": "l7wt74qqs",
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
      "id": "7kxsl9pze",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "ewz2tgjm7",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "stjq4m3fd",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "3h7pz7urh",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "gbgdmhqkr",
      "name": "API: Extras",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Extras",
      "url": "/api/extras"
    },
    {
      "id": "4ml9kircr",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "0tmoz3mo5",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "dd8ibyqql",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "rqvnexigg",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "03v96aqw7",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "dntefinxc",
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
        "Schicht_templates": {
          "read": true,
          "create": true,
          "update": true,
          "delete": true
        },
        "Schicht_template_eintraege": {
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
        "Ausnahmetage": {
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
        "Schicht_templates": {
          "read": true,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schicht_template_eintraege": {
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
        "Ausnahmetage": {
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
        "Schicht_templates": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schicht_template_eintraege": {
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
        "Ausnahmetage": {
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
        "Schicht_templates": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false
        },
        "Schicht_template_eintraege": {
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
        "Ausnahmetage": {
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
      "id": "1j5bf85cg",
      "title": "Abonnement-Verwaltung (Mollie)",
      "desc": "Aus Phase 4 – SaaS-Features",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "tps7jay71",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "pvcnas4jl",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "pq5qdrs21",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "fpr1vmzr6",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "l26nja7sq",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "fyv7dow25",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "cy5l055o8",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "x8u7vd8q5",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "qfpl7cdkw",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "i4grzxt4p",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "oh4wrqx82",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "ti2lef8i2",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "l1spxkb88",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "0tl9p4nrn",
      "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "a4r9v8joo",
      "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "x4z2ayo0l",
      "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "r0lhn5zxt",
      "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "ex03zleon",
      "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "ejts8w2td",
      "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "fc2r2tu9b",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "mukhw8ndz",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "7m730wcxb",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "c8qg5dde4",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    },
    {
      "id": "i0s4zuo4v",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-14"
    }
  ],
  "roadmap": [
    {
      "id": "xvqhfoipg",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "8jgbcjrbb",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "a3ro1fn6z",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "f571qoq78",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "4h3sc9a1k",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "i7fusbxg4",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "58hwa0gzp",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "scqapspek",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "qqov21nt7",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "35cdr5wut",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "d6pf2ztsl",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "zkh0g2epq",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "nfzdh96ol",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "tgpirzte2",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "2g65d0sqd",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "9tdln9q9z",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "abdyw3ujg",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "bxlcf0m04",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "hk5sbn2q9",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "zebohc6dg",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "68unlspxp",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "mxrl4xwp8",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "ev4kzof2b",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "l4sdjdpbe",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "bwz3s1jv9",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "3vzqln50t",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "aeyupec9l",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "97zgvut2q",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "921cmyc9e",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "1473ynfuk",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "23y2vbngl",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "1idp3aanc",
          "title": "Abonnement-Verwaltung (Mollie)",
          "done": false
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "iz961d719",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "vedl648as",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "ro59tgwva",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "8k947ohdx",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "wn97ime41",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "8xc8an2qc",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "9a23frviu",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "onm4asbig",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "ka9h58fqk",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "7cxyomm7p",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "bwc93sr0x",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "6oz6wlrzs",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "gj19shnxy",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "osako9osl",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "kk3ohwcm8",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "y7r3nlqyw",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "d6vejxbi3",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "lq21hhzm6",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "iifoggjqm",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "4vvwnsmp3",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "n9wkcyru8",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "1914vhmen",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "36ttmxq5x",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten)",
          "done": true
        },
        {
          "id": "jcq3c9zlo",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": true
        },
        {
          "id": "n4l99mms9",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": true
        },
        {
          "id": "vwi5k9xf6",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": true
        },
        {
          "id": "1c6z3w0rj",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren)",
          "done": true
        },
        {
          "id": "qvk35to0n",
          "title": "Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io)",
          "done": true
        },
        {
          "id": "o5gc0684e",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": true
        },
        {
          "id": "tns4czrkt",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": true
        },
        {
          "id": "kxz4w6fpl",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": true
        },
        {
          "id": "lvoz614ht",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": true
        },
        {
          "id": "fh9v9cao0",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "dw9qswpb7",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 10,
      "total": 12
    },
    {
      "id": "bp8zw32qt",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "m6jvizp45",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "19uhkkrry",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "yxf4ahscm",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "tte88p170",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "alt7l29s2",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "i9cda561v",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "7x1susts8",
          "title": "QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package)",
          "done": true
        },
        {
          "id": "53igd9yk5",
          "title": "Socket.io Live-Updates bei neuer/geänderter Reservierung",
          "done": true
        },
        {
          "id": "76jp5uzfy",
          "title": "Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit)",
          "done": true
        },
        {
          "id": "tlwptncw1",
          "title": "Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite)",
          "done": true
        },
        {
          "id": "00t5ykw33",
          "title": "**Räumlicher Tischplan / Floor Plan Editor**",
          "done": true
        },
        {
          "id": "oi5hd4jqq",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": true
        },
        {
          "id": "y05hnik9i",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "suanf5y9j",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "gbspa59td",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "wmigmjoy5",
          "title": "Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit)",
          "done": true
        },
        {
          "id": "u0h9ary1q",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
          "done": false
        },
        {
          "id": "qkberdas5",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": true
        },
        {
          "id": "i1auchlhh",
          "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
          "done": false
        },
        {
          "id": "4xrk114x3",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": false
        },
        {
          "id": "xyejv92qv",
          "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
          "done": false
        }
      ],
      "done": 14,
      "total": 21
    },
    {
      "id": "iyn2kuizs",
      "name": "Extras/Modifier-System ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "tht4ztw8k",
          "title": "DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen",
          "done": true
        },
        {
          "id": "h8w0lv6mf",
          "title": "Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading)",
          "done": true
        },
        {
          "id": "kb8hpq841",
          "title": "Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras)",
          "done": true
        },
        {
          "id": "pcnyjjrhk",
          "title": "Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern",
          "done": true
        },
        {
          "id": "0hng15ixf",
          "title": "Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra",
          "done": true
        },
        {
          "id": "1epb9flr2",
          "title": "useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts)",
          "done": true
        },
        {
          "id": "kpz2by23s",
          "title": "GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis",
          "done": true
        },
        {
          "id": "4bnp1awng",
          "title": "Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige",
          "done": true
        },
        {
          "id": "ftsma7d9p",
          "title": "BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt",
          "done": true
        },
        {
          "id": "p2sjlyubo",
          "title": "Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte)",
          "done": true
        },
        {
          "id": "r5o1355fu",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "25k99t8vp",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "ejrrccww0",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "p2z8a334y",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "xrpt2rkyc",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "yyluor5iw",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "3329rlz23",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "caq0hhc1p",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "7wgsib27j",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "gxq6h1xkx",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "vrcwt0n0k",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "a1gi4m1ua",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "p8b2ikmhi",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "6xlleg2gc",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "2c4ah2d5o",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "rupmrrfkg",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "hzsxgp7in",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "djcoy3hnf",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "rog5piubc",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "3k19wg4c4",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "acfniiez1",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "6lde2l96d",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "3lxr8dkly",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "e6q5t4l30",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "8ydeh0z54",
      "name": "Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "gd6u9tcp7",
          "title": "Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3)",
          "done": true
        },
        {
          "id": "jp98wajfd",
          "title": "Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1)",
          "done": true
        },
        {
          "id": "cf5aj69mg",
          "title": "\"Zum Kalender hinzufuegen\" auf Bestaetigungsseite (Google Calendar + iCal-Download)",
          "done": true
        },
        {
          "id": "qexs3mm5i",
          "title": "DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen`",
          "done": true
        },
        {
          "id": "oljuanac0",
          "title": "Backend + Admin-UI + Detailseite erweitert",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "0d9o0hft9",
      "name": "Bekannte Bugs (Bugfix-Session 2026-04-13)",
      "todos": [
        {
          "id": "3h5u3e5o3",
          "title": "🔴 **KRITISCH: DB-Schema `quelle` CHECK fehlt `'google'`** — `schema.sql:219` gefixt: `'google'` zur Constraint hinzugefügt.",
          "done": true
        },
        {
          "id": "88hn7ou1c",
          "title": "🔴 **KRITISCH: Socket.io Room-Namen falsch in `reservierungen.ts`** — `io.to(restaurantId)` → `io.to(\\`restaurant:${restaurantId}\\`)` an 3 Stellen.",
          "done": true
        },
        {
          "id": "p55k7bc4r",
          "title": "🟡 **MITTEL: Socket.io Room-Namen falsch in `walk-ins.ts`** — Gleicher Fix, 3 Stellen.",
          "done": true
        },
        {
          "id": "qwjje0oxf",
          "title": "🔴 **KRITISCH: Registrierung \"Email nicht verifiziert\" obwohl Code bestätigt** — `verifiedTokens` war eine In-Memory Map, die bei Server-Neustart (nodemon) geleert wurde. Fix: Token jetzt als signiertes JWT ausgestellt (`verifTokenErstellen`/`verifTokenPruefen`) → kein Server-State nötig.",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "qo0073iw9",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "z349bypqv",
          "title": "E-Mail-Vorlagen umgestalten — aktuell Standard-Text, muss professionelles ServeFlow-Design bekommen (Bestätigung, Erinnerung, Stornierung, Einladung, Passwort-Reset)",
          "done": false
        },
        {
          "id": "sdfsxqaqd",
          "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
          "done": false
        },
        {
          "id": "hjuok6unq",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "br4dxvmsj",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 0,
      "total": 4
    },
    {
      "id": "5x8ggoj92",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "0bql2e3r7",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "yaepbqay5",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "kq4rhia7j",
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
      "id": "vdfj2xqs7",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "0ljydlwtu",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "twfl2carx",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "8h507r1cs",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "dvplcl7wz",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "j99qjga2c",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "sdduexb80",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "babvyhmjh",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "u6zn59emk",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "a88p8apz5",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "aos0el2yv",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "v9cxqo38c",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "qznd4ewlp",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "v5rw9zbmu",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      },
      {
        "id": "1i7rbw0qg",
        "date": "2026-04-09",
        "title": "Urlaubsverwaltung (Urlaubskonto)"
      },
      {
        "id": "wifehgs0u",
        "date": "2026-04-11",
        "title": "Google Reserve Integration + DSGVO-Check"
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
      "id": "cm9spthzi",
      "text": "Phase 7: Schichttausch-System + Lohn/Personalbedarf im Dienstplan",
      "date": "2026-04-11"
    },
    {
      "id": "523cy19md",
      "text": "Phase 8A Reservierungssystem + Phase 6 Kategorie-Flow + Bugfixes",
      "date": "2026-04-07"
    },
    {
      "id": "6lgnrssxq",
      "text": "Full app update: auth system, dashboard, theme engine, pro order page, and project docs",
      "date": "2026-04-07"
    },
    {
      "id": "aaio91abx",
      "text": "Add dashboard, sync skill, project docs, and restaurant-app codebase",
      "date": "2026-04-04"
    },
    {
      "id": "ur7m6uy15",
      "text": "Initial commit: Restaurant SaaS project",
      "date": "2026-04-04"
    }
  ]
};
