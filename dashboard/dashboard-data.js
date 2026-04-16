// AUTO-GENERIERT von sync-dashboard.js — 2026-04-16T18:52:00.322Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "s3dbu3kwo",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-jabbm6a7f",
      "name": "Restaurants",
      "fields": [
        {
          "id": "5f37y73ig",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "rhlp9q8u2",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "4dba58hha",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "qczz25fhu",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "gsy2152a5",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "j2msj37j3",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "lbo4ltn8b",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "6ms2oi361",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "fisak798q",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "wj2gwwjf9",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "jnibl6bsa",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "hip5q0y2h",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "dtfcthf2x",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "yp674qqn7",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "jtrfcf82r",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "rnuxyyguj",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "2pdiilidt",
          "name": "max_gaeste_pro_slot",
          "type": "Zahl",
          "description": "max_gaeste_pro_slot",
          "required": false
        },
        {
          "id": "i3gf4bhjx",
          "name": "reservierung_puffer_min",
          "type": "Zahl",
          "description": "reservierung_puffer_min",
          "required": true
        },
        {
          "id": "blulxn1s3",
          "name": "reservierung_vorlauf_tage",
          "type": "Zahl",
          "description": "reservierung_vorlauf_tage",
          "required": true
        },
        {
          "id": "zqd3qz66u",
          "name": "buchungsintervall_min",
          "type": "Zahl",
          "description": "buchungsintervall_min",
          "required": true
        },
        {
          "id": "sdm2llq1v",
          "name": "tisch_dauer_min",
          "type": "Zahl",
          "description": "tisch_dauer_min",
          "required": true
        },
        {
          "id": "0ua63qr7v",
          "name": "max_gleichzeitige_reservierungen",
          "type": "Zahl",
          "description": "max_gleichzeitige_reservierungen",
          "required": false
        },
        {
          "id": "3m83x5c3w",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-5rmfg39m2",
      "name": "Bereiche",
      "fields": [
        {
          "id": "zubhdrbz9",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "t7tm0tchz",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "z3qmlmmyu",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "3q50icil9",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-wm63dxqsm",
      "name": "Kategorien",
      "fields": [
        {
          "id": "sqkxocsc5",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "qffu7y6eh",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "kuu63kthw",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "umwzk1g8t",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "uvmxtub9u",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "edaofbl2x",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-n3d3ubyev",
      "name": "Unterkategorien",
      "fields": [
        {
          "id": "c0qepdv6d",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "9b9l20v0x",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "slw2sjpxz",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "te8gireds",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "eiishe48i",
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
      "id": "dt-uxfd6ls9h",
      "name": "Tische",
      "fields": [
        {
          "id": "sxkxx5p89",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "i8giy2bty",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "e9sy2ocsr",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "p07d4ctqg",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "w4d30ox40",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "nh7ymempd",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "qrr41ojzk",
          "name": "form",
          "type": "Option Set",
          "description": "Moegliche Werte: rechteck, rund, quadrat, bar",
          "required": true
        },
        {
          "id": "f6imipw2i",
          "name": "pos_x",
          "type": "Zahl",
          "description": "pos_x",
          "required": true
        },
        {
          "id": "taeq9ipf3",
          "name": "pos_y",
          "type": "Zahl",
          "description": "pos_y",
          "required": true
        },
        {
          "id": "qiukxpcfv",
          "name": "breite",
          "type": "Zahl",
          "description": "breite",
          "required": true
        },
        {
          "id": "ftr4g364q",
          "name": "hoehe",
          "type": "Zahl",
          "description": "hoehe",
          "required": true
        },
        {
          "id": "qot5j5f4o",
          "name": "rotation",
          "type": "Zahl",
          "description": "rotation",
          "required": true
        },
        {
          "id": "1usk6mklq",
          "name": "bereich_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bereiche",
          "required": false
        },
        {
          "id": "kha2q8rz1",
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
      "id": "dt-g0vxy9ls9",
      "name": "Gerichte",
      "fields": [
        {
          "id": "l4nc16pay",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "iw20m72q1",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "jbol0p2ip",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "o21au5whr",
          "name": "unterkategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Unterkategorien",
          "required": false
        },
        {
          "id": "ejxaavlde",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "v3hm0sqhc",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "iuyhargfe",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "bg5i9hvjq",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "4f08kwr4q",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "ivai3gymi",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "l8scitg2a",
          "name": "modell_3d_url",
          "type": "Text",
          "description": "modell_3d_url",
          "required": false
        },
        {
          "id": "pkmy9140b",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "qbmzidi0x",
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
      "id": "dt-lzz4s93nq",
      "name": "Extras_gruppen",
      "fields": [
        {
          "id": "agka4thva",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xdklc8b2u",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "zr7nmia3g",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "qny5x5pqd",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "0zzigf6x3",
          "name": "pflicht",
          "type": "Ja/Nein",
          "description": "pflicht",
          "required": true
        },
        {
          "id": "jg3165sdz",
          "name": "max_auswahl",
          "type": "Zahl",
          "description": "max_auswahl",
          "required": true
        },
        {
          "id": "9w1nefl8p",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "hpk6h99ny",
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
      "id": "dt-m2ny00o0w",
      "name": "Extras",
      "fields": [
        {
          "id": "fdhxdgcum",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "1mhaa0709",
          "name": "gruppe_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras_gruppen",
          "required": true
        },
        {
          "id": "w4q94jea4",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "ftox25ir0",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "ffddlhyg2",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        },
        {
          "id": "5nivc6pb2",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "vcb9t43n7",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "c5vis3tta",
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
      "id": "dt-lj6knpuca",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "2fxubdu9s",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "x6h29yba4",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "pmgq1w03g",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "s33m016t0",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "10uysfxua",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "dm42xrd8h",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "i0h52rnl0",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "uo1x9suxs",
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
      "id": "dt-ivzl3dywc",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "3y12vt1lf",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "to0476cb2",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "bm59c6ahg",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "4wzqfx1zv",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "1aj8prgcq",
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
      "id": "dt-31zfdsi50",
      "name": "Bestellposition_extras",
      "fields": [
        {
          "id": "7tn1tqfyu",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "91hcr6rur",
          "name": "position_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellpositionen",
          "required": true
        },
        {
          "id": "13sc8uijp",
          "name": "extra_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras",
          "required": true
        },
        {
          "id": "gqkhtwi9k",
          "name": "extra_name",
          "type": "Text",
          "description": "extra_name",
          "required": true
        },
        {
          "id": "gnrhhvi73",
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
      "id": "dt-yu137vx8k",
      "name": "Gaeste",
      "fields": [
        {
          "id": "1x5p6datu",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "cficzl1ro",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "gkcm4l0gv",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "b5u2unu22",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "kqoqsbqol",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "z8ha04dlc",
          "name": "notizen",
          "type": "Text",
          "description": "notizen",
          "required": false
        },
        {
          "id": "7ergeo4gs",
          "name": "tags",
          "type": "Text",
          "description": "tags",
          "required": true
        },
        {
          "id": "7nigbguym",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "zs1orsoha",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        },
        {
          "id": "vfnmlbypg",
          "name": "loeschen_nach",
          "type": "Datum",
          "description": "loeschen_nach",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-060ziht6f",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "gllxeywk1",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "lgx4ma9sj",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "c9ngx4kdz",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "4vs47uwez",
          "name": "tisch_kombiniert_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "jma6xyrlu",
          "name": "gast_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gaeste",
          "required": false
        },
        {
          "id": "m178oppfi",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "lm8tozyiu",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "enstzj5ln",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "q9y169ccs",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "dn2ok2zqu",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "jc015nop7",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert, abgeschlossen, no_show",
          "required": true
        },
        {
          "id": "2xfs0vyym",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "bnce4nsyd",
          "name": "anlass",
          "type": "Text",
          "description": "anlass",
          "required": false
        },
        {
          "id": "d7ippamm6",
          "name": "sitzplatz_wunsch",
          "type": "Text",
          "description": "sitzplatz_wunsch",
          "required": false
        },
        {
          "id": "38qur7kny",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon, online, google",
          "required": true
        },
        {
          "id": "t54ejq5ds",
          "name": "buchungs_token",
          "type": "Text",
          "description": "buchungs_token",
          "required": false
        },
        {
          "id": "v6dht7ozk",
          "name": "dsgvo_einwilligung",
          "type": "Ja/Nein",
          "description": "dsgvo_einwilligung",
          "required": true
        },
        {
          "id": "kuys0hu56",
          "name": "erinnerung_gesendet",
          "type": "Text",
          "description": "erinnerung_gesendet",
          "required": true
        },
        {
          "id": "578ze5lei",
          "name": "verweilzeit_min",
          "type": "Zahl",
          "description": "verweilzeit_min",
          "required": true
        },
        {
          "id": "mruz864fl",
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
      "id": "dt-4wsa8opho",
      "name": "Walk_ins",
      "fields": [
        {
          "id": "qmt9chqaz",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "irp7j99da",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "5jgyzwzkk",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "ejvzc4ene",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "a6047c5yh",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "ve2ubacto",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: wartend, platziert, abgegangen",
          "required": true
        },
        {
          "id": "f4lh2me9b",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "u56bibxsg",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "t9hseow2a",
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
      "id": "dt-fup0b5ckl",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "93h5tkh9b",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "imfdk8llc",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "9hxz4uh2j",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "a6uny71pp",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "eb5kavm4f",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "jg3tmjzl6",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "3jst1qvrv",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "clmtujla3",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "atfo9atxg",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "fcph032gb",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "aw7isd3jg",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "dckqrr33g",
          "name": "stundenlohn",
          "type": "Text",
          "description": "stundenlohn",
          "required": false
        },
        {
          "id": "fg0w20ahl",
          "name": "urlaubsanspruch_tage",
          "type": "Zahl",
          "description": "urlaubsanspruch_tage",
          "required": false
        },
        {
          "id": "tfll0uoop",
          "name": "foto_url",
          "type": "Text",
          "description": "foto_url",
          "required": false
        },
        {
          "id": "5ytwcaz0p",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-0fadpp5qi",
      "name": "Schichten",
      "fields": [
        {
          "id": "4jh1g6gcp",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "8it9d0p7l",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "2ltuyptxu",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "dcxcgzi3a",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "cd5zxms11",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "xh3daswif",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "ctsrlo9ji",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "juyk4cwjw",
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
      "id": "dt-ft6gcj1rg",
      "name": "Abwesenheiten",
      "fields": [
        {
          "id": "8ircc6x8d",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "v8751rb2j",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "lheyf2uss",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "1pzz31pqs",
          "name": "von_datum",
          "type": "Datum",
          "description": "von_datum",
          "required": true
        },
        {
          "id": "bvnz2y3lz",
          "name": "bis_datum",
          "type": "Datum",
          "description": "bis_datum",
          "required": true
        },
        {
          "id": "kaycc3l5c",
          "name": "typ",
          "type": "Option Set",
          "description": "Moegliche Werte: urlaub, krank, sonstiges",
          "required": true
        },
        {
          "id": "3k7kkreoe",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "q1phlqe4b",
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
      "id": "dt-npsk7n7fo",
      "name": "Schichttausch",
      "fields": [
        {
          "id": "ufwsxrltr",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "yclzv0kds",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "s9br8f3k4",
          "name": "anbieter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "z8if69zj0",
          "name": "anbieter_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": true
        },
        {
          "id": "spdfpjwti",
          "name": "annehmer_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": false
        },
        {
          "id": "1f2jaqt3k",
          "name": "annehmer_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": false
        },
        {
          "id": "zuubde1ox",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, angeboten, genehmigt, abgelehnt",
          "required": true
        },
        {
          "id": "o481ccy8f",
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
      "id": "dt-12m6tn2tk",
      "name": "Schicht_templates",
      "fields": [
        {
          "id": "8r5yxnjst",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "28yt2k9iq",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "jti7wefaj",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "etgvdarto",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-j7su7m8x1",
      "name": "Schicht_template_eintraege",
      "fields": [
        {
          "id": "sz1wl31ma",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "iocm1y2pw",
          "name": "template_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schicht_templates",
          "required": true
        },
        {
          "id": "v91sflu1j",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "595cl0cyk",
          "name": "wochentag",
          "type": "Text",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "3lc81bdcx",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "18l2m1nkp",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "fh9p2qd18",
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
      "id": "dt-semjf9jga",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "nqc0ny9xc",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "6i3h734z9",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "e0766j8zd",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "aoq5kjk2c",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "pdp4aspfw",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "dw3apyept",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-9csetsf94",
      "name": "Ausnahmetage",
      "fields": [
        {
          "id": "25644ru4o",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "vg74zjds8",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "z9o3qto9s",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "2k2dthez3",
          "name": "grund",
          "type": "Text",
          "description": "grund",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-3ox26el6f",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "h4x175273",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "hhqs64osv",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "7njnm3mba",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "12twmcbze",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "2kyv4ep80",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "elanbucz3",
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
      "id": "dt-md714qjpz",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "tuh6q5v8o",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "tnfs4l1tp",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "x478gjp3h",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "r2ulylho0",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "llgw6s4my",
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
      "id": "6wu06ol28",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "yavj30j64",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "lkzox791f",
      "name": "Tische_Form",
      "values": [
        "rechteck, rund, quadrat, bar"
      ]
    },
    {
      "id": "awlow2qht",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "4asgm69jc",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert, abgeschlossen, no_show"
      ]
    },
    {
      "id": "ssi8fz41s",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon, online, google"
      ]
    },
    {
      "id": "ol8324zuq",
      "name": "Walk_ins_Status",
      "values": [
        "wartend, platziert, abgegangen"
      ]
    },
    {
      "id": "mnwoy1y9q",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    },
    {
      "id": "mtlpk0eq5",
      "name": "Abwesenheiten_Typ",
      "values": [
        "urlaub, krank, sonstiges"
      ]
    },
    {
      "id": "h84qt7pbe",
      "name": "Schichttausch_Status",
      "values": [
        "offen, angeboten, genehmigt, abgelehnt"
      ]
    }
  ],
  "workflows": [
    {
      "id": "90efb4eur",
      "name": "Abwesenheiten abrufen",
      "folder": "Abwesenheiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abwesenheiten-Seite geladen wird",
      "steps": [
        {
          "id": "ay9zvaseu",
          "type": "api",
          "desc": "GET /api/abwesenheiten aufrufen"
        },
        {
          "id": "tekfie00o",
          "type": "database",
          "desc": "Abwesenheiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "e7yljk0kf",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "xedhtcz0q",
      "name": "Abwesenheiten erstellen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abwesenheiten abgeschickt wird",
      "steps": [
        {
          "id": "lrodjckxf",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fsx5tap09",
          "type": "api",
          "desc": "POST /api/abwesenheiten aufrufen"
        },
        {
          "id": "8499d5tiw",
          "type": "database",
          "desc": "Neuen Abwesenheiten-Datensatz in DB speichern"
        },
        {
          "id": "5ly4ogf7q",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "falsq3wbv",
      "name": "Abwesenheiten loeschen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "a6q4gevbd",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "4j0koseg8",
          "type": "api",
          "desc": "DELETE /api/abwesenheiten/:id aufrufen"
        },
        {
          "id": "81sk299bh",
          "type": "database",
          "desc": "Abwesenheiten-Datensatz aus DB entfernen"
        },
        {
          "id": "pamptu3xt",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "jl6461tot",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "19n55mjst",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "fvi568h0j",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "3unuri86b",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9env9kbrf",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "u7yymp02a",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "juii8triq",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "stt4pofia",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "mazhiru4r",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "c24is2gwe",
      "name": "Bereiche abrufen",
      "folder": "Bereiche",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche-Seite geladen wird",
      "steps": [
        {
          "id": "d0jkegygr",
          "type": "api",
          "desc": "GET /api/bereiche aufrufen"
        },
        {
          "id": "iouvugmp7",
          "type": "database",
          "desc": "Bereiche-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "u0ak3srun",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "03sg04mlu",
      "name": "Bereiche erstellen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bereiche abgeschickt wird",
      "steps": [
        {
          "id": "gdce6r4dv",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "1qi194p4n",
          "type": "api",
          "desc": "POST /api/bereiche aufrufen"
        },
        {
          "id": "0gtk314u1",
          "type": "database",
          "desc": "Neuen Bereiche-Datensatz in DB speichern"
        },
        {
          "id": "8mm9a1ech",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "kq0u7vo4y",
      "name": "Bereiche bearbeiten",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "9fe938evm",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "zmt75n2j6",
          "type": "api",
          "desc": "PATCH /api/bereiche/:id aufrufen"
        },
        {
          "id": "gncunitk4",
          "type": "database",
          "desc": "Bereiche-Datensatz in DB aktualisieren"
        },
        {
          "id": "6jrwd9czh",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "4u47enth9",
      "name": "Bereiche loeschen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "gpgi9isuj",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "4ap7dy800",
          "type": "api",
          "desc": "DELETE /api/bereiche/:id aufrufen"
        },
        {
          "id": "jjgl8ujqw",
          "type": "database",
          "desc": "Bereiche-Datensatz aus DB entfernen"
        },
        {
          "id": "tlxqd643f",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "w5r9axsqz",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "ifuc0mtqu",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "lofqsa6k5",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "1vq70jwat",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "zb47pnh6k",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "nlbojn1dj",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "0d4tvef2c",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "ltv361i55",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "riavmfti6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "9yr3f7v7a",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "d864lpb4q",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "77jm7uu1d",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "kimegngo8",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "47y51yqfa",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "azg46sh79",
      "name": "Bewertungen abrufen",
      "folder": "Bewertungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bewertungen-Seite geladen wird",
      "steps": [
        {
          "id": "06j4t6sxb",
          "type": "api",
          "desc": "GET /api/bewertungen aufrufen"
        },
        {
          "id": "kitnqeywu",
          "type": "database",
          "desc": "Bewertungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4aniddygp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "1nhu9q0pd",
      "name": "Bewertungen erstellen",
      "folder": "Bewertungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bewertungen abgeschickt wird",
      "steps": [
        {
          "id": "coawnidkz",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "gl7jsbeun",
          "type": "api",
          "desc": "POST /api/bewertungen aufrufen"
        },
        {
          "id": "dajrsplef",
          "type": "database",
          "desc": "Neuen Bewertungen-Datensatz in DB speichern"
        },
        {
          "id": "ua4lo1glz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ocmdm0mll",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "p0sl9x1fk",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "zg1stb4tg",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8tbhq33ma",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9ubru2zk2",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "yc2v4hm1d",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "2w7knmo60",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "ctto0a79w",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "z91axe9db",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "yil9zw1gy",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "r058z49u0",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "hpko0lrwu",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ttvs7habw",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "44zxqi3ca",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "1f7m0cp0d",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "wrxu5eyl3",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "octhxl2jb",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "ur7prql4j",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "cp73j7vln",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "l5nd53jb7",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "6fof0zbfr",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "viohgrl2j",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "c9tycxnoi",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "aoqdz0d7w",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "id0tk4ybk",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "5cn96lax9",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "9ytmh88bt",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "7466x2564",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "fu9rl2uuv",
      "name": "Gaeste abrufen",
      "folder": "Gaeste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste-Seite geladen wird",
      "steps": [
        {
          "id": "b6td0mxd1",
          "type": "api",
          "desc": "GET /api/gaeste aufrufen"
        },
        {
          "id": "ahahl7wew",
          "type": "database",
          "desc": "Gaeste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8bx5uo0ws",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "g03npcz7n",
      "name": "Gaeste erstellen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Gaeste abgeschickt wird",
      "steps": [
        {
          "id": "uamxjdhw5",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "ur1s3owm1",
          "type": "api",
          "desc": "POST /api/gaeste aufrufen"
        },
        {
          "id": "z774oxv25",
          "type": "database",
          "desc": "Neuen Gaeste-Datensatz in DB speichern"
        },
        {
          "id": "0u61q5esx",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "m77z4dpsn",
      "name": "Gaeste bearbeiten",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "v24n96azf",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "15wcwgyf2",
          "type": "api",
          "desc": "PATCH /api/gaeste/:id aufrufen"
        },
        {
          "id": "jus4hhywz",
          "type": "database",
          "desc": "Gaeste-Datensatz in DB aktualisieren"
        },
        {
          "id": "bd3kumy5c",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "pmihc09kf",
      "name": "Gaeste loeschen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "heg2tfq2r",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "dxudhuff9",
          "type": "api",
          "desc": "DELETE /api/gaeste/:id aufrufen"
        },
        {
          "id": "romzl4pzj",
          "type": "database",
          "desc": "Gaeste-Datensatz aus DB entfernen"
        },
        {
          "id": "4h74kkpm5",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "snwckgylo",
      "name": "Google-reserve abrufen",
      "folder": "Google-reserve",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Google-reserve-Seite geladen wird",
      "steps": [
        {
          "id": "idej9dea0",
          "type": "api",
          "desc": "GET /api/google-reserve aufrufen"
        },
        {
          "id": "976z4doek",
          "type": "database",
          "desc": "Google-reserve-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "mliceoh61",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "tb2ovdily",
      "name": "Google-reserve erstellen",
      "folder": "Google-reserve",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Google-reserve abgeschickt wird",
      "steps": [
        {
          "id": "zkawyqt5g",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "zqk15s8yw",
          "type": "api",
          "desc": "POST /api/google-reserve aufrufen"
        },
        {
          "id": "3eb9t58w8",
          "type": "database",
          "desc": "Neuen Google-reserve-Datensatz in DB speichern"
        },
        {
          "id": "l2a5oy5l2",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "f2giwousz",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "uquuyb2c1",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "z6o9sjhhr",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4kiwowpmb",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "z4d8znm6p",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "se5kbpd84",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "y4m41vu7m",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "8eimsrj97",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "1xp189blb",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "l45bgd6y8",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "8ip2mykmy",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "7h97wjk3e",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "3cjr16z1z",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "whhjml86j",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "vjson0mzl",
      "name": "Oeffnungszeiten abrufen",
      "folder": "Oeffnungszeiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten-Seite geladen wird",
      "steps": [
        {
          "id": "3p9stwcjy",
          "type": "api",
          "desc": "GET /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "gz9b72bgt",
          "type": "database",
          "desc": "Oeffnungszeiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "nsrq4hckb",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "8jzl6imza",
      "name": "Oeffnungszeiten erstellen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Oeffnungszeiten abgeschickt wird",
      "steps": [
        {
          "id": "c0qxidqbr",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "z0xafxjx4",
          "type": "api",
          "desc": "POST /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "zm6butnoi",
          "type": "database",
          "desc": "Neuen Oeffnungszeiten-Datensatz in DB speichern"
        },
        {
          "id": "z3s7b18cf",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "uqq53ui59",
      "name": "Oeffnungszeiten bearbeiten",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "hcrupv5bd",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "aep5ai7a7",
          "type": "api",
          "desc": "PATCH /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "1dn97obv9",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz in DB aktualisieren"
        },
        {
          "id": "0y5cdbie4",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "bdfm5lof2",
      "name": "Oeffnungszeiten loeschen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "totnu1nce",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "leu1de4m9",
          "type": "api",
          "desc": "DELETE /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "va80ciu1z",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz aus DB entfernen"
        },
        {
          "id": "xnoga0ob8",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "kb6mpves8",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "1ljp0buaj",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "gpwmeq9t6",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ngxzum8lf",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "fq320fu0s",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "yjujtdpd4",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "cbm0lm3p7",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "uhq0o29ol",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "xn0o1ztwz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "lvh4lz3xb",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "9im7gerkj",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "o8uw67fx1",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "0in2mrxb3",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "689ubv44e",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "6buwo3qm0",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "6320fl8rv",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "lcbv04jvv",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "8gkbj5znk",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "fuehqtg34",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "gh569d2e7",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "0qqu3fdvd",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "kljtbl7ff",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "pqdmc8ksb",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "2qrjes30j",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "j4ui55l4q",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "7osgxf6gf",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "fruu7oss8",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "4peu45z18",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "dzutjgjf6",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "pcgqd9l4a",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "yhlb3ib1s",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "it2wgmbfn",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "1v0vgwj92",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "jo87u8og1",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "xnzhod31l",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "qdt1c0b0e",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "qg4hj2c0k",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "t88s1uf8m",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "42aobz5v6",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "ejlfw8h1h",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "a6oc7yy5n",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "iiu49olkm",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ilrn2wqgo",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "h1p7k8lji",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "lwajr0qn0",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "7uwq3pd2b",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "qdrvj3rn4",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "mddgnihbu",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "6ab0ejrhs",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "acj8508z7",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ar7q192qb",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "4ocii98ph",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "950us1pzo",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "yeuylcxeo",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "cgtlfvoiy",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "1jiwhqvu0",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "9pofjx7vy",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "9bcreorc9",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "wlgpgm35s",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "okdyxzdhz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "1i3gq6769",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "k9n46gik6",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "rhi89cs1f",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "0y2o9vqbe",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "1ahei80qb",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "hwtl1j06c",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "j34ue5bws",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "m07oogoq3",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "ij2tltmq4",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "k9abbx3ck",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "kexsds5r5",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "i20gud48l",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6t35vllit",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "qp00j60xc",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "08qkhcojq",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "cky0v0qzp",
      "name": "Verfuegbarkeit abrufen",
      "folder": "Verfuegbarkeit",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Verfuegbarkeit-Seite geladen wird",
      "steps": [
        {
          "id": "iwx8hxzlu",
          "type": "api",
          "desc": "GET /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "6q3noa1fk",
          "type": "database",
          "desc": "Verfuegbarkeit-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "n4rehbb26",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "qzqf1v7c3",
      "name": "Verfuegbarkeit erstellen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Verfuegbarkeit abgeschickt wird",
      "steps": [
        {
          "id": "d82pdeojt",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fzvoa7xot",
          "type": "api",
          "desc": "POST /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "5m6nqurz5",
          "type": "database",
          "desc": "Neuen Verfuegbarkeit-Datensatz in DB speichern"
        },
        {
          "id": "xyxx51wci",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "sjauuw8l7",
      "name": "Verfuegbarkeit loeschen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "bfc5joqqw",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "dqpnbwgrz",
          "type": "api",
          "desc": "DELETE /api/verfuegbarkeit/:id aufrufen"
        },
        {
          "id": "hxuj470v2",
          "type": "database",
          "desc": "Verfuegbarkeit-Datensatz aus DB entfernen"
        },
        {
          "id": "ddupe00is",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "jnykdnolv",
      "name": "Walk-ins abrufen",
      "folder": "Walk-ins",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins-Seite geladen wird",
      "steps": [
        {
          "id": "pa316cvjo",
          "type": "api",
          "desc": "GET /api/walk-ins aufrufen"
        },
        {
          "id": "bs4mg0hxn",
          "type": "database",
          "desc": "Walk-ins-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "zcbf7bx8q",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9t7qou1ql",
      "name": "Walk-ins erstellen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Walk-ins abgeschickt wird",
      "steps": [
        {
          "id": "za3gsex7r",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "8xkxyrjb3",
          "type": "api",
          "desc": "POST /api/walk-ins aufrufen"
        },
        {
          "id": "h88xzg52r",
          "type": "database",
          "desc": "Neuen Walk-ins-Datensatz in DB speichern"
        },
        {
          "id": "fm9dayuaw",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "z3o8j4sj4",
      "name": "Walk-ins bearbeiten",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "wa10gjchu",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "0dfe921qw",
          "type": "api",
          "desc": "PATCH /api/walk-ins/:id aufrufen"
        },
        {
          "id": "esf1ymear",
          "type": "database",
          "desc": "Walk-ins-Datensatz in DB aktualisieren"
        },
        {
          "id": "c9zi4063f",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "5v55updkq",
      "name": "Walk-ins loeschen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "wfitiq8wo",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "149wfes5j",
          "type": "api",
          "desc": "DELETE /api/walk-ins/:id aufrufen"
        },
        {
          "id": "5e1b6mpkb",
          "type": "database",
          "desc": "Walk-ins-Datensatz aus DB entfernen"
        },
        {
          "id": "w664on8zh",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "ev07obb2p",
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
      "id": "at603a2a4",
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
      "id": "em3d6kzfg",
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
      "id": "grphkw155",
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
      "id": "byuw92rt8",
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
      "id": "gknc07nmm",
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
      "id": "rbt8n5p2m",
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
      "id": "jqnxuggte",
      "name": "Dienstplan",
      "desc": "Seite: Dienstplan — Nutzt 6 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AuthStore",
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
      "id": "orgmvgpd2",
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
      "id": "ewkk6rrk3",
      "name": "Einstellungen",
      "desc": "Seite: Einstellungen — Nutzt 3 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
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
      "id": "ay2xk0dyn",
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
      "id": "f89kvf0ib",
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
      "id": "8yhmtdnxu",
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
      "id": "dpxr8ptcc",
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
      "id": "pm1xruhqp",
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
      "id": "1bxb0zsxc",
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
      "id": "u13ydeot5",
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
      "id": "h5zenk6x4",
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
      "id": "1yeattubt",
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
      "id": "cyu20pxf6",
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
      "id": "o1g1uciwf",
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
      "id": "3pj36424i",
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
      "id": "ee6hlu4y2",
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
      "id": "qdj6pr1gn",
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
      "id": "v9yp0temt",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "5em3ybu9i",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "jrmyb88qo",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "3mkvm1neg",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "0a1plpcn5",
      "name": "API: Extras",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Extras",
      "url": "/api/extras"
    },
    {
      "id": "xr8m4q27s",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "37v0xt0t9",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "rc1jtymi3",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "g7x6v6wig",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "u3q9srqqp",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "7dd7lvstc",
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
      "id": "1ead3sqzg",
      "title": "Abonnement-Verwaltung (Mollie)",
      "desc": "Aus Phase 4 – SaaS-Features",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "c6m96aquj",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "fcuzb43zz",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "er5lom1kp",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "ijj7ue8w6",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "74ks9jcve",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "kllovq3ue",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "1yqu6u0sh",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "635ezzc51",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "kza2no6f7",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "q08h1crl2",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "jahdsxacq",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "h5hqgqyyn",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "wme75339k",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "v1wvxjeq2",
      "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "7yys0u8a3",
      "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "kpk5881jy",
      "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "2da3g6zo8",
      "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "t05yiet4w",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "aefh6dre0",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "da2ehnpf6",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "bnsbow57w",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    },
    {
      "id": "iqcygse0w",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-16"
    }
  ],
  "roadmap": [
    {
      "id": "eyfwyncio",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "33oq41g98",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "gnj7gmr9v",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "709a7z642",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "tde956knd",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "4tfc1yagu",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "i4pmkrmqo",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "nswn69uus",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "zfrxlrv88",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "pbpwgn5lz",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "vso84tefa",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "6imuv71js",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "2sp765a9p",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "3ae0aaxn3",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "n1ofp1rjt",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "5emt7sdu2",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "px8u76vo6",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "0zr56kbg5",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "m24tmw8kk",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "nsjmh53kg",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "n04ft4cjq",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "mqwmr3ilq",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "uijkccjvg",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "g1jp84shw",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "gpyvoq8d1",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "0djf7216r",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "jggs38aig",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "a4pugwaan",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "j3qxjznn1",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "qql1q5cvk",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "y7g97f4bt",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "100jpa4ms",
          "title": "Abonnement-Verwaltung (Mollie)",
          "done": false
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "ee1pq5sf6",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "k4cbyu1rf",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "3s2pw8z1w",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "sq0mitcmx",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "ch9mm8ynr",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "5ccwbapyf",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "mdr7dpe21",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "nf9nwzgy7",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "vp027cdow",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "xq85ef4rt",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "wy6sv4y5s",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "oppi1m7y8",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "zo2chy5j5",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "p5moczhe8",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "8pbja1i0a",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "dqtq50okq",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "mfjpbz6ct",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "ngb1ajacp",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "x8c2m07f0",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "h9bzf8vce",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "epyvw8wm1",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "sd1hsk8ve",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "mw48aaseb",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten)",
          "done": true
        },
        {
          "id": "skykdvi6z",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": true
        },
        {
          "id": "0pf3n2yo0",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": true
        },
        {
          "id": "rh7bxd58x",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": true
        },
        {
          "id": "iz78gm5cj",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren)",
          "done": true
        },
        {
          "id": "3zan4ntv1",
          "title": "Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io)",
          "done": true
        },
        {
          "id": "hegqap118",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": true
        },
        {
          "id": "2vavafe5q",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": true
        },
        {
          "id": "jocyt3t0b",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": true
        },
        {
          "id": "u8fn943ez",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": true
        },
        {
          "id": "gbfnwhw39",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "q5312u7w5",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 10,
      "total": 12
    },
    {
      "id": "ah96i4erc",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "cqagfevgo",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "ge9xp9iyr",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "1n3mf2eop",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "uavcvzqms",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "gkpejxkwh",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "yqgpwmj9m",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "itj8ryzcb",
          "title": "QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package)",
          "done": true
        },
        {
          "id": "xpsj5oh49",
          "title": "Socket.io Live-Updates bei neuer/geänderter Reservierung",
          "done": true
        },
        {
          "id": "t0fj7bt51",
          "title": "Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit)",
          "done": true
        },
        {
          "id": "480uv7uyh",
          "title": "Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite)",
          "done": true
        },
        {
          "id": "go63exkpo",
          "title": "**Räumlicher Tischplan / Floor Plan Editor**",
          "done": true
        },
        {
          "id": "2gq7e2cay",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": true
        },
        {
          "id": "tn7vbq6ou",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "qfosvw2m0",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "w4cu3xlct",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "gzd75c7f6",
          "title": "Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit)",
          "done": true
        },
        {
          "id": "ma0w55xqe",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
          "done": false
        },
        {
          "id": "mbyxcwba3",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": true
        },
        {
          "id": "fkaxuhqvx",
          "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
          "done": false
        },
        {
          "id": "w7p5ay7rn",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": true
        },
        {
          "id": "f3pm3nei1",
          "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
          "done": false
        }
      ],
      "done": 15,
      "total": 21
    },
    {
      "id": "16upml2di",
      "name": "Extras/Modifier-System ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "jmkru4dgs",
          "title": "DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen",
          "done": true
        },
        {
          "id": "7a6sdweto",
          "title": "Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading)",
          "done": true
        },
        {
          "id": "jhonwuvrc",
          "title": "Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras)",
          "done": true
        },
        {
          "id": "9z5ol9vrh",
          "title": "Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern",
          "done": true
        },
        {
          "id": "sctl62ve6",
          "title": "Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra",
          "done": true
        },
        {
          "id": "z0semg8uf",
          "title": "useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts)",
          "done": true
        },
        {
          "id": "gbpsqhjcx",
          "title": "GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis",
          "done": true
        },
        {
          "id": "xlcderiae",
          "title": "Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige",
          "done": true
        },
        {
          "id": "b0es0duhh",
          "title": "BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt",
          "done": true
        },
        {
          "id": "a2p5jpl50",
          "title": "Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte)",
          "done": true
        },
        {
          "id": "oscu4lwlo",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "fz3ocj7os",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "pfhoho30c",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "lg3e9k39c",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "g0p1n8vnu",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "jw8179ngb",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "vwdgfmrc1",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "2bettpqua",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "nltloc8uy",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "gaoyjfcrx",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "dl5mjyyvx",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "s7te7wmxw",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "slu2m7v5r",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "7jzim2iin",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "v7q4hhwya",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "nml7nt08s",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "qrbwvxyz0",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "7g637tzb2",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "g627t5nbw",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "90tblfmmu",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "195515f70",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "gm0y78v6r",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "oclhb85do",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "lk35hbea3",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "d78qk3gjk",
      "name": "Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "vlr2wv69t",
          "title": "Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3)",
          "done": true
        },
        {
          "id": "8ix850uh5",
          "title": "Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1)",
          "done": true
        },
        {
          "id": "n9g37qfnz",
          "title": "\"Zum Kalender hinzufuegen\" auf Bestaetigungsseite (Google Calendar + iCal-Download)",
          "done": true
        },
        {
          "id": "13xp3kk2c",
          "title": "DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen`",
          "done": true
        },
        {
          "id": "xa3mcwuuu",
          "title": "Backend + Admin-UI + Detailseite erweitert",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "ucfx3mz7a",
      "name": "Bugfix + Feature-Session 2026-04-15",
      "todos": [
        {
          "id": "oe20e9rsm",
          "title": "🟡 Dienstplan MA-Ansicht: `/mitarbeiter/alle`-Endpoint + useMitarbeiter für Nicht-Admins",
          "done": true
        },
        {
          "id": "26992yyeb",
          "title": "🟡 Bestellung Dankeschön-Screen: `status === 'offen'` zeigt Bestätigungs-Banner",
          "done": true
        },
        {
          "id": "wi68q9orx",
          "title": "🟡 no_show Cronjob: `starteNoShowCron()` in server.ts, alle 15 Min",
          "done": true
        },
        {
          "id": "yyxt8nog5",
          "title": "🟡 Speisekarte Reihenfolge: ↑↓ Buttons für Kategorien + Gerichte",
          "done": true
        },
        {
          "id": "56q9e6v8f",
          "title": "🟡 Telefon-Validierung Backend (buchung.ts)",
          "done": true
        },
        {
          "id": "6j6fctu96",
          "title": "🟡 Preis ≥ 0 Validierung Backend (speisekarte.ts)",
          "done": true
        },
        {
          "id": "s8nt18nbn",
          "title": "🟡 Bestellmenge 1–99 Validierung Backend (bestellungen.ts)",
          "done": true
        },
        {
          "id": "w615xhtck",
          "title": "🟡 Leere Kategorien in Admin-Speisekarte ausgeblendet",
          "done": true
        },
        {
          "id": "dyjiubim1",
          "title": "🟡 Profilbild-System: foto_url in DB-Schema + Backend-Routes + useMitarbeiter-Hook + MitarbeiterZeile Upload-UI",
          "done": true
        }
      ],
      "done": 9,
      "total": 9
    },
    {
      "id": "yk09hn5l9",
      "name": "Bekannte Bugs (Bugfix-Session 2026-04-13)",
      "todos": [
        {
          "id": "7tp53byzi",
          "title": "🔴 **KRITISCH: DB-Schema `quelle` CHECK fehlt `'google'`** — `schema.sql:219` gefixt: `'google'` zur Constraint hinzugefügt.",
          "done": true
        },
        {
          "id": "ny9mokd0f",
          "title": "🔴 **KRITISCH: Socket.io Room-Namen falsch in `reservierungen.ts`** — `io.to(restaurantId)` → `io.to(\\`restaurant:${restaurantId}\\`)` an 3 Stellen.",
          "done": true
        },
        {
          "id": "qcho9l7f9",
          "title": "🟡 **MITTEL: Socket.io Room-Namen falsch in `walk-ins.ts`** — Gleicher Fix, 3 Stellen.",
          "done": true
        },
        {
          "id": "g485eswwa",
          "title": "🔴 **KRITISCH: Registrierung \"Email nicht verifiziert\" obwohl Code bestätigt** — `verifiedTokens` war eine In-Memory Map, die bei Server-Neustart (nodemon) geleert wurde. Fix: Token jetzt als signiertes JWT ausgestellt (`verifTokenErstellen`/`verifTokenPruefen`) → kein Server-State nötig.",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "vwqikonfl",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "ylzdro02p",
          "title": "E-Mail-Vorlagen umgestalten — professionelles ServeFlow-Design mit Dark-Header, Blue/Cyan-Gradient, QR-Code, klaren CTAs",
          "done": true
        },
        {
          "id": "2i5msdpgx",
          "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt (TODO in `routes/abwesenheiten.ts` Zeile ~76) — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
          "done": false
        },
        {
          "id": "zst435xca",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "s6c4h8uxh",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 1,
      "total": 4
    },
    {
      "id": "968tog4vb",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "fsbcteuhd",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "fibmytm8m",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "hafeh431w",
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
      "id": "tz5d20uri",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "4fvbqylks",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "hk6i7vt9k",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "vrdoevad1",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "k092mlzfd",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "1tmw0p57i",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "fly072407",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "6eofnflff",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "ufrb80fc7",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "bck7j99hs",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "hhsndqhix",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "7aydlcjqq",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "lpbfn2y09",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "x7dgke3w1",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      },
      {
        "id": "c2m547l8u",
        "date": "2026-04-09",
        "title": "Urlaubsverwaltung (Urlaubskonto)"
      },
      {
        "id": "1cvdrwep0",
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
      "id": "d8c0sjwj6",
      "text": "fix: Backend Host-Header fuer Traefik-Routing korrigieren",
      "date": "2026-04-15"
    },
    {
      "id": "2m6x7qoff",
      "text": "fix: nginx.template.conf aus conf.d raus — verhindert Parser-Fehler",
      "date": "2026-04-15"
    },
    {
      "id": "vz6ugqdhr",
      "text": "test: webhook auto-deploy testen",
      "date": "2026-04-15"
    },
    {
      "id": "5a1uki0lk",
      "text": "Nginx: BACKEND_URL als Umgebungsvariable fuer Staging/Production",
      "date": "2026-04-15"
    },
    {
      "id": "sqckqv2pj",
      "text": "Fix hardcoded localhost in Gaeste.tsx export",
      "date": "2026-04-15"
    },
    {
      "id": "cmj7jipvd",
      "text": "Add Dockerfile + nginx proxy für Frontend-Backend Verbindung",
      "date": "2026-04-15"
    },
    {
      "id": "lhb2kqiva",
      "text": "Add Capacitor mobile (Android/iOS) + update dashboard data",
      "date": "2026-04-15"
    },
    {
      "id": "96039vccd",
      "text": "Fix TypeScript errors + sync alle lokalen Änderungen",
      "date": "2026-04-14"
    },
    {
      "id": "mpx7vi1sr",
      "text": "Phase 8B: Öffnungszeiten-System + Reservierungseinstellungen + Bug-Fix Buchungsseite",
      "date": "2026-04-14"
    },
    {
      "id": "1cydxvxfr",
      "text": "Phase 7: Schichttausch-System + Lohn/Personalbedarf im Dienstplan",
      "date": "2026-04-11"
    }
  ]
};
