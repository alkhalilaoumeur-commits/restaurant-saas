// AUTO-GENERIERT von sync-dashboard.js — 2026-04-07T08:23:08.556Z
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = {
  "project": {
    "name": "Restaurant SaaS",
    "status": "In Entwicklung",
    "techStack": "Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io",
    "team": [
      {
        "id": "be5ic3h4z",
        "name": "Ilias",
        "rolle": "Entwickler & Gruender"
      }
    ]
  },
  "dataTypes": [
    {
      "id": "dt-40s2fz9d6",
      "name": "Restaurants",
      "fields": [
        {
          "id": "xb6pzeob2",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "hn54nra4z",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "oeqsxktpy",
          "name": "logo_url",
          "type": "Text",
          "description": "logo_url",
          "required": false
        },
        {
          "id": "9t3p997yt",
          "name": "oeffnungszeiten",
          "type": "Text",
          "description": "oeffnungszeiten",
          "required": false
        },
        {
          "id": "m6fgz98k3",
          "name": "strasse",
          "type": "Text",
          "description": "strasse",
          "required": false
        },
        {
          "id": "uanfg3ong",
          "name": "plz",
          "type": "Text",
          "description": "plz",
          "required": false
        },
        {
          "id": "wwsx6pjz8",
          "name": "stadt",
          "type": "Text",
          "description": "stadt",
          "required": false
        },
        {
          "id": "ufn9bdfk7",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "8oz3p33gx",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": false
        },
        {
          "id": "wvm8qjv8z",
          "name": "waehrung",
          "type": "Text",
          "description": "waehrung",
          "required": true
        },
        {
          "id": "w9elapxay",
          "name": "primaerfarbe",
          "type": "Text",
          "description": "primaerfarbe",
          "required": true
        },
        {
          "id": "rd1b0lisc",
          "name": "lizenz_code",
          "type": "Text",
          "description": "lizenz_code",
          "required": false
        },
        {
          "id": "rdehyxm9g",
          "name": "max_mitarbeiter",
          "type": "Zahl",
          "description": "max_mitarbeiter",
          "required": true
        },
        {
          "id": "w7v9b16d6",
          "name": "abo_status",
          "type": "Option Set",
          "description": "Moegliche Werte: trial, active, expired",
          "required": true
        },
        {
          "id": "wx6f2l8xd",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-mfl5fj8ak",
      "name": "Kategorien",
      "fields": [
        {
          "id": "gmhyjk7hh",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "xfzr0llyi",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "zakyx7dem",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "sdrnx7584",
          "name": "reihenfolge",
          "type": "Zahl",
          "description": "reihenfolge",
          "required": true
        },
        {
          "id": "lz8tisx5d",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-ywsdwdm1r",
      "name": "Tische",
      "fields": [
        {
          "id": "wn084h1up",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "cl58t8a4v",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "k553epxj8",
          "name": "nummer",
          "type": "Zahl",
          "description": "nummer",
          "required": true
        },
        {
          "id": "jdpujr82u",
          "name": "kapazitaet",
          "type": "Zahl",
          "description": "kapazitaet",
          "required": false
        },
        {
          "id": "z7mv5y6lh",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: frei, besetzt, wartet_auf_zahlung",
          "required": true
        },
        {
          "id": "ftlbylx85",
          "name": "qr_url",
          "type": "Text",
          "description": "qr_url",
          "required": false
        },
        {
          "id": "m134htf6e",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-xrmjt6bwh",
      "name": "Gerichte",
      "fields": [
        {
          "id": "j5v2ksai2",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "dtk1b1opv",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "jwc3daqhh",
          "name": "kategorie_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Kategorien",
          "required": true
        },
        {
          "id": "cpm9utacv",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "8prm84pel",
          "name": "beschreibung",
          "type": "Text",
          "description": "beschreibung",
          "required": false
        },
        {
          "id": "evo7f2obt",
          "name": "preis",
          "type": "Zahl",
          "description": "preis",
          "required": true
        },
        {
          "id": "i2txaywwj",
          "name": "bild_url",
          "type": "Text",
          "description": "bild_url",
          "required": false
        },
        {
          "id": "zstr4s8l0",
          "name": "allergene",
          "type": "Text",
          "description": "allergene",
          "required": false
        },
        {
          "id": "2hiujo5l3",
          "name": "verfuegbar",
          "type": "Ja/Nein",
          "description": "verfuegbar",
          "required": true
        },
        {
          "id": "li6ry2pzn",
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
      "id": "dt-d7xbb2c8f",
      "name": "Bestellungen",
      "fields": [
        {
          "id": "dl9yzvlmb",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "9vs37zt4l",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "mrvuydaji",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": true
        },
        {
          "id": "rjfujxg17",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: offen, in_zubereitung, serviert, bezahlt",
          "required": true
        },
        {
          "id": "fkso7gzhx",
          "name": "gesamtpreis",
          "type": "Zahl",
          "description": "gesamtpreis",
          "required": true
        },
        {
          "id": "4wvvvd5m8",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "qhq02jma6",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        },
        {
          "id": "savoe72b8",
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
      "id": "dt-5jj17et9v",
      "name": "Bestellpositionen",
      "fields": [
        {
          "id": "ha3nq95lv",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "rndrr5k4i",
          "name": "bestellung_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Bestellungen",
          "required": true
        },
        {
          "id": "ixf6apr03",
          "name": "gericht_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Gerichte",
          "required": true
        },
        {
          "id": "3iq7wvxic",
          "name": "menge",
          "type": "Zahl",
          "description": "menge",
          "required": true
        },
        {
          "id": "i3lp399st",
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
      "id": "dt-mhb84gt07",
      "name": "Reservierungen",
      "fields": [
        {
          "id": "njmq097dm",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "t7e0b2ma8",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "oml2wivwv",
          "name": "tisch_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Tische",
          "required": false
        },
        {
          "id": "b47iflt4i",
          "name": "gast_name",
          "type": "Text",
          "description": "gast_name",
          "required": true
        },
        {
          "id": "xmw6eqzfb",
          "name": "telefon",
          "type": "Text",
          "description": "telefon",
          "required": false
        },
        {
          "id": "n0771rdgf",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "mh2yqgwy7",
          "name": "personen",
          "type": "Zahl",
          "description": "personen",
          "required": true
        },
        {
          "id": "s4tz0nhdb",
          "name": "status",
          "type": "Option Set",
          "description": "Moegliche Werte: ausstehend, bestaetigt, storniert",
          "required": true
        },
        {
          "id": "kjdiam2mp",
          "name": "anmerkung",
          "type": "Text",
          "description": "anmerkung",
          "required": false
        },
        {
          "id": "vwc2x6skx",
          "name": "quelle",
          "type": "Option Set",
          "description": "Moegliche Werte: app, whatsapp, telefon",
          "required": true
        },
        {
          "id": "uuv6i8yj1",
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
      "id": "dt-u6aw4dyn1",
      "name": "Mitarbeiter",
      "fields": [
        {
          "id": "sgabc936g",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "n9mts57xk",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "0hz95yt2w",
          "name": "name",
          "type": "Text",
          "description": "name",
          "required": true
        },
        {
          "id": "ofhyspn4z",
          "name": "email",
          "type": "Text",
          "description": "email",
          "required": true
        },
        {
          "id": "kcwcy4yyj",
          "name": "passwort_hash",
          "type": "Text",
          "description": "passwort_hash",
          "required": true
        },
        {
          "id": "mvy6lgk0m",
          "name": "rolle",
          "type": "Option Set",
          "description": "Moegliche Werte: admin, kellner, kueche",
          "required": true
        },
        {
          "id": "yyk4k3lod",
          "name": "aktiv",
          "type": "Ja/Nein",
          "description": "aktiv",
          "required": true
        },
        {
          "id": "3gc8lq3vk",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": []
    },
    {
      "id": "dt-f0d8ocpgp",
      "name": "Schichten",
      "fields": [
        {
          "id": "4ixyrjqd5",
          "name": "id",
          "type": "ID",
          "description": "Eindeutige ID (UUID, automatisch)",
          "required": false
        },
        {
          "id": "bjdgw55nc",
          "name": "restaurant_id",
          "type": "Beziehung",
          "description": "Gehoert zu Restaurant (Multi-Tenant)",
          "required": true
        },
        {
          "id": "zzp4o3kwl",
          "name": "mitarbeiter_id",
          "type": "Beziehung",
          "description": "Verknuepft mit Mitarbeiter",
          "required": true
        },
        {
          "id": "nhtf5w2wr",
          "name": "datum",
          "type": "Datum",
          "description": "datum",
          "required": true
        },
        {
          "id": "h3stk4p1q",
          "name": "beginn",
          "type": "Datum",
          "description": "beginn",
          "required": true
        },
        {
          "id": "brzagcoja",
          "name": "ende",
          "type": "Datum",
          "description": "ende",
          "required": true
        },
        {
          "id": "hn1oj8793",
          "name": "notiz",
          "type": "Text",
          "description": "notiz",
          "required": false
        },
        {
          "id": "2ctxg5rqe",
          "name": "erstellt_am",
          "type": "Datum",
          "description": "Erstellungszeitpunkt",
          "required": true
        }
      ],
      "relationships": [
        "Mitarbeiter"
      ]
    }
  ],
  "optionSets": [
    {
      "id": "dh84jjy5j",
      "name": "Restaurants_Abo_status",
      "values": [
        "trial, active, expired"
      ]
    },
    {
      "id": "bf4mts0dc",
      "name": "Tische_Status",
      "values": [
        "frei, besetzt, wartet_auf_zahlung"
      ]
    },
    {
      "id": "swem0uujo",
      "name": "Bestellungen_Status",
      "values": [
        "offen, in_zubereitung, serviert, bezahlt"
      ]
    },
    {
      "id": "zvwmyw78y",
      "name": "Reservierungen_Status",
      "values": [
        "ausstehend, bestaetigt, storniert"
      ]
    },
    {
      "id": "n808ewc48",
      "name": "Reservierungen_Quelle",
      "values": [
        "app, whatsapp, telefon"
      ]
    },
    {
      "id": "7hl72lcty",
      "name": "Mitarbeiter_Rolle",
      "values": [
        "admin, kellner, kueche"
      ]
    }
  ],
  "workflows": [
    {
      "id": "chqbvbvhb",
      "name": "Auth abrufen",
      "folder": "Auth",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Auth-Seite geladen wird",
      "steps": [
        {
          "id": "k92ozify3",
          "type": "api",
          "desc": "GET /api/auth aufrufen"
        },
        {
          "id": "pyngp0ejd",
          "type": "database",
          "desc": "Auth-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "t56heaw5q",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "aes02kqvp",
      "name": "Auth erstellen",
      "folder": "Auth",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Auth abgeschickt wird",
      "steps": [
        {
          "id": "dvygkzgtg",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "l06vhs4ux",
          "type": "api",
          "desc": "POST /api/auth aufrufen"
        },
        {
          "id": "evuw7asii",
          "type": "database",
          "desc": "Neuen Auth-Datensatz in DB speichern"
        },
        {
          "id": "sdnetepy6",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "jfur12gu4",
      "name": "Bestellungen abrufen",
      "folder": "Bestellungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen-Seite geladen wird",
      "steps": [
        {
          "id": "2etmz5wki",
          "type": "api",
          "desc": "GET /api/bestellungen aufrufen"
        },
        {
          "id": "njzed9qfu",
          "type": "database",
          "desc": "Bestellungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "9od3lp8z2",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "qzd0xtkv0",
      "name": "Bestellungen erstellen",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Bestellungen abgeschickt wird",
      "steps": [
        {
          "id": "z1vibjlmn",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "2p2ukj3bf",
          "type": "api",
          "desc": "POST /api/bestellungen aufrufen"
        },
        {
          "id": "2panexpdx",
          "type": "database",
          "desc": "Neuen Bestellungen-Datensatz in DB speichern"
        },
        {
          "id": "dobl47ajf",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "3jg068bdu",
      "name": "Bestellungen bearbeiten",
      "folder": "Bestellungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Bestellungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "309ucnyzu",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "b0yrwoxaw",
          "type": "api",
          "desc": "PATCH /api/bestellungen/:id aufrufen"
        },
        {
          "id": "b6o1t2c11",
          "type": "database",
          "desc": "Bestellungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "6i1ejebkr",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "ncph8q2vw",
      "name": "Dienstplan abrufen",
      "folder": "Dienstplan",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan-Seite geladen wird",
      "steps": [
        {
          "id": "bj1z9n4ts",
          "type": "api",
          "desc": "GET /api/dienstplan aufrufen"
        },
        {
          "id": "5h26m1q1a",
          "type": "database",
          "desc": "Dienstplan-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "qnnh3x9vi",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "76mqs476q",
      "name": "Dienstplan erstellen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Dienstplan abgeschickt wird",
      "steps": [
        {
          "id": "zv5e7626n",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "a4gau911x",
          "type": "api",
          "desc": "POST /api/dienstplan aufrufen"
        },
        {
          "id": "jnzf4bp6u",
          "type": "database",
          "desc": "Neuen Dienstplan-Datensatz in DB speichern"
        },
        {
          "id": "usik5zshi",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "rwjt3ipln",
      "name": "Dienstplan bearbeiten",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Dienstplan bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "z1l8hblgb",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "krag9qiy2",
          "type": "api",
          "desc": "PATCH /api/dienstplan/:id aufrufen"
        },
        {
          "id": "l93y6i5nj",
          "type": "database",
          "desc": "Dienstplan-Datensatz in DB aktualisieren"
        },
        {
          "id": "lc7pfnzk3",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "0csy1387u",
      "name": "Dienstplan loeschen",
      "folder": "Dienstplan",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "q85nbs9fv",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "2so4ab8sj",
          "type": "api",
          "desc": "DELETE /api/dienstplan/:id aufrufen"
        },
        {
          "id": "vz0r4yu84",
          "type": "database",
          "desc": "Dienstplan-Datensatz aus DB entfernen"
        },
        {
          "id": "c28agf00s",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "3zme9puko",
      "name": "Mitarbeiter abrufen",
      "folder": "Mitarbeiter",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter-Seite geladen wird",
      "steps": [
        {
          "id": "jsy5hoy5i",
          "type": "api",
          "desc": "GET /api/mitarbeiter aufrufen"
        },
        {
          "id": "qpgy1lnzp",
          "type": "database",
          "desc": "Mitarbeiter-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "mswb8shdp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "91rv2fsfs",
      "name": "Mitarbeiter erstellen",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Mitarbeiter abgeschickt wird",
      "steps": [
        {
          "id": "3w6eaorep",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "o10xf5vu8",
          "type": "api",
          "desc": "POST /api/mitarbeiter aufrufen"
        },
        {
          "id": "wkbxwcgxk",
          "type": "database",
          "desc": "Neuen Mitarbeiter-Datensatz in DB speichern"
        },
        {
          "id": "ort26el45",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ts9xvofly",
      "name": "Mitarbeiter bearbeiten",
      "folder": "Mitarbeiter",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Mitarbeiter bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "ksjorcufa",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "59sux1bgd",
          "type": "api",
          "desc": "PATCH /api/mitarbeiter/:id aufrufen"
        },
        {
          "id": "fn7pfpc9i",
          "type": "database",
          "desc": "Mitarbeiter-Datensatz in DB aktualisieren"
        },
        {
          "id": "rvw04f3ac",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "lcdyf8dwq",
      "name": "Reservierungen abrufen",
      "folder": "Reservierungen",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen-Seite geladen wird",
      "steps": [
        {
          "id": "ovaw2cfln",
          "type": "api",
          "desc": "GET /api/reservierungen aufrufen"
        },
        {
          "id": "mwhwamtil",
          "type": "database",
          "desc": "Reservierungen-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "962vyalxr",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "tb09dh3bf",
      "name": "Reservierungen erstellen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Reservierungen abgeschickt wird",
      "steps": [
        {
          "id": "soa86u2mx",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "6djn6cfrx",
          "type": "api",
          "desc": "POST /api/reservierungen aufrufen"
        },
        {
          "id": "8zod3i3ul",
          "type": "database",
          "desc": "Neuen Reservierungen-Datensatz in DB speichern"
        },
        {
          "id": "15qbtjig7",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "ny5f5ifz4",
      "name": "Reservierungen bearbeiten",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Reservierungen bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "onl70v0x3",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "tf54jld23",
          "type": "api",
          "desc": "PATCH /api/reservierungen/:id aufrufen"
        },
        {
          "id": "2k586bydl",
          "type": "database",
          "desc": "Reservierungen-Datensatz in DB aktualisieren"
        },
        {
          "id": "6grctgpz9",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "f2gzeuwsh",
      "name": "Reservierungen loeschen",
      "folder": "Reservierungen",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "hwtn79e0t",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "q5gj3cslb",
          "type": "api",
          "desc": "DELETE /api/reservierungen/:id aufrufen"
        },
        {
          "id": "kvjo0rmsa",
          "type": "database",
          "desc": "Reservierungen-Datensatz aus DB entfernen"
        },
        {
          "id": "ohb7c97bj",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "vocd8rwf3",
      "name": "Restaurant abrufen",
      "folder": "Restaurant",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant-Seite geladen wird",
      "steps": [
        {
          "id": "eatx6d6fh",
          "type": "api",
          "desc": "GET /api/restaurant aufrufen"
        },
        {
          "id": "u46og6k2g",
          "type": "database",
          "desc": "Restaurant-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "zv5ekjjjp",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "h5ou5r6s4",
      "name": "Restaurant bearbeiten",
      "folder": "Restaurant",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Restaurant bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "6qbpjp5gj",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "rex9xlpre",
          "type": "api",
          "desc": "PATCH /api/restaurant/:id aufrufen"
        },
        {
          "id": "xjo537nhn",
          "type": "database",
          "desc": "Restaurant-Datensatz in DB aktualisieren"
        },
        {
          "id": "ii0lvfpo5",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "vgpinhe3x",
      "name": "Speisekarte abrufen",
      "folder": "Speisekarte",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte-Seite geladen wird",
      "steps": [
        {
          "id": "r7yd5f6rv",
          "type": "api",
          "desc": "GET /api/speisekarte aufrufen"
        },
        {
          "id": "jol1viqjo",
          "type": "database",
          "desc": "Speisekarte-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "8i0lel96s",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "w8ky4bq2n",
      "name": "Speisekarte erstellen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Speisekarte abgeschickt wird",
      "steps": [
        {
          "id": "7e55m4prq",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "borurbt31",
          "type": "api",
          "desc": "POST /api/speisekarte aufrufen"
        },
        {
          "id": "ukn86yrvv",
          "type": "database",
          "desc": "Neuen Speisekarte-Datensatz in DB speichern"
        },
        {
          "id": "uomsqikla",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "zc8k9cz89",
      "name": "Speisekarte bearbeiten",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Speisekarte bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "mnon7jnks",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "a28k470n6",
          "type": "api",
          "desc": "PATCH /api/speisekarte/:id aufrufen"
        },
        {
          "id": "if7l42v3w",
          "type": "database",
          "desc": "Speisekarte-Datensatz in DB aktualisieren"
        },
        {
          "id": "7btnmk5ni",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "3025a3non",
      "name": "Speisekarte loeschen",
      "folder": "Speisekarte",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "p3bibmmyw",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "8iw7pv7bd",
          "type": "api",
          "desc": "DELETE /api/speisekarte/:id aufrufen"
        },
        {
          "id": "pnzi7jhll",
          "type": "database",
          "desc": "Speisekarte-Datensatz aus DB entfernen"
        },
        {
          "id": "5jip7w7k3",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "2lf093roi",
      "name": "Statistiken abrufen",
      "folder": "Statistiken",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Statistiken-Seite geladen wird",
      "steps": [
        {
          "id": "a3aoqbghb",
          "type": "api",
          "desc": "GET /api/statistiken aufrufen"
        },
        {
          "id": "k9rkh1zfn",
          "type": "database",
          "desc": "Statistiken-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "3sawlj2kv",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "hixi1i02r",
      "name": "Tische abrufen",
      "folder": "Tische",
      "trigger": "Seiten-Load",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische-Seite geladen wird",
      "steps": [
        {
          "id": "q6auczdyg",
          "type": "api",
          "desc": "GET /api/tische aufrufen"
        },
        {
          "id": "1oucakw54",
          "type": "database",
          "desc": "Tische-Daten aus DB laden (gefiltert nach restaurant_id)"
        },
        {
          "id": "o0g7ewgj1",
          "type": "navigation",
          "desc": "Daten in der UI anzeigen"
        }
      ]
    },
    {
      "id": "gg65yhb59",
      "name": "Tische erstellen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Formular fuer neuen Tische abgeschickt wird",
      "steps": [
        {
          "id": "io52yirg0",
          "type": "condition",
          "desc": "Eingaben validieren"
        },
        {
          "id": "a8knarcu7",
          "type": "api",
          "desc": "POST /api/tische aufrufen"
        },
        {
          "id": "llkv2rpjq",
          "type": "database",
          "desc": "Neuen Tische-Datensatz in DB speichern"
        },
        {
          "id": "5hsmpr6jz",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen + Liste aktualisieren"
        }
      ]
    },
    {
      "id": "9opqbl6gv",
      "name": "Tische bearbeiten",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Tische bearbeitet und gespeichert wird",
      "steps": [
        {
          "id": "gdmjhp7y7",
          "type": "condition",
          "desc": "Aenderungen validieren"
        },
        {
          "id": "526p4dox0",
          "type": "api",
          "desc": "PATCH /api/tische/:id aufrufen"
        },
        {
          "id": "nblm99e19",
          "type": "database",
          "desc": "Tische-Datensatz in DB aktualisieren"
        },
        {
          "id": "9ofmo29ub",
          "type": "confirm",
          "desc": "Erfolgsmeldung anzeigen"
        }
      ]
    },
    {
      "id": "tfpgfwjch",
      "name": "Tische loeschen",
      "folder": "Tische",
      "trigger": "Button-Klick",
      "status": "Fertig",
      "triggerDesc": "Wenn: Loeschen-Button geklickt und bestaetigt",
      "steps": [
        {
          "id": "dr16ztdrs",
          "type": "condition",
          "desc": "Bestaetigung vom Benutzer einholen"
        },
        {
          "id": "a1p1w7qig",
          "type": "api",
          "desc": "DELETE /api/tische/:id aufrufen"
        },
        {
          "id": "n7enn322q",
          "type": "database",
          "desc": "Tische-Datensatz aus DB entfernen"
        },
        {
          "id": "w8mlq7xyg",
          "type": "confirm",
          "desc": "Erfolgsmeldung + Liste aktualisieren"
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "za60qqch5",
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
      "id": "n21gc06hk",
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
      "id": "wpv1nj9ap",
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
      "id": "krv9y7ua0",
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
      "id": "phmhh8xsx",
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
      "id": "drbr36iml",
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
      "id": "4d8rltvpd",
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
      "id": "2xpe71gi1",
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
      "id": "jfe20q9pm",
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
      "id": "ulpbnaf5w",
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
      "id": "2gx8u0fki",
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
      "id": "a5hmqw2cj",
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
      "id": "76gnhh3q8",
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
      "id": "cmc1qo5ad",
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
      "id": "qq8cvz3qm",
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
      "id": "m9pbd8fq5",
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
      "id": "nyvrt33lh",
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
      "id": "2doyjkizm",
      "name": "API: Auth",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Auth",
      "url": "/api/auth"
    },
    {
      "id": "xoo2wqwtv",
      "name": "API: Restaurants",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Restaurants",
      "url": "/api/restaurants"
    },
    {
      "id": "9p02hqdoo",
      "name": "API: Tische",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "5 Endpunkte fuer Tische",
      "url": "/api/tische"
    },
    {
      "id": "48ladzvy3",
      "name": "API: Speisekarte (Gerichte",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "8 Endpunkte fuer Speisekarte (Gerichte",
      "url": "/api/speisekartegerichte"
    },
    {
      "id": "qv8ftaf8a",
      "name": "API: Bestellungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "3 Endpunkte fuer Bestellungen",
      "url": "/api/bestellungen"
    },
    {
      "id": "xnw5x4mpa",
      "name": "API: Reservierungen",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Reservierungen",
      "url": "/api/reservierungen"
    },
    {
      "id": "5rqpyh15i",
      "name": "API: Dienstplan",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "4 Endpunkte fuer Dienstplan",
      "url": "/api/dienstplan"
    },
    {
      "id": "obom3f4wg",
      "name": "API: Statistiken",
      "typ": "REST API",
      "status": "Verbunden",
      "desc": "1 Endpunkte fuer Statistiken",
      "url": "/api/statistiken"
    },
    {
      "id": "qgam8pdm5",
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
        }
      }
    }
  ],
  "issues": [
    {
      "id": "njbmhb0oo",
      "title": "Abonnement-Verwaltung (Mollie)",
      "desc": "Aus Phase 4 – SaaS-Features",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "xberrwf74",
      "title": "Mehrsprachigkeit (DE/EN)",
      "desc": "Aus Phase 5 – Extras",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "demd0p1pl",
      "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "rbbo1371p",
      "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "ru9gqirle",
      "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "utsasdzrm",
      "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "3dleeljbq",
      "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "60rpat1o2",
      "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "7twtv9m45",
      "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
      "desc": "Aus Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "z9ar1hjax",
      "title": "Dienstplan fuer Mitarbeiter sichtbar machen (aktuell nur Admin — Kellner/Kueche muessen eigene Schichten sehen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "ogbhkbb0r",
      "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "usnnthbcd",
      "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "bjksryjcc",
      "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "cgpd6e0pw",
      "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "mhaqi0kug",
      "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "b9zsoj3gd",
      "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "lq4thmaub",
      "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "h18hgl5s4",
      "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "7yg6ceymw",
      "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "67uijeo4u",
      "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
      "desc": "Aus Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "hl9ygao34",
      "title": "Zeitslot-System (Kapazitaet pro 15-Min-Slot konfigurierbar, Turn-Times pro Tischgroesse)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "s2mnhia3u",
      "title": "Oeffentliche Buchungsseite fuer Gaeste (3-Schritt-Flow: Datum+Personen → Slot waehlen → Kontaktdaten)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "tye4om8ef",
      "title": "E-Mail-Bestaetigung + Erinnerung (sofort + 24h + 2-3h vorher, automatisch)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "8sq4eo1mo",
      "title": "Gast-Self-Service (Stornierung + Umbuchung per Link in der E-Mail, 1-Klick)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "ehqxuqewu",
      "title": "Einbettbares Buchungswidget (JS-Snippet fuer Restaurant-Website, responsiv, Modal-Overlay)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "yfxgan8py",
      "title": "Kapazitaetsmanagement (Max Covers pro Slot, Pufferzeiten zwischen Reservierungen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "dgvfxmxa5",
      "title": "**Räumlicher Tischplan / Floor Plan Editor** (Priorität!)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "6jg4wuxbd",
      "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "undin0mwk",
      "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "qt370at1g",
      "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "h0s86iaeq",
      "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "8j68k5s2k",
      "title": "Google Reserve Integration (>50% aller Reservierungen in DE kommen ueber Google Maps)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "8prqclwu8",
      "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "n4ncks7ef",
      "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "6jbxu1zbo",
      "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "qcxyjajgu",
      "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "3w5vszb3q",
      "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
      "desc": "Aus Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "owc4lpz5p",
      "title": "🔴 Speisekarte-Bug fixen — Kategorien + Gerichte können nicht hinzugefügt werden (Frontend)",
      "desc": "Aus Nächstes Todo",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "03e4up5o0",
      "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "0f1w574ni",
      "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
      "desc": "Aus Vor Release (Pflicht!)",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "byksqot1k",
      "title": "Mobile App (falls gewünscht)",
      "desc": "Aus Irgendwann",
      "priority": "Normal",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "dbpryovkw",
      "title": "Kundenbewertungen",
      "desc": "Aus Irgendwann",
      "priority": "Hoch",
      "area": "Allgemein",
      "status": "Backlog",
      "created": "2026-04-07"
    },
    {
      "id": "4x2r7929h",
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
      "id": "3u4bpbeoj",
      "name": "Jetzt dran",
      "todos": [
        {
          "id": "5jsmy33x6",
          "title": "Node.js installieren (via nvm, Version 20)",
          "done": true
        },
        {
          "id": "brjd6n9y2",
          "title": "PostgreSQL installieren",
          "done": true
        },
        {
          "id": "gq3gwie3v",
          "title": "PostgreSQL: Datenbank `restaurant_saas` anlegen",
          "done": true
        },
        {
          "id": "jyk1o01oa",
          "title": "`.env` konfigurieren und Backend starten (`npm run dev`)",
          "done": true
        },
        {
          "id": "igc5kpcn7",
          "title": "Datenbank-Migration ausführen (`migration.sql`)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "1qfx2pt9z",
      "name": "Phase 1 – Grundstruktur ✅ (Codestruktur fertig)",
      "todos": [
        {
          "id": "a4rl57zha",
          "title": "Backend-Grundstruktur (Node.js + Express + TypeScript)",
          "done": true
        },
        {
          "id": "9c6yttpjd",
          "title": "Datenbankschema in PostgreSQL-Migration erstellt",
          "done": true
        },
        {
          "id": "cibd3qf2b",
          "title": "Multi-Tenant-Logik (restaurant_id überall)",
          "done": true
        },
        {
          "id": "5p99gwj5m",
          "title": "Authentifizierung (Login, JWT, Rollen)",
          "done": true
        },
        {
          "id": "stm6nrxta",
          "title": "Alle 7 API-Routen (auth, restaurants, tische, gerichte, bestellungen, reservierungen, mitarbeiter)",
          "done": true
        },
        {
          "id": "9zfwc0j1x",
          "title": "Socket.io für Live-Updates",
          "done": true
        },
        {
          "id": "hejvfps7n",
          "title": "Frontend-Grundstruktur (React + TypeScript + Tailwind)",
          "done": true
        },
        {
          "id": "wl80pd1au",
          "title": "Gäste-Bestellseite (QR-Code-basiert)",
          "done": true
        }
      ],
      "done": 8,
      "total": 8
    },
    {
      "id": "nw72m5muo",
      "name": "Phase 2 – Admin-Dashboard (in Arbeit)",
      "todos": [
        {
          "id": "eppqxhkoa",
          "title": "Dashboard Live-Stats (Tagesumsatz, Reservierungen heute, Bestellungs-Übersicht)",
          "done": true
        },
        {
          "id": "o5rrnhvjj",
          "title": "Speisekarte verwalten (Kategorien + Gerichte CRUD)",
          "done": true
        },
        {
          "id": "j3s7t1lz0",
          "title": "Tischplan visuell (Tisch-CRUD, Status-Wechsel, QR-Link)",
          "done": true
        },
        {
          "id": "le0fot8ev",
          "title": "Reservierungsverwaltung mit Kalenderansicht (Wochenleiste, Tagesnavigation, Statistiken)",
          "done": true
        },
        {
          "id": "vf31ot0ye",
          "title": "Mitarbeiterverwaltung (anlegen, Rollen, deaktivieren, Passwort ändern)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "3ccldqtho",
      "name": "Phase 3 – Gäste-Seite ✅ (komplett)",
      "todos": [
        {
          "id": "02v0qmapi",
          "title": "Öffentliche Bestellseite mit QR-Code-Parameter",
          "done": true
        },
        {
          "id": "vrn3ophcs",
          "title": "Speisekarte anzeigen (nach Kategorien)",
          "done": true
        },
        {
          "id": "g3c7jun1m",
          "title": "Warenkorb + Bestellung abschicken",
          "done": true
        },
        {
          "id": "9u6sam9o8",
          "title": "QR-Codes generieren & drucken pro Tisch",
          "done": true
        },
        {
          "id": "txo1mvfsd",
          "title": "Bestellstatus für Gäste (Socket.io)",
          "done": true
        }
      ],
      "done": 5,
      "total": 5
    },
    {
      "id": "n3qhj7n11",
      "name": "Phase 4 – SaaS-Features",
      "todos": [
        {
          "id": "7a63e6brj",
          "title": "Restaurant-Registrierung & Onboarding",
          "done": true
        },
        {
          "id": "pelkbmdrh",
          "title": "Lizenzcode-System (pro Restaurant, Mitarbeiteranzahl)",
          "done": true
        },
        {
          "id": "m8496b8ns",
          "title": "Design-Anpassung pro Restaurant (Primärfarbe für Gäste-Seite)",
          "done": true
        },
        {
          "id": "ngwax4a6m",
          "title": "Abonnement-Verwaltung (Mollie)",
          "done": false
        }
      ],
      "done": 3,
      "total": 4
    },
    {
      "id": "amzdoaeo7",
      "name": "Phase 5 – Extras",
      "todos": [
        {
          "id": "k50s9grqa",
          "title": "Statistiken & Berichte (Umsatz, Top-Gerichte, Stoßzeiten, Kategorien)",
          "done": true
        },
        {
          "id": "86a7k7y9j",
          "title": "Dienstplan (Wochenansicht, Schicht-CRUD, Stundenzähler)",
          "done": true
        },
        {
          "id": "53oae9bjw",
          "title": "Dark Mode (Toggle in Einstellungen, alle Seiten + Komponenten, Light als Standard)",
          "done": true
        },
        {
          "id": "qg8pn9c8j",
          "title": "Dashboard Auto-Sync + Erweiterung (Hook, Roadmap-Tab, Entscheidungen-Tab, DSGVO-Status)",
          "done": true
        },
        {
          "id": "i295wx2ym",
          "title": "Mehrsprachigkeit (DE/EN)",
          "done": false
        }
      ],
      "done": 4,
      "total": 5
    },
    {
      "id": "lushgvlxr",
      "name": "Phase 6 – Design-System Bestellseite (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "r5i9e5059",
          "title": "Theme-JSON-Schema + TypeScript-Interface definieren",
          "done": true
        },
        {
          "id": "qq4vyjpak",
          "title": "6 Preset-Konstanten anlegen (`src/lib/themes.ts`: Modern, Eleganz, Trattoria, Fresh, Street, Rustikal)",
          "done": true
        },
        {
          "id": "qyn4kdmab",
          "title": "`useGastroTheme`-Hook: JSON → CSS Custom Properties auf document.documentElement",
          "done": true
        },
        {
          "id": "1753va318",
          "title": "Tailwind-Config: `gastro-*` Utilities auf `var(--t-*)` CSS-Variablen mappen",
          "done": true
        },
        {
          "id": "x9objq8iv",
          "title": "Bestellen-Seite + 3 Komponenten von inline-styles auf `gastro-*` Klassen umgebaut",
          "done": true
        },
        {
          "id": "1r92mzyyj",
          "title": "DB: `bild_url` auf `kategorien` + Kategorien-Endpoint öffentlich + KategorieKarte-Komponente",
          "done": true
        },
        {
          "id": "j69n2dbux",
          "title": "BestellenPro: Kategorie-First Flow (Kategorie-Kacheln → Gerichte-Grid)",
          "done": true
        },
        {
          "id": "45qym1lfs",
          "title": "DB: `theme_config JSONB` + `theme_premium_unlocked BOOLEAN` auf `restaurants`",
          "done": false
        },
        {
          "id": "zr9ikt8of",
          "title": "API: `/api/restaurant/:id/design` um `theme_config` erweitern",
          "done": false
        },
        {
          "id": "j1sy06x33",
          "title": "Einstellungen-Seite: Preset-Galerie mit Vorschau-Thumbnails",
          "done": false
        },
        {
          "id": "yrc4uugp6",
          "title": "Premium Custom-Builder UI (Farb-Picker, Font-Dropdown, Layout-Toggle, Live-Preview)",
          "done": false
        },
        {
          "id": "l0ciipjgn",
          "title": "Zahlungsintegration fuer 20 EUR einmalig (Mollie/Stripe) → `theme_premium_unlocked` setzen",
          "done": false
        },
        {
          "id": "102g12hw4",
          "title": "Paywall-UI: \"Design-Builder freischalten\" mit Vorschau",
          "done": false
        },
        {
          "id": "xjeg8ulj7",
          "title": "Mobile-Vorschau im Builder + \"Zurueck zum Preset\" Reset",
          "done": false
        }
      ],
      "done": 7,
      "total": 14
    },
    {
      "id": "6aadyphk7",
      "name": "Phase 7 – Schichtplan Pro (Marktanalyse 2026-04-05)",
      "todos": [
        {
          "id": "jw8pgvagf",
          "title": "Dienstplan fuer Mitarbeiter sichtbar machen (aktuell nur Admin — Kellner/Kueche muessen eigene Schichten sehen)",
          "done": false
        },
        {
          "id": "pgcfeeddi",
          "title": "Drag & Drop Schichtplanung (Schichten per Ziehen verschieben/kopieren)",
          "done": false
        },
        {
          "id": "5lrjdhxk9",
          "title": "ArbZG-Compliance (11h Ruhezeit, Pausen 30min/6h + 45min/9h, Max 10h/Tag)",
          "done": false
        },
        {
          "id": "3o1ie1l5z",
          "title": "Konflikterkennung mit Gelb/Rot-Warnungen (Doppelbuchung, Ruhezeitverstoss, Ueberstunden)",
          "done": false
        },
        {
          "id": "hps6ph2lx",
          "title": "Mitarbeiter-Verfuegbarkeit (MA tragen ein wann sie koennen/nicht koennen)",
          "done": false
        },
        {
          "id": "egy1qfhbb",
          "title": "Schicht-Templates (wiederkehrende Wochen als Vorlage speichern + anwenden)",
          "done": false
        },
        {
          "id": "x8d7kw1uj",
          "title": "Reservierungs-basierter Personalbedarf (Reservierungen → automatische Empfehlung Mitarbeiterzahl)",
          "done": false
        },
        {
          "id": "u3tsy0xy3",
          "title": "Budget-Overlay (Personalkosten live waehrend der Planung anzeigen)",
          "done": false
        },
        {
          "id": "i743rblvq",
          "title": "Schichttausch 3-Tap-Flow (Anfrage → Claim → Genehmigung)",
          "done": false
        },
        {
          "id": "ez9ye22hp",
          "title": "Push-Benachrichtigungen (neue Schicht, Aenderungen, Erinnerung vor Schichtbeginn)",
          "done": false
        },
        {
          "id": "q0gwnbis1",
          "title": "Lesebestaetigung fuer veroeffentlichte Dienstplaene",
          "done": false
        }
      ],
      "done": 0,
      "total": 11
    },
    {
      "id": "9q3iif2gn",
      "name": "Phase 8 – Reservierungssystem Pro (Marktanalyse 2026-04-06)",
      "todos": [
        {
          "id": "wicn8vv96",
          "title": "Zeitslot-System (Kapazitaet pro 15-Min-Slot konfigurierbar, Turn-Times pro Tischgroesse)",
          "done": false
        },
        {
          "id": "mi8slox82",
          "title": "Oeffentliche Buchungsseite fuer Gaeste (3-Schritt-Flow: Datum+Personen → Slot waehlen → Kontaktdaten)",
          "done": false
        },
        {
          "id": "d9ozay0zm",
          "title": "E-Mail-Bestaetigung + Erinnerung (sofort + 24h + 2-3h vorher, automatisch)",
          "done": false
        },
        {
          "id": "ufnyvxa6i",
          "title": "Gast-Self-Service (Stornierung + Umbuchung per Link in der E-Mail, 1-Klick)",
          "done": false
        },
        {
          "id": "nfzixgy2h",
          "title": "Einbettbares Buchungswidget (JS-Snippet fuer Restaurant-Website, responsiv, Modal-Overlay)",
          "done": false
        },
        {
          "id": "tvoul0va6",
          "title": "Kapazitaetsmanagement (Max Covers pro Slot, Pufferzeiten zwischen Reservierungen)",
          "done": false
        },
        {
          "id": "atk7ims4d",
          "title": "**Räumlicher Tischplan / Floor Plan Editor** (Priorität!)",
          "done": false
        },
        {
          "id": "otjy9euw8",
          "title": "Automatische Tischzuweisung (kleinster passender Tisch, Kombinationen, Puffer, Zonen)",
          "done": false
        },
        {
          "id": "y2nlis88u",
          "title": "Gaeste-CRM (Profile, Tags, Besuchshistorie, Allergien mit DSGVO-Einwilligung)",
          "done": false
        },
        {
          "id": "x183h3etp",
          "title": "No-Show-Management (Kreditkartengarantie optional, No-Show-Tracking, Gaeste-Score)",
          "done": false
        },
        {
          "id": "k5xs3gbq9",
          "title": "SMS/WhatsApp-Erinnerungen (95% Oeffnungsrate vs. 20-30% bei E-Mail)",
          "done": false
        },
        {
          "id": "icchjdvf0",
          "title": "Google Reserve Integration (>50% aller Reservierungen in DE kommen ueber Google Maps)",
          "done": false
        },
        {
          "id": "irlbz9ek2",
          "title": "Warteliste (Walk-in + Online, automatisches Nachruecken bei Stornierung, SMS-Benachrichtigung)",
          "done": false
        },
        {
          "id": "rdg5jxqcr",
          "title": "Walk-in-Management (Laufkundschaft digital erfassen, Wartezeit-Schaetzung)",
          "done": false
        },
        {
          "id": "p1x34kqng",
          "title": "Reservierungs-basierte Personalplanung (Alleinstellungsmerkmal! Reservierungen → Personalbedarf)",
          "done": false
        },
        {
          "id": "n3jm4wyoq",
          "title": "Bewertungsmanagement (Feedback intern → bei positiv → Google-Bewertung vorschlagen)",
          "done": false
        },
        {
          "id": "8qy2zq5vk",
          "title": "Erlebnis-Buchung (Menue + Tisch als Prepaid-Paket, eliminiert No-Shows)",
          "done": false
        }
      ],
      "done": 0,
      "total": 17
    },
    {
      "id": "8y9ja8b5a",
      "name": "Auth-System Umbau ✅ (erledigt 2026-04-06)",
      "todos": [
        {
          "id": "6pj7v6d28",
          "title": "Rate Limiting auf Login (5 Versuche / 15 Min)",
          "done": true
        },
        {
          "id": "b8irkphgs",
          "title": "Passwort-Anforderungen (8+ Zeichen, 1 Großbuchstabe, 1 Zahl)",
          "done": true
        },
        {
          "id": "163ftaai2",
          "title": "Email- und Telefon-Formatvalidierung",
          "done": true
        },
        {
          "id": "tvzjikzg1",
          "title": "Restaurant-Code (auto-generiert bei Registrierung)",
          "done": true
        },
        {
          "id": "2h2r5z6hq",
          "title": "Registrierung als 3-Schritt-Wizard (Konto → Restaurant → Details)",
          "done": true
        },
        {
          "id": "4xgkz8tkp",
          "title": "Öffnungszeiten-Tabelle + automatische Tisch-Erstellung",
          "done": true
        },
        {
          "id": "7crl7zjy5",
          "title": "Email-Verifizierung (Token + Bestätigungslink)",
          "done": true
        },
        {
          "id": "7ol9brew9",
          "title": "Mitarbeiter-Einladung per Email (MA setzt eigenes Passwort)",
          "done": true
        },
        {
          "id": "8vxdhtajc",
          "title": "Passwort-vergessen Flow (Reset-Link, 1h gültig)",
          "done": true
        },
        {
          "id": "mbei2oygn",
          "title": "Email-Service (Nodemailer)",
          "done": true
        },
        {
          "id": "6bobb5wo1",
          "title": "DB-Migration (migration-auth.sql)",
          "done": true
        }
      ],
      "done": 11,
      "total": 11
    },
    {
      "id": "tgp6bynyw",
      "name": "Nächstes Todo",
      "todos": [
        {
          "id": "duivfiyaz",
          "title": "🔴 Speisekarte-Bug fixen — Kategorien + Gerichte können nicht hinzugefügt werden (Frontend)",
          "done": false
        },
        {
          "id": "0oi4zif9h",
          "title": "🔴 Phase 6 Theme-Umbau debuggen — Problem war fehlende npm install, Code war korrekt",
          "done": true
        },
        {
          "id": "yxdxthm53",
          "title": "Kategorie-First Bestellseite — Kacheln mit Hintergrundbild, 2-Schritt-Flow",
          "done": true
        },
        {
          "id": "35vq1ov2n",
          "title": "DB-Migration ausführen (`psql $DATABASE_URL -f database/migration-auth.sql`)",
          "done": true
        },
        {
          "id": "npiguxuri",
          "title": "SMTP-Daten in `.env` konfigurieren (Gmail)",
          "done": true
        },
        {
          "id": "fbbg1hbgj",
          "title": "Email-Verifizierung inline bei Registrierung (6-stelliger Code)",
          "done": true
        },
        {
          "id": "im3hjsgkz",
          "title": "SMS-Verifizierung inline bei Registrierung (6-stelliger Code, Dev: Konsole)",
          "done": true
        },
        {
          "id": "1qxtdn65x",
          "title": "Mitarbeiter-Seite im Frontend an Einladungssystem anpassen",
          "done": true
        }
      ],
      "done": 7,
      "total": 8
    },
    {
      "id": "kw9i106k2",
      "name": "Vor Release (Pflicht!)",
      "todos": [
        {
          "id": "w1soflss4",
          "title": "SMS-Versand auf Twilio (oder alternativen Anbieter) umstellen — aktuell nur Konsolen-Ausgabe im Dev-Modus",
          "done": false
        },
        {
          "id": "pqtt1bgjt",
          "title": "SMTP auf Produktions-Email umstellen (aktuell: Gmail App-Passwort)",
          "done": false
        }
      ],
      "done": 0,
      "total": 2
    },
    {
      "id": "vrnwzpzvq",
      "name": "Irgendwann",
      "todos": [
        {
          "id": "fso85rz25",
          "title": "Mobile App (falls gewünscht)",
          "done": false
        },
        {
          "id": "pgp3viiju",
          "title": "Kundenbewertungen",
          "done": false
        },
        {
          "id": "od8qy28ww",
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
      "id": "acccf356f",
      "title": "Tech-Stack",
      "date": "2026-04-04",
      "content": "- Frontend: React + TypeScript + Tailwind CSS\n- Backend: Node.js + Express\n- Datenbank: PostgreSQL\n- Echtzeit: Socket.io (WebSockets)\n- Hosting: Hetzner Cloud Frankfurt (DSGVO-konform)\n- Auth: JWT + bcrypt\n- Zahlungen: Mollie (NL, DSGVO-freundlich)"
    },
    {
      "id": "g1ixl0cla",
      "title": "Geschäftsmodell",
      "date": "",
      "content": "- SaaS Abo: €49/Monat Einstieg, später €99-129 Premium\n- Zielmarkt: DACH (Deutschland, Österreich, Schweiz)\n- Multi-Tenant: jedes Restaurant bekommt eigene UUID + Lizenzcode"
    },
    {
      "id": "2gzm5ho4v",
      "title": "Plattform",
      "date": "",
      "content": "- Umstieg von Bubble.io auf Custom Code\n- Grund: DSGVO (Bubble-Server in USA), Flexibilität, Kontrolle"
    },
    {
      "id": "j2szwg47x",
      "title": "Supabase entfernt (2026-04-05)",
      "date": "",
      "content": "- Frontend lief doppelt: teils über Express API, teils direkt über Supabase\n- Entscheidung: Alles über Express API — eine einzige, kontrollierte Backend-Schicht\n- Grund: Konsistenz, Sicherheit (Preise wurden vom Client geschickt), Multi-Tenancy zentral im Backend\n- Supabase Realtime ersetzt durch Socket.io (war bereits im Backend vorhanden)\n- DB-Visualisierung: TablePlus statt Supabase-Dashboard"
    },
    {
      "id": "fops21dvc",
      "title": "Multi-Tenancy Absicherung (2026-04-05)",
      "date": "",
      "content": "- Öffentliche Endpunkte (Bestellungen, Reservierungen) validieren jetzt restaurant_id\n- Bestellungen: Tisch muss zum Restaurant gehören (DB-Check)\n- Reservierungen: Restaurant muss existieren (DB-Check)"
    },
    {
      "id": "wigaw95mv",
      "title": "Produktname: ServeFlow (2026-04-06)",
      "date": "",
      "content": "- App heißt ab jetzt **ServeFlow** (vorher \"Restaurant App\")\n- Eigenständiger Produktname statt DRVN Sub-Brand\n- Logo: Stilisierte Servierglocke mit Flow-Kurve, Blue→Cyan Gradient (DRVN-Farben)\n- Farbschema: Brand-Farben von Rot auf Blue (#3B82F6) / Cyan (#06B6D4) umgestellt\n- Grund: \"ServeFlow\" klingt professionell, international, kommuniziert Service + Effizienz\n- Alternativen waren: DRVN Gastro (Sub-Brand), Gastronaut, Mise\n- Geänderte Dateien: Logo-Komponente, Sidebar, Login, Registrierung, Einladung, Passwort-Reset, Tailwind-Config, index.html, package.json"
    },
    {
      "id": "fi5x2cixe",
      "title": "Dashboard Auto-Sync via Claude Code Hook (2026-04-06)",
      "date": "",
      "content": "- PostToolUse Hook in `.claude/settings.json`: Bei jedem Write/Edit wird `sync-dashboard.js` automatisch ausgeführt\n- Das Sync-Script liest alle Projektdateien (todos, schema, routes, entscheidungen, dsgvo) und generiert `dashboard-data.js`\n- Dashboard zeigt jetzt ALLES: Roadmap mit allen Phasen/Todos, Entscheidungen-Timeline, DSGVO-Status\n- SYNCED_DATA hat Priorität über DEFAULT_DATA — Dashboard ist immer aktuell\n- Grund: Vorher musste man manuell `node dashboard/sync-dashboard.js` ausführen → wurde oft vergessen"
    }
  ],
  "dsgvo": {
    "entries": [
      {
        "id": "2mc2tbqqq",
        "date": "2026-04-05",
        "title": "Restaurant-Registrierung"
      },
      {
        "id": "9k5d3nr1o",
        "date": "2026-04-05",
        "title": "Umfassender DSGVO-Check & Skill-Erstellung"
      },
      {
        "id": "2ot4yl7dw",
        "date": "2026-04-05",
        "title": "Mitarbeiterverwaltung"
      },
      {
        "id": "ex6cuonfo",
        "date": "2026-04-04",
        "title": "Initiale Bewertung"
      }
    ],
    "tomDone": 19,
    "tomOpen": 14,
    "tomPartial": 3,
    "openCritical": [
      "Datenschutzerklaerung erstellen und auf Webseite einbinden",
      "Impressum erstellen",
      "AV-Vertrag mit Supabase abschliessen (Serverstandort pruefen: EU?)",
      "AV-Vertrag mit Hetzner abschliessen",
      "HTTPS / TLS auf Produktionsserver konfigurieren",
      "Automatische Loeschung: Reservierungsdaten nach 30 Tagen",
      "Hinweis im Anmerkungsfeld: \"Bitte keine Gesundheitsdaten ohne Einwilligung\""
    ],
    "openImportant": [
      "Rate Limiting auf Login-Endpunkt (Brute-Force-Schutz)",
      "Sichere HTTP-Headers (helmet.js) einbinden",
      "Passwort-Hash bei Mitarbeiter-Deaktivierung auf NULL setzen",
      "Art. 15 Auskunftsrecht: Export-Funktion (JSON) implementieren",
      "Art. 17 Loeschrecht: Loeschfunktion fuer Gaeste-Daten",
      "Art. 20 Datenuebertragbarkeit: JSON-Export aller Daten einer Person"
    ]
  },
  "changelog": [
    {
      "id": "8d5zbhwrn",
      "text": "Add dashboard, sync skill, project docs, and restaurant-app codebase",
      "date": "2026-04-04"
    },
    {
      "id": "fky1osdro",
      "text": "Initial commit: Restaurant SaaS project",
      "date": "2026-04-04"
    }
  ]
};
