import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { BestellungModel, BestellungStatus } from '../models/Bestellung';
import { pool, q, q1 } from '../models/db';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { io } from '../server';

interface PositionExtras {
  extra_id: string;
}

const router = Router();

const ERLAUBTE_STATUS: BestellungStatus[] = ['offen', 'in_zubereitung', 'serviert', 'bezahlt'];

// GET /api/bestellungen  (Mitarbeiter)
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const bestellungen = await BestellungModel.alleAktiven(req.auth!.restaurantId);
  res.json(bestellungen);
}));

// POST /api/bestellungen  (Gäste – kein Auth)
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { restaurant_id, tisch_id, positionen, anmerkung } = req.body;
  if (!restaurant_id || !tisch_id || !positionen?.length) {
    res.status(400).json({ fehler: 'restaurant_id, tisch_id und positionen sind erforderlich' });
    return;
  }

  // Menge pro Position validieren (1–99)
  for (const pos of positionen as { gericht_id: string; menge: number }[]) {
    const menge = Number(pos.menge);
    if (!Number.isInteger(menge) || menge < 1 || menge > 99) {
      res.status(400).json({ fehler: 'Menge muss zwischen 1 und 99 liegen' });
      return;
    }
  }

  // Prüfen: Gehört der Tisch wirklich zu diesem Restaurant?
  const tisch = await q1('SELECT id FROM tische WHERE id = $1 AND restaurant_id = $2', [tisch_id, restaurant_id]);
  if (!tisch) {
    res.status(404).json({ fehler: 'Tisch nicht gefunden' });
    return;
  }

  // Preise serverseitig aus DB holen – nie vom Client vertrauen
  const gerichtIds = positionen.map((p: { gericht_id: string }) => p.gericht_id);
  const gerichte = await q<{ id: string; preis: number; verfuegbar: boolean }>(
    'SELECT id, preis, verfuegbar FROM gerichte WHERE id = ANY($1) AND restaurant_id = $2 AND verfuegbar = true',
    [gerichtIds, restaurant_id]
  );

  if (gerichte.length !== gerichtIds.length) {
    res.status(400).json({ fehler: 'Ein oder mehrere Gerichte nicht verfügbar' });
    return;
  }

  // Extras-IDs aus allen Positionen sammeln und Preise aus DB holen
  const alleExtraIds: string[] = [];
  for (const pos of positionen as { gericht_id: string; menge: number; extras?: PositionExtras[] }[]) {
    if (pos.extras?.length) {
      alleExtraIds.push(...pos.extras.map((e) => e.extra_id));
    }
  }

  const extrasPreisMap = new Map<string, { name: string; aufpreis: number }>();
  if (alleExtraIds.length > 0) {
    const extrasAusDb = await q<{ id: string; name: string; aufpreis: number; verfuegbar: boolean }>(
      'SELECT id, name, aufpreis, verfuegbar FROM extras WHERE id = ANY($1) AND restaurant_id = $2 AND verfuegbar = true',
      [alleExtraIds, restaurant_id]
    );
    for (const e of extrasAusDb) {
      extrasPreisMap.set(e.id, { name: e.name, aufpreis: Number(e.aufpreis) });
    }
  }

  const preisMap = new Map(gerichte.map((g) => [g.id, g.preis]));
  let gesamtpreis = 0;

  const bestellungId = uuid();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO bestellungen (id, restaurant_id, tisch_id, status, gesamtpreis, anmerkung, erstellt_am)
       VALUES ($1,$2,$3,'offen',$4,$5,NOW())`,
      [bestellungId, restaurant_id, tisch_id, 0, anmerkung || null]
    );

    for (const pos of positionen as { gericht_id: string; menge: number; extras?: PositionExtras[] }[]) {
      const preis = preisMap.get(pos.gericht_id)!;

      // Extras-Aufpreise pro Position berechnen
      let extrasAufpreis = 0;
      if (pos.extras?.length) {
        for (const e of pos.extras) {
          const extraInfo = extrasPreisMap.get(e.extra_id);
          if (extraInfo) extrasAufpreis += extraInfo.aufpreis;
        }
      }

      // Einzelpreis = Gerichtpreis + Summe aller Extras-Aufpreise
      const einzelpreis = preis + extrasAufpreis;
      gesamtpreis += einzelpreis * pos.menge;

      const positionId = uuid();
      await client.query(
        'INSERT INTO bestellpositionen (id,bestellung_id,gericht_id,menge,einzelpreis) VALUES ($1,$2,$3,$4,$5)',
        [positionId, bestellungId, pos.gericht_id, pos.menge, einzelpreis]
      );

      // Gewählte Extras speichern (mit eingefrorenem Aufpreis)
      if (pos.extras?.length) {
        for (const e of pos.extras) {
          const extraInfo = extrasPreisMap.get(e.extra_id);
          if (extraInfo) {
            await client.query(
              'INSERT INTO bestellposition_extras (id,position_id,extra_id,extra_name,aufpreis) VALUES ($1,$2,$3,$4,$5)',
              [uuid(), positionId, e.extra_id, extraInfo.name, extraInfo.aufpreis]
            );
          }
        }
      }
    }

    await client.query('UPDATE bestellungen SET gesamtpreis = $1 WHERE id = $2', [gesamtpreis, bestellungId]);
    await client.query("UPDATE tische SET status = 'besetzt' WHERE id = $1", [tisch_id]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  io.to(`restaurant:${restaurant_id}`).emit('neue_bestellung', { bestellungId, tisch_id });

  res.status(201).json({ id: bestellungId, gesamtpreis });
}));

// PATCH /api/bestellungen/:id/status  (Mitarbeiter)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner', 'kueche'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    if (!ERLAUBTE_STATUS.includes(status)) {
      res.status(400).json({ fehler: `Ungültiger Status. Erlaubt: ${ERLAUBTE_STATUS.join(', ')}` });
      return;
    }
    const bestellung = await BestellungModel.statusAendern(req.params.id, req.auth!.restaurantId, status);
    if (!bestellung) { res.status(404).json({ fehler: 'Bestellung nicht gefunden' }); return; }

    io.to(`restaurant:${req.auth!.restaurantId}`).emit('bestellung_aktualisiert', bestellung);
    if (bestellung.tisch_id) {
      io.to(`tisch:${req.auth!.restaurantId}:${bestellung.tisch_id}`).emit('bestellung_aktualisiert', bestellung);
    }

    // Wenn Bestellung → bezahlt: Prüfen ob ALLE aktiven Bestellungen des Tisches bezahlt sind
    // → Tisch automatisch auf 'frei' setzen
    if (status === 'bezahlt' && bestellung.tisch_id) {
      const offene = await q<{ id: string }>(
        `SELECT id FROM bestellungen
         WHERE tisch_id = $1 AND restaurant_id = $2 AND status != 'bezahlt'`,
        [bestellung.tisch_id, req.auth!.restaurantId]
      );
      if (offene.length === 0) {
        await q(`UPDATE tische SET status = 'frei' WHERE id = $1 AND restaurant_id = $2`,
          [bestellung.tisch_id, req.auth!.restaurantId]);
        io.to(`restaurant:${req.auth!.restaurantId}`).emit('tisch_aktualisiert', {
          id: bestellung.tisch_id, status: 'frei',
        });
      }
    }

    res.json(bestellung);
  })
);

export default router;
