import { Router, Response } from 'express';
import { SchichtModel } from '../models/Schicht';
import { SchichttauschModel } from '../models/Schichttausch';
import { SchichtTemplateModel } from '../models/SchichtTemplate';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

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
  res.json(tausch);
}));

// POST /api/dienstplan/tausch/:id/ablehnen — Admin oder MA lehnt ab
router.post('/tausch/:id/ablehnen', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const tausch = await SchichttauschModel.ablehnen(req.params.id, req.auth!.restaurantId);
  if (!tausch) {
    res.status(404).json({ fehler: 'Tausch nicht gefunden' });
    return;
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

export default router;
