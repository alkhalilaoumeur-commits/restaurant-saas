// AUTO-GENERIERT von sync-dashboard.js — 2026-04-26T20:38:36.287Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "m8myoz3ed",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-0tr7yjvr0",
      "name": "Restaurants",
      "fields": [
        {
          "id": "ddgsmcvzs",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "khaxj77qd",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "f9gvwg02z",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "vjzpj8rw5",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "erguu96bq",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "gc80f315i",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "ls43nzonq",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "0c2p8gzdi",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "aknh6bcr2",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "a0ztach5o",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "ihw82j2ky",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "zt1gvfm6g",
          "name": "layout_id",
          "type": "Text",
          "description": "layout_id",
          "required": true
        },
        {
          "id": "7xcr5xhzc",
          "name": "restaurant_code",
          "type": "Text",
          "description": "restaurant_code",
          "required": true
        },
        {
          "id": "o3rtj7pym",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "fc5avyqs5",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "ngl3fid6e",
          "name": "newsletter_aktiv",
          "type": "Ja/Nein",
          "description": "newsletter_aktiv",
          "required": true
        },
        {
          "id": "08bjx5o5w",
          "name": "newsletter_widerspruch_am",
          "type": "Datum",
          "description": "newsletter_widerspruch_am",
          "required": false
        },
        {
          "id": "jqegp6kf3",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "5t6omj24e",
          "name": "max_gaeste_pro_slot",
          "type": "Zahl",
          "description": "max_gaeste_pro_slot",
          "required": false
        },
        {
          "id": "2yin8k7ol",
          "name": "reservierung_puffer_min",
          "type": "Zahl",
          "description": "reservierung_puffer_min",
          "required": true
        },
        {
          "id": "6vgabgbjr",
          "name": "reservierung_vorlauf_tage",
          "type": "Zahl",
          "description": "reservierung_vorlauf_tage",
          "required": true
        },
        {
          "id": "o426dokc6",
          "name": "buchungsintervall_min",
          "type": "Zahl",
          "description": "buchungsintervall_min",
          "required": true
        },
        {
          "id": "09cvsrsdt",
          "name": "tisch_dauer_min",
          "type": "Zahl",
          "description": "tisch_dauer_min",
          "required": true
        },
        {
          "id": "76k1uytj6",
          "name": "max_gleichzeitige_reservierungen",
          "type": "Zahl",
          "description": "max_gleichzeitige_reservierungen",
          "required": false
        },
        {
          "id": "e59na1fis",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-b3ocgdx5h",
      "name": "Bereiche",
      "fields": [
        {
          "id": "9jqpon67q",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "zstmuqc22",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "asfmz2xa8",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "6cnz66q5x",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-1n23lkjr7",
      "name": "Kategorien",
      "fields": [
        {
          "id": "23w80u56k",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "q742kjn2f",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "4dta0ifl1",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "hd1im5gzk",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "t8xbmiixi",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "lesycakk5",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-8tdhx3e3p",
      "name": "Unterkategorien",
      "fields": [
        {
          "id": "r4grzqy8v",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "wkdcq0x53",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "d3j9cnqjw",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "o40hm3qlu",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "kgoviu57c",
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
      "id": "dt-r0gxdwahx",
      "name": "Tische",
      "fields": [
        {
          "id": "rgaiar4tx",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "0k9fm1vch",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "8uqni90jf",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "7yd7lc0mq",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "jmdacqthy",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "1xxeftf0g",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "6e1zq5xvw",
          "name": "form",
          "type": "Option Set",
          "description": "Moegliche Werte: rechteck, rund, quadrat, bar",
          "required": true
        },
        {
          "id": "jijw34u9c",
          "name": "pos_x",
          "type": "Zahl",
          "description": "pos_x",
          "required": true
        },
        {
          "id": "18jo1v1yc",
          "name": "pos_y",
          "type": "Zahl",
          "description": "pos_y",
          "required": true
        },
        {
          "id": "i9qcmml3h",
          "name": "breite",
          "type": "Zahl",
          "description": "breite",
          "required": true
        },
        {
          "id": "3ugdhx6wn",
          "name": "hoehe",
          "type": "Zahl",
          "description": "hoehe",
          "required": true
        },
        {
          "id": "agctak6k6",
          "name": "rotation",
          "type": "Zahl",
          "description": "rotation",
          "required": true
        },
        {
          "id": "ozrme2nbp",
          "name": "bereich_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bereiche",
          "required": false
        },
        {
          "id": "28t1pi3hh",
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
      "id": "dt-fr2ahne4z",
      "name": "Gerichte",
      "fields": [
        {
          "id": "kji68885x",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "bi5966r8x",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "44xtlquoa",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "fz1ki4suq",
          "name": "unterkategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Unterkategorien",
          "required": false
        },
        {
          "id": "0hh6fmj9a",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "z684l2dg2",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "vwiatu9iq",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "i7xai4q9d",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "1d318c01e",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "lsggh7ikx",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "yl13kre44",
          "name": "modell_3d_url",
          "type": "Text",
          "description": "modell_3d_url",
          "required": false
        },
        {
          "id": "n4jh3vkyp",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "5mm3glv4j",
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
      "id": "dt-zevxnwnr8",
      "name": "Extras_gruppen",
      "fields": [
        {
          "id": "shkq0zp6u",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "zju2mk4re",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "vlceuutgg",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "yz0qq3k5r",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "altpl8rbu",
          "name": "pflicht",
          "type": "Ja/Nein",
          "description": "pflicht",
          "required": true
        },
        {
          "id": "210vafenm",
          "name": "max_auswahl",
          "type": "Zahl",
          "description": "max_auswahl",
          "required": true
        },
        {
          "id": "h9d344dmx",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "4rmrjo8dh",
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
      "id": "dt-7np0wz65l",
      "name": "Extras",
      "fields": [
        {
          "id": "49tfe4wy3",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "er4i2k1nf",
          "name": "gruppe_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras_gruppen",
          "required": true
        },
        {
          "id": "4aqx2wc5x",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "eg87ufs63",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "gweoq6yeg",
          "name": "aufpreis",
          "type": "Zahl",
          "description": "aufpreis",
          "required": true
        },
        {
          "id": "2gymg797j",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "q2qlce06a",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "2awr4w3em",
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
      "id": "dt-zizf8o2lp",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "df4p3m6fo",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "5cc67f72t",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "qbv12g530",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "yvquw1vmf",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "9r1glfz1f",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "ebaxeibte",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "s1ycnr8pb",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "o0bi08igo",
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
      "id": "dt-ltlqiw18l",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "ge4ktz3qc",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "keki5sh1t",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "jvhbir6w8",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "4sek21vew",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "bts0d95j0",
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
      "id": "dt-s1zp0etyz",
      "name": "Bestellposition_extras",
      "fields": [
        {
          "id": "jy4ydhavm",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "itn4n6x3s",
          "name": "position_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellpositionen",
          "required": true
        },
        {
          "id": "usozdh2u2",
          "name": "extra_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Extras",
          "required": true
        },
        {
          "id": "fsslgj2l0",
          "name": "extra_name",
          "type": "Text",
          "description": "extra_name",
          "required": true
        },
        {
          "id": "tsb9q33st",
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
      "id": "dt-c84fw8tm0",
      "name": "Gaeste",
      "fields": [
        {
          "id": "z0aezhbo5",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "dxc9huyil",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "nxshxzolt",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "kn4yjcho3",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "tpjeykc9e",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "kzjhk8ubv",
          "name": "notizen",
          "type": "Text",
          "description": "notizen",
          "required": false
        },
        {
          "id": "osjzv6bzq",
          "name": "tags",
          "type": "Text",
          "description": "tags",
          "required": true
        },
        {
          "id": "95x74uz5d",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "8z81mjvm2",
          "name": "aktualisiert_am",
          "type": "Datum",
          "description": "Letzte Aenderung",
          "required": true
        },
        {
          "id": "om9jn5833",
          "name": "loeschen_nach",
          "type": "Datum",
          "description": "loeschen_nach",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-0ybxk60mp",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "7f9kmp3bi",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "s3mu028mm",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "py32fjiwb",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "wz99d4l69",
          "name": "tisch_kombiniert_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "v2rjn4oc6",
          "name": "gast_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gaeste",
          "required": false
        },
        {
          "id": "8fkzyt59x",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "g2py1rqx6",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "76d3r4zvt",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "ir7oj5ack",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "i4agpq0yj",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "tqn97f2o2",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert, abgeschlossen, no_show",
          "required": true
        },
        {
          "id": "mlsn6o9mx",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "gpjn3lx4k",
          "name": "anlass",
          "type": "Text",
          "description": "anlass",
          "required": false
        },
        {
          "id": "moknav4ga",
          "name": "sitzplatz_wunsch",
          "type": "Text",
          "description": "sitzplatz_wunsch",
          "required": false
        },
        {
          "id": "nplhnxprp",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon, online, google",
          "required": true
        },
        {
          "id": "pa0vj9dxu",
          "name": "buchungs_token",
          "type": "Text",
          "description": "buchungs_token",
          "required": false
        },
        {
          "id": "x5n6rrsyh",
          "name": "dsgvo_einwilligung",
          "type": "Ja/Nein",
          "description": "dsgvo_einwilligung",
          "required": true
        },
        {
          "id": "aacxdllrn",
          "name": "erinnerung_gesendet",
          "type": "Text",
          "description": "erinnerung_gesendet",
          "required": true
        },
        {
          "id": "623236zwz",
          "name": "verweilzeit_min",
          "type": "Zahl",
          "description": "verweilzeit_min",
          "required": true
        },
        {
          "id": "t73orffy5",
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
      "id": "dt-1hbhpass4",
      "name": "Walk_ins",
      "fields": [
        {
          "id": "rmewdfm4b",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "3vncp4rz7",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "wni9bdaz3",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "3wijdjmmu",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "iz0av41jy",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "ydq8c46i5",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: wartend, platziert, abgegangen",
          "required": true
        },
        {
          "id": "v8zx75wp3",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "14b2r5xzx",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "vh9rc7q20",
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
      "id": "dt-uffpkxo4r",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "q4m206lnn",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "5pak7dhq2",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "n152f1suk",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "y51dm579y",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "lt8tz1fnb",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": false
        },
        {
          "id": "p1g7sy33w",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "vnfobh5m6",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "qobxxi4k1",
          "name": "einladung_token",
          "type": "Text",
          "description": "einladung_token",
          "required": false
        },
        {
          "id": "zfpcgou3c",
          "name": "einladung_gueltig_bis",
          "type": "Datum",
          "description": "einladung_gueltig_bis",
          "required": false
        },
        {
          "id": "txtlebfa6",
          "name": "email_verifiziert",
          "type": "Ja/Nein",
          "description": "email_verifiziert",
          "required": true
        },
        {
          "id": "h40niokdn",
          "name": "verifizierung_token",
          "type": "Text",
          "description": "verifizierung_token",
          "required": false
        },
        {
          "id": "dpnbxtin1",
          "name": "stundenlohn",
          "type": "Text",
          "description": "stundenlohn",
          "required": false
        },
        {
          "id": "rpdxvr605",
          "name": "urlaubsanspruch_tage",
          "type": "Zahl",
          "description": "urlaubsanspruch_tage",
          "required": false
        },
        {
          "id": "mjjzvl4w8",
          "name": "foto_url",
          "type": "Text",
          "description": "foto_url",
          "required": false
        },
        {
          "id": "q30xdexfo",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-q3gczmgz8",
      "name": "Schichten",
      "fields": [
        {
          "id": "u4su0zqm4",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "9x2isnuxd",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "b0dlyyc09",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "pt10c3kwg",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "53id0jqon",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "yjkonbump",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "jvsbk3nha",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "zc5vnrdy9",
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
      "id": "dt-io3yi6pnh",
      "name": "Abwesenheiten",
      "fields": [
        {
          "id": "4i68j3g9z",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "i8nn2m4hm",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "lfwydj26j",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "p680s9grg",
          "name": "von_datum",
          "type": "Datum",
          "description": "von_datum",
          "required": true
        },
        {
          "id": "ud4a8nlt8",
          "name": "bis_datum",
          "type": "Datum",
          "description": "bis_datum",
          "required": true
        },
        {
          "id": "5dvleotvz",
          "name": "typ",
          "type": "Option Set",
          "description": "Moegliche Werte: urlaub, krank, sonstiges",
          "required": true
        },
        {
          "id": "sjp2mi8bm",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "4eqdta9g3",
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
      "id": "dt-aft1wwpui",
      "name": "Schichttausch",
      "fields": [
        {
          "id": "uo0umtju5",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "4wlmu87oa",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "cz62027mx",
          "name": "anbieter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "jy0cxbs3y",
          "name": "anbieter_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": true
        },
        {
          "id": "e20el94t7",
          "name": "annehmer_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": false
        },
        {
          "id": "rgy80gj6a",
          "name": "annehmer_schicht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schichten",
          "required": false
        },
        {
          "id": "hpd63o907",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, angeboten, genehmigt, abgelehnt",
          "required": true
        },
        {
          "id": "ulshjnlsm",
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
      "id": "dt-g9hkk4p8u",
      "name": "Schicht_templates",
      "fields": [
        {
          "id": "1f8vmmnqa",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "fda8dxa66",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "5dg57xe40",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "z4e1j8q8k",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-cw82j8zw5",
      "name": "Schicht_template_eintraege",
      "fields": [
        {
          "id": "lpl4ohq2n",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xf5jhk2uw",
          "name": "template_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Schicht_templates",
          "required": true
        },
        {
          "id": "j1ezvpnkt",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "2ucq41ej2",
          "name": "wochentag",
          "type": "Text",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "62xxkty34",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "ym27ylcyu",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "hu3rb60mc",
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
      "id": "dt-2borci0df",
      "name": "Oeffnungszeiten",
      "fields": [
        {
          "id": "y5zj2pj10",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xwkwfcig1",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "4rosl766e",
          "name": "wochentag",
          "type": "Zahl",
          "description": "wochentag",
          "required": true
        },
        {
          "id": "fhbpt2nf4",
          "name": "von",
          "type": "Datum",
          "description": "von",
          "required": true
        },
        {
          "id": "cwzsplqzb",
          "name": "bis",
          "type": "Datum",
          "description": "bis",
          "required": true
        },
        {
          "id": "d1nqlh54x",
          "name": "geschlossen",
          "type": "Ja/Nein",
          "description": "geschlossen",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-1m21ucacq",
      "name": "Ausnahmetage",
      "fields": [
        {
          "id": "lf7ro9508",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "hveloegzk",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "2ph52o8uh",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "zmcjyire4",
          "name": "grund",
          "type": "Text",
          "description": "grund",
          "required": false
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-3uf6juobh",
      "name": "Passwort_resets",
      "fields": [
        {
          "id": "f26j1lvej",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "cf4i0oyxf",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "kexe6w35r",
          "name": "token",
          "type": "Text",
          "description": "token",
          "required": true
        },
        {
          "id": "vs5vaf9dk",
          "name": "gueltig_bis",
          "type": "Datum",
          "description": "gueltig_bis",
          "required": true
        },
        {
          "id": "89hdao1rx",
          "name": "benutzt",
          "type": "Ja/Nein",
          "description": "benutzt",
          "required": true
        },
        {
          "id": "7e2lwrq0f",
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
      "id": "dt-7ev49ja90",
      "name": "Login_versuche",
      "fields": [
        {
          "id": "ii4pu5436",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "f1i3pw9ug",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "damd5oqb1",
          "name": "ip_adresse",
          "type": "Text",
          "description": "ip_adresse",
          "required": false
        },
        {
          "id": "091q9n00l",
          "name": "erfolgreich",
          "type": "Ja/Nein",
          "description": "erfolgreich",
          "required": true
        },
        {
          "id": "v31iu5o5t",
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
      "id": "vnhpa60ex",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "lhlxxiib8",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "44ccyingw",
      "name": "Tische_Form",
      "values": [
        "rechteck, rund, quadrat, bar"
      ]
    },
    {
      "id": "w4leitqac",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "cz9i2zwtz",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert, abgeschlossen, no_show"
      ]
    },
    {
      "id": "q23yjqytx",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon, online, google"
      ]
    },
    {
      "id": "w0fwuti1b",
      "name": "Walk_ins_Status",
      "values": [
        "wartend, platziert, abgegangen"
      ]
    },
    {
      "id": "jv9gp5fit",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    },
    {
      "id": "vt9usa97q",
      "name": "Abwesenheiten_Typ",
      "values": [
        "urlaub, krank, sonstiges"
      ]
    },
    {
      "id": "iu4pgzxr3",
      "name": "Schichttausch_Status",
      "values": [
        "offen, angeboten, genehmigt, abgelehnt"
      ]
    }
  ],
  "workflows": [
    {
      "id": "tqolj6twj",
      "name": "Abo abrufen",
      "folder": "Abo",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abo-Seite geladen wird",
      "steps": [
        {
          "id": "0atmnrawv",
          "type": "api",
          "desc": "GET /api/abo aufrufen"
        },
        {
          "id": "8gfn8tq1n",
          "type": "database",
          "desc": "Abo-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "md1y7npan",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "mgsywew3b",
      "name": "Abo erstellen",
      "folder": "Abo",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abo abgeschickt wird",
      "steps": [
        {
          "id": "qbna5d260",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "s7qtbsqok",
          "type": "api",
          "desc": "POST /api/abo aufrufen"
        },
        {
          "id": "p35wj5fus",
          "type": "database",
          "desc": "Neuen Abo-Datensatz in DB speichern"
        },
        {
          "id": "nyyszi1ja",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "iwcyfb0wo",
      "name": "Abwesenheiten abrufen",
      "folder": "Abwesenheiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Abwesenheiten-Seite geladen wird",
      "steps": [
        {
          "id": "vs209cj1w",
          "type": "api",
          "desc": "GET /api/abwesenheiten aufrufen"
        },
        {
          "id": "c79jiw4a1",
          "type": "database",
          "desc": "Abwesenheiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "yiolbetyk",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "l9qojovax",
      "name": "Abwesenheiten erstellen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Abwesenheiten abgeschickt wird",
      "steps": [
        {
          "id": "ycp3fky8g",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "joczm2izo",
          "type": "api",
          "desc": "POST /api/abwesenheiten aufrufen"
        },
        {
          "id": "mlywkrsok",
          "type": "database",
          "desc": "Neuen Abwesenheiten-Datensatz in DB speichern"
        },
        {
          "id": "4aphs73an",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "81nwwzk1g",
      "name": "Abwesenheiten loeschen",
      "folder": "Abwesenheiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "v46z0jfx5",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "3apewls7p",
          "type": "api",
          "desc": "DELETE /api/abwesenheiten/:id aufrufen"
        },
        {
          "id": "k1zmt1fte",
          "type": "database",
          "desc": "Abwesenheiten-Datensatz aus DB entfernen"
        },
        {
          "id": "b37lwn2kd",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "0cpd4f52q",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "xe6nldf2w",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "8lmyrrm0d",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "fd2bkt46l",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "n3w06pwjc",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "61xnql8qb",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "7au5jlu54",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "vsh43wa4k",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "9vhwrc49v",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "8uyl5l6ab",
      "name": "Bereiche abrufen",
      "folder": "Bereiche",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche-Seite geladen wird",
      "steps": [
        {
          "id": "ysc7agnk2",
          "type": "api",
          "desc": "GET /api/bereiche aufrufen"
        },
        {
          "id": "e3m7byp8e",
          "type": "database",
          "desc": "Bereiche-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8yldogmvt",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "1qpciw6h5",
      "name": "Bereiche erstellen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bereiche abgeschickt wird",
      "steps": [
        {
          "id": "td3grjhrg",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "cgrf9r7j9",
          "type": "api",
          "desc": "POST /api/bereiche aufrufen"
        },
        {
          "id": "qee3nkx0f",
          "type": "database",
          "desc": "Neuen Bereiche-Datensatz in DB speichern"
        },
        {
          "id": "2ac5jmrx6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "bptn6oiar",
      "name": "Bereiche bearbeiten",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bereiche bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "8mqei8lmr",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "bw0ow69qz",
          "type": "api",
          "desc": "PATCH /api/bereiche/:id aufrufen"
        },
        {
          "id": "2fjg1y92t",
          "type": "database",
          "desc": "Bereiche-Datensatz in DB aktualisieren"
        },
        {
          "id": "w5kv6yah7",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "4gpnau3tj",
      "name": "Bereiche loeschen",
      "folder": "Bereiche",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "tfaofq87o",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "cuk8ggjpv",
          "type": "api",
          "desc": "DELETE /api/bereiche/:id aufrufen"
        },
        {
          "id": "gjk457va5",
          "type": "database",
          "desc": "Bereiche-Datensatz aus DB entfernen"
        },
        {
          "id": "7arci7rdy",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "hxsptqiso",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "dyezfl6l7",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "1n4510cab",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "2sohgon4e",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ojn2l35bb",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "ucecvgagp",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "d74w5c4wn",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "d9qq3foc9",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "xqixhp4w5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "boabq039o",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "h4djxg28p",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "b3ikgmjoz",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "26vrqywjs",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "m4c578f7r",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "qu59vm3uy",
      "name": "Bewertungen abrufen",
      "folder": "Bewertungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bewertungen-Seite geladen wird",
      "steps": [
        {
          "id": "ygivwaunv",
          "type": "api",
          "desc": "GET /api/bewertungen aufrufen"
        },
        {
          "id": "6vdafv4eo",
          "type": "database",
          "desc": "Bewertungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "5n55xcpmp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ndfypl8vw",
      "name": "Bewertungen erstellen",
      "folder": "Bewertungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bewertungen abgeschickt wird",
      "steps": [
        {
          "id": "oyg0j5cwg",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "01caz9998",
          "type": "api",
          "desc": "POST /api/bewertungen aufrufen"
        },
        {
          "id": "hq156vmve",
          "type": "database",
          "desc": "Neuen Bewertungen-Datensatz in DB speichern"
        },
        {
          "id": "nim8p10l5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "72ezo6hix",
      "name": "Buchung abrufen",
      "folder": "Buchung",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Buchung-Seite geladen wird",
      "steps": [
        {
          "id": "n0anl4agg",
          "type": "api",
          "desc": "GET /api/buchung aufrufen"
        },
        {
          "id": "exljf3q71",
          "type": "database",
          "desc": "Buchung-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "tgxv0xmo3",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "jcx2574o4",
      "name": "Buchung erstellen",
      "folder": "Buchung",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Buchung abgeschickt wird",
      "steps": [
        {
          "id": "ls3kw4w7g",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "kk9qkpwra",
          "type": "api",
          "desc": "POST /api/buchung aufrufen"
        },
        {
          "id": "82fmrvyna",
          "type": "database",
          "desc": "Neuen Buchung-Datensatz in DB speichern"
        },
        {
          "id": "rfjhlk48b",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "mujm07p7b",
      "name": "Dekorationen abrufen",
      "folder": "Dekorationen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dekorationen-Seite geladen wird",
      "steps": [
        {
          "id": "vyf63smey",
          "type": "api",
          "desc": "GET /api/dekorationen aufrufen"
        },
        {
          "id": "6u468rorw",
          "type": "database",
          "desc": "Dekorationen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "inueisvbq",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "gyl1gv9wj",
      "name": "Dekorationen erstellen",
      "folder": "Dekorationen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dekorationen abgeschickt wird",
      "steps": [
        {
          "id": "jcozo3txw",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "m4odlyxue",
          "type": "api",
          "desc": "POST /api/dekorationen aufrufen"
        },
        {
          "id": "hmfg8udat",
          "type": "database",
          "desc": "Neuen Dekorationen-Datensatz in DB speichern"
        },
        {
          "id": "c2ikhi2q4",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "2705ww91x",
      "name": "Dekorationen bearbeiten",
      "folder": "Dekorationen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dekorationen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "incpwrr1q",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "cq26x9vd4",
          "type": "api",
          "desc": "PATCH /api/dekorationen/:id aufrufen"
        },
        {
          "id": "v22mpybn1",
          "type": "database",
          "desc": "Dekorationen-Datensatz in DB aktualisieren"
        },
        {
          "id": "aaf1euc14",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ztqzchzbj",
      "name": "Dekorationen loeschen",
      "folder": "Dekorationen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "3bl7by9ad",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "6vl4h39di",
          "type": "api",
          "desc": "DELETE /api/dekorationen/:id aufrufen"
        },
        {
          "id": "9lqcn6anl",
          "type": "database",
          "desc": "Dekorationen-Datensatz aus DB entfernen"
        },
        {
          "id": "7uigeqm63",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "dxbzmiu87",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "i25b3s906",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "a4ke143tm",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "9q34fx0c4",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "pxayz9x30",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "j4efjtwfe",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "rm5v6y0a9",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "kf50je055",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "v07c3dpry",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "vuw3s4zpz",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "neo9oh3pt",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "tmtnbnhel",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "ej3tnk9is",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "e7zcjhxfc",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "heofj1oum",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "5eiwzjudi",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "ouzof3gpj",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "o1nieabao",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "i51k3cb6w",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "cyhed3zqm",
      "name": "Erlebnisse abrufen",
      "folder": "Erlebnisse",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Erlebnisse-Seite geladen wird",
      "steps": [
        {
          "id": "oet1nye9j",
          "type": "api",
          "desc": "GET /api/erlebnisse aufrufen"
        },
        {
          "id": "c8l3y4fhl",
          "type": "database",
          "desc": "Erlebnisse-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "r14sav96x",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "1zh9eik8j",
      "name": "Erlebnisse erstellen",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Erlebnisse abgeschickt wird",
      "steps": [
        {
          "id": "k3j4nnfth",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "y2t55gu26",
          "type": "api",
          "desc": "POST /api/erlebnisse aufrufen"
        },
        {
          "id": "kjpona05s",
          "type": "database",
          "desc": "Neuen Erlebnisse-Datensatz in DB speichern"
        },
        {
          "id": "l7ojhk9nj",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "z9nnqawqc",
      "name": "Erlebnisse bearbeiten",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Erlebnisse bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "ejxj3x9zh",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "bddby5j7k",
          "type": "api",
          "desc": "PATCH /api/erlebnisse/:id aufrufen"
        },
        {
          "id": "8rtdufcva",
          "type": "database",
          "desc": "Erlebnisse-Datensatz in DB aktualisieren"
        },
        {
          "id": "6r7odvvze",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "uhc7dnlqa",
      "name": "Erlebnisse loeschen",
      "folder": "Erlebnisse",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "7fbl4ghrh",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "1zbufunxp",
          "type": "api",
          "desc": "DELETE /api/erlebnisse/:id aufrufen"
        },
        {
          "id": "7wd32bjme",
          "type": "database",
          "desc": "Erlebnisse-Datensatz aus DB entfernen"
        },
        {
          "id": "ptg8pfjpp",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "kyuztm0pm",
      "name": "Gaeste abrufen",
      "folder": "Gaeste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste-Seite geladen wird",
      "steps": [
        {
          "id": "309wig3nn",
          "type": "api",
          "desc": "GET /api/gaeste aufrufen"
        },
        {
          "id": "dd8ymo99f",
          "type": "database",
          "desc": "Gaeste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "6h8y835jx",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "bl3v4ihbe",
      "name": "Gaeste erstellen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Gaeste abgeschickt wird",
      "steps": [
        {
          "id": "73w8b786i",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "wrkoq47v7",
          "type": "api",
          "desc": "POST /api/gaeste aufrufen"
        },
        {
          "id": "pso3qx5qa",
          "type": "database",
          "desc": "Neuen Gaeste-Datensatz in DB speichern"
        },
        {
          "id": "nur7v0t0p",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "o25zn42in",
      "name": "Gaeste bearbeiten",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Gaeste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "te0zpob6g",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "wdldayqug",
          "type": "api",
          "desc": "PATCH /api/gaeste/:id aufrufen"
        },
        {
          "id": "z1weimfbn",
          "type": "database",
          "desc": "Gaeste-Datensatz in DB aktualisieren"
        },
        {
          "id": "8r5l3i0c9",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "vdht171g7",
      "name": "Gaeste loeschen",
      "folder": "Gaeste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "o35flhq3u",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "liiiiiowi",
          "type": "api",
          "desc": "DELETE /api/gaeste/:id aufrufen"
        },
        {
          "id": "0uzj4wvrt",
          "type": "database",
          "desc": "Gaeste-Datensatz aus DB entfernen"
        },
        {
          "id": "acpw6ks0g",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "f4g0uxatx",
      "name": "Google-reserve abrufen",
      "folder": "Google-reserve",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Google-reserve-Seite geladen wird",
      "steps": [
        {
          "id": "5v3ve2r2f",
          "type": "api",
          "desc": "GET /api/google-reserve aufrufen"
        },
        {
          "id": "vff7yelmi",
          "type": "database",
          "desc": "Google-reserve-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "yzby0flh0",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "vemj28rwb",
      "name": "Google-reserve erstellen",
      "folder": "Google-reserve",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Google-reserve abgeschickt wird",
      "steps": [
        {
          "id": "frdrfdlrt",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fpbzwx2yz",
          "type": "api",
          "desc": "POST /api/google-reserve aufrufen"
        },
        {
          "id": "u1hksssxe",
          "type": "database",
          "desc": "Neuen Google-reserve-Datensatz in DB speichern"
        },
        {
          "id": "yzkt0gux4",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zpt49l23g",
      "name": "Inventur abrufen",
      "folder": "Inventur",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Inventur-Seite geladen wird",
      "steps": [
        {
          "id": "4r0g037lg",
          "type": "api",
          "desc": "GET /api/inventur aufrufen"
        },
        {
          "id": "qywhvgu9f",
          "type": "database",
          "desc": "Inventur-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "tgbt6969d",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ybll157nv",
      "name": "Inventur erstellen",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Inventur abgeschickt wird",
      "steps": [
        {
          "id": "40lutksli",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "b6alryilb",
          "type": "api",
          "desc": "POST /api/inventur aufrufen"
        },
        {
          "id": "5reiv3acw",
          "type": "database",
          "desc": "Neuen Inventur-Datensatz in DB speichern"
        },
        {
          "id": "bjbb49avr",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "axmr85faz",
      "name": "Inventur bearbeiten",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Inventur bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "156ptlow7",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "y6pf3mw2q",
          "type": "api",
          "desc": "PATCH /api/inventur/:id aufrufen"
        },
        {
          "id": "b0oaz113z",
          "type": "database",
          "desc": "Inventur-Datensatz in DB aktualisieren"
        },
        {
          "id": "7wtxg77ks",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "otagpbjem",
      "name": "Inventur loeschen",
      "folder": "Inventur",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "gdgn13y2r",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "2nbjwfsus",
          "type": "api",
          "desc": "DELETE /api/inventur/:id aufrufen"
        },
        {
          "id": "yir936vsy",
          "type": "database",
          "desc": "Inventur-Datensatz aus DB entfernen"
        },
        {
          "id": "dmy44ymq9",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "w0pynoakk",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "9gwzodsbv",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "s1ikiofpq",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "lugyty94k",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "wjup2rcjx",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "lomvgftk3",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "i30dlk2fq",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "2l98ypslb",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "rvanknkvm",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zpun74fjd",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "dgvimu9pr",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "yadf6jma6",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "gzjshhrk8",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "a2xa9964x",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "85xdugoyd",
      "name": "Oeffnungszeiten abrufen",
      "folder": "Oeffnungszeiten",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten-Seite geladen wird",
      "steps": [
        {
          "id": "dv7bq2mid",
          "type": "api",
          "desc": "GET /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "2fml586gv",
          "type": "database",
          "desc": "Oeffnungszeiten-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "96vupbc0j",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "9ne4t5cok",
      "name": "Oeffnungszeiten erstellen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Oeffnungszeiten abgeschickt wird",
      "steps": [
        {
          "id": "i29t85a2z",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "zfsyiv4pi",
          "type": "api",
          "desc": "POST /api/oeffnungszeiten aufrufen"
        },
        {
          "id": "5wrd2c8pv",
          "type": "database",
          "desc": "Neuen Oeffnungszeiten-Datensatz in DB speichern"
        },
        {
          "id": "ofeyka2qi",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "2qzi08l92",
      "name": "Oeffnungszeiten bearbeiten",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Oeffnungszeiten bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "mfsmsxn8o",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "5fzt82w7b",
          "type": "api",
          "desc": "PATCH /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "1n1dmy58q",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz in DB aktualisieren"
        },
        {
          "id": "nmr32mfet",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "22w2lsx5s",
      "name": "Oeffnungszeiten loeschen",
      "folder": "Oeffnungszeiten",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "nhfw094d4",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "3klgpl6hc",
          "type": "api",
          "desc": "DELETE /api/oeffnungszeiten/:id aufrufen"
        },
        {
          "id": "z6q49fktq",
          "type": "database",
          "desc": "Oeffnungszeiten-Datensatz aus DB entfernen"
        },
        {
          "id": "ddzd2ofwj",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "f2oaejpth",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "koex28l01",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "rp2aomepd",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "5r77yxh8c",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "kos2d4ogo",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "zach5ho8y",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "xcmri2sxf",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "hbys5je5g",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "okub8qu5p",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "o5pms4p63",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "yo1ehfk6d",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "exkkfcs3n",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "7g8s14e22",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "wijnyrwb2",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "zqur9mnod",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "mgjdkgvze",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "50dcpdn2d",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "bzsd503rv",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "pp71xo5mg",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "wkpz7c1md",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "qsftjalu2",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "z2l9w1s3o",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "y4zuedmco",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "sjv70fti7",
      "name": "Restaurant erstellen",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Restaurant abgeschickt wird",
      "steps": [
        {
          "id": "bikko7cgu",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "i5dnonukk",
          "type": "api",
          "desc": "POST /api/restaurant aufrufen"
        },
        {
          "id": "50nto2h8p",
          "type": "database",
          "desc": "Neuen Restaurant-Datensatz in DB speichern"
        },
        {
          "id": "hb03138kv",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "qlgkq5f8n",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "84jc0chb8",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "hehx630e3",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "zlicro80n",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "fp2457prn",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "0hejcq8bm",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "m93qzidjo",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "ru0aqe8f6",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "3ids6u2wx",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "ssvuuw0cx",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "7sukuvied",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "xjmvnbdih",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "hpk5gtozv",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "cldp2sn45",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "vy4k4mipf",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "oaqog909u",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "0cg598zjr",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "azj8c7fo6",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "prs3cxd48",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "z31htnlmd",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "3qkk67nl5",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "wzwm7bdor",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "qgs4rm5sw",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "4mvymxstf",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "38l1bnpqm",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "7h38qlikr",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "fi4n3bptp",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "ddr901eho",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "fogwrwtz4",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "3xvxu2shx",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "xdsnf8j52",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8uwsx971v",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "x9qlf1q5p",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "x6l47f5j8",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6vnafp00l",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "py8ja16z5",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "sd06hei9f",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "dspo9w3sp",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "2o295u8rm",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "7gv6gp7me",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "p9b1h45nt",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "jswg2qokw",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ftfet76pb",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "0rcak7137",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "rjbq6wm6l",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "frmsv9k89",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "q9h3u2atk",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "dbhbzjvuo",
      "name": "Uploads erstellen",
      "folder": "Uploads",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Uploads abgeschickt wird",
      "steps": [
        {
          "id": "13nixuvgm",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "fwu2czord",
          "type": "api",
          "desc": "POST /api/uploads aufrufen"
        },
        {
          "id": "2xjtk9mqu",
          "type": "database",
          "desc": "Neuen Uploads-Datensatz in DB speichern"
        },
        {
          "id": "3r35ylw0p",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zjchuijx7",
      "name": "Verfuegbarkeit abrufen",
      "folder": "Verfuegbarkeit",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Verfuegbarkeit-Seite geladen wird",
      "steps": [
        {
          "id": "qgd2d6oup",
          "type": "api",
          "desc": "GET /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "dxh5g7fqj",
          "type": "database",
          "desc": "Verfuegbarkeit-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "4x3yoo2a3",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "xgeyv2q55",
      "name": "Verfuegbarkeit erstellen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Verfuegbarkeit abgeschickt wird",
      "steps": [
        {
          "id": "6bjddkix1",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "dvj3wmhov",
          "type": "api",
          "desc": "POST /api/verfuegbarkeit aufrufen"
        },
        {
          "id": "583jtzoch",
          "type": "database",
          "desc": "Neuen Verfuegbarkeit-Datensatz in DB speichern"
        },
        {
          "id": "v1baj3fdy",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "x7gdnb2ak",
      "name": "Verfuegbarkeit loeschen",
      "folder": "Verfuegbarkeit",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "fzls8935p",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "4sj2jhg69",
          "type": "api",
          "desc": "DELETE /api/verfuegbarkeit/:id aufrufen"
        },
        {
          "id": "k2i92xwjn",
          "type": "database",
          "desc": "Verfuegbarkeit-Datensatz aus DB entfernen"
        },
        {
          "id": "sn9epd2mx",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "7tq9aunhr",
      "name": "Walk-ins abrufen",
      "folder": "Walk-ins",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins-Seite geladen wird",
      "steps": [
        {
          "id": "tmlmbem18",
          "type": "api",
          "desc": "GET /api/walk-ins aufrufen"
        },
        {
          "id": "9ibfwlyvo",
          "type": "database",
          "desc": "Walk-ins-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "gwt7wdylo",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "sx8z7sdnz",
      "name": "Walk-ins erstellen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Walk-ins abgeschickt wird",
      "steps": [
        {
          "id": "9hj0ewicq",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "ui440fmm6",
          "type": "api",
          "desc": "POST /api/walk-ins aufrufen"
        },
        {
          "id": "yqktagetm",
          "type": "database",
          "desc": "Neuen Walk-ins-Datensatz in DB speichern"
        },
        {
          "id": "nztql5iok",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "dihe4b8iw",
      "name": "Walk-ins bearbeiten",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Walk-ins bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "wts19mpku",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "mpv5q92kc",
          "type": "api",
          "desc": "PATCH /api/walk-ins/:id aufrufen"
        },
        {
          "id": "tyje1xwjy",
          "type": "database",
          "desc": "Walk-ins-Datensatz in DB aktualisieren"
        },
        {
          "id": "f65djob3t",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ypd6hneyc",
      "name": "Walk-ins loeschen",
      "folder": "Walk-ins",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "qw1atz08v",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "dsqjq9fxb",
          "type": "api",
          "desc": "DELETE /api/walk-ins/:id aufrufen"
        },
        {
          "id": "vo3hyjdu1",
          "type": "database",
          "desc": "Walk-ins-Datensatz aus DB entfernen"
        },
        {
          "id": "elxx5vurs",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "h7zqghu4j",
      "name": "Warteliste abrufen",
      "folder": "Warteliste",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Warteliste-Seite geladen wird",
      "steps": [
        {
          "id": "ryg44h9xr",
          "type": "api",
          "desc": "GET /api/warteliste aufrufen"
        },
        {
          "id": "x29fpi3yb",
          "type": "database",
          "desc": "Warteliste-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "n380j25nn",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "wbch1303a",
      "name": "Warteliste erstellen",
      "folder": "Warteliste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Warteliste abgeschickt wird",
      "steps": [
        {
          "id": "bkc5dykhp",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "pbyd8dz9w",
          "type": "api",
          "desc": "POST /api/warteliste aufrufen"
        },
        {
          "id": "2z4g6bl90",
          "type": "database",
          "desc": "Neuen Warteliste-Datensatz in DB speichern"
        },
        {
          "id": "6j4x7upjm",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zglr05o6u",
      "name": "Warteliste bearbeiten",
      "folder": "Warteliste",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Warteliste bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "6q17dvdgb",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "8ohmczt49",
          "type": "api",
          "desc": "PATCH /api/warteliste/:id aufrufen"
        },
        {
          "id": "0e0chorji",
          "type": "database",
          "desc": "Warteliste-Datensatz in DB aktualisieren"
        },
        {
          "id": "ufpwtph8r",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "4wt0ic09a",
      "name": "AGB",
      "desc": "Seite: AGB — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "zfuhognl2",
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
      "id": "p2uwthjox",
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
      "id": "aasmlvl65",
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
      "id": "g943s9412",
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
      "id": "1gq1i6yuf",
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
      "id": "kpcvhrzxm",
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
      "id": "i2kkz99c8",
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
      "id": "5jp0qohpf",
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
      "id": "71o6x01el",
      "name": "Datenschutz",
      "desc": "Seite: Datenschutz — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "9f6tgxi4h",
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
      "id": "v6j9ryiyh",
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
      "id": "tbnujwktj",
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
      "id": "8qa5mv2w7",
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
      "id": "9bgw3lgfg",
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
      "id": "0onoqjpqw",
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
      "id": "6xh7k9duq",
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
      "id": "4uucla0t9",
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
      "id": "2lmw2koe9",
      "name": "Impressum",
      "desc": "Seite: Impressum — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "7k097d80r",
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
      "id": "zxioxxu7k",
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
      "id": "ekn2tglnh",
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
      "id": "ompps0xwo",
      "name": "NewsletterWiderspruch",
      "desc": "Seite: NewsletterWiderspruch — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "ycm0fr1nh",
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
      "id": "og18kaxrz",
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
      "id": "huwa65w85",
      "name": "PlanAuswaehlen",
      "desc": "Seite: PlanAuswaehlen — Nutzt 2 Hooks, 0 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "AboStore",
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
      "id": "f2kwg676c",
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
      "id": "uog6kfq9i",
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
      "id": "dwqybo4in",
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
      "id": "n840e2xwk",
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
      "id": "z4tqhatce",
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
      "id": "8mlah5nen",
      "name": "RestaurantEmailBestaetigen",
      "desc": "Seite: RestaurantEmailBestaetigen — Nutzt 0 Hooks, 0 Komponenten",
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
      "id": "dypqd35ga",
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
      "id": "u4cp4vnmx",
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
      "id": "cyvpmvchu",
      "name": "Tischplan",
      "desc": "Seite: Tischplan — Nutzt 5 Hooks, 3 Komponenten",
      "status": "Fertig",
      "dataTypes": [
        "Tische",
        "Bereiche",
        "Dekorationen",
        "AuthStore",
        "Reservierungen"
      ],
      "reusables": [
        "ReservierungsTimeline",
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
      "id": "w1wn6imcb",
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
      "id": "x3e9wexs0",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "kxutzpod7",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "p33kg2lbe",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "ityyqjr2m",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "2k85n11jq",
      "name": "API: Extras",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Extras",
      "url": "/api/extras"
    },
    {
      "id": "eq3i9acy6",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "fxlt9jsgk",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "owed829q2",
      "name": "API: Dekorationen (NEU 2026-04-26)\nStatische Floor-Plan-Elemente",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Dekorationen (NEU 2026-04-26)\nStatische Floor-Plan-Elemente",
      "url": "/api/dekorationenneustatischefloorplanelemente"
    },
    {
      "id": "t9swdwmwz",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "ocr4j99ln",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "8ks7t58kg",
      "name": "API: Online-Buchung (",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "6 Endpunkte fuer Online-Buchung (",
      "url": "/api/onlinebuchung"
    },
    {
      "id": "xyik88kbt",
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
      "id": "6z4k33ya7",
      "title": "**Migration auf Production-DB ausführen** (`migration-floorplan-erweitert.sql`) — läuft automatisch beim nächsten Deploy via `runAllMigrations`",
      "desc": "Aus 📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "oqbz8f23w",
      "title": "**Stripe-Webhook im Live-Dashboard prüfen** — Endpoint URL muss auf Production-Backend zeigen, alle 4 Events abonniert",
      "desc": "Aus 📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "k257rub2m",
      "title": "**Stripe-Audit Folgefixes** — Bug 2 (62-Tage-Doppel-Update) + Inkonsistenz 1 (Folge-Zahlungen in `zahlungen` loggen) noch offen",
      "desc": "Aus 📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ju3gktl9o",
      "title": "**Erlebnis-Stripe-Code aufräumen** — `ErlebnisModel.buchungBezahlen()` + `buchungStripeSessionSetzen()` sind tote Helfer, bleiben für Stripe Connect Phase C",
      "desc": "Aus 📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "yjqkja75q",
      "title": "**Reservierung-Quick-Actions in Timeline** — Inline-Buttons (Bestätigen / No-Show / Stornieren) bei ausgewählter Reservierung",
      "desc": "Aus 📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "091zx7upi",
      "title": "**seven.io Integration** — SMS-Versand umstellen (ersetzt Konsolen-Ausgabe im Dev-Modus, siehe \"Vor Release\"-Block)",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "s60pgbngz",
      "title": "**21.dev fuer Landingpage nutzen** — Marketing-Website serve-flow.org mit 21.dev bauen (Hero, Features, Preise)",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "qhvjsrnto",
      "title": "**Designs anpassen Bestellseite** — Preset-Galerie + Theme-Feinschliff (haengt mit Phase 6 zusammen)",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "xl7d0mp25",
      "title": "**Tischplan: Bild auf Handy bearbeiten** — mobile UX im Floor Plan Editor pruefen/fixen",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ej1ti6feq",
      "title": "**Restaurant-Webseite bauen + mit App verknuepfen** — Pilot-Kunde: eigene Webseite + Reservierung/Bestellung ueber ServeFlow-Widget",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "pfffpekvf",
      "title": "**Testdaten der App durchtesten** — End-to-End mit realistischen Daten, alle kritischen Flows",
      "desc": "Aus 📌 Fuer morgen (aufgenommen 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1ffclztmc",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "6gyie9aaz",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "no3wbtydw",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ntu1u9d4s",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "z8uhbcb9k",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "vixkpzi83",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "tkrc3qtlo",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "yjq0sgk9p",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "gow43m52i",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ohlwiwjfc",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8beydq1th",
      "title": "No-Show-Folgesystem (offen): Kreditkartengarantie (Stripe Auth-Hold) + Gaeste-Score (Anzahl No-Shows pro Gast → Risiko-Markierung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "x6d2z8b6k",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "f9r05ad5v",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "jjk2tsyfv",
      "title": "Landing Page bauen: Hero, Features, Preise (3 Pläne), CTA \"Jetzt starten\"",
      "desc": "Aus Marketing-Website (serve-flow.org)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "zl4lj6ilv",
      "title": "Impressum auf serve-flow.org einbauen (Inhalt fertig in App: `pages/Impressum.tsx`)",
      "desc": "Aus Marketing-Website (serve-flow.org)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "bb5um1wfk",
      "title": "Datenschutzerklärung auf serve-flow.org einbauen (Inhalt fertig in App: `pages/Datenschutz.tsx`)",
      "desc": "Aus Marketing-Website (serve-flow.org)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1kmji8i2n",
      "title": "AGB auf serve-flow.org einbauen (Inhalt fertig in App: `pages/AGB.tsx`)",
      "desc": "Aus Marketing-Website (serve-flow.org)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "t7kp40ra5",
      "title": "\"Jetzt starten\" CTA → Registrierung in der App",
      "desc": "Aus Marketing-Website (serve-flow.org)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "qrbsooz0x",
      "title": "**Anwaltsreview einplanen** — Impressum + Datenschutz + AGB + AVV von einem deutschen IT-/Datenschutz-Anwalt prüfen lassen (Erstkosten ca. 300–800 € einmalig). Empfohlene Kanzleien: anwalt.de Suche „IT-Recht Stuttgart\" oder eRecht24-Premium (günstigere Generator-Variante ~30 €/Jahr).",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "5bq8slmn7",
      "title": "**Berufshaftpflicht abschliessen** — vor erstem zahlendem Kunden. Anbieter für Solo-IT/SaaS: Hiscox „CyberClear\", exali „Software Profihaftpflicht\", VHV „IT-Haftpflicht\". Kosten ca. 25–60 €/Monat. Deckt Schäden durch Software-Fehler, Datenpannen, Vertragsverletzungen.",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "y7m6sha6d",
      "title": "**Stripe-Dashboard: Impressum-Link hinterlegen** — Stripe verlangt für deutsche Konten einen Link auf das Impressum (https://serve-flow.org/impressum nach Marketing-Site-Launch, ansonsten App-URL). Stripe Settings → Public business information.",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "3ic5y6ptu",
      "title": "**Stripe-Dashboard: Geschäftsdaten vervollständigen** — Anschrift, Kontakt-Email, Statement-Descriptor \"SERVEFLOW\", Support-URL.",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8rreeu8zy",
      "title": "**(Optional) Telefonnummer für Impressum** — nicht zwingend (Email reicht laut BGH 25.02.2016), aber gibt mehr Vertrauen. Wenn ja: Festnetz-Weiterleitung über Anbieter wie sipgate (~5 €/Monat) statt private Mobilnummer veröffentlichen.",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "3cgwos1dk",
      "title": "**Steuer-Registrierung beim Finanzamt** — falls noch nicht erfolgt: Fragebogen zur steuerlichen Erfassung über ELSTER ausgefüllt? Steuernummer für Einzelunternehmen vorhanden?",
      "desc": "Aus Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "c84n2zoli",
      "title": "**Coolify Docker-Driver-Logging** konfigurieren (json-file, max-size=10m, max-file=14) — Schritt-fuer-Schritt in `legal/logfile-rotation.md`",
      "desc": "Aus Manuelle Aufgaben Tag 3 (kann nur Ilias erledigen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "g8fx2f357",
      "title": "**Hetzner Snapshot-Policy** auf 14 Tage Aufbewahrung pruefen",
      "desc": "Aus Manuelle Aufgaben Tag 3 (kann nur Ilias erledigen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "7c7ih1sow",
      "title": "**CSP Test-Checkliste** beim ersten Production-Deploy abarbeiten — siehe `legal/csp-konfiguration.md` (Browser-Console auf Violations pruefen!)",
      "desc": "Aus Manuelle Aufgaben Tag 3 (kann nur Ilias erledigen)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ina58ytzk",
      "title": "**model-viewer per npm bundeln** wenn 3D-Showcase-Theme produktiv genutzt wird (`npm i @google/model-viewer` + dynamic import in Showcase-Layout)",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "0vah6vut4",
      "title": "**@fontsource fuer Theme-Fonts** (Cormorant Garamond, Playfair Display, Lato, Oswald, DM Sans, Space Grotesk, etc.) wenn Bestellseiten-Themes mit Custom-Schrift sinnvoll",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "gf8n8gcfg",
      "title": "**Cross-Tenant CI-Tests** schreiben — automatisierter Test dass Restaurant A nicht auf Daten von Restaurant B zugreifen kann",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1z27zxfue",
      "title": "**DB-Encryption at rest auf App-Level** — pflichtgemaess ab 5+ Kunden (Hetzner-Volume reicht aktuell, App-Level reduziert Art. 34-Pflicht bei Datenpanne)",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "6md4o1f2e",
      "title": "**DSFA fuer Mitarbeiter-Modul** vorbereiten — falls Performance-Tracking/Schichtbewertung eingefuehrt wird (EU AI Act Anhang III)",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "4e6u7ewp8",
      "title": "DPA-Plattform evaluieren (heyData/DataGuard ~99-199 €/Monat)",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "5ltvkin7n",
      "title": "Externer DSB freiwillig (~150 €/Monat) als Vertrauenssignal im Vertrieb",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "7p1r07ul4",
      "title": "DSB verpflichtend (oder externer DSB) sobald 20+ MA bei Auftraggeber/Anbieter",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "so4dmtltw",
      "title": "BSI Grundschutz-Profil \"Cloud\" als Eigenauskunft",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "mbczxjz9z",
      "title": "Penetration-Test (~5-8k €) vor Enterprise-Kunden",
      "desc": "Aus DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "mm7gy0oda",
      "title": "**Marketing-Site serve-flow.org** bauen (Hero, Features, Preise, CTA) — separates Projekt; Templates fuer Impressum/Datenschutz/AGB sind fertig in `restaurant-app/frontend/src/pages/`",
      "desc": "Aus Rechts-Set Tag 4+ (offen — gross)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "t26ya3jvr",
      "title": "**Anwaltsreview** der drei Frontend-Seiten + AVV + TOM + Datenpannen-Runbook (~300–800 €)",
      "desc": "Aus Rechts-Set Tag 4+ (offen — gross)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1ezy5moyk",
      "title": "**Per-Route-CSP** (Verschaerfung): `frame-ancestors 'none'` fuer App-Routes, `*` nur fuer /buchen, /bestellen, /reservierung, /erlebnis, /bewertung — verhindert Click-Jacking auf Login",
      "desc": "Aus Rechts-Set Tag 4+ (offen — gross)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "31kyxaou9",
      "title": "Stripe: 3 Produkte + Preise anlegen (29€, 59€, 99€) im Stripe-Dashboard (manuell)",
      "desc": "Aus Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "iksa17d4j",
      "title": "**Voraussetzung:** Developer Token bei ready2order beantragen (ready2order.com/en/api/)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8qfpvo4qq",
      "title": "**Voraussetzung:** ISV-Partner-Antrag bei orderbird stellen (orderbird.com/en/isv-partner-request) + Email an development@orderbird.com",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "bwqq0c756",
      "title": "**Voraussetzung:** Lightspeed Developer Portal registrieren (developers.lightspeedhq.com)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "eduis5i72",
      "title": "OAuth-Flow für ready2order implementieren (3-Stufen: Developer Token → Grant Token → Account Token)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "j0df1ydps",
      "title": "Adapter korrekt nach echten API-Docs bauen (orderbird, ready2order, Lightspeed)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "wa6t6ir7i",
      "title": "Rückrichtung: Zahlungen von Kasse → ServeFlow Status auf 'bezahlt' setzen (Webhooks)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "6heg3kqf4",
      "title": "Menü-Sync: Speisekarte aus KSS importieren",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "ucw8j6fm5",
      "title": "Custom-Integration als Paid Service (299€ einmalig für andere Systeme mit API)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "xsbq1h66c",
      "title": "Persistent Retry-Queue (DB-basiert, überlebt Server-Neustart)",
      "desc": "Aus Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8591zaaq6",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "4o3jy4hcm",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1d5sat58e",
      "title": "Wartezeit-Schätzung",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "c553olr3k",
      "title": "Trinkgeld-System — Gäste können bei Zahlung digital Trinkgeld geben (%, feste Beträge)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "1scpun09h",
      "title": "Split-Bill — Rechnung auf mehrere Personen aufteilen",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8gx1gn078",
      "title": "Prepayment bei Reservierung — Anzahlung für große Gruppen (ab 6 Personen) direkt bei Buchung",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "7gefdi3et",
      "title": "Bon-Drucker-Anbindung — ESC/POS-Protokoll für Küchenbons (Star, Epson)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "3dw99l057",
      "title": "Tagesangebote / Happy Hour — zeitgesteuerte Rabatte auf der Bestellseite",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "mvmngygxd",
      "title": "Kassenbuch-Export — Tagesabschluss als PDF/CSV für Steuerberater",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "9bd5lozhq",
      "title": "Personalkosten vs. Umsatz Ratio — live im Dashboard (Ziel: unter 30%)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "lpul58vvt",
      "title": "Gerichtanalyse — welche Gerichte werden zusammen bestellt (Cross-Sell-Hinweise)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "okhlu3hx4",
      "title": "Auslastungs-Heatmap — wann ist das Restaurant voll (nach Wochentag/Stunde)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "m7kmeqzmk",
      "title": "Digitale Speisekarte ohne Bestellfunktion — reiner Anzeige-Modus",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "xg81w4u8u",
      "title": "Allergen-Filter auf Bestellseite — Gäste filtern nach Laktose/Gluten etc.",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "6uxjmuzsh",
      "title": "Geburtstagsautomatisierung — Email/SMS am Geburtstag mit Rabattcode",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "mmqge5b13",
      "title": "Loyalty-Punkte — digitale Stempelkarte (10 Besuche → 1 gratis)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "jj4lcgphd",
      "title": "Gast-Feedback nach Besuch — automatische Email 2h nach Abreise",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "8sx5eic87",
      "title": "Küchen-Display-System (KDS) — separater Bildschirm für Küche statt Bon-Drucker",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "87i3pk8tg",
      "title": "Inventur-Warnschwellen — Push wenn Bestand unter X fällt (Echtzeit)",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "poz9u8dad",
      "title": "Tischstatus-Timeline — wann bestellt, wann geliefert, wann bezahlt",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "epn7y1zga",
      "title": "Öffnungszeiten-Ausnahmen — Feiertage, Betriebsurlaub automatisch sperren",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "lwqi2jkwr",
      "title": "DATEV-Export — Buchhaltungsdaten für deutschen Steuerberater",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "zt7s6a1uu",
      "title": "Meta/Google Ads Conversion-Tracking — Reservierungen als Events",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    },
    {
      "id": "0m51t8qu9",
      "title": "Zapier/Make-Webhook — für externe Automatisierungen",
      "desc": "Aus ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-26"
    }
  ],
  "roadmap": [
    {
      "id": "3cs9p4fig",
      "name": "✅ Erledigt 2026-04-26 (Stripe + Tischplan v2)",
      "todos": [
        {
          "id": "cqaz9in9j",
          "title": "Stripe-Bug v2026 API gefixt — `promotion.coupon` statt `coupon` direkt (`expand: ['data.promotion.coupon']` in pruefen + checkout)",
          "done": true
        },
        {
          "id": "xle8xp53z",
          "title": "Promo-Code-Logik gesäubert — `coupon.duration` + `coupon.duration_in_months` direkt aus Stripe lesen statt Custom-Metadata",
          "done": true
        },
        {
          "id": "uyk99p6rl",
          "title": "Erlebnis-Buchung: Stripe entfernt (Option B) — Vor-Ort-Zahlung statt Online-Prepayment, kein Stripe Connect nötig",
          "done": true
        },
        {
          "id": "mdgrpho5c",
          "title": "Coupon `gratis-3-monate` (100% off, 3 Monate) + Promo-Code `PIZZASERVICE` in Stripe angelegt + live getestet",
          "done": true
        },
        {
          "id": "7shcvnzn8",
          "title": "DB-Migration `migration-floorplan-erweitert.sql` — `reservierungen.tags TEXT[]` + neue Tabelle `dekorationen`",
          "done": true
        },
        {
          "id": "iqnveqtbk",
          "title": "Backend: `PATCH /api/reservierungen/:id/tags` + komplette `/api/dekorationen` CRUD-Routes",
          "done": true
        },
        {
          "id": "g6jjo4zju",
          "title": "`ReservierungModel.alle` mit LEFT JOIN auf gaeste → Gast-Stats (Besuche, No-Shows, CRM-Tags) in jeder Reservierung",
          "done": true
        },
        {
          "id": "750lfwrkm",
          "title": "Frontend: `ReservierungsTimeline`-Komponente (chronologische Liste mit \"Jetzt\"-Marker, Tags, Status-Icons)",
          "done": true
        },
        {
          "id": "p943v7uhw",
          "title": "Frontend: `useDekorationen`-Hook + Demo-Deko (Eingang, Bar, Pflanzen, Service-Station)",
          "done": true
        },
        {
          "id": "9gfhyvn3x",
          "title": "Tischplan: Split-View (Timeline links 340px + Floor Plan rechts) im Live-Modus",
          "done": true
        },
        {
          "id": "oq4czmyrk",
          "title": "Tischplan: Live-Uhr + \"Auf jetzt wechseln\" Button in Topbar (scrollt Timeline zu jetzt)",
          "done": true
        },
        {
          "id": "nfkz5a99i",
          "title": "Tischplan: Bereich-Tabs direkt am Canvas (Resmio-Style mit Cyan-Underline)",
          "done": true
        },
        {
          "id": "si5mij143",
          "title": "Tischplan: Diamond-Tische mit Stuhl-Indikatoren (Kreise rund um Tisch je nach Form/Kapazität)",
          "done": true
        },
        {
          "id": "pym9q340w",
          "title": "Tischplan: Live-Zeit-Badges auf Tischen (\"19:00\", \"5m\"-Countdown, \"JETZT\"-Overdue)",
          "done": true
        },
        {
          "id": "zehq2hxz7",
          "title": "Tischplan: Deko-Layer auf Canvas + Edit-Sidebar mit 6 Deko-Vorlagen (Pflanze, Theke, Eingang, Service, Wand, Tür)",
          "done": true
        },
        {
          "id": "qjo3btswa",
          "title": "Tischplan: DRVN Floor-Background (Punkt-Raster + Cyan-Vignette) im Live-Modus",
          "done": true
        },
        {
          "id": "ff4ka03fa",
          "title": "Tischplan: Tags-Bearbeiten Modal (14 vordefinierte Reservierungs-Tags + Custom-Eingabe)",
          "done": true
        },
        {
          "id": "1hto1q3cu",
          "title": "Tischplan: \"Alle\"-Tab entfernt — strikte Bereich-Trennung wie Resmio (jeder Bereich = eigener Floor Plan)",
          "done": true
        },
        {
          "id": "ptub50mfa",
          "title": "Tischplan: Default-Bereich-Init (erster Bereich automatisch aktiv) + Empty States + Migrations-Banner für Legacy-Tische",
          "done": true
        },
        {
          "id": "mhl27y1t5",
          "title": "Memory-Idee gespeichert: ServeFlow Pro+ Plan mit DATEV-Export (4. Plan-Stufe ~99€, erst nach 5-10 Kunden)",
          "done": true
        }
      ],
      "done": 20,
      "total": 20
    },
    {
      "id": "4a2yo2r8l",
      "name": "📌 Tischplan v2 — Folge-Aufgaben (offen)",
      "todos": [
        {
          "id": "5ea143fwo",
          "title": "**Migration auf Production-DB ausführen** (`migration-floorplan-erweitert.sql`) — läuft automatisch beim nächsten Deploy via `runAllMigrations`",
          "done": false
        },
        {
          "id": "l0zglwkre",
          "title": "**Stripe-Webhook im Live-Dashboard prüfen** — Endpoint URL muss auf Production-Backend zeigen, alle 4 Events abonniert",
          "done": false
        },
        {
          "id": "u6b69xdn7",
          "title": "**Stripe-Audit Folgefixes** — Bug 2 (62-Tage-Doppel-Update) + Inkonsistenz 1 (Folge-Zahlungen in `zahlungen` loggen) noch offen",
          "done": false
        },
        {
          "id": "tj4zizxxb",
          "title": "**Erlebnis-Stripe-Code aufräumen** — `ErlebnisModel.buchungBezahlen()` + `buchungStripeSessionSetzen()` sind tote Helfer, bleiben für Stripe Connect Phase C",
          "done": false
        },
        {
          "id": "v2p2qer9x",
          "title": "**Reservierung-Quick-Actions in Timeline** — Inline-Buttons (Bestätigen / No-Show / Stornieren) bei ausgewählter Reservierung",
          "done": false
        }
      ],
      "done": 0,
      "total": 5
    },
    {
      "id": "hl6tf01ur",
      "name": "📌 Fuer morgen (aufgenommen 2026-04-25)",
      "todos": [
        {
          "id": "2o6npszhc",
          "title": "**seven.io Integration** — SMS-Versand umstellen (ersetzt Konsolen-Ausgabe im Dev-Modus, siehe \"Vor Release\"-Block)",
          "done": false
        },
        {
          "id": "vl9gk581p",
          "title": "**21.dev fuer Landingpage nutzen** — Marketing-Website serve-flow.org mit 21.dev bauen (Hero, Features, Preise)",
          "done": false
        },
        {
          "id": "01f0i42a0",
          "title": "**Designs anpassen Bestellseite** — Preset-Galerie + Theme-Feinschliff (haengt mit Phase 6 zusammen)",
          "done": false
        },
        {
          "id": "4ytlppo9j",
          "title": "**Tischplan: Bild auf Handy bearbeiten** — mobile UX im Floor Plan Editor pruefen/fixen",
          "done": false
        },
        {
          "id": "fk5ewy4p9",
          "title": "**Rechtlicher Feinschliff (Tag 1: App-Seiten)** — Impressum + Datenschutz + AGB als Frontend-Seiten + Cookie-Banner + AVV/TOM/Subunternehmer-Liste in `legal/`",
          "done": true
        },
        {
          "id": "014my7ih2",
          "title": "**Email umstellen auf Business-Mail** — Versand via Resend (3000/Monat gratis, smtp.resend.com), Empfang via Cloudflare Email Routing (kontakt@/support@ → DRVN-Inbox), alle 11 Templates getestet",
          "done": true
        },
        {
          "id": "utu7fb1in",
          "title": "**Restaurant-Webseite bauen + mit App verknuepfen** — Pilot-Kunde: eigene Webseite + Reservierung/Bestellung ueber ServeFlow-Widget",
          "done": false
        },
        {
          "id": "6n1pqk7o2",
          "title": "**Testdaten der App durchtesten** — End-to-End mit realistischen Daten, alle kritischen Flows",
          "done": false
        }
      ],
      "done": 2,
      "total": 8
    },
    {
      "id": "ac8do17in",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "tnzhxxtzn",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "e3zn5553r",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "mkidhjnu1",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "czdbhj98i",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "fzlros4cn",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "19u98gr3v",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "lk6yyl71j",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "is6y0zjpx",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "vrkxeidzx",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "1niu3dw4k",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "lhuz9htol",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "zhv9zfjcv",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "6xts1og3w",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "mm38gplmr",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "si1qviod0",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "bw5qrzxiu",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "82hrmxrqx",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "q9fqxvefb",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "988je45l9",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "8m2bs9q1y",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "qdujdivki",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "113wcdiw9",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "zg2rxfqiz",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "pfh2fpwfd",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "lsnuxes2y",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "e5dnfkdqs",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "j2wukoqgt",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "9l2pxqqoq",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "t58kieard",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "ve0z9bd53",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "bhiwwvl10",
          "title": "Abonnement-Verwaltung (Mollie) — Option B (Einzelzahlung + Webhook), Rabattcodes, Paywall",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "pefnwg0sq",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "x139c8gcz",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "evruzz6ox",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "pkcfxs1no",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "nt83is345",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "kikjp7ozu",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "mt7xg2csi",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "59cd2umja",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "4rc4kt6f0",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "421ri3xo4",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "2fh6i3b9i",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "cyuqvlfph",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "dpuzbpgbe",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "78072hedd",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "9g0vfqkcq",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "eb6n9lzdv",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "llsv00s4m",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "bwfnqfbio",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "tbitdwmcg",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "mo3mfinzg",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "4mdl2auwq",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "xju4z5s6c",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "r3v07rxna",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (Kellner/Kueche sehen eigene Schichten als read-only Tageskarten)",
          "done": true
        },
        {
          "id": "5vwv5xwus",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": true
        },
        {
          "id": "3bxpb9rvb",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": true
        },
        {
          "id": "omus1yrfj",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": true
        },
        {
          "id": "ac61lhe9j",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen — Wochentag-Editor + Admin-Indikatoren)",
          "done": true
        },
        {
          "id": "0zdlvz7e0",
          "title": "Abwesenheiten (konkrete Daten/Zeiträume — Urlaub, Krank, Sonstiges + Admin-Konflikt-Notification via Socket.io)",
          "done": true
        },
        {
          "id": "97jvg76fa",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": true
        },
        {
          "id": "fl11pcyds",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": true
        },
        {
          "id": "ce2xxz967",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": true
        },
        {
          "id": "esr80po7b",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": true
        },
        {
          "id": "tr78zdfyr",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "lv03msgbf",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 10,
      "total": 12
    },
    {
      "id": "z14bkonq3",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "i4p68k02j",
          "title": "Zeitslot-System (15-Min-Slots on-the-fly aus Öffnungszeiten, Verweilzeit nach Gruppengröße)",
          "done": true
        },
        {
          "id": "l4ws8cpk0",
          "title": "Öffentliche Buchungsseite für Gäste (3-Schritt-Flow: Datum+Personen → Slot wählen → Kontaktdaten)",
          "done": true
        },
        {
          "id": "b9ucac1sy",
          "title": "E-Mail-Bestätigung + Erinnerung (sofort + 24h + 3h vorher via node-cron)",
          "done": true
        },
        {
          "id": "yut4uepp7",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Buchungs-Token in der E-Mail)",
          "done": true
        },
        {
          "id": "22wpc8ako",
          "title": "Einbettbares Buchungswidget (iframe-Snippet, kopierbar aus Einstellungen)",
          "done": true
        },
        {
          "id": "3edjgfrvl",
          "title": "Kapazitätsmanagement (Max Covers pro Slot, Pufferzeiten, Auto-Tischzuweisung)",
          "done": true
        },
        {
          "id": "3dwklpyt0",
          "title": "QR-Code in Bestätigungs-Email (Gast zeigt im Restaurant vor, qrcode-Package)",
          "done": true
        },
        {
          "id": "ejub716f4",
          "title": "Socket.io Live-Updates bei neuer/geänderter Reservierung",
          "done": true
        },
        {
          "id": "t6b2egnou",
          "title": "Toast-Benachrichtigung für Mitarbeiter bei neuer Online-Reservierung (app-weit)",
          "done": true
        },
        {
          "id": "tvxet8a0e",
          "title": "Reservierungs-Detailseite /reservierung/:token (QR-Code-Zielseite)",
          "done": true
        },
        {
          "id": "sfz1qgn22",
          "title": "**Räumlicher Tischplan / Floor Plan Editor**",
          "done": true
        },
        {
          "id": "dsb763o9o",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": true
        },
        {
          "id": "jbosj7t1r",
          "title": "Gaeste-CRM (gaeste-Tabelle mit Tags + Notizen + Email + Telefon; gast_id-Verknüpfung auf reservierungen; Frontend Gaeste.tsx 695 Zeilen; Allergien via Anmerkungs-Feld Art. 9 DSGVO)",
          "done": true
        },
        {
          "id": "seckto3ox",
          "title": "No-Show-Tracking — `no-show.ts` Cronjob (alle 15 Min) setzt Reservierungen 30 Min nach Termin automatisch auf 'no_show'",
          "done": true
        },
        {
          "id": "e6ge6bfiw",
          "title": "No-Show-Folgesystem (offen): Kreditkartengarantie (Stripe Auth-Hold) + Gaeste-Score (Anzahl No-Shows pro Gast → Risiko-Markierung)",
          "done": false
        },
        {
          "id": "eiosvg99p",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "uied0yjq8",
          "title": "Google Reserve Integration (Option A aktiv + Option B Infrastruktur bereit)",
          "done": true
        },
        {
          "id": "s64ns0h3q",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken per Email)",
          "done": true
        },
        {
          "id": "50lu8k51c",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": true
        },
        {
          "id": "7i5995966",
          "title": "Reservierungs-basierte Personalplanung (Reservierungen → Personalbedarf-Empfehlung)",
          "done": true
        },
        {
          "id": "qsq2wa3ca",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": true
        },
        {
          "id": "yfrrpi1re",
          "title": "Erlebnis-Buchung (Erlebnis-Pakete + 3-Schritt-Buchung + Stripe-Prepayment)",
          "done": true
        }
      ],
      "done": 20,
      "total": 22
    },
    {
      "id": "4e3ury143",
      "name": "Extras/Modifier-System ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "1s48i4gzc",
          "title": "DB-Schema: extras_gruppen + extras + bestellposition_extras Tabellen",
          "done": true
        },
        {
          "id": "8nff9cp4c",
          "title": "Backend-Model: ExtrasModel (CRUD + öffentliche Abfrage + Batch-Loading)",
          "done": true
        },
        {
          "id": "56tgw7zxv",
          "title": "Backend-Routes: 8 neue Endpunkte (öffentlich + Admin CRUD für Gruppen + Extras)",
          "done": true
        },
        {
          "id": "2ez3c8nz5",
          "title": "Bestell-API: Extras-Aufpreise serverseitig berechnen + in bestellposition_extras speichern",
          "done": true
        },
        {
          "id": "zpjw3269w",
          "title": "Frontend-Types: Extra, ExtrasGruppe, GewaehlteExtra, BestellPositionExtra",
          "done": true
        },
        {
          "id": "8dxppttc4",
          "title": "useGerichtExtras Hook: Lazy-Loading (erst beim Antippen eines Gerichts)",
          "done": true
        },
        {
          "id": "vd93vpnm4",
          "title": "GerichtDetailModal: Bottom-Sheet mit Bild, Extras-Auswahl (Radio/Checkbox), Menge, Live-Preis",
          "done": true
        },
        {
          "id": "8w76ez993",
          "title": "Warenkorb: Key-basiert (gleiches Gericht + verschiedene Extras = getrennte Zeilen), Extras-Anzeige",
          "done": true
        },
        {
          "id": "66y3nbnz3",
          "title": "BestellenPro: Alle 5 Layouts auf Detail-Modal umgestellt",
          "done": true
        },
        {
          "id": "m002eizgo",
          "title": "Admin-Seite: Extras pro Gericht verwalten (ExtrasVerwaltung Komponente + Modal in Speisekarte)",
          "done": true
        },
        {
          "id": "vpdbmwrem",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-extras.sql`)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "gsla5mge8",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "oy0f2vm4u",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "5umq9tvc9",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "v598mkl6v",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "gloa51j1u",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "gse2fdhvj",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "a9kl2iz5y",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "9th06do9u",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "ez7luz3rl",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "bwzukljlq",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "xi36xptfg",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "6f0legb1l",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "o3xu6a321",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "f4dkx0l7b",
          "title": "🔴 Speisekarte-Auth-Bug fixen — GET-Routes fehlte `optionalAuth`, Mitarbeiter bekamen 400-Fehler",
          "done": true
        },
        {
          "id": "lyahnwhmf",
          "title": "🔴 Schema.sql synchronisieren — migration-auth.sql Änderungen in schema.sql eingebaut",
          "done": true
        },
        {
          "id": "d12gzg7u9",
          "title": "🟡 BestellenPro raw fetch — `fetch()` durch `api.post()` ersetzt",
          "done": true
        },
        {
          "id": "v0iso9no7",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "h4dwzgjmw",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "3m610m5x1",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "6dmrpxxx2",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "uukdbzfob",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "2cfcseeb7",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "dk8wthsyb",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 10,
      "total": 10
    },
    {
      "id": "gin6eu7rs",
      "name": "Buchungs-Quick-Wins ✅ (erledigt 2026-04-08)",
      "todos": [
        {
          "id": "zpxno5wf7",
          "title": "Anlass-Auswahl auf Buchungsseite (6 Optionen als Chips in Schritt 3)",
          "done": true
        },
        {
          "id": "kjovnaxaq",
          "title": "Sitzplatzwunsch auf Buchungsseite (6 Optionen als Chips in Schritt 1)",
          "done": true
        },
        {
          "id": "9ri9n2gbj",
          "title": "\"Zum Kalender hinzufuegen\" auf Bestaetigungsseite (Google Calendar + iCal-Download)",
          "done": true
        },
        {
          "id": "4zqdb7n7i",
          "title": "DB-Migration: `anlass` + `sitzplatz_wunsch` auf `reservierungen`",
          "done": true
        },
        {
          "id": "des9quw03",
          "title": "Backend + Admin-UI + Detailseite erweitert",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "pd4wihtxz",
      "name": "Bugfix + Feature-Session 2026-04-15",
      "todos": [
        {
          "id": "hwvwd412t",
          "title": "🟡 Dienstplan MA-Ansicht: `/mitarbeiter/alle`-Endpoint + useMitarbeiter für Nicht-Admins",
          "done": true
        },
        {
          "id": "hdwivqfjp",
          "title": "🟡 Bestellung Dankeschön-Screen: `status === 'offen'` zeigt Bestätigungs-Banner",
          "done": true
        },
        {
          "id": "b0oay6puf",
          "title": "🟡 no_show Cronjob: `starteNoShowCron()` in server.ts, alle 15 Min",
          "done": true
        },
        {
          "id": "2obam51pt",
          "title": "🟡 Speisekarte Reihenfolge: ↑↓ Buttons für Kategorien + Gerichte",
          "done": true
        },
        {
          "id": "sjpnr5ptd",
          "title": "🟡 Telefon-Validierung Backend (buchung.ts)",
          "done": true
        },
        {
          "id": "bzq7za27a",
          "title": "🟡 Preis ≥ 0 Validierung Backend (speisekarte.ts)",
          "done": true
        },
        {
          "id": "uzj2gb5ns",
          "title": "🟡 Bestellmenge 1–99 Validierung Backend (bestellungen.ts)",
          "done": true
        },
        {
          "id": "rbnsi51ky",
          "title": "🟡 Leere Kategorien in Admin-Speisekarte ausgeblendet",
          "done": true
        },
        {
          "id": "8nk7n9ae2",
          "title": "🟡 Profilbild-System: foto_url in DB-Schema + Backend-Routes + useMitarbeiter-Hook + MitarbeiterZeile Upload-UI",
          "done": true
        }
      ],
      "done": 9,
      "total": 9
    },
    {
      "id": "lhynej0bk",
      "name": "Bekannte Bugs (Bugfix-Session 2026-04-13)",
      "todos": [
        {
          "id": "690n0sgkx",
          "title": "🔴 **KRITISCH: DB-Schema `quelle` CHECK fehlt `'google'`** — `schema.sql:219` gefixt: `'google'` zur Constraint hinzugefügt.",
          "done": true
        },
        {
          "id": "21znarf20",
          "title": "🔴 **KRITISCH: Socket.io Room-Namen falsch in `reservierungen.ts`** — `io.to(restaurantId)` → `io.to(\\`restaurant:${restaurantId}\\`)` an 3 Stellen.",
          "done": true
        },
        {
          "id": "fmwthg92w",
          "title": "🟡 **MITTEL: Socket.io Room-Namen falsch in `walk-ins.ts`** — Gleicher Fix, 3 Stellen.",
          "done": true
        },
        {
          "id": "5y8hm3nxg",
          "title": "🔴 **KRITISCH: Registrierung \"Email nicht verifiziert\" obwohl Code bestätigt** — `verifiedTokens` war eine In-Memory Map, die bei Server-Neustart (nodemon) geleert wurde. Fix: Token jetzt als signiertes JWT ausgestellt (`verifTokenErstellen`/`verifTokenPruefen`) → kein Server-State nötig.",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "klb4cyyns",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "t35l5dm5d",
          "title": "E-Mail-Vorlagen umgestalten — professionelles ServeFlow-Design mit Dark-Header, Blue/Cyan-Gradient, QR-Code, klaren CTAs",
          "done": true
        },
        {
          "id": "trx3rm2h8",
          "title": "Email-Benachrichtigung bei Abwesenheits-Konflikt — Admin bekommt Email wenn MA Abwesenheit im laufenden Monat einträgt und Schichten betroffen sind",
          "done": true
        },
        {
          "id": "g0spt11oh",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "omz11wn7o",
          "title": "SMTP auf Produktions-Email umstellen — Resend SMTP auf serve-flow.org, EU-Region, Domain verifiziert",
          "done": true
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "0glt82abk",
      "name": "Marketing-Website (serve-flow.org)",
      "todos": [
        {
          "id": "trotm9zgz",
          "title": "Domain serve-flow.org gekauft + auf Coolify/Hetzner verbunden",
          "done": true
        },
        {
          "id": "b5194mx3z",
          "title": "Landing Page bauen: Hero, Features, Preise (3 Pläne), CTA \"Jetzt starten\"",
          "done": false
        },
        {
          "id": "65lfhxjjo",
          "title": "Impressum auf serve-flow.org einbauen (Inhalt fertig in App: `pages/Impressum.tsx`)",
          "done": false
        },
        {
          "id": "xnyxtekyx",
          "title": "Datenschutzerklärung auf serve-flow.org einbauen (Inhalt fertig in App: `pages/Datenschutz.tsx`)",
          "done": false
        },
        {
          "id": "yshi91s91",
          "title": "AGB auf serve-flow.org einbauen (Inhalt fertig in App: `pages/AGB.tsx`)",
          "done": false
        },
        {
          "id": "8ozfg5ze7",
          "title": "\"Jetzt starten\" CTA → Registrierung in der App",
          "done": false
        }
      ],
      "done": 1,
      "total": 6
    },
    {
      "id": "ot04zawmb",
      "name": "Manuelle Aufgaben Tag 1 (kann nur Ilias erledigen — nicht Code)",
      "todos": [
        {
          "id": "r98nge1me",
          "title": "**Anwaltsreview einplanen** — Impressum + Datenschutz + AGB + AVV von einem deutschen IT-/Datenschutz-Anwalt prüfen lassen (Erstkosten ca. 300–800 € einmalig). Empfohlene Kanzleien: anwalt.de Suche „IT-Recht Stuttgart\" oder eRecht24-Premium (günstigere Generator-Variante ~30 €/Jahr).",
          "done": false
        },
        {
          "id": "5wqr8mou8",
          "title": "**Berufshaftpflicht abschliessen** — vor erstem zahlendem Kunden. Anbieter für Solo-IT/SaaS: Hiscox „CyberClear\", exali „Software Profihaftpflicht\", VHV „IT-Haftpflicht\". Kosten ca. 25–60 €/Monat. Deckt Schäden durch Software-Fehler, Datenpannen, Vertragsverletzungen.",
          "done": false
        },
        {
          "id": "4j7jlspsp",
          "title": "**Empfang `kontakt@serve-flow.org` getestet** — Cloudflare Email Routing → Forward an a.aoumeur@drvnorganisations.com funktioniert. SPF + DKIM (Resend) im Cloudflare-DNS gesetzt",
          "done": true
        },
        {
          "id": "zoijltpmw",
          "title": "**Resend API-Key rotieren** — neuer Key in `.env` SMTP_PASS, Test-Script erneut grün (alle 11 Templates)",
          "done": true
        },
        {
          "id": "jxsjoipcb",
          "title": "**Stripe-Dashboard: Impressum-Link hinterlegen** — Stripe verlangt für deutsche Konten einen Link auf das Impressum (https://serve-flow.org/impressum nach Marketing-Site-Launch, ansonsten App-URL). Stripe Settings → Public business information.",
          "done": false
        },
        {
          "id": "j4p3a3keg",
          "title": "**Stripe-Dashboard: Geschäftsdaten vervollständigen** — Anschrift, Kontakt-Email, Statement-Descriptor \"SERVEFLOW\", Support-URL.",
          "done": false
        },
        {
          "id": "dihrwra7z",
          "title": "**(Optional) Telefonnummer für Impressum** — nicht zwingend (Email reicht laut BGH 25.02.2016), aber gibt mehr Vertrauen. Wenn ja: Festnetz-Weiterleitung über Anbieter wie sipgate (~5 €/Monat) statt private Mobilnummer veröffentlichen.",
          "done": false
        },
        {
          "id": "tfxg8nk8l",
          "title": "**Steuer-Registrierung beim Finanzamt** — falls noch nicht erfolgt: Fragebogen zur steuerlichen Erfassung über ELSTER ausgefüllt? Steuernummer für Einzelunternehmen vorhanden?",
          "done": false
        }
      ],
      "done": 2,
      "total": 8
    },
    {
      "id": "3iynrcl4o",
      "name": "Rechts-Set Tag 2 (Backend-Hardening — Claude erledigt) ✅ erledigt 2026-04-25",
      "todos": [
        {
          "id": "9u50wxcwv",
          "title": "`helmet.js` installiert + HSTS, X-Content-Type-Options, Referrer-Policy, COOP aktiv (CSP separat — siehe Tag 3)",
          "done": true
        },
        {
          "id": "mz8med8rv",
          "title": "Passwort-Hash auf NULL bei Mitarbeiter-Deaktivierung (in `MitarbeiterModel.aktualisieren`)",
          "done": true
        },
        {
          "id": "bxdiki4ft",
          "title": "Allergie-Hinweis im Anmerkungs-Feld der Buchungsseite (Art. 9 DSGVO)",
          "done": true
        },
        {
          "id": "rhopozjd8",
          "title": "AVV/AGB-Akzeptanz bei Registrierung: Migration + Backend-Pflichtcheck + Frontend-Checkbox + Versions-Konstante",
          "done": true
        },
        {
          "id": "ho5jgtbfb",
          "title": "Account-Loeschung (Anfrage-Email) + JSON-Datenexport fuer Restaurant-Inhaber (Tab \"Datenschutz\" in Einstellungen)",
          "done": true
        },
        {
          "id": "lboxzo6m5",
          "title": "Datenpannen-Runbook in `legal/datenpannen-runbook.md`",
          "done": true
        }
      ],
      "done": 6,
      "total": 6
    },
    {
      "id": "6kker0dlp",
      "name": "Rechts-Set Tag 3 ✅ erledigt 2026-04-25",
      "todos": [
        {
          "id": "7n0136ohk",
          "title": "**CSP konfigurieren** in Production aktiviert, im Dev aus (Vite-HMR-Kompat). Doku: `legal/csp-konfiguration.md`",
          "done": true
        },
        {
          "id": "f8q9zgs22",
          "title": "Stornierte Reservierungen nach 7 Tagen automatisch anonymisieren (Trigger + Cleanup-Erweiterung)",
          "done": true
        },
        {
          "id": "4f3aehp02",
          "title": "AVV-Versions-Banner: 2 neue Endpunkte + `RechtsdokumenteBanner` in Layout, Bestandskunden sehen Banner bei Versions-Mismatch",
          "done": true
        },
        {
          "id": "2vw9qz09p",
          "title": "Server-Logfile-Rotation Doku: `legal/logfile-rotation.md` (muss von dir einmalig in Coolify gesetzt werden)",
          "done": true
        }
      ],
      "done": 4,
      "total": 4
    },
    {
      "id": "u3lep003q",
      "name": "Manuelle Aufgaben Tag 3 (kann nur Ilias erledigen)",
      "todos": [
        {
          "id": "639o3dhui",
          "title": "**Coolify Docker-Driver-Logging** konfigurieren (json-file, max-size=10m, max-file=14) — Schritt-fuer-Schritt in `legal/logfile-rotation.md`",
          "done": false
        },
        {
          "id": "zuumrxnzg",
          "title": "**Hetzner Snapshot-Policy** auf 14 Tage Aufbewahrung pruefen",
          "done": false
        },
        {
          "id": "r5xaiqawi",
          "title": "**CSP Test-Checkliste** beim ersten Production-Deploy abarbeiten — siehe `legal/csp-konfiguration.md` (Browser-Console auf Violations pruefen!)",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    },
    {
      "id": "l9w2opuxe",
      "name": "DSGVO-Audit-Folge (aus Skill-v2-Check 2026-04-25)",
      "todos": [
        {
          "id": "23hh9wd2a",
          "title": "Google Fonts auf @fontsource lokal umgestellt (Karla + Playfair Display SC)",
          "done": true
        },
        {
          "id": "ssc9ijitf",
          "title": "Dynamic Theme-Fonts via Google CDN deaktiviert (Fallback System-Fonts)",
          "done": true
        },
        {
          "id": "qcv02lauj",
          "title": "model-viewer Google CDN entfernt (Hinweis-Kommentar fuer npm-Bundling)",
          "done": true
        },
        {
          "id": "2o1bnpnj5",
          "title": "TTDSG → TDDDG in Datenschutz + CookieBanner",
          "done": true
        },
        {
          "id": "pqpo85y1b",
          "title": "PII aus Backend-Logs entfernt (warteliste, sms-gast, sms)",
          "done": true
        },
        {
          "id": "fz3iehg1y",
          "title": "Stripe DPF + SCCs explizit in Datenschutzerklaerung erwaehnt",
          "done": true
        },
        {
          "id": "vyicynnng",
          "title": "**model-viewer per npm bundeln** wenn 3D-Showcase-Theme produktiv genutzt wird (`npm i @google/model-viewer` + dynamic import in Showcase-Layout)",
          "done": false
        },
        {
          "id": "r22ydha9l",
          "title": "**@fontsource fuer Theme-Fonts** (Cormorant Garamond, Playfair Display, Lato, Oswald, DM Sans, Space Grotesk, etc.) wenn Bestellseiten-Themes mit Custom-Schrift sinnvoll",
          "done": false
        },
        {
          "id": "4w2gxy60k",
          "title": "**EuGH C-654/23 Newsletter-Hinweis** — Migration `migration-newsletter.sql` (newsletter_aktiv + newsletter_widerspruch_am), `services/newsletter.ts` (HMAC-Token), Endpunkt `POST /api/restaurant/newsletter-widerspruch/:token`, `werbeFooterHtml()` in email.ts, Hinweistext in Registrieren.tsx, neue Sektion in Datenschutz.tsx, Widerspruchs-Seite `/newsletter-widerspruch/:token`",
          "done": true
        },
        {
          "id": "by6ehnz87",
          "title": "**Cross-Tenant CI-Tests** schreiben — automatisierter Test dass Restaurant A nicht auf Daten von Restaurant B zugreifen kann",
          "done": false
        },
        {
          "id": "ury4pqwet",
          "title": "**DB-Encryption at rest auf App-Level** — pflichtgemaess ab 5+ Kunden (Hetzner-Volume reicht aktuell, App-Level reduziert Art. 34-Pflicht bei Datenpanne)",
          "done": false
        },
        {
          "id": "35ovqk0bw",
          "title": "**DSFA fuer Mitarbeiter-Modul** vorbereiten — falls Performance-Tracking/Schichtbewertung eingefuehrt wird (EU AI Act Anhang III)",
          "done": false
        },
        {
          "id": "t9d8px75f",
          "title": "DPA-Plattform evaluieren (heyData/DataGuard ~99-199 €/Monat)",
          "done": false
        },
        {
          "id": "j2na5bevq",
          "title": "Externer DSB freiwillig (~150 €/Monat) als Vertrauenssignal im Vertrieb",
          "done": false
        },
        {
          "id": "8w225sv1j",
          "title": "DSB verpflichtend (oder externer DSB) sobald 20+ MA bei Auftraggeber/Anbieter",
          "done": false
        },
        {
          "id": "8seixtw1e",
          "title": "BSI Grundschutz-Profil \"Cloud\" als Eigenauskunft",
          "done": false
        },
        {
          "id": "hepseerys",
          "title": "Penetration-Test (~5-8k €) vor Enterprise-Kunden",
          "done": false
        }
      ],
      "done": 7,
      "total": 17
    },
    {
      "id": "kfotvalxs",
      "name": "Rechts-Set Tag 4+ (offen — gross)",
      "todos": [
        {
          "id": "s86gc0n7h",
          "title": "**Marketing-Site serve-flow.org** bauen (Hero, Features, Preise, CTA) — separates Projekt; Templates fuer Impressum/Datenschutz/AGB sind fertig in `restaurant-app/frontend/src/pages/`",
          "done": false
        },
        {
          "id": "a7o5nsfaz",
          "title": "**Anwaltsreview** der drei Frontend-Seiten + AVV + TOM + Datenpannen-Runbook (~300–800 €)",
          "done": false
        },
        {
          "id": "scc0igr9m",
          "title": "**Per-Route-CSP** (Verschaerfung): `frame-ancestors 'none'` fuer App-Routes, `*` nur fuer /buchen, /bestellen, /reservierung, /erlebnis, /bewertung — verhindert Click-Jacking auf Login",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    },
    {
      "id": "c40cg07go",
      "name": "Phase 9 – Inventurmanagement ✅ (erledigt 2026-04-18)",
      "todos": [
        {
          "id": "jjovrugso",
          "title": "Inventar-Datenbank: Zutaten/Artikel mit Einheit, Mindestbestand, Kategorie",
          "done": true
        },
        {
          "id": "q7rtmbvyw",
          "title": "Lagerbestand erfassen + manuell anpassen (Eingänge, Abgänge, Korrekturen)",
          "done": true
        },
        {
          "id": "74t36psdy",
          "title": "Automatischer Abzug bei Bestellung bezahlt (Rezeptur: Gericht → Zutaten-Verbrauch)",
          "done": true
        },
        {
          "id": "dpvraxv1a",
          "title": "Mindestbestand-Alarm (Email an Admin wenn Artikel nach Bestellung unter Schwellenwert fällt)",
          "done": true
        },
        {
          "id": "ihxze4fcb",
          "title": "Lieferanten-Verwaltung (Name, Kontakt, Liefertage)",
          "done": true
        },
        {
          "id": "1578094zm",
          "title": "Bestellvorschläge (Artikel unter Mindestbestand — rotes Banner im Dashboard)",
          "done": true
        },
        {
          "id": "d51pmutt0",
          "title": "Inventur-Auswertung (Verbrauch + Kosten pro 7/14/30/90 Tage)",
          "done": true
        }
      ],
      "done": 7,
      "total": 7
    },
    {
      "id": "ul4y9v5uv",
      "name": "Phase 10 – Abo-Pläne (Basis / Standard / Pro) ✅ erledigt 2026-04-18",
      "todos": [
        {
          "id": "3lmx0lbnq",
          "title": "DB-Migration: `abo_plan` Spalte auf `restaurants` + `plan` auf `zahlungen`",
          "done": true
        },
        {
          "id": "ufotf3ic5",
          "title": "Backend: `/api/abo/checkout` — Plan als Parameter, Preis aus PLAN_PREISE (29€/59€/99€)",
          "done": true
        },
        {
          "id": "g8i3iuone",
          "title": "Backend: `/api/abo/status` gibt `abo_plan` + `plan_preise` zurück",
          "done": true
        },
        {
          "id": "8aydpbvih",
          "title": "Backend: `zahlungAbschliessen` setzt `abo_plan` beim Restaurant",
          "done": true
        },
        {
          "id": "by1jfepxc",
          "title": "Frontend: `usePlan()` Hook — `hatZugang(feature)` prüft Plan-Rang",
          "done": true
        },
        {
          "id": "hty5kgays",
          "title": "Frontend: `PaywallKarte` Komponente — gesperrtes Feature + Upgrade-Hinweis",
          "done": true
        },
        {
          "id": "ppjktdxyn",
          "title": "Frontend: Einstellungen Abo-Tab — 3 Plan-Karten (Basis/Standard/Pro) mit Features",
          "done": true
        },
        {
          "id": "tygtuknp5",
          "title": "Frontend: Guards auf Inventur (Pro), Erlebnisse (Pro), Gäste-CRM (Standard), Dienstplan (Standard)",
          "done": true
        },
        {
          "id": "h0uh8i95s",
          "title": "Stripe: 3 Produkte + Preise anlegen (29€, 59€, 99€) im Stripe-Dashboard (manuell)",
          "done": false
        },
        {
          "id": "bvyheh18n",
          "title": "Backend: Mitarbeiter-Limit pro Plan API-seitig durchsetzen (Basis: 3, Standard: 10, Pro: 999) — `services/plan-limits.ts` + Migration `migration-plan-limits.sql` + `max_mitarbeiter` wird automatisch beim Plan-Wechsel synchronisiert (3 Stellen in abo.ts/Abo.ts)",
          "done": true
        }
      ],
      "done": 9,
      "total": 10
    },
    {
      "id": "gyaiiy1tf",
      "name": "Phase 11 – Kassensystem-Integration ⏸️ ZURÜCKGESTELLT (2026-04-20)",
      "todos": [
        {
          "id": "l3pamh3ew",
          "title": "Architektur definiert: Generic Webhook + Adapter-Pattern + AES-256 Verschlüsselung + 3x Retry + Alert-Email",
          "done": true
        },
        {
          "id": "0hdc6d7q1",
          "title": "Adapter-Entwürfe: orderbird, ready2order, Generic Webhook",
          "done": true
        },
        {
          "id": "s2rsc6w8e",
          "title": "**Voraussetzung:** Developer Token bei ready2order beantragen (ready2order.com/en/api/)",
          "done": false
        },
        {
          "id": "xxa9br1k9",
          "title": "**Voraussetzung:** ISV-Partner-Antrag bei orderbird stellen (orderbird.com/en/isv-partner-request) + Email an development@orderbird.com",
          "done": false
        },
        {
          "id": "murnckcce",
          "title": "**Voraussetzung:** Lightspeed Developer Portal registrieren (developers.lightspeedhq.com)",
          "done": false
        },
        {
          "id": "3btyta610",
          "title": "OAuth-Flow für ready2order implementieren (3-Stufen: Developer Token → Grant Token → Account Token)",
          "done": false
        },
        {
          "id": "k33jz1ggq",
          "title": "Adapter korrekt nach echten API-Docs bauen (orderbird, ready2order, Lightspeed)",
          "done": false
        },
        {
          "id": "ig6mrjxg2",
          "title": "Rückrichtung: Zahlungen von Kasse → ServeFlow Status auf 'bezahlt' setzen (Webhooks)",
          "done": false
        },
        {
          "id": "fgb1s0u3q",
          "title": "Menü-Sync: Speisekarte aus KSS importieren",
          "done": false
        },
        {
          "id": "xbygcj18h",
          "title": "Custom-Integration als Paid Service (299€ einmalig für andere Systeme mit API)",
          "done": false
        },
        {
          "id": "n06xig2y5",
          "title": "Persistent Retry-Queue (DB-basiert, überlebt Server-Neustart)",
          "done": false
        }
      ],
      "done": 2,
      "total": 11
    },
    {
      "id": "625fkky34",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "p97lauehs",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "7305aglot",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "40e8a1qss",
          "title": "Wartezeit-Schätzung",
          "done": false
        }
      ],
      "done": 0,
      "total": 3
    },
    {
      "id": "obng3xymp",
      "name": "ServeFlow 2.0 – Ideen (noch besprechen, nicht umsetzen!)",
      "todos": [
        {
          "id": "hdlfmhibp",
          "title": "Trinkgeld-System — Gäste können bei Zahlung digital Trinkgeld geben (%, feste Beträge)",
          "done": false
        },
        {
          "id": "oydaw7ioj",
          "title": "Split-Bill — Rechnung auf mehrere Personen aufteilen",
          "done": false
        },
        {
          "id": "ym8jpx2aa",
          "title": "Prepayment bei Reservierung — Anzahlung für große Gruppen (ab 6 Personen) direkt bei Buchung",
          "done": false
        },
        {
          "id": "7a4u5x58k",
          "title": "Bon-Drucker-Anbindung — ESC/POS-Protokoll für Küchenbons (Star, Epson)",
          "done": false
        },
        {
          "id": "9e8no2wk0",
          "title": "Tagesangebote / Happy Hour — zeitgesteuerte Rabatte auf der Bestellseite",
          "done": false
        },
        {
          "id": "0ojcqo4v7",
          "title": "Kassenbuch-Export — Tagesabschluss als PDF/CSV für Steuerberater",
          "done": false
        },
        {
          "id": "2nzr99auy",
          "title": "Personalkosten vs. Umsatz Ratio — live im Dashboard (Ziel: unter 30%)",
          "done": false
        },
        {
          "id": "mkg2rii5l",
          "title": "Gerichtanalyse — welche Gerichte werden zusammen bestellt (Cross-Sell-Hinweise)",
          "done": false
        },
        {
          "id": "xvg323vpo",
          "title": "Auslastungs-Heatmap — wann ist das Restaurant voll (nach Wochentag/Stunde)",
          "done": false
        },
        {
          "id": "g3p6sqvql",
          "title": "Digitale Speisekarte ohne Bestellfunktion — reiner Anzeige-Modus",
          "done": false
        },
        {
          "id": "a9lekrped",
          "title": "Allergen-Filter auf Bestellseite — Gäste filtern nach Laktose/Gluten etc.",
          "done": false
        },
        {
          "id": "od50qwc8e",
          "title": "Geburtstagsautomatisierung — Email/SMS am Geburtstag mit Rabattcode",
          "done": false
        },
        {
          "id": "spnozopxd",
          "title": "Loyalty-Punkte — digitale Stempelkarte (10 Besuche → 1 gratis)",
          "done": false
        },
        {
          "id": "yze3ejk8z",
          "title": "Gast-Feedback nach Besuch — automatische Email 2h nach Abreise",
          "done": false
        },
        {
          "id": "gi8qmkv7i",
          "title": "Küchen-Display-System (KDS) — separater Bildschirm für Küche statt Bon-Drucker",
          "done": false
        },
        {
          "id": "ubpopl74s",
          "title": "Inventur-Warnschwellen — Push wenn Bestand unter X fällt (Echtzeit)",
          "done": false
        },
        {
          "id": "c6u5eo8pc",
          "title": "Tischstatus-Timeline — wann bestellt, wann geliefert, wann bezahlt",
          "done": false
        },
        {
          "id": "djnfww9lm",
          "title": "Öffnungszeiten-Ausnahmen — Feiertage, Betriebsurlaub automatisch sperren",
          "done": false
        },
        {
          "id": "6r82klfax",
          "title": "DATEV-Export — Buchhaltungsdaten für deutschen Steuerberater",
          "done": false
        },
        {
          "id": "371fayuw6",
          "title": "Meta/Google Ads Conversion-Tracking — Reservierungen als Events",
          "done": false
        },
        {
          "id": "rkeq2enys",
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
      "id": "f75rj86a3",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Stripe (DSGVO-konform mit EU-Datenverarbeitung, Standardvertragsklauseln)"
    },
    {
      "id": "8pi0h558v",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "sp0jndqce",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "tk8e1psxr",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "86krmavye",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "mr96dw49l",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "pyjzak5bb",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    },
    {
      "id": "kc5aphi4q",
      "title": "asyncHandler für Express 4 (2026-04-07)",
      "date": "",
      "content": "- Express 4 fängt keine Errors aus async Route-Handlern ab → Server crashte bei DB-Fehlern (z.B. duplicate key)\n- Lösung: `asyncHandler()` Wrapper in `middleware/errorHandler.ts` — ruft `.catch(next)` auf\n- Auf alle 30+ Route-Handler in 8 Route-Dateien angewendet\n- Error-Handler erkennt jetzt PostgreSQL-Fehlercodes: 23505 (unique → 409), 23503 (FK → 400)"
    },
    {
      "id": "qwmekx0ao",
      "title": "Reservierungssystem Pro — Architektur (2026-04-07)",
      "date": "",
      "content": "- Slots werden **on-the-fly berechnet** aus `oeffnungszeiten` + bestehenden Reservierungen (kein Slot-Table)\n- Tischzuweisung: **Auto-Assign** (kleinster passender Tisch), nicht manuell\n- Kapazitätsmodell: Summe Tischkapazitäten als Default, optionaler `max_gaeste_pro_slot` Override\n- Self-Service: **Buchungs-Token** (64 Hex-Zeichen) in URL statt Login — sicher + einfach für Gäste\n- Erinnerungen: **node-cron** im Express-Prozess (alle 15 Min), nicht separater Service\n- Widget: **iframe** auf `/buchen/:restaurantId` — kein separates Build nötig\n- DSGVO: Personenbezogene Daten (Name, Email, Telefon) werden 30 Tage nach Reservierungsdatum automatisch gelöscht (Cron täglich 3:00)"
    },
    {
      "id": "l0lywkd4y",
      "title": "Abo-Modell: 3 Pläne (2026-04-18)",
      "date": "",
      "content": "- Kein Freemium — alle 3 Pläne sind vollwertige Bezahl-Pläne\n- Zahlungsanbieter: Stripe (bereits integriert)\n- **Basis (29€/Monat):** Reservierungen (unbegrenzt), Online-Buchungsseite, Speisekarte, Tischplan, Walk-ins, Öffnungszeiten, E-Mail-Bestätigung, bis 3 Mitarbeiter\n- **Standard (59€/Monat):** Alles aus Basis + QR-Bestellung, Gästebuch/CRM, Bewertungsmanagement, Warteliste, erweiterte Statistiken, SMS-Erinnerungen, bis 10 Mitarbeiter\n- **Pro (99€/Monat):** Alles aus Standard + Dienstplan (inkl. Templates + Excel-Import), Inventur, Kassensystem, unbegrenzt Mitarbeiter\n- Technisch umzusetzen: `abo_plan` Spalte (basis/standard/pro) auf `restaurants`, Feature-Guard Middleware im Backend, Paywall-Komponente im Frontend"
    },
    {
      "id": "56mit2r4m",
      "title": "Email-Versand: Resend + Cloudflare statt Zoho (2026-04-25)",
      "date": "",
      "content": "- **Versand**: Resend (smtp.resend.com, EU-Region, 3000 Mails/Monat gratis) statt Zoho/Gmail\n- **Empfang**: Cloudflare Email Routing (kostenlos) statt eigener Zoho-Mailbox auf serve-flow.org — leitet kontakt@/support@ → a.aoumeur@drvnorganisations.com weiter\n- **Aliase im Code**: noreply@ (Absender), support@ (Footer), kontakt@ (Impressum/Datenschutz) — alle auf serve-flow.org\n- **Code-Änderung**: nur `.env`-Werte, kein Code-Refactor (nodemailer SMTP bleibt)\n- **DSGVO**: dsgvo-vendoren.md aktualisiert (Zoho raus, Resend + Cloudflare rein, AVV/DPF-Status hinterlegt)\n- **Begruendung**: Resend ist fuer SaaS-Transaktionsmails optimiert (Deliverability, Analytics, Multi-Domain). Cloudflare-Routing ist gratis und sofort verfuegbar weil Domain dort liegt. Zoho-Mailbox waere ueberteuert fuer ein Empfangs-Postfach, das nur 1× pro Woche jemand checkt\n- **Skalierbarkeit**: gleicher Resend-Account kann spaeter CaterBase, CleanBase, HandBase, etc. mit-versorgen — nur Domain hinzufuegen, kein neuer Account\n- **Offen**: API-Key rotieren (wurde im Chat geteilt), Resend DPA pruefen + akzeptieren"
    },
    {
      "id": "gptpnsiyf",
      "title": "Mitarbeiter-Limit pro Abo-Plan im Backend (2026-04-26)",
      "date": "",
      "content": "- Limits: Basis = 3, Standard = 10, Pro = 999 (praktisch unbegrenzt)\n- Single Source of Truth: `restaurant-app/backend/src/services/plan-limits.ts`\n- Mechanik: `restaurants.max_mitarbeiter` wird automatisch aus `abo_plan` abgeleitet — bei jedem Plan-Wechsel mit-aktualisiert (3 Stellen in abo.ts: Helper + checkout.session.completed + customer.subscription.updated; 1 Stelle in models/Abo.ts: zahlungAbschliessen)\n- Migration: `migration-plan-limits.sql` synchronisiert bestehende Restaurants (2 Restaurants betroffen, default in schema.sql von 5 auf 3 angepasst)\n- Grandfather-Fall: Restaurants mit mehr Mitarbeitern als das neue Limit (z.B. Trattoria Demo: 4 MA bei Basis-Limit 3) verlieren NIEMANDEN — bestehende bleiben aktiv, aber kein weiterer Mitarbeiter kann angelegt werden bis Plan-Upgrade\n- Fehler-Response bei Limit: HTTP 403 mit Plan-Name + konkretem Upgrade-Hinweis (\"Upgrade auf Standard (10 Mitarbeiter) oder Pro (unbegrenzt)\")\n- Begruendung: Bisher entwertete fehlende Limit-Logik die hoeheren Plaene — ein Restaurant im 19€-Basis-Plan konnte unbegrenzt Mitarbeiter anlegen, was Standard (39€) und Pro (69€) wirtschaftlich sinnlos macht"
    },
    {
      "id": "3slfisn62",
      "title": "Erlebnis-Buchungen ohne Online-Zahlung — \"Option B\" (2026-04-26)",
      "date": "",
      "content": "- Status: Ursprünglicher Stripe-Prepayment-Flow für Erlebnisse entfernt\n- Ablauf neu: Gast bucht online → Status `ausstehend` (Vor-Ort-Zahlung offen) → Restaurant-Admin setzt nach Bezahlung manuell auf `bezahlt`\n- Code-Änderungen: `restaurant-app/backend/src/routes/erlebnisse.ts` (Stripe-Import + getStripe + Checkout-Logik entfernt) + `ErlebnisDetail.tsx` (kein Stripe-Redirect, direkt zur Bestätigungsseite) + `ErlebnisBestaetigung.tsx` (3 Status-Varianten: storniert/bezahlt/ausstehend)\n- DB-Spalte `erlebnis_buchungen.stripe_session_id` bleibt als Karteileiche (kein Datenverlust, wird wiederverwendet wenn Stripe Connect kommt)\n- Begründung: Aktueller Stripe-Account fließt auf Ilias' Konto — Erlebnis-Geld gehört rechtlich/steuerlich aber zum Restaurant. Korrekte Lösung wäre Stripe Connect (Express Account mit Restaurant-Onboarding), aber das ist 1-2 Tage Zusatzaufwand. Vor-Ort-Zahlung ist der pragmatische Zwischenstand bis 5+ zahlende Restaurants existieren\n- Folge-Schritt (später): Stripe Connect \"Express Account\" einbauen → Plattformgebühr-Modell möglich (z.B. 2-3% von jeder Erlebnis-Buchung als Aufpreis zum Abo)"
    },
    {
      "id": "02qaoc3rk",
      "title": "Stripe Promo-Code-System für Test-Restaurants (2026-04-26)",
      "date": "",
      "content": "- Stripe API-Version: `2026-03-25.dahlia` — neue Struktur `promotion.coupon` (Coupon ist NICHT mehr direkt an `promotionCode.coupon` gebunden, sondern unter `promotion.coupon`)\n- Bug-Fix: `expand: ['data.promotion.coupon']` muss explizit gesetzt werden, sonst kommt Coupon als String-ID zurück und Backend wirft \"Cannot read properties of undefined\"\n- Coupon-Logik gesäubert: `coupon.duration_in_months` direkt aus Stripe lesen (nicht mehr über Custom-Metadata `monate`)\n- Aktiver Test-Code: `PIZZASERVICE` (100% Rabatt, 3 Monate, max 1 Einlösung, Erstkunden-only) — verknüpft mit Coupon `gratis-3-monate`\n- Workflow für neue Test-Restaurants: pro Restaurant einen separaten Promotion Code auf demselben Coupon erstellen (z.B. `PIZZERIA-MARIO-3M`) → max_redemptions=1, expires_at=+30 Tage\n- KEIN automatischer 30-Tage-Trial in Checkout — User-Entscheidung: Volle Kontrolle über wer wie lange gratis bekommt, statt automatisch jedem Trial-Zugang\n- Folge-Schritt: Stripe-Webhook im Live-Dashboard prüfen (Endpoint URL + 4 Events abonniert)"
    },
    {
      "id": "f9kpmf6me",
      "title": "Tischplan v2 — Resmio-Style Floor Plan (2026-04-26)",
      "date": "",
      "content": "- Strikte Bereich-Trennung: jeder Bereich (Innen, Terrasse, Bar) ist EIGENER Floor Plan mit eigenen Koordinaten + eigener Deko. Kein \"Alle\"-View mehr\n- Default-Verhalten: erster Bereich automatisch aktiv beim Laden — Tische ohne `bereich_id` (Legacy) sind unsichtbar bis Admin sie zuweist\n- Neue Komponente: Split-View mit `ReservierungsTimeline` (links 340px) + Floor Plan Canvas (rechts) im Live-Modus\n- Live-Features: Live-Uhr mit \"Auf jetzt wechseln\"-Scroll, Live-Zeit-Badges auf Tischen (\"19:00\", \"5m\"-Countdown, \"JETZT\"-Overdue), pulsierender Cyan-Dot in Topbar\n- Diamond-Tische mit Stuhl-Indikatoren (kleine Kreise rund um Tisch je nach Form/Kapazität — verteilt auf 4 Kanten bei eckig, kreisförmig bei rund, einreihig bei Bar)\n- Deko-System: 6 Typen (Pflanze, Theke, Eingang, Servicestation, Wand, Tür) — eigener Konva-Layer unter Tischen, Drag&Drop im Edit-Modus, Rotation in 15°-Schritten\n- Tag-System: `reservierungen.tags TEXT[]` (max 10 Tags pro Reservierung) + 14 vordefinierte (`Vegan`, `Geburtstag`, `Allergie`, `Fensterplatz`, ...) + Custom-Eingabe via Modal\n- Backend: `ReservierungModel.alle` mit LEFT JOIN auf `gaeste` → liefert Gast-Stats (`gast_besuche`, `gast_no_shows`, `gast_tags`) in jeder Reservierung\n- DRVN-konformes Design: Dark-Theme behalten (kein Holzboden-Look von Resmio), aber Funktionalität 1:1 — Floor-Background als feines Punkt-Raster + Cyan-Vignette von oben\n- Migration: `migration-floorplan-erweitert.sql` (idempotent, läuft via `runAllMigrations` automatisch beim Server-Start)\n- Begründung User-Wunsch: Resmio macht das so, jeder Bereich hat eigene Realität, klarere mentale Modelle für Restaurant-Inhaber + verhindert Tisch-Überlappungen über Bereiche hinweg"
    },
    {
      "id": "1oukmbm5p",
      "title": "EuGH C-654/23 Newsletter-Widerspruch — Bestandskundenwerbung (2026-04-26)",
      "date": "",
      "content": "- Rechtsgrundlage: § 7 Abs. 3 UWG + EuGH-Urteil C-654/23 vom 26.09.2024 (Bestandskundenwerbung ueber aehnliche eigene Produkte)\n- Mechanik: Opt-out-Modell mit HMAC-signiertem Widerspruchs-Token (kein DB-Token-Storage noetig). Token = `<restaurant_id>.<HMAC-SHA256-32hex>` mit JWT_SECRET signiert\n- DB-Felder: `restaurants.newsletter_aktiv BOOLEAN DEFAULT TRUE` + `newsletter_widerspruch_am TIMESTAMPTZ` (Migration `migration-newsletter.sql`)\n- Endpunkt: `POST /api/restaurant/newsletter-widerspruch/:token` (oeffentlich, validiert Token, setzt newsletter_aktiv=FALSE)\n- Frontend-Route: `/newsletter-widerspruch/:token` zeigt Erfolg/Fehler-Feedback\n- Hinweis bei Datenerhebung: kleiner Text unter Submit-Button auf der Registrierungs-Seite (kein Opt-In-Haekchen — UWG erlaubt Opt-out-Modell fuer Bestandskunden)\n- Hinweis in jeder Werbe-Mail: `werbeFooterHtml()` Helper in email.ts mit Erklaerung + Widerspruchs-Link (NICHT in transaktionalen Mails verwenden)\n- Datenschutzerklaerung: neuer Abschnitt 6 (\"Direktwerbung fuer eigene aehnliche Produkte\") mit Verweis auf EuGH C-654/23\n- Begruendung: Rechtssicherheit fuer zukuenftige Multi-Produkt-Strategie (CaterBase, CleanBase, etc.) — Bestandskunden duerfen ohne Einwilligung ueber neue ServeFlow-Module/Schwesterprodukte informiert werden, solange Hinweise an beiden Stellen + funktionierender Widerspruchsweg vorhanden sind"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "r0zkrq2nw",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "1785xtnq9",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "zm4mkdbuf",
        "date": "2026-04-07",
        "title": "Reservierungssystem Pro (Online-Buchung)"
      },
      {
        "id": "sfjs78xw3",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "7m41vnc54",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      },
      {
        "id": "sav2xycht",
        "date": "2026-04-09",
        "title": "Urlaubsverwaltung (Urlaubskonto)"
      },
      {
        "id": "b1900cxvz",
        "date": "2026-04-25",
        "title": "Vollstaendiger DSGVO-Audit mit Skill v2 + Web-Recherche"
      },
      {
        "id": "wjm69cdvr",
        "date": "2026-04-25",
        "title": "Rechts-Set fuer Verkaufsstart (Tag 3 – Folge-Aufgaben)"
      },
      {
        "id": "rmlpiwbkz",
        "date": "2026-04-25",
        "title": "Rechts-Set fuer Verkaufsstart (Tag 2 – Backend-Hardening)"
      },
      {
        "id": "3n8nvtzbx",
        "date": "2026-04-25",
        "title": "Rechts-Set fuer Verkaufsstart (Tag 1)"
      },
      {
        "id": "fknhntif1",
        "date": "2026-04-11",
        "title": "Google Reserve Integration + DSGVO-Check"
      }
    ],
    "tomDone": 31,
    "tomOpen": 13,
    "tomPartial": 6,
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
      "id": "c41uhxy27",
      "text": "revert + polish: Editorial-Layout zurück, nur Animationen + Kästchen verfeinert",
      "date": "2026-04-25"
    },
    {
      "id": "74urlkpca",
      "text": "fix: PWA-Icon zeigt ServeFlow-Logo statt SF-Buchstaben",
      "date": "2026-04-25"
    },
    {
      "id": "0od9amdya",
      "text": "feat: Editorial Mission-Control Redesign — Login, Dashboard, Sidebar, Topbar",
      "date": "2026-04-25"
    },
    {
      "id": "j054d9tn5",
      "text": "feat: Premium Design-Upgrade (Login, Dashboard, Sidebar, Topbar, PlanAuswaehlen)",
      "date": "2026-04-25"
    },
    {
      "id": "aos7et781",
      "text": "fix: Domain-Referenzen von serveflow.de auf serve-flow.org umgestellt",
      "date": "2026-04-24"
    },
    {
      "id": "i9idk5wz0",
      "text": "fix: Root-Route geht zu /login statt /dashboard",
      "date": "2026-04-24"
    },
    {
      "id": "quwr1s0gc",
      "text": "fix: Abmelden-Button auf PlanAuswaehlen-Seite",
      "date": "2026-04-24"
    },
    {
      "id": "c2p33bdi3",
      "text": "fix: Auto-Migration Runner + CORS + fehlende Spalten beim Server-Start",
      "date": "2026-04-24"
    },
    {
      "id": "js0tgqacm",
      "text": "feat: Gutscheincode-Feld im Stripe Checkout aktivieren",
      "date": "2026-04-24"
    },
    {
      "id": "ym17ssrm0",
      "text": "feat: Demo-Daten für Erlebnisse, Inventur und Warteliste (voller Pro-Zugriff in Demo)",
      "date": "2026-04-24"
    }
  ]
};
