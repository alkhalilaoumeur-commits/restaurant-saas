// AUTO-GENERIERT von sync-dashboard.js — 2026-04-20T20:52:09.643Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "2oys1d39h",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-0fqcs5unj",
      "name": "Restaurants",
      "fields": [
        {
          "id": "bnc6h21oj",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "j0a2xb2pt",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "wbd2yite2",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "03xufp6gf",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "3j29xfs5f",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "4wrrmyqt1",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "lsslvrl1k",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "e75lxz1kf",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "gevn0h5ro",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "nz2hpuvha",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "vqz25zyy7",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "ebidrtizb",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "mvzc9n0nz",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "cbz2vsg54",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "x3k6yms5x",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "pi45n0x04",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "2528tiyuf",
          "name": "max_gaeste_pro_slot",
          "type": "Zahl",
          "description": "max_gaeste_pro_slot",
          "required": false
        },
        {
          "id": "vqwd2v083",
          "name": "reservierung_puffer_min",
          "type": "Zahl",
          "description": "reservierung_puffer_min",
          "required": true
        },
        {
          "id": "b4hlxkxwk",
          "name": "reservierung_vorlauf_tage",
          "type": "Zahl",
          "description": "reservierung_vorlauf_tage",
          "required": true
        },
        {
          "id": "bs7b9mnu6",
          "name": "buchungsintervall_min",
          "type": "Zahl",
          "description": "buchungsintervall_min",
          "required": true
        },
        {
          "id": "6739jarta",
          "name": "tisch_dauer_min",
          "type": "Zahl",
          "description": "tisch_dauer_min",
          "required": true
        },
        {
          "id": "q2039d0re",
          "name": "max_gleichzeitige_reservierungen",
          "type": "Zahl",
          "description": "max_gleichzeitige_reservierungen",
          "required": false
        },
        {
          "id": "bufn2yvhq",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-rgzw13p2v",
      "name": "Bereiche",
      "fields": [
        {
          "id": "86g2op2zm",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "97hbfg9q8",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "4z0g4wqyt",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "1xjty9ekv",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-as4mp9m2d",
      "name": "Kategorien",
      "fields": [
        {
          "id": "9eavey3ph",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "4wc8osru7",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "puedcxxyf",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "ylnzawmnb",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "9xfvor3yx",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "urz8nau1i",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-g1gc7bi0a",
      "name": "Unterkategorien",
      "fields": [
        {
          "id": "2iqzcurho",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "crtuy9cvt",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "66esdo8vj",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "vctgrhb44",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "6rhngy0ch",
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
      "id": "dt-15g5o6t0u",
      "name": "Tische",
      "fields": [
        {
          "id": "yardtnkbk",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "cczi0kuuw",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "dbua6yot3",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "qkxkpsfbn",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "qufsdqjak",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "dwqd75tlf",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "a3b0fzs7w",
          "name": "form",
          "type": "Option Set",
          "description": "Moegliche Werte: rechteck, rund, quadrat, bar",
          "required": true
        },
        {
          "id": "swmbrzfa8",
          "name": "pos_x",
          "type": "Zahl",
          "description": "pos_x",
          "required": true
        },
        {
          "id": "0oe1k9sv0",
          "name": "pos_y",
          "type": "Zahl",
          "description": "pos_y",
          "required": true
        },
        {
          "id": "u2qop1y19",
          "name": "breite",
          "type": "Zahl",
          "description": "breite",
          "required": true
        },
        {
          "id": "oq7ejd8mn",
          "name": "hoehe",
          "type": "Zahl",
          "description": "hoehe",
          "required": true
        },
        {
          "id": "im2huw1z3",
          "name": "rotation",
          "type": "Zahl",
          "description": "rotation",
          "required": true
        },
        {
          "id": "usnpjo4ah",
          "name": "bereich_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bereiche",
          "required": false
        },
        {
          "id": "qqgiffmha",
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
      "id": "dt-jghkrwh6u",
      "name": "Gerichte",
      "fields": [
        {
          "id": "f4ja4wn4r",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "49x6w20u5",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "vi2vfm7v6",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "b93wht58v",
          "name": "unterkategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Unterkategorien",
          "required": false
        },
        {
          "id": "s7goniip2",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "6oypt4yr3",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "lid9m6x9o",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "0yozuov9p",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "6d02a0mqv",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "crrqciqva",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "c2t3ljdyt",
          "name": "modell_3d_url",
          "type": "Text",
          "description": "modell_3d_url",
          "required": false
        },
        {
          "id": "ssf8bl34g",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "0zqq63jlp",
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
      "id": "dt-6p7grkbnv",
      "name": "Extras_gruppen",
      "fields": [
        {
          "id": "y4s9nemsr",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "hrs5zr6yc",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "apzsyx1gr",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "42ek8n6vg",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "oweqhees0",
          "name": "pflicht",
          "type": "Ja/Nein",
          "description": "pflicht",
          "required": true
        },
        {
          "id": "58oi3u9b0",
          "name": "max_auswahl",
          "type": "Zahl",
          "description": "max_auswahl",
          "required": true
        },
        {
          "id": "6yo2qm1tu",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "xs0d1zpfb",
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
      "id": "dt-l6envimzb",
      "name": "Extras",
      "fields": [
        {
          "id": "6a8eojtrc",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "3r1zmty7e",
          "name": "gruppe_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras_gruppen",
          "required": true
        },
        {
          "id": "90a1ash1o",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "3k322toux",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "z8mdpi09z",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        },
        {
          "id": "d4z8wz3vb",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "uy9en6ucx",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "ho1rq8cv2",
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
      "id": "dt-7894724di",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "tylnvdcaj",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "uparkf04d",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "vd9atxxcw",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "0l41pmvrj",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "m7j4hzytu",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "bscmn5zfs",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "f5zutser7",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "q1z2yqmij",
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
      "id": "dt-91juemvr5",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "xnr6jaoeu",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "d721i6yqc",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "jjnpeglk6",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "whxsdblhu",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "36qv0v65c",
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
      "id": "dt-3l3ui7m3u",
      "name": "Bestellposition_extras",
      "fields": [
        {
          "id": "c130uqkah",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "hoe0ictpf",
          "name": "position_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellpositionen",
          "required": true
        },
        {
          "id": "tqh6556wk",
          "name": "extra_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras",
          "required": true
        },
        {
          "id": "udi0ajw3p",
          "name": "extra_name",
          "type": "Text",
          "description": "extra_name",
          "required": true
        },
        {
          "id": "6obppvbxs",
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
      "id": "dt-qc05vfpkj",
      "name": "Gaeste",
      "fields": [
        {
          "id": "4v2m4hgu1",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "1pfog0yy7",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "n70927nh7",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "ozul5lqk7",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "u76y4t862",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "2z0tbs9gb",
          "name": "notizen",
          "type": "Text",
          "description": "notizen",
          "required": false
        },
        {
          "id": "jhwkuns9b",
          "name": "tags",
          "type": "Text",
          "description": "tags",
          "required": true
        },
        {
          "id": "0vdkdub9u",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "rorcg55gw",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        },
        {
          "id": "raxkkx806",
          "name": "loeschen_nach",
          "type": "Datum",
          "description": "loeschen_nach",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-r51yye3j6",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "42x0mqcgp",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "dzz9u3mb5",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "msqinzlx2",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "6uiwfc9b8",
          "name": "tisch_kombiniert_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "y1ev2na4f",
          "name": "gast_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gaeste",
          "required": false
        },
        {
          "id": "18b54k5je",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "exblqdckh",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "q86x4dmvy",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "yxt87lskp",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "9e7i635ct",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "spmt9c965",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert, abgeschlossen, no_show",
          "required": true
        },
        {
          "id": "cnyzgusl6",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "rzdvzjszz",
          "name": "anlass",
          "type": "Text",
          "description": "anlass",
          "required": false
        },
        {
          "id": "ffosnk6we",
          "name": "sitzplatz_wunsch",
          "type": "Text",
          "description": "sitzplatz_wunsch",
          "required": false
        },
        {
          "id": "r59vkyp4l",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon, online, google",
          "required": true
        },
        {
          "id": "malvxk1xs",
          "name": "buchungs_token",
          "type": "Text",
          "description": "buchungs_token",
          "required": false
        },
        {
          "id": "6a4l864e5",
          "name": "dsgvo_einwilligung",
          "type": "Ja/Nein",
          "description": "dsgvo_einwilligung",
          "required": true
        },
        {
          "id": "jdqgquyge",
          "name": "erinnerung_gesendet",
          "type": "Text",
          "description": "erinnerung_gesendet",
          "required": true
        },
        {
          "id": "d64b10zn9",
          "name": "verweilzeit_min",
          "type": "Zahl",
          "description": "verweilzeit_min",
          "required": true
        },
        {
          "id": "a4obdmt3v",
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
      "id": "dt-ru4qb6c7a",
      "name": "Walk_ins",
      "fields": [
        {
          "id": "yyikaniah",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "b2jonrf81",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "ysty5fq64",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "xq97za1lm",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "94g667jmh",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "wmbgscevl",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: wartend, platziert, abgegangen",
          "required": true
        },
        {
          "id": "8xg4ptsvk",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "zkhf5bz7s",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "f7xs2o8u5",
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
      "id": "dt-ehtg8q5vv",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "1nl9typeh",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "o6d84bvsx",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "1my63nrs0",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "o79rkkrzq",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "vmu84oby6",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "st81zp55x",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "3nqd3mk0h",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "otmzxqole",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "os5kpiud1",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "7evj52clw",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "yd2mybf92",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "mmu8jshme",
          "name": "stundenlohn",
          "type": "Text",
          "description": "stundenlohn",
          "required": false
        },
        {
          "id": "bodevjynb",
          "name": "urlaubsanspruch_tage",
          "type": "Zahl",
          "description": "urlaubsanspruch_tage",
          "required": false
        },
        {
          "id": "5cmjqfy9j",
          "name": "foto_url",
          "type": "Text",
          "description": "foto_url",
          "required": false
        },
        {
          "id": "6mti5r2sb",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-l9h05jz0u",
      "name": "Schichten",
      "fields": [
        {
          "id": "7gyu1zrsh",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "dzq65fhil",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "uv9eh0218",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "cr4y40aa2",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "ct5puxs13",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "6jrs9riof",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "t4u6gni41",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "fdh655ftf",
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
      "id": "dt-asmftaig6",
      "name": "Abwesenheiten",
      "fields": [
        {
          "id": "mipp43nqx",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "8izw5lfiw",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "jb7g0qo62",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "u0ilhwfb2",
          "name": "von_datum",
          "type": "Datum",
          "description": "von_datum",
          "required": true
        },
        {
          "id": "8ve758d4s",
          "name": "bis_datum",
          "type": "Datum",
          "description": "bis_datum",
          "required": true
        },
        {
          "id": "1na5qmg5s",
          "name": "typ",
          "type": "Option Set",
          "description": "Moegliche Werte: urlaub, krank, sonstiges",
          "required": true
        },
        {
          "id": "mo6nn3zwj",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "6ohvsc56l",
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
      "id": "dt-1wwbkfswl",
      "name": "Schichttausch",
      "fields": [
        {
          "id": "c7excha5f",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "ypknq0jfg",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "qhd4zdm4n",
          "name": "anbieter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "hcrevcaco",
          "name": "anbieter_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": true
        },
        {
          "id": "nimotgsdu",
          "name": "annehmer_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": false
        },
        {
          "id": "gijuszb9x",
          "name": "annehmer_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": false
        },
        {
          "id": "on8sf76tx",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, angeboten, genehmigt, abgelehnt",
          "required": true
        },
        {
          "id": "wqmh8qrcc",
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
      "id": "dt-slfawq4pv",
      "name": "Schicht_templates",
      "fields": [
        {
          "id": "kjf4boeih",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "91gzxd461",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "z7lbb1g7m",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "wvct0cwjs",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-wxwmk2cwx",
      "name": "Schicht_template_eintraege",
      "fields": [
        {
          "id": "pkmatakvz",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "dukslvkhe",
          "name": "template_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schicht_templates",
          "required": true
        },
        {
          "id": "88l849vyd",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "btil76fxe",
          "name": "wochentag",
          "type": "Text",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "qsupwz7dy",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "39vvbbnok",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "kei1hh9pk",
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
      "id": "dt-4zb0ru3in",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "1oz7mk6ki",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "56ifs5ppg",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "vjahuemmh",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "vvb9w1lga",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "6n7t3t3jv",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "fetix6l2m",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-8dzu886ix",
      "name": "Ausnahmetage",
      "fields": [
        {
          "id": "rdz14u6jn",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "a3wmnu74c",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "0na6qg7sk",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "s53sldlra",
          "name": "grund",
          "type": "Text",
          "description": "grund",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-7450mhar7",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "z34fcmh6i",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "qmr6qlwpo",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "ui8nnfy7d",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "keaebl51f",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "3lrn5bx08",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "8hk7sf1gc",
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
      "id": "dt-z59febpnf",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "0r1pjmhi9",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "eggb0vag6",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "2f3olxy60",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "bhg4s1c79",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "1tnsu6mj1",
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
      "id": "cucytql9p",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "jz8b7f03i",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "ud7psi7eg",
      "name": "Tische_Form",
      "values": [
        "rechteck, rund, quadrat, bar"
      ]
    },
    {
      "id": "ls5xre31x",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "cf6b85403",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert, abgeschlossen, no_show"
      ]
    },
    {
      "id": "xs2quea57",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon, online, google"
      ]
    },
    {
      "id": "w4kfn9yw8",
      "name": "Walk_ins_Status",
      "values": [
        "wartend, platziert, abgegangen"
      ]
    },
    {
      "id": "fktisk3sd",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    },
    {
      "id": "cetggs657",
      "name": "Abwesenheiten_Typ",
      "values": [
        "urlaub, krank, sonstiges"
      ]
    },
    {
      "id": "c1bvbe5i2",
      "name": "Schichttausch_Status",
      "values": [
        "offen, angeboten, genehmigt, abgelehnt"
      ]
    }
  ],
  "workflows": [
    {
      "id": "uc13gco5y",
      "name": "Abo abrufen",
      "folder": "Abo",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abo-Seite geladen wird",
      "steps": [
        {
          "id": "v50nm0nkf",
          "type": "api",
          "desc": "GET /api/abo aufrufen"
        },
        {
          "id": "1ob8regva",
          "type": "database",
          "desc": "Abo-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "hyyuf91pi",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ajql4gklk",
      "name": "Abo erstellen",
      "folder": "Abo",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abo abgeschickt wird",
      "steps": [
        {
          "id": "zs4onklcs",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "ye64ipuoj",
          "type": "api",
          "desc": "POST /api/abo aufrufen"
        },
        {
          "id": "gv5msn1xx",
          "type": "database",
          "desc": "Neuen Abo-Datensatz in DB speichern"
        },
        {
          "id": "l5eart0yt",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "apqhkrd5m",
      "name": "Abwesenheiten abrufen",
      "folder": "Abwesenheiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abwesenheiten-Seite geladen wird",
      "steps": [
        {
          "id": "2avcw53hn",
          "type": "api",
          "desc": "GET /api/abwesenheiten aufrufen"
        },
        {
          "id": "7y7zuvqdo",
          "type": "database",
          "desc": "Abwesenheiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4pkmh6a88",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "k3a5rdaku",
      "name": "Abwesenheiten erstellen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abwesenheiten abgeschickt wird",
      "steps": [
        {
          "id": "v50ap6a98",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "txca33ee6",
          "type": "api",
          "desc": "POST /api/abwesenheiten aufrufen"
        },
        {
          "id": "sgjzz3eml",
          "type": "database",
          "desc": "Neuen Abwesenheiten-Datensatz in DB speichern"
        },
        {
          "id": "aj7q6acj9",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "5qh8wro0o",
      "name": "Abwesenheiten loeschen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "130yex6cu",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "iv7rk7ar0",
          "type": "api",
          "desc": "DELETE /api/abwesenheiten/:id aufrufen"
        },
        {
          "id": "6o6k0mwso",
          "type": "database",
          "desc": "Abwesenheiten-Datensatz aus DB entfernen"
        },
        {
          "id": "ppn1gise8",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "xu562s4pf",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "ik02sioh0",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "2c7hyu2sl",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "3z80gpr3c",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "0303lkbcq",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "18r5fmmun",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6jll7o586",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "nfvz1ancp",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "gjktz08mb",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "55tp7w11c",
      "name": "Bereiche abrufen",
      "folder": "Bereiche",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche-Seite geladen wird",
      "steps": [
        {
          "id": "tqqathsj7",
          "type": "api",
          "desc": "GET /api/bereiche aufrufen"
        },
        {
          "id": "v8xarlsee",
          "type": "database",
          "desc": "Bereiche-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "cut1d5lgh",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "wkca4dhut",
      "name": "Bereiche erstellen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bereiche abgeschickt wird",
      "steps": [
        {
          "id": "jzayv8qxu",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "j0zafwetz",
          "type": "api",
          "desc": "POST /api/bereiche aufrufen"
        },
        {
          "id": "ssru19jdr",
          "type": "database",
          "desc": "Neuen Bereiche-Datensatz in DB speichern"
        },
        {
          "id": "yekm7f9qs",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "42031lm36",
      "name": "Bereiche bearbeiten",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "5pyit1h36",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "k6up0aabl",
          "type": "api",
          "desc": "PATCH /api/bereiche/:id aufrufen"
        },
        {
          "id": "z2z8eliv6",
          "type": "database",
          "desc": "Bereiche-Datensatz in DB aktualisieren"
        },
        {
          "id": "c1hb242io",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "cw64vu6ik",
      "name": "Bereiche loeschen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "nvv60rkq1",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "5y5bztw2y",
          "type": "api",
          "desc": "DELETE /api/bereiche/:id aufrufen"
        },
        {
          "id": "cgnpzla5f",
          "type": "database",
          "desc": "Bereiche-Datensatz aus DB entfernen"
        },
        {
          "id": "fyfth6j7p",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "j13mkfqmb",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "g2aheolva",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "gyd3p3ntd",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "slo4ndyil",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "nhx5itsjd",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "xwehmbgln",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "tekynya1g",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "rf5hbq8cx",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "ou0lqjpez",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "4nbjucb8o",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "vm5x6bwdt",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "wpr3zjtuo",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "zr7l57r0r",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "b3fk4onwc",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "8a442iuc1",
      "name": "Bewertungen abrufen",
      "folder": "Bewertungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bewertungen-Seite geladen wird",
      "steps": [
        {
          "id": "ngjxvflv5",
          "type": "api",
          "desc": "GET /api/bewertungen aufrufen"
        },
        {
          "id": "u8hax6ofd",
          "type": "database",
          "desc": "Bewertungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "pshhckc2r",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9e9w3cg6g",
      "name": "Bewertungen erstellen",
      "folder": "Bewertungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bewertungen abgeschickt wird",
      "steps": [
        {
          "id": "2vle03pjw",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "f2oubaece",
          "type": "api",
          "desc": "POST /api/bewertungen aufrufen"
        },
        {
          "id": "drni4th1x",
          "type": "database",
          "desc": "Neuen Bewertungen-Datensatz in DB speichern"
        },
        {
          "id": "pa5gc76iz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "kcj0eq829",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "0e6dqzkfc",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "kvzbeb2x0",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "dngkdhcnz",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "zuqgpo666",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "wl57wvqkb",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "dt1o1jvua",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "4ngv4e0am",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "yowyzfck6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "tq2h5nvuq",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "9775eflv6",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "4842ggvqt",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "9gdqyumgg",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "na341rmn5",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "yqxvjsj5k",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "oofg8nr82",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "il2aymq32",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "rhf0fumd5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "sg71t11ra",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "bsx36qqpx",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "2il0bcasr",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "4keslmzsj",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "99bhb51fy",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "h4ttnkkkw",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "j0jo64rhx",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "dkf1np4gh",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "acr907u8g",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "vgkj3p2k8",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "8n8qhi263",
      "name": "Erlebnisse abrufen",
      "folder": "Erlebnisse",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Erlebnisse-Seite geladen wird",
      "steps": [
        {
          "id": "kso4ua7kt",
          "type": "api",
          "desc": "GET /api/erlebnisse aufrufen"
        },
        {
          "id": "pd1j8on4n",
          "type": "database",
          "desc": "Erlebnisse-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "vui88h27o",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "h6htwmwgx",
      "name": "Erlebnisse erstellen",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Erlebnisse abgeschickt wird",
      "steps": [
        {
          "id": "mfwycx6wz",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "vqmlex3kc",
          "type": "api",
          "desc": "POST /api/erlebnisse aufrufen"
        },
        {
          "id": "4g3aoq1t6",
          "type": "database",
          "desc": "Neuen Erlebnisse-Datensatz in DB speichern"
        },
        {
          "id": "hribosrng",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "65ypibuqg",
      "name": "Erlebnisse bearbeiten",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Erlebnisse bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "0id2b4b12",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "p3ztikz0c",
          "type": "api",
          "desc": "PATCH /api/erlebnisse/:id aufrufen"
        },
        {
          "id": "xde0dkif5",
          "type": "database",
          "desc": "Erlebnisse-Datensatz in DB aktualisieren"
        },
        {
          "id": "oh7vhotl6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "u43eroeh7",
      "name": "Erlebnisse loeschen",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "ozkghckmp",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "2j6hz12ge",
          "type": "api",
          "desc": "DELETE /api/erlebnisse/:id aufrufen"
        },
        {
          "id": "u5l9bwcbm",
          "type": "database",
          "desc": "Erlebnisse-Datensatz aus DB entfernen"
        },
        {
          "id": "8m8g2n726",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "9ks3wuwow",
      "name": "Gaeste abrufen",
      "folder": "Gaeste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste-Seite geladen wird",
      "steps": [
        {
          "id": "e7ga85lyt",
          "type": "api",
          "desc": "GET /api/gaeste aufrufen"
        },
        {
          "id": "6jqm75yzw",
          "type": "database",
          "desc": "Gaeste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "54yr97wlr",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "34aiyo41e",
      "name": "Gaeste erstellen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Gaeste abgeschickt wird",
      "steps": [
        {
          "id": "rbnxfspvo",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "a99evrhhb",
          "type": "api",
          "desc": "POST /api/gaeste aufrufen"
        },
        {
          "id": "wiuaqkwyz",
          "type": "database",
          "desc": "Neuen Gaeste-Datensatz in DB speichern"
        },
        {
          "id": "f7znrkwb1",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "a6g1soj0z",
      "name": "Gaeste bearbeiten",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "pe5gydplt",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "41y1b2t7p",
          "type": "api",
          "desc": "PATCH /api/gaeste/:id aufrufen"
        },
        {
          "id": "2ggy9jlqa",
          "type": "database",
          "desc": "Gaeste-Datensatz in DB aktualisieren"
        },
        {
          "id": "zf0pboyoe",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "u6qdr6ogp",
      "name": "Gaeste loeschen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "dycprjl6v",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "8voee20h6",
          "type": "api",
          "desc": "DELETE /api/gaeste/:id aufrufen"
        },
        {
          "id": "0vi4ipvuo",
          "type": "database",
          "desc": "Gaeste-Datensatz aus DB entfernen"
        },
        {
          "id": "gxbrpz14n",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "uytwi8ben",
      "name": "Google-reserve abrufen",
      "folder": "Google-reserve",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Google-reserve-Seite geladen wird",
      "steps": [
        {
          "id": "ejd1ysg3t",
          "type": "api",
          "desc": "GET /api/google-reserve aufrufen"
        },
        {
          "id": "iaxam3v6q",
          "type": "database",
          "desc": "Google-reserve-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "rj6yvw4ft",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "nrimbdgfx",
      "name": "Google-reserve erstellen",
      "folder": "Google-reserve",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Google-reserve abgeschickt wird",
      "steps": [
        {
          "id": "yw2pk0ejd",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "c22mqs2cq",
          "type": "api",
          "desc": "POST /api/google-reserve aufrufen"
        },
        {
          "id": "py7dbtayy",
          "type": "database",
          "desc": "Neuen Google-reserve-Datensatz in DB speichern"
        },
        {
          "id": "4hhwnkyi5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "gzxpuya7u",
      "name": "Inventur abrufen",
      "folder": "Inventur",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Inventur-Seite geladen wird",
      "steps": [
        {
          "id": "i5r1l44xq",
          "type": "api",
          "desc": "GET /api/inventur aufrufen"
        },
        {
          "id": "zwnu4jex9",
          "type": "database",
          "desc": "Inventur-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "oew82kot7",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "5r66xab5f",
      "name": "Inventur erstellen",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Inventur abgeschickt wird",
      "steps": [
        {
          "id": "jec26oy0a",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "5e0dwa47g",
          "type": "api",
          "desc": "POST /api/inventur aufrufen"
        },
        {
          "id": "3jcfoqe76",
          "type": "database",
          "desc": "Neuen Inventur-Datensatz in DB speichern"
        },
        {
          "id": "7zv9si5sp",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ank0qk9td",
      "name": "Inventur bearbeiten",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Inventur bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "cs0rgiewd",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "589ug1bzh",
          "type": "api",
          "desc": "PATCH /api/inventur/:id aufrufen"
        },
        {
          "id": "368xhcqis",
          "type": "database",
          "desc": "Inventur-Datensatz in DB aktualisieren"
        },
        {
          "id": "9srkxuy18",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ide3qllnt",
      "name": "Inventur loeschen",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "6o9weccs8",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "hf0ohy494",
          "type": "api",
          "desc": "DELETE /api/inventur/:id aufrufen"
        },
        {
          "id": "nc0yvo2ay",
          "type": "database",
          "desc": "Inventur-Datensatz aus DB entfernen"
        },
        {
          "id": "wcv3cwa11",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "e7yirwq02",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "r2af766be",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "4xdjkwqsq",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ii17mwcts",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "qvh8eyw0r",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "av1ghf063",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "tiu8m0bz8",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "m7w30xkta",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "pj4g3rnoo",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "cre9lmy5s",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "occb84gtf",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "soyaqqvvu",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "p3n3ue0dl",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "pes5bk44q",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "fqlew1ang",
      "name": "Oeffnungszeiten abrufen",
      "folder": "Oeffnungszeiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten-Seite geladen wird",
      "steps": [
        {
          "id": "vsm4rdtir",
          "type": "api",
          "desc": "GET /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "cak22hlg8",
          "type": "database",
          "desc": "Oeffnungszeiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "5fsjb7dcu",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "o3ed9tetp",
      "name": "Oeffnungszeiten erstellen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Oeffnungszeiten abgeschickt wird",
      "steps": [
        {
          "id": "3z4fx64q2",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "b69w0dhpt",
          "type": "api",
          "desc": "POST /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "zokctliy4",
          "type": "database",
          "desc": "Neuen Oeffnungszeiten-Datensatz in DB speichern"
        },
        {
          "id": "ngnhgukni",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "s9bfcuq2a",
      "name": "Oeffnungszeiten bearbeiten",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "uwrh3l60l",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "nr4k3y27u",
          "type": "api",
          "desc": "PATCH /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "nqi00oaym",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz in DB aktualisieren"
        },
        {
          "id": "2zi95us55",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "m40ml4m7y",
      "name": "Oeffnungszeiten loeschen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "4xp3vn9fu",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "jgfc9uto9",
          "type": "api",
          "desc": "DELETE /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "6c65tsmck",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz aus DB entfernen"
        },
        {
          "id": "fcuooeynk",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "6pbh12a2q",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "ipzur6kfb",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "1gc4mlwue",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "l0zn4uvqv",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "j02ocm3d3",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "rh0e11wwa",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "0or88jvfd",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "tcsld3xu9",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "69uvxqtd4",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "x7d0upccb",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "yih1jdm4v",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "34ppkhwpv",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "2nttnwl94",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "tf8evmz9p",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ppb6fzlgc",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "x67hbeprb",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "zmbax4f3c",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "kkmmwgwxs",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "ygkpay763",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "orra2qf9c",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "auspg20v6",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "civnla95b",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "2mf8fc9bt",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9h3m03ryh",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "ia0plx2ob",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "0z0xr2mu3",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "hb6tj3om0",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "b6bmbqnj6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "m6ujmr5wf",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "w380v4n97",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "zh1jle9s7",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "zd8rppvob",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "yky4rjpoe",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "9y66emu87",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fgdf1fk26",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "ywury19rj",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "hpxcuxwjf",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "5nraz4p8m",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "tsmpssjg5",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "t6c2jnp1g",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "l8ditfpxe",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "t6quf6yua",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "0sd3qe0kt",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "wgpm69c5y",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "pd3gyt9lq",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "sc0ii7e3e",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "yerk8vb0d",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "xdovpive6",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "qu4vyiihy",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "7d63oqbwe",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "e7kvktbzc",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9sqk0tnsz",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "25mmwqxm3",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "nwpk3ljb2",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "jt0w2wy89",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "todg9id8z",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "c9aigf38v",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "euo1bosd6",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "g0jmewwo5",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "pi097n70j",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "d9lxges89",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "hrxnbsbbt",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "mbc5lz0ir",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "uimb4mum2",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "7m97ryah6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "tod4i7kuk",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "p56jecaqe",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "jpf863r5z",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "wxmm8dpoe",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "b2lt32d1c",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7mzroi5cr",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "cxkz6l0kb",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "72pddttwi",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "5im8kmggr",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "phfo7kiex",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "674xbatq7",
      "name": "Verfuegbarkeit abrufen",
      "folder": "Verfuegbarkeit",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Verfuegbarkeit-Seite geladen wird",
      "steps": [
        {
          "id": "veqgokosj",
          "type": "api",
          "desc": "GET /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "hdasiwtuy",
          "type": "database",
          "desc": "Verfuegbarkeit-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "jp0909p52",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "s921ws9hl",
      "name": "Verfuegbarkeit erstellen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Verfuegbarkeit abgeschickt wird",
      "steps": [
        {
          "id": "s309pyf3k",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "sgf6zb15n",
          "type": "api",
          "desc": "POST /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "xxoi5uzn2",
          "type": "database",
          "desc": "Neuen Verfuegbarkeit-Datensatz in DB speichern"
        },
        {
          "id": "usjkrlcpz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "pcy7lz2dp",
      "name": "Verfuegbarkeit loeschen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "mfpsg7osz",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "dtle06fkk",
          "type": "api",
          "desc": "DELETE /api/verfuegbarkeit/:id aufrufen"
        },
        {
          "id": "7cjnngubf",
          "type": "database",
          "desc": "Verfuegbarkeit-Datensatz aus DB entfernen"
        },
        {
          "id": "4282srbg9",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "x17014aqe",
      "name": "Walk-ins abrufen",
      "folder": "Walk-ins",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins-Seite geladen wird",
      "steps": [
        {
          "id": "xvc6qwa77",
          "type": "api",
          "desc": "GET /api/walk-ins aufrufen"
        },
        {
          "id": "2cfi812hh",
          "type": "database",
          "desc": "Walk-ins-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "k7hww30fx",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ujdmuiyb4",
      "name": "Walk-ins erstellen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Walk-ins abgeschickt wird",
      "steps": [
        {
          "id": "929xcecwx",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "7tb4qfjju",
          "type": "api",
          "desc": "POST /api/walk-ins aufrufen"
        },
        {
          "id": "ya0japzyk",
          "type": "database",
          "desc": "Neuen Walk-ins-Datensatz in DB speichern"
        },
        {
          "id": "4eqq7jh04",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "fmka0mng1",
      "name": "Walk-ins bearbeiten",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "fw23e6y1p",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "3lizc6zu9",
          "type": "api",
          "desc": "PATCH /api/walk-ins/:id aufrufen"
        },
        {
          "id": "4f7p7wsl2",
          "type": "database",
          "desc": "Walk-ins-Datensatz in DB aktualisieren"
        },
        {
          "id": "uc26nqwxr",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "5ij6zlscl",
      "name": "Walk-ins loeschen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "hibngywt3",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "6ukwbf80g",
          "type": "api",
          "desc": "DELETE /api/walk-ins/:id aufrufen"
        },
        {
          "id": "0kqldci68",
          "type": "database",
          "desc": "Walk-ins-Datensatz aus DB entfernen"
        },
        {
          "id": "60czomvcj",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "cwvqtm7b9",
      "name": "Warteliste abrufen",
      "folder": "Warteliste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Warteliste-Seite geladen wird",
      "steps": [
        {
          "id": "u5lgdkl8g",
          "type": "api",
          "desc": "GET /api/warteliste aufrufen"
        },
        {
          "id": "mukv0wmxd",
          "type": "database",
          "desc": "Warteliste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "yx8ruwkz2",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9id7o14uh",
      "name": "Warteliste erstellen",
      "folder": "Warteliste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Warteliste abgeschickt wird",
      "steps": [
        {
          "id": "iv6ou083s",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "cefi306rq",
          "type": "api",
          "desc": "POST /api/warteliste aufrufen"
        },
        {
          "id": "5r18f5ayo",
          "type": "database",
          "desc": "Neuen Warteliste-Datensatz in DB speichern"
        },
        {
          "id": "ku1g4tlfc",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "q0j3ygan6",
      "name": "Warteliste bearbeiten",
      "folder": "Warteliste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Warteliste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "extbldz3r",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "78l1ha6kq",
          "type": "api",
          "desc": "PATCH /api/warteliste/:id aufrufen"
        },
        {
          "id": "g8fmx0rjt",
          "type": "database",
          "desc": "Warteliste-Datensatz in DB aktualisieren"
        },
        {
          "id": "c6x1e9laq",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "w6smt0lfr",
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
      "id": "e1frjtdzj",
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
      "id": "uvlfq1189",
      "name": "BestellenQR",
      "desc": "Seite: BestellenQR — Nutzt 3 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte",
        "RestaurantDesign",
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
      "id": "ceia1qrcs",
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
      "id": "jfmshbeya",
      "name": "Bewertung",
      "desc": "Seite: Bewertung — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "eyt0xkjk2",
      "name": "Bewertungen",
      "desc": "Seite: Bewertungen — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Bewertungen"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "wyxr6s5ql",
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
      "id": "0lje6qkmv",
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
      "id": "7iq83p9v0",
      "name": "Dienstplan",
      "desc": "Seite: Dienstplan — Nutzt 7 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore",
        "Plan",
        "Dienstplan",
        "Mitarbeiter",
        "Personalbedarf",
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
      "id": "ps8qcd52n",
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
      "id": "lud2vauzm",
      "name": "Einstellungen",
      "desc": "Seite: Einstellungen — Nutzt 4 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Abo",
        "Restaurant",
        "ThemeStore",
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
      "id": "wyn2wh1px",
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
      "id": "uavbooqmr",
      "name": "ErlebnisBestaetigung",
      "desc": "Seite: ErlebnisBestaetigung — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "15duc1hom",
      "name": "ErlebnisDetail",
      "desc": "Seite: ErlebnisDetail — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "SearchParams"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "zi98hot8g",
      "name": "Erlebnisse",
      "desc": "Seite: Erlebnisse — Nutzt 3 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Plan",
        "Erlebnisse",
        "Restaurant"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "ropey94ba",
      "name": "Gaeste",
      "desc": "Seite: Gaeste — Nutzt 3 Hooks, 16 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Plan",
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
      "id": "4ufrlo4wm",
      "name": "Inventur",
      "desc": "Seite: Inventur — Nutzt 6 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Plan",
        "Artikel",
        "Lieferanten",
        "Bewegungen",
        "InventurAuswertung",
        "Vorschlaege"
      ],
      "reusables": [],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "sxl4y8t8t",
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
      "id": "47qylrzow",
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
      "id": "pijk51ceq",
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
      "id": "lvo0e82ni",
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
      "id": "hd0j2gx4w",
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
      "id": "6cuivh2ht",
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
      "id": "p4j7ymg7t",
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
      "id": "g8mbxvsk0",
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
      "id": "utgkcm6db",
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
      "id": "pdojryqta",
      "name": "Speisekarte",
      "desc": "Seite: Speisekarte — Nutzt 1 Hooks, 5 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Speisekarte"
      ],
      "reusables": [
        "ExtrasVerwaltung",
        "GerichtFormular",
        "GerichtKarte",
        "KategorieVerwaltung",
        "RezepturVerwaltung"
      ],
      "responsive": {
        "desktop": true,
        "tablet": true,
        "mobile": false
      }
    },
    {
      "id": "b5vwo9asb",
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
      "id": "6t2f6i7t9",
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
    },
    {
      "id": "w85zkgray",
      "name": "Warteliste",
      "desc": "Seite: Warteliste — Nutzt 1 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Warteliste"
      ],
      "reusables": [],
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
      "id": "hjftwfn8e",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "tzbhqfrov",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "s15ge44kj",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "chxdj2dkd",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "sxumrmfzw",
      "name": "API: Extras",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Extras",
      "url": "/api/extras"
    },
    {
      "id": "qdnmdix79",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "u9pds17mh",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "biu20uqr2",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "nzj7opcbj",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "zynzgcnzj",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "8u4j3ixf2",
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
      "id": "4hpxg8yp7",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "4t0tgqxt3",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "u0nmvswfg",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "pe2259lhq",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "3doz6cqfv",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "tpvfreuxu",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "guew31m5j",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "scbzsi9ny",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "fto1gzzpa",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "xg2bglbfo",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "7ndlzfsel",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "39x1dieol",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "c6do2vne6",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "0csc1tkd0",
      "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "0s2pisv06",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "40e62ukzn",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "kivzycg2r",
      "title": "Stripe: 3 Produkte + Preise anlegen (29€, 59€, 99€) im Stripe-Dashboard (manuell)",
      "desc": "Aus Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "ud9nvhvpa",
      "title": "Backend: Mitarbeiter-Limit pro Plan API-seitig durchsetzen (Basis: 3, Standard: 10)",
      "desc": "Aus Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "44qad5rnc",
      "title": "**Voraussetzung:** Developer Token bei ready2order beantragen (ready2order.com/en/api/)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "k00mpjihf",
      "title": "**Voraussetzung:** ISV-Partner-Antrag bei orderbird stellen (orderbird.com/en/isv-partner-request) + Email an development@orderbird.com",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "loxb4di7z",
      "title": "**Voraussetzung:** Lightspeed Developer Portal registrieren (developers.lightspeedhq.com)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "ti6htjsai",
      "title": "OAuth-Flow für ready2order implementieren (3-Stufen: Developer Token → Grant Token → Account Token)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "kx5shxur1",
      "title": "Adapter korrekt nach echten API-Docs bauen (orderbird, ready2order, Lightspeed)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "p2vpgjvqh",
      "title": "Rückrichtung: Zahlungen von Kasse → ServeFlow Status auf 'bezahlt' setzen (Webhooks)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "hnawqo2yu",
      "title": "Menü-Sync: Speisekarte aus KSS importieren",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "03z3jq96d",
      "title": "Custom-Integration als Paid Service (299€ einmalig für andere Systeme mit API)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "k11un96r2",
      "title": "Persistent Retry-Queue (DB-basiert, überlebt Server-Neustart)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "olbptm6hx",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "1pn0rgh8b",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "2au352nj3",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "qv39r53md",
      "title": "Trinkgeld-System — Gäste können bei Zahlung digital Trinkgeld geben (%, feste Beträge)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "k0a0hg2ik",
      "title": "Split-Bill — Rechnung auf mehrere Personen aufteilen",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "9km71rsro",
      "title": "Prepayment bei Reservierung — Anzahlung für große Gruppen (ab 6 Personen) direkt bei Buchung",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "l331tziqb",
      "title": "Bon-Drucker-Anbindung — ESC/POS-Protokoll für Küchenbons (Star, Epson)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "4uop8bxbs",
      "title": "Tagesangebote / Happy Hour — zeitgesteuerte Rabatte auf der Bestellseite",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "nuxkb8a5s",
      "title": "Kassenbuch-Export — Tagesabschluss als PDF/CSV für Steuerberater",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "3qd7b0yrr",
      "title": "Personalkosten vs. Umsatz Ratio — live im Dashboard (Ziel: unter 30%)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "05j2h5v4h",
      "title": "Gerichtanalyse — welche Gerichte werden zusammen bestellt (Cross-Sell-Hinweise)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "f7bq23zud",
      "title": "Auslastungs-Heatmap — wann ist das Restaurant voll (nach Wochentag/Stunde)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "mo2yrszw5",
      "title": "Digitale Speisekarte ohne Bestellfunktion — reiner Anzeige-Modus",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "fxssa64nt",
      "title": "Allergen-Filter auf Bestellseite — Gäste filtern nach Laktose/Gluten etc.",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "g6fxhtolo",
      "title": "Geburtstagsautomatisierung — Email/SMS am Geburtstag mit Rabattcode",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "frpvlgo4x",
      "title": "Loyalty-Punkte — digitale Stempelkarte (10 Besuche → 1 gratis)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "znzk4i3fg",
      "title": "Gast-Feedback nach Besuch — automatische Email 2h nach Abreise",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "yfkfrz72b",
      "title": "Küchen-Display-System (KDS) — separater Bildschirm für Küche statt Bon-Drucker",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "y3ey3lmcd",
      "title": "Inventur-Warnschwellen — Push wenn Bestand unter X fällt (Echtzeit)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "r0lllcoob",
      "title": "Tischstatus-Timeline — wann bestellt, wann geliefert, wann bezahlt",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "aoora4y74",
      "title": "Öffnungszeiten-Ausnahmen — Feiertage, Betriebsurlaub automatisch sperren",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "87vsl3qtt",
      "title": "DATEV-Export — Buchhaltungsdaten für deutschen Steuerberater",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "scac02vkr",
      "title": "Meta/Google Ads Conversion-Tracking — Reservierungen als Events",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    },
    {
      "id": "2hnph97k2",
      "title": "Zapier/Make-Webhook — für externe Automatisierungen",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-20"
    }
  ],
  "roadmap": [
    {
      "id": "xozi3cjsk",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "i6a7nbnej",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "psc0berwk",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "5fjfahcxe",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "aho07u702",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "94p83tlea",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "eyryf4eru",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "taq3x1h6e",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "z1ea9sfl8",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "wl0ds8pzp",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "1ao31aj0v",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "vrucee15v",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "29sxrp873",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "ei93wrc9w",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "hbqixymjo",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "m80y4f7my",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "oeq7inwnm",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "wgwqztvs2",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "py9gtuu9q",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "90sd6bcf7",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "0js23wiee",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "ak8z10bdv",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "vetm2nvi5",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "fmmxma5cj",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "i449ghlek",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "1r74k0lco",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "gez0fo0b4",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "h1xespajb",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "hgwedbasq",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "kt9njg4ku",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "sgr1xnz3d",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "nrpttiglh",
          "title": "Abonnement-Verwaltung (Mollie) — Option B (Einzelzahlung + Webhook), Rabattcodes, Paywall",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "zq6us835o",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "dqpwl6kcy",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "pxvhpa9ss",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "p3uf25b16",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "m5l9z9u4d",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "t5p0jl4do",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "knfocp00q",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "s3y9nnsyg",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "kgzgfbbrn",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "s0x3a1zc9",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "q6zrs9ykn",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "siditqeee",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "11gf8sjxi",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "6ftxull9n",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "sps2hgxow",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "qrpgqoi2p",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "c8vrp3yqa",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "uwrw0nu9z",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "pujlozf0s",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "ywuqwgtke",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "1o9ke8one",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "jajgw0061",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "pdpme0wat",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten)",
          "done": true
        },
        {
          "id": "4jdw8y8f1",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": true
        },
        {
          "id": "2ygvj23l8",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": true
        },
        {
          "id": "pj5xgwv4n",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": true
        },
        {
          "id": "qbhpphz5o",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren)",
          "done": true
        },
        {
          "id": "mqn4c5w27",
          "title": "Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io)",
          "done": true
        },
        {
          "id": "35o4kca3k",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": true
        },
        {
          "id": "57tg94vvz",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": true
        },
        {
          "id": "ek6svz4ev",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": true
        },
        {
          "id": "e2386wgd1",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": true
        },
        {
          "id": "t6h92orzw",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "nldi6ax41",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 10,
      "total": 12
    },
    {
      "id": "tth5nkiy8",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "z2fp37bo0",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "ziv0pn4vu",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "n8xq3l9dq",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "ww2tjdzpr",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "neh01rn96",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "86aoo9g1i",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "8j4t9s5xc",
          "title": "QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package)",
          "done": true
        },
        {
          "id": "5o8vl85te",
          "title": "Socket.io Live-Updates bei neuer/geänderter Reservierung",
          "done": true
        },
        {
          "id": "15mr9zicz",
          "title": "Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit)",
          "done": true
        },
        {
          "id": "61ik5ndsv",
          "title": "Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite)",
          "done": true
        },
        {
          "id": "s7ycfju2g",
          "title": "**Räumlicher Tischplan / Floor Plan Editor**",
          "done": true
        },
        {
          "id": "lo4p16flr",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": true
        },
        {
          "id": "w3h5qhdms",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "6q1c6v6vv",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "6xpcennhl",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "f2f4oithh",
          "title": "Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit)",
          "done": true
        },
        {
          "id": "ty07c0hum",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken per Email)",
          "done": true
        },
        {
          "id": "xq6yhechm",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": true
        },
        {
          "id": "wty21qr4y",
          "title": "Reservierungs-basierte Personalplanung (Reservierungen → Personalbedarf-Empfehlung)",
          "done": true
        },
        {
          "id": "jhfq7wqpk",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": true
        },
        {
          "id": "e6oohlwo1",
          "title": "Erlebnis-Buchung (Erlebnis-Pakete + 3-Schritt-Buchung + Stripe-Prepayment)",
          "done": true
        }
      ],
      "done": 18,
      "total": 21
    },
    {
      "id": "7l375iow2",
      "name": "Extras/Modifier-System ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "c301no9uh",
          "title": "DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen",
          "done": true
        },
        {
          "id": "y1ohix6fw",
          "title": "Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading)",
          "done": true
        },
        {
          "id": "06czfefe2",
          "title": "Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras)",
          "done": true
        },
        {
          "id": "67nlp5244",
          "title": "Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern",
          "done": true
        },
        {
          "id": "jdnwq2ftz",
          "title": "Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra",
          "done": true
        },
        {
          "id": "1embq6p2s",
          "title": "useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts)",
          "done": true
        },
        {
          "id": "rgq2ar2k4",
          "title": "GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis",
          "done": true
        },
        {
          "id": "mvxng7rjk",
          "title": "Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige",
          "done": true
        },
        {
          "id": "4sha66pcb",
          "title": "BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt",
          "done": true
        },
        {
          "id": "0pcurpjic",
          "title": "Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte)",
          "done": true
        },
        {
          "id": "7ixp8zgp0",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "v9i5d8v1h",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "51btepyoj",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "mh7vj98ht",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "x968ekoda",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "6rb6i8vnl",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "tfgb1jglx",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "tsbzwdqvo",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "zq2xwdrp3",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "6ueqt1qbr",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "hnw41hp7r",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "fxoc7eqa4",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "x4k9l0p9m",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "jqsvtfo27",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "q2hcs2ms3",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "q0g1qngmq",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "t403nnbm4",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "rbg1vf3ik",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "tji1si11w",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "zr4gsoglw",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "pp8hyqiac",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "587qszj1g",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "pxxjzlvip",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "cgavnf7ph",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "rui981pnp",
      "name": "Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "bqzr27blq",
          "title": "Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3)",
          "done": true
        },
        {
          "id": "c94e5hvef",
          "title": "Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1)",
          "done": true
        },
        {
          "id": "i70okbdrk",
          "title": "\"Zum Kalender hinzufuegen\" auf Bestaetigungsseite (Google Calendar + iCal-Download)",
          "done": true
        },
        {
          "id": "ugaop6wwu",
          "title": "DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen`",
          "done": true
        },
        {
          "id": "t6z5k5g2g",
          "title": "Backend + Admin-UI + Detailseite erweitert",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "62s0n3926",
      "name": "Bugfix + Feature-Session 2026-04-15",
      "todos": [
        {
          "id": "r8v2l1rmv",
          "title": "🟡 Dienstplan MA-Ansicht: `/mitarbeiter/alle`-Endpoint + useMitarbeiter für Nicht-Admins",
          "done": true
        },
        {
          "id": "mm5wqt90i",
          "title": "🟡 Bestellung Dankeschön-Screen: `status === 'offen'` zeigt Bestätigungs-Banner",
          "done": true
        },
        {
          "id": "v6e7s7whe",
          "title": "🟡 no_show Cronjob: `starteNoShowCron()` in server.ts, alle 15 Min",
          "done": true
        },
        {
          "id": "zs4h6uqph",
          "title": "🟡 Speisekarte Reihenfolge: ↑↓ Buttons für Kategorien + Gerichte",
          "done": true
        },
        {
          "id": "vnnumnkn7",
          "title": "🟡 Telefon-Validierung Backend (buchung.ts)",
          "done": true
        },
        {
          "id": "94dpa0bxo",
          "title": "🟡 Preis ≥ 0 Validierung Backend (speisekarte.ts)",
          "done": true
        },
        {
          "id": "mphg52wny",
          "title": "🟡 Bestellmenge 1–99 Validierung Backend (bestellungen.ts)",
          "done": true
        },
        {
          "id": "k0ayrz6xs",
          "title": "🟡 Leere Kategorien in Admin-Speisekarte ausgeblendet",
          "done": true
        },
        {
          "id": "42ttgn4x7",
          "title": "🟡 Profilbild-System: foto_url in DB-Schema + Backend-Routes + useMitarbeiter-Hook + MitarbeiterZeile Upload-UI",
          "done": true
        }
      ],
      "done": 9,
      "total": 9
    },
    {
      "id": "147bhdbgj",
      "name": "Bekannte Bugs (Bugfix-Session 2026-04-13)",
      "todos": [
        {
          "id": "ybtltn20e",
          "title": "🔴 **KRITISCH: DB-Schema `quelle` CHECK fehlt `'google'`** — `schema.sql:219` gefixt: `'google'` zur Constraint hinzugefügt.",
          "done": true
        },
        {
          "id": "fmx25migs",
          "title": "🔴 **KRITISCH: Socket.io Room-Namen falsch in `reservierungen.ts`** — `io.to(restaurantId)` → `io.to(\\`restaurant:${restaurantId}\\`)` an 3 Stellen.",
          "done": true
        },
        {
          "id": "f7wf2oxaq",
          "title": "🟡 **MITTEL: Socket.io Room-Namen falsch in `walk-ins.ts`** — Gleicher Fix, 3 Stellen.",
          "done": true
        },
        {
          "id": "2iq3fh3qs",
          "title": "🔴 **KRITISCH: Registrierung \"Email nicht verifiziert\" obwohl Code bestätigt** — `verifiedTokens` war eine In-Memory Map, die bei Server-Neustart (nodemon) geleert wurde. Fix: Token jetzt als signiertes JWT ausgestellt (`verifTokenErstellen`/`verifTokenPruefen`) → kein Server-State nötig.",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "plkj1lvhc",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "d2vfonfjv",
          "title": "E-Mail-Vorlagen umgestalten — professionelles ServeFlow-Design mit Dark-Header, Blue/Cyan-Gradient, QR-Code, klaren CTAs",
          "done": true
        },
        {
          "id": "kvrql0pmk",
          "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
          "done": false
        },
        {
          "id": "f8e776mu4",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "1fhjxsx7p",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 1,
      "total": 4
    },
    {
      "id": "eogjrhmpn",
      "name": "Phase 9 – Inventurmanagement ✅ (erledigt 2026-04-18)",
      "todos": [
        {
          "id": "nipl85oic",
          "title": "Inventar-Datenbank: Zutaten/Artikel mit Einheit, Mindestbestand, Kategorie",
          "done": true
        },
        {
          "id": "z4jza1e7g",
          "title": "Lagerbestand erfassen + manuell anpassen (Eingänge, Abgänge, Korrekturen)",
          "done": true
        },
        {
          "id": "jiivnyu7w",
          "title": "Automatischer Abzug bei Bestellung bezahlt (Rezeptur: Gericht → Zutaten-Verbrauch)",
          "done": true
        },
        {
          "id": "9ayj9a9rh",
          "title": "Mindestbestand-Alarm (Email an Admin wenn Artikel nach Bestellung unter Schwellenwert fällt)",
          "done": true
        },
        {
          "id": "5wgbq3sw5",
          "title": "Lieferanten-Verwaltung (Name, Kontakt, Liefertage)",
          "done": true
        },
        {
          "id": "u785z7lq3",
          "title": "Bestellvorschläge (Artikel unter Mindestbestand — rotes Banner im Dashboard)",
          "done": true
        },
        {
          "id": "9efk8stkx",
          "title": "Inventur-Auswertung (Verbrauch + Kosten pro 7/14/30/90 Tage)",
          "done": true
        }
      ],
      "done": 7,
      "total": 7
    },
    {
      "id": "cs1a7ihur",
      "name": "Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18",
      "todos": [
        {
          "id": "ht66wdq7l",
          "title": "DB-Migration: `abo_plan` Spalte auf `restaurants` + `plan` auf `zahlungen`",
          "done": true
        },
        {
          "id": "pyqsv5741",
          "title": "Backend: `/api/abo/checkout` — Plan als Parameter, Preis aus PLAN_PREISE (29€/59€/99€)",
          "done": true
        },
        {
          "id": "yfl9du9q8",
          "title": "Backend: `/api/abo/status` gibt `abo_plan` + `plan_preise` zurück",
          "done": true
        },
        {
          "id": "o7enc2smb",
          "title": "Backend: `zahlungAbschliessen` setzt `abo_plan` beim Restaurant",
          "done": true
        },
        {
          "id": "o62y0h566",
          "title": "Frontend: `usePlan()` Hook — `hatZugang(feature)` prüft Plan-Rang",
          "done": true
        },
        {
          "id": "l17lr20bf",
          "title": "Frontend: `PaywallKarte` Komponente — gesperrtes Feature + Upgrade-Hinweis",
          "done": true
        },
        {
          "id": "uhw477i7e",
          "title": "Frontend: Einstellungen Abo-Tab — 3 Plan-Karten (Basis/Standard/Pro) mit Features",
          "done": true
        },
        {
          "id": "p6um61h5y",
          "title": "Frontend: Guards auf Inventur (Pro), Erlebnisse (Pro), Gäste-CRM (Standard), Dienstplan (Standard)",
          "done": true
        },
        {
          "id": "d71pms4ny",
          "title": "Stripe: 3 Produkte + Preise anlegen (29€, 59€, 99€) im Stripe-Dashboard (manuell)",
          "done": false
        },
        {
          "id": "c9acrhunh",
          "title": "Backend: Mitarbeiter-Limit pro Plan API-seitig durchsetzen (Basis: 3, Standard: 10)",
          "done": false
        }
      ],
      "done": 8,
      "total": 10
    },
    {
      "id": "v3y1buz7d",
      "name": "Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "todos": [
        {
          "id": "zn3mxsmzu",
          "title": "Architektur definiert: Generic Webhook + Adapter-Pattern + AES-256 Verschlüsselung + 3x Retry + Alert-Email",
          "done": true
        },
        {
          "id": "4xczutksq",
          "title": "Adapter-Entwürfe: orderbird, ready2order, Generic Webhook",
          "done": true
        },
        {
          "id": "xzuidbhe3",
          "title": "**Voraussetzung:** Developer Token bei ready2order beantragen (ready2order.com/en/api/)",
          "done": false
        },
        {
          "id": "mnt75l1zr",
          "title": "**Voraussetzung:** ISV-Partner-Antrag bei orderbird stellen (orderbird.com/en/isv-partner-request) + Email an development@orderbird.com",
          "done": false
        },
        {
          "id": "lzkzf3b6w",
          "title": "**Voraussetzung:** Lightspeed Developer Portal registrieren (developers.lightspeedhq.com)",
          "done": false
        },
        {
          "id": "agqq7rzrk",
          "title": "OAuth-Flow für ready2order implementieren (3-Stufen: Developer Token → Grant Token → Account Token)",
          "done": false
        },
        {
          "id": "oedrzz4fi",
          "title": "Adapter korrekt nach echten API-Docs bauen (orderbird, ready2order, Lightspeed)",
          "done": false
        },
        {
          "id": "bimhjtaae",
          "title": "Rückrichtung: Zahlungen von Kasse → ServeFlow Status auf 'bezahlt' setzen (Webhooks)",
          "done": false
        },
        {
          "id": "b57z7mzfo",
          "title": "Menü-Sync: Speisekarte aus KSS importieren",
          "done": false
        },
        {
          "id": "sytgptfeg",
          "title": "Custom-Integration als Paid Service (299€ einmalig für andere Systeme mit API)",
          "done": false
        },
        {
          "id": "uyafehc1u",
          "title": "Persistent Retry-Queue (DB-basiert, überlebt Server-Neustart)",
          "done": false
        }
      ],
      "done": 2,
      "total": 11
    },
    {
      "id": "h1pbaubde",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "98yx1ybpv",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "y4xlsg91b",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "c2oewy2db",
          "title": "Wartezeit-Schätzung",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    },
    {
      "id": "75rma1h34",
      "name": "ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "todos": [
        {
          "id": "66j434rsr",
          "title": "Trinkgeld-System — Gäste können bei Zahlung digital Trinkgeld geben (%, feste Beträge)",
          "done": false
        },
        {
          "id": "3owtzqmsk",
          "title": "Split-Bill — Rechnung auf mehrere Personen aufteilen",
          "done": false
        },
        {
          "id": "cuolvo3fx",
          "title": "Prepayment bei Reservierung — Anzahlung für große Gruppen (ab 6 Personen) direkt bei Buchung",
          "done": false
        },
        {
          "id": "lgoz6aagg",
          "title": "Bon-Drucker-Anbindung — ESC/POS-Protokoll für Küchenbons (Star, Epson)",
          "done": false
        },
        {
          "id": "s0o6d171n",
          "title": "Tagesangebote / Happy Hour — zeitgesteuerte Rabatte auf der Bestellseite",
          "done": false
        },
        {
          "id": "e9geu0h5s",
          "title": "Kassenbuch-Export — Tagesabschluss als PDF/CSV für Steuerberater",
          "done": false
        },
        {
          "id": "suaxx43hx",
          "title": "Personalkosten vs. Umsatz Ratio — live im Dashboard (Ziel: unter 30%)",
          "done": false
        },
        {
          "id": "vzsg8tvyl",
          "title": "Gerichtanalyse — welche Gerichte werden zusammen bestellt (Cross-Sell-Hinweise)",
          "done": false
        },
        {
          "id": "h0drno14r",
          "title": "Auslastungs-Heatmap — wann ist das Restaurant voll (nach Wochentag/Stunde)",
          "done": false
        },
        {
          "id": "n8oqjqfws",
          "title": "Digitale Speisekarte ohne Bestellfunktion — reiner Anzeige-Modus",
          "done": false
        },
        {
          "id": "ei09idrf5",
          "title": "Allergen-Filter auf Bestellseite — Gäste filtern nach Laktose/Gluten etc.",
          "done": false
        },
        {
          "id": "mcu4cxuc4",
          "title": "Geburtstagsautomatisierung — Email/SMS am Geburtstag mit Rabattcode",
          "done": false
        },
        {
          "id": "q13iuk7h2",
          "title": "Loyalty-Punkte — digitale Stempelkarte (10 Besuche → 1 gratis)",
          "done": false
        },
        {
          "id": "wft3nlyew",
          "title": "Gast-Feedback nach Besuch — automatische Email 2h nach Abreise",
          "done": false
        },
        {
          "id": "d477vtg9t",
          "title": "Küchen-Display-System (KDS) — separater Bildschirm für Küche statt Bon-Drucker",
          "done": false
        },
        {
          "id": "rss2ybais",
          "title": "Inventur-Warnschwellen — Push wenn Bestand unter X fällt (Echtzeit)",
          "done": false
        },
        {
          "id": "nh7nzgsbk",
          "title": "Tischstatus-Timeline — wann bestellt, wann geliefert, wann bezahlt",
          "done": false
        },
        {
          "id": "c8z2tnoae",
          "title": "Öffnungszeiten-Ausnahmen — Feiertage, Betriebsurlaub automatisch sperren",
          "done": false
        },
        {
          "id": "41k7yzg9v",
          "title": "DATEV-Export — Buchhaltungsdaten für deutschen Steuerberater",
          "done": false
        },
        {
          "id": "x0m3l96ao",
          "title": "Meta/Google Ads Conversion-Tracking — Reservierungen als Events",
          "done": false
        },
        {
          "id": "rrn6zkt9g",
          "title": "Zapier/Make-Webhook — für externe Automatisierungen",
          "done": false
        }
      ],
      "done": 0,
      "total": 21
    }
  ],
  "decisions": [
    {
      "id": "ynzgubhlt",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "yynhcr9pt",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "3l0nqnojb",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "82d278c1h",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "hpjfs7g4e",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "ezf54etn6",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "3v8occ0cn",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "mhhq1lqy9",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "h2ue4sd92",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    },
    {
      "id": "q4ta361n6",
      "title": "Abo-Modell: 3 Pläne (2026-04-18)",
      "date": "",
      "content": "- Kein Freemium — alle 3 Pläne sind vollwertige Bezahl-Pläne\n- Zahlungsanbieter: Stripe (bereits integriert)\n- **Basis (29€/Monat):** Reservierungen (unbegrenzt), Online-Buchungsseite, Speisekarte, Tischplan, Walk-ins, Öffnungszeiten, E-Mail-Bestätigung, bis 3 Mitarbeiter\n- **Standard (59€/Monat):** Alles aus Basis + QR-Bestellung, Gästebuch/CRM, Bewertungsmanagement, Warteliste, erweiterte Statistiken, SMS-Erinnerungen, bis 10 Mitarbeiter\n- **Pro (99€/Monat):** Alles aus Standard + Dienstplan (inkl. Templates + Excel-Import), Inventur, Kassensystem, unbegrenzt Mitarbeiter\n- Technisch umzusetzen: `abo_plan` Spalte (basis/standard/pro) auf `restaurants`, Feature-Guard Middleware im Backend, Paywall-Komponente im Frontend"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "vlgeocni2",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "f7lp364ns",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "jb8gndlqq",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "h7dlaaqvp",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "4xxw9j9h3",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      },
      {
        "id": "0fjusweiz",
        "date": "2026-04-09",
        "title": "Urlaubsverwaltung (Urlaubskonto)"
      },
      {
        "id": "5qgwt5exh",
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
      "id": "pm56ftgpl",
      "text": "feat(mobile-app): Mobile Redesign v3 — Light/Dark korrekt",
      "date": "2026-04-20"
    },
    {
      "id": "zos887zca",
      "text": "fix: Dashboard + Layout auf GitHub-Stand zurücksetzen (Light/Dark korrekt)",
      "date": "2026-04-20"
    },
    {
      "id": "m4mzmxk6i",
      "text": "feat(mobile-app): Vollständiges Mobile Redesign v2",
      "date": "2026-04-20"
    },
    {
      "id": "nz815lop9",
      "text": "Revert \"feat(mobile-app): App-like Mobile Redesign\"",
      "date": "2026-04-20"
    },
    {
      "id": "tuqijtpt0",
      "text": "feat(mobile-app): App-like Mobile Redesign",
      "date": "2026-04-20"
    },
    {
      "id": "69d635wwp",
      "text": "feat: Mobile Bottom Navigation für PWA",
      "date": "2026-04-19"
    },
    {
      "id": "7ze0u2s1b",
      "text": "feat: PWA-Support für ServeFlow hinzufügen",
      "date": "2026-04-19"
    },
    {
      "id": "n2hvp50jj",
      "text": "fix: TypeScript-Fehler in warteliste.ts — SocketServer Import korrigiert",
      "date": "2026-04-18"
    },
    {
      "id": "l6t30xsip",
      "text": "feat: Warteliste — Walk-in + Online, automatisches Nachrücken per Email",
      "date": "2026-04-18"
    },
    {
      "id": "z74h5ckxr",
      "text": "feat: Abo-System, Inventur, KSS-Integration, QR-Bestellen, Stripe-Migration",
      "date": "2026-04-18"
    }
  ]
};
