import { Router, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { SchichtModel } from '../models/Schicht';
import { SchichttauschModel } from '../models/Schichttausch';
import { SchichtTemplateModel } from '../models/SchichtTemplate';
import { MitarbeiterModel } from '../models/Mitarbeiter';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { smsSenden, smsTextTauschGenehmigt, smsTextTauschAbgelehnt } from '../services/sms';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// GET /api/dienstplan?start=2026-04-07&ende=2026-04-13
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { start, ende } = req.query;
  if (!start || !ende) {
    res.status(400).json({ fehler: 'start und ende sind erforderlich (YYYY-MM-DD)' });
    return;
  }
  const schichten = await SchichtModel.nachZeitraum(req.auth!.restaurantId, start as string, ende as string);
  res.json(schichten);
}));

// POST /api/dienstplan
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { mitarbeiter_id, datum, beginn, ende, notiz } = req.body;
  if (!mitarbeiter_id || !datum || !beginn || !ende) {
    res.status(400).json({ fehler: 'mitarbeiter_id, datum, beginn und ende sind erforderlich' });
    return;
  }
  if (beginn >= ende) {
    res.status(400).json({ fehler: 'Ende muss nach Beginn liegen' });
    return;
  }

  // ── ArbZG-Prüfung vor dem Speichern ────────────────────────────────────────
  // Konflikte (Doppelbuchung) → 409, Schicht wird nicht gespeichert
  // Warnungen (Ruhezeit, Max-Stunden, Pausen) → Schicht wird gespeichert, Warnungen im Response
  const pruefung = await SchichtModel.arbzgPruefen(
    req.auth!.restaurantId, mitarbeiter_id, datum, beginn, ende
  );
  if (pruefung.konflikte.length > 0) {
    res.status(409).json({ fehler: pruefung.konflikte[0], konflikte: pruefung.konflikte });
    return;
  }

  const schicht = await SchichtModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    mitarbeiter_id, datum, beginn, ende, notiz,
  });
  res.status(201).json({ ...schicht, warnungen: pruefung.warnungen });
}));

// PATCH /api/dienstplan/:id
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { mitarbeiter_id, datum, beginn, ende, notiz } = req.body;
  if (beginn && ende && beginn >= ende) {
    res.status(400).json({ fehler: 'Ende muss nach Beginn liegen' });
    return;
  }

  // ── ArbZG-Prüfung: Aktuelle Schicht laden um fehlende Felder zu ergänzen ──
  let warnungen: string[] = [];
  if (mitarbeiter_id || datum || beginn || ende) {
    const aktuelle = await SchichtModel.nachId(req.params.id, req.auth!.restaurantId);
    if (aktuelle) {
      const pruefungDatum  = datum          || aktuelle.datum.slice(0, 10);
      const pruefungBeginn = beginn         || aktuelle.beginn.slice(0, 5);
      const pruefungEnde   = ende           || aktuelle.ende.slice(0, 5);
      const pruefungMA     = mitarbeiter_id || aktuelle.mitarbeiter_id;

      const pruefung = await SchichtModel.arbzgPruefen(
        req.auth!.restaurantId,
        pruefungMA,
        pruefungDatum,
        pruefungBeginn,
        pruefungEnde,
        req.params.id // eigene ID ausschließen
      );
      if (pruefung.konflikte.length > 0) {
        res.status(409).json({ fehler: pruefung.konflikte[0], konflikte: pruefung.konflikte });
        return;
      }
      warnungen = pruefung.warnungen;
    }
  }

  const schicht = await SchichtModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
    mitarbeiter_id, datum, beginn, ende, notiz,
  });
  if (!schicht) { res.status(404).json({ fehler: 'Schicht nicht gefunden' }); return; }
  res.json({ ...schicht, warnungen });
}));

// DELETE /api/dienstplan/:id
router.delete('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const schicht = await SchichtModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!schicht) { res.status(404).json({ fehler: 'Schicht nicht gefunden' }); return; }
  res.json({ geloescht: true });
}));

// ── Schichttausch ────────────────────────────────────────────────────────────

// GET /api/dienstplan/tausch — Alle offenen/angebotenen Tausch-Anfragen
router.get('/tausch', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const tausche = await SchichttauschModel.liste(req.auth!.restaurantId);
  res.json(tausche);
}));

// POST /api/dienstplan/tausch — Tap 1: MA bietet eigene Schicht zum Tausch an (offen oder direkt)
router.post('/tausch', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { schicht_id, ziel_schicht_id } = req.body;
  if (!schicht_id) {
    res.status(400).json({ fehler: 'schicht_id ist erforderlich' });
    return;
  }

  // Eigene Schicht validieren
  const schicht = await SchichtModel.nachId(schicht_id, req.auth!.restaurantId);
  if (!schicht) {
    res.status(404).json({ fehler: 'Schicht nicht gefunden' });
    return;
  }
  if (schicht.mitarbeiter_id !== req.auth!.mitarbeiterId) {
    res.status(403).json({ fehler: 'Nur eigene Schichten können zum Tausch angeboten werden' });
    return;
  }

  // Eigene Schicht darf noch nicht in einem offenen Tausch stecken
  const check = await SchichttauschModel.schichtIstImTausch(schicht_id, req.auth!.restaurantId);
  if (check?.vorhanden) {
    res.status(409).json({ fehler: 'Diese Schicht ist bereits in einem offenen Tausch' });
    return;
  }

  // ── Direkter Tausch: Zielschicht angegeben ─────────────────────────────────
  if (ziel_schicht_id) {
    const zielSchicht = await SchichtModel.nachId(ziel_schicht_id, req.auth!.restaurantId);
    if (!zielSchicht) {
      res.status(404).json({ fehler: 'Zielschicht nicht gefunden' });
      return;
    }
    if (zielSchicht.mitarbeiter_id === req.auth!.mitarbeiterId) {
      res.status(400).json({ fehler: 'Direkter Tausch nur mit Schichten anderer Mitarbeiter möglich' });
      return;
    }
    const checkZiel = await SchichttauschModel.schichtIstImTausch(ziel_schicht_id, req.auth!.restaurantId);
    if (checkZiel?.vorhanden) {
      res.status(409).json({ fehler: 'Die Zielschicht ist bereits in einem offenen Tausch' });
      return;
    }
    const tausch = await SchichttauschModel.erstellenDirekt(
      req.auth!.restaurantId,
      req.auth!.mitarbeiterId,
      schicht_id,
      zielSchicht.mitarbeiter_id,
      ziel_schicht_id
    );
    res.status(201).json(tausch);
    return;
  }

  // ── Offener Tausch: Freigeben für alle ────────────────────────────────────
  const tausch = await SchichttauschModel.erstellen(
    req.auth!.restaurantId,
    req.auth!.mitarbeiterId,
    schicht_id
  );
  res.status(201).json(tausch);
}));

// POST /api/dienstplan/tausch/:id/annehmen — Tap 2: MA B übernimmt mit eigener Schicht
router.post('/tausch/:id/annehmen', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { schicht_id } = req.body;
  if (!schicht_id) {
    res.status(400).json({ fehler: 'schicht_id (eigene Schicht) ist erforderlich' });
    return;
  }

  // Angebotene Schicht muss dem eingeloggten MA gehören
  const schicht = await SchichtModel.nachId(schicht_id, req.auth!.restaurantId);
  if (!schicht) {
    res.status(404).json({ fehler: 'Schicht nicht gefunden' });
    return;
  }
  if (schicht.mitarbeiter_id !== req.auth!.mitarbeiterId) {
    res.status(403).json({ fehler: 'Nur eigene Schichten können angeboten werden' });
    return;
  }

  const tausch = await SchichttauschModel.annehmen(
    req.params.id,
    req.auth!.restaurantId,
    req.auth!.mitarbeiterId,
    schicht_id
  );
  if (!tausch) {
    res.status(404).json({ fehler: 'Tausch nicht gefunden oder bereits angenommen' });
    return;
  }
  res.json(tausch);
}));

// POST /api/dienstplan/tausch/:id/genehmigen — Tap 3: Admin genehmigt
router.post('/tausch/:id/genehmigen', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  // Schichtdaten VOR dem Tausch laden — brauchen wir für SMS (Datum/Uhrzeit der neuen Schicht)
  const tauschVorher = await SchichttauschModel.liste(req.auth!.restaurantId);
  const tauschEintrag = tauschVorher.find(t => t.id === req.params.id);

  const tausch = await SchichttauschModel.genehmigen(req.params.id, req.auth!.restaurantId);
  if (!tausch) {
    res.status(404).json({ fehler: 'Tausch nicht gefunden oder noch kein Annehmer' });
    return;
  }
  // Eigentumscheck fehlgeschlagen → 409 Conflict
  if ('fehler' in tausch) {
    res.status(409).json(tausch);
    return;
  }

  // ── SMS an beide Mitarbeiter senden (fire-and-forget, kein Fehler wenn kein Telefon) ──
  if (tauschEintrag) {
    // Nach dem Tausch: Anbieter bekommt die Annehmer-Schicht, Annehmer bekommt die Anbieter-Schicht
    const [anbieterTel, annehmerTel] = await Promise.all([
      MitarbeiterModel.telefonnummer(tausch.anbieter_id, req.auth!.restaurantId),
      tausch.annehmer_id ? MitarbeiterModel.telefonnummer(tausch.annehmer_id, req.auth!.restaurantId) : Promise.resolve(null),
    ]);

    // Anbieter: bekommt jetzt die Annehmer-Schicht
    if (anbieterTel?.telefon && tauschEintrag.annehmer_beginn && tauschEintrag.annehmer_ende) {
      const uhrzeit = `${tauschEintrag.annehmer_beginn.slice(0, 5)}–${tauschEintrag.annehmer_ende.slice(0, 5)}`;
      smsSenden(
        anbieterTel.telefon,
        smsTextTauschGenehmigt(
          anbieterTel.name,
          annehmerTel?.name || 'Kollege',
          tauschEintrag.annehmer_datum || '',
          uhrzeit,
        )
      ).catch(err => console.error('[SMS Tausch] Anbieter:', err));
    }

    // Annehmer: bekommt jetzt die Anbieter-Schicht
    if (annehmerTel?.telefon && tauschEintrag.anbieter_beginn && tauschEintrag.anbieter_ende) {
      const uhrzeit = `${tauschEintrag.anbieter_beginn.slice(0, 5)}–${tauschEintrag.anbieter_ende.slice(0, 5)}`;
      smsSenden(
        annehmerTel.telefon,
        smsTextTauschGenehmigt(
          annehmerTel.name,
          anbieterTel?.name || 'Kollege',
          tauschEintrag.anbieter_datum || '',
          uhrzeit,
        )
      ).catch(err => console.error('[SMS Tausch] Annehmer:', err));
    }
  }

  res.json(tausch);
}));

// POST /api/dienstplan/tausch/:id/ablehnen — Admin oder MA lehnt ab
router.post('/tausch/:id/ablehnen', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  // Schichtdaten VOR dem Ablehnen laden — für die SMS an den Anbieter
  const tauschVorher = await SchichttauschModel.liste(req.auth!.restaurantId);
  const tauschEintrag = tauschVorher.find(t => t.id === req.params.id);

  const tausch = await SchichttauschModel.ablehnen(req.params.id, req.auth!.restaurantId);
  if (!tausch) {
    res.status(404).json({ fehler: 'Tausch nicht gefunden' });
    return;
  }

  // ── SMS an Anbieter: seine ursprüngliche Schicht bleibt ──
  if (tauschEintrag?.anbieter_datum && tauschEintrag.anbieter_beginn && tauschEintrag.anbieter_ende) {
    const anbieterTel = await MitarbeiterModel.telefonnummer(tausch.anbieter_id, req.auth!.restaurantId);
    if (anbieterTel?.telefon) {
      const uhrzeit = `${tauschEintrag.anbieter_beginn.slice(0, 5)}–${tauschEintrag.anbieter_ende.slice(0, 5)}`;
      smsSenden(
        anbieterTel.telefon,
        smsTextTauschAbgelehnt(anbieterTel.name, tauschEintrag.anbieter_datum, uhrzeit)
      ).catch(err => console.error('[SMS Tausch Ablehnen]:', err));
    }
  }

  res.json(tausch);
}));

// ── Schicht-Templates ────────────────────────────────────────────────────────

// GET /api/dienstplan/templates — Alle Templates laden (nur Admin)
router.get('/templates', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const templates = await SchichtTemplateModel.alle(req.auth!.restaurantId);
  res.json(templates);
}));

// POST /api/dienstplan/templates — Neue Vorlage speichern
// Body: { name: string, eintraege: Array<{ mitarbeiter_id, wochentag, beginn, ende, notiz? }> }
router.post('/templates', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, eintraege } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ fehler: 'Name ist erforderlich' });
    return;
  }
  if (!Array.isArray(eintraege)) {
    res.status(400).json({ fehler: 'eintraege muss ein Array sein' });
    return;
  }

  const template = await SchichtTemplateModel.erstellenMitEintraegen(
    req.auth!.restaurantId,
    name.trim(),
    eintraege
  );
  res.status(201).json(template);
}));

// POST /api/dienstplan/templates/:id/anwenden — Vorlage auf eine Woche anwenden
// Body: { montag: "2026-04-14" }
router.post('/templates/:id/anwenden', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { montag } = req.body;
  if (!montag || !/^\d{4}-\d{2}-\d{2}$/.test(montag)) {
    res.status(400).json({ fehler: 'montag ist erforderlich (Format: YYYY-MM-DD)' });
    return;
  }

  const ergebnis = await SchichtTemplateModel.anwenden(
    req.auth!.restaurantId,
    req.params.id,
    montag
  );
  res.json(ergebnis);
}));

// DELETE /api/dienstplan/templates/:id — Vorlage löschen
router.delete('/templates/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const geloescht = await SchichtTemplateModel.loeschen(req.auth!.restaurantId, req.params.id);
  if (!geloescht) {
    res.status(404).json({ fehler: 'Vorlage nicht gefunden' });
    return;
  }
  res.json({ geloescht: true });
}));

// POST /api/dienstplan/tausch/:id/zurueckziehen — Anbieter zieht Anfrage zurück
router.post('/tausch/:id/zurueckziehen', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const tausch = await SchichttauschModel.zurueckziehen(
    req.params.id,
    req.auth!.restaurantId,
    req.auth!.mitarbeiterId
  );
  if (!tausch) {
    res.status(404).json({ fehler: 'Tausch nicht gefunden oder bereits angenommen' });
    return;
  }
  res.json(tausch);
}));

// ── Excel-Import ─────────────────────────────────────────────────────────────

/** Excel-Datum (Serial oder String) → YYYY-MM-DD oder null */
function excelDatumZuStr(val: unknown): string | null {
  if (val == null) return null;
  // Excel speichert Daten als Serien-Nummern (Tage seit 1900-01-01)
  if (typeof val === 'number' && val > 1 && val < 100000) {
    const datum = XLSX.SSF.parse_date_code(val);
    if (datum) return `${datum.y}-${String(datum.m).padStart(2, '0')}-${String(datum.d).padStart(2, '0')}`;
  }
  const str = String(val).trim();
  // DD.MM.YYYY (deutsches Format)
  const de = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (de) return `${de[3]}-${de[2].padStart(2, '0')}-${de[1].padStart(2, '0')}`;
  // YYYY-MM-DD (ISO)
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // MM/DD/YYYY (US)
  const us = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) return `${us[3]}-${us[1].padStart(2, '0')}-${us[2].padStart(2, '0')}`;
  return null;
}

/** Zeitstring → { beginn, ende } oder null. Unterstützt: "08:00-16:00", "8-16", "08.00-16.00" */
function parseZeiten(val: unknown): { beginn: string; ende: string } | null {
  const str = String(val ?? '').trim();
  if (!str) return null;
  // HH:MM-HH:MM oder HH:MM – HH:MM (mit Bindestrich oder Gedankenstrich)
  const m1 = str.match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})$/);
  if (m1) return { beginn: `${m1[1].padStart(2, '0')}:${m1[2]}`, ende: `${m1[3].padStart(2, '0')}:${m1[4]}` };
  // H-H (z.B. "8-16" → "08:00-16:00")
  const m2 = str.match(/^(\d{1,2})\s*[-–]\s*(\d{1,2})$/);
  if (m2) return { beginn: `${m2[1].padStart(2, '0')}:00`, ende: `${m2[2].padStart(2, '0')}:00` };
  // HH.MM-HH.MM (europäischer Punkt statt Doppelpunkt)
  const m3 = str.match(/^(\d{1,2})\.(\d{2})\s*[-–]\s*(\d{1,2})\.(\d{2})$/);
  if (m3) return { beginn: `${m3[1].padStart(2, '0')}:${m3[2]}`, ende: `${m3[3].padStart(2, '0')}:${m3[4]}` };
  return null;
}

/**
 * POST /api/dienstplan/import-excel
 * Query: ?trockenlauf=true  → Vorschau ohne Speichern
 *
 * Excel-Format (erste Tabelle):
 *   Zeile 1: Kopfzeile — Spalte A = "Name"/"Mitarbeiter" (ignoriert), Spalten B+ = Datum (DD.MM.YYYY etc.)
 *   Zeile 2+: Spalte A = Mitarbeitername, Spalten B+ = Schichtzeit ("08:00-16:00") oder leer
 */
router.post(
  '/import-excel',
  requireAuth,
  requireRolle('admin'),
  upload.single('datei'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ fehler: 'Keine Datei hochgeladen' });
      return;
    }

    const trockenlauf = req.query.trockenlauf === 'true';

    // ── Excel parsen ─────────────────────────────────────────────────────────
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: false });
    } catch {
      res.status(400).json({ fehler: 'Datei konnte nicht gelesen werden. Bitte .xlsx oder .xls verwenden.' });
      return;
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet['!ref']) {
      res.status(400).json({ fehler: 'Erste Tabelle ist leer' });
      return;
    }

    // Zellen als rohe Werte einlesen
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const zeilen: unknown[][] = [];
    for (let r = range.s.r; r <= range.e.r; r++) {
      const zeile: unknown[] = [];
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r, c })];
        zeile.push(cell ? cell.v : null);
      }
      zeilen.push(zeile);
    }

    if (zeilen.length < 2) {
      res.status(400).json({ fehler: 'Datei hat zu wenige Zeilen (Kopfzeile + mind. 1 Datenzeile)' });
      return;
    }

    // ── Datumsspalten aus Kopfzeile ermitteln ─────────────────────────────────
    const kopfzeile = zeilen[0];
    const datumspalten: { index: number; datum: string }[] = [];
    for (let i = 1; i < kopfzeile.length; i++) {
      const datum = excelDatumZuStr(kopfzeile[i]);
      if (datum) datumspalten.push({ index: i, datum });
    }

    if (datumspalten.length === 0) {
      res.status(400).json({
        fehler: 'Keine Datumsspalten gefunden. Spaltentitel müssen Datumswerte sein (z.B. 01.04.2026 oder 2026-04-01)',
      });
      return;
    }

    // ── Aktive Mitarbeiter laden ──────────────────────────────────────────────
    const mitarbeiterListe = await MitarbeiterModel.alleAktiv(req.auth!.restaurantId);

    const vorschau: { mitarbeiter_name: string; mitarbeiter_id: string; datum: string; beginn: string; ende: string }[] = [];
    const fehler: string[] = [];
    const nichtGefunden: string[] = [];
    let erstelltAnzahl = 0;

    for (let r = 1; r < zeilen.length; r++) {
      const zeile = zeilen[r];
      if (!zeile[0]) continue;
      const name = String(zeile[0]).trim();
      if (!name) continue;

      // Mitarbeiter per Name suchen (exakt, dann Teilstring, case-insensitive)
      const ma =
        mitarbeiterListe.find((m: { name: string }) => m.name.toLowerCase() === name.toLowerCase()) ||
        mitarbeiterListe.find((m: { name: string }) =>
          m.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(m.name.toLowerCase())
        );

      if (!ma) {
        if (!nichtGefunden.includes(name)) nichtGefunden.push(name);
        continue;
      }

      for (const { index, datum } of datumspalten) {
        const zellenwert = zeile[index];
        if (zellenwert == null || String(zellenwert).trim() === '') continue;

        const zeiten = parseZeiten(zellenwert);
        if (!zeiten) {
          fehler.push(`${ma.name}, ${datum}: "${zellenwert}" ist kein gültiges Zeitformat (z.B. 08:00-16:00)`);
          continue;
        }

        if (zeiten.beginn >= zeiten.ende) {
          fehler.push(`${ma.name}, ${datum}: Ende muss nach Beginn liegen (${zeiten.beginn}–${zeiten.ende})`);
          continue;
        }

        if (trockenlauf) {
          vorschau.push({ mitarbeiter_name: ma.name, mitarbeiter_id: ma.id, datum, beginn: zeiten.beginn, ende: zeiten.ende });
        } else {
          try {
            const pruefung = await SchichtModel.arbzgPruefen(req.auth!.restaurantId, ma.id, datum, zeiten.beginn, zeiten.ende);
            if (pruefung.konflikte.length > 0) {
              fehler.push(`${ma.name}, ${datum}: ${pruefung.konflikte[0]}`);
              continue;
            }
            await SchichtModel.erstellen({
              restaurant_id: req.auth!.restaurantId,
              mitarbeiter_id: ma.id,
              datum,
              beginn: zeiten.beginn,
              ende: zeiten.ende,
            });
            erstelltAnzahl++;
          } catch (e: unknown) {
            fehler.push(`${ma.name}, ${datum}: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`);
          }
        }
      }
    }

    res.json({
      trockenlauf,
      erstellt: trockenlauf ? vorschau.length : erstelltAnzahl,
      vorschau: trockenlauf ? vorschau : undefined,
      fehler,
      nichtGefunden,
    });
  })
);

export default router;
