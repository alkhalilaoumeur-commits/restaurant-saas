import { Router, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import { WartelisteModel } from '../models/Warteliste';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { q1 } from '../models/db';
import { wartelisteBenachrichtigungSenden } from '../services/email';

const router = Router();

// GET /api/warteliste?datum=YYYY-MM-DD
// Alle Einträge für ein Datum (Admin/Kellner)
router.get('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const datum = (req.query.datum as string) || new Date().toISOString().slice(0, 10);
    const eintraege = await WartelisteModel.nachDatum(req.auth!.restaurantId, datum);
    res.json(eintraege);
  })
);

// POST /api/warteliste
// Neuen Eintrag hinzufügen (Admin/Kellner für Walk-in, oder öffentlich für online)
router.post('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { gast_name, telefon, email, personen, datum, anmerkung, quelle } = req.body;

    if (!gast_name || !personen || !datum) {
      res.status(400).json({ fehler: 'gast_name, personen und datum sind erforderlich' });
      return;
    }
    if (parseInt(personen) < 1 || parseInt(personen) > 50) {
      res.status(400).json({ fehler: 'Personenzahl muss zwischen 1 und 50 liegen' });
      return;
    }

    const eintrag = await WartelisteModel.erstellen({
      restaurant_id: req.auth!.restaurantId,
      gast_name: gast_name.trim(),
      telefon: telefon?.trim() || null,
      email: email?.trim() || null,
      personen: parseInt(personen),
      datum,
      anmerkung: anmerkung?.trim() || null,
      quelle: quelle === 'online' ? 'online' : 'walk_in',
    });

    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('warteliste_neu', eintrag);

    res.status(201).json(eintrag);
  })
);

// POST /api/warteliste/online/:restaurantId
// Öffentlicher Endpunkt — Gast trägt sich selbst ein (von der Buchungsseite)
router.post('/online/:restaurantId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { restaurantId } = req.params;
    const { gast_name, telefon, email, personen, datum, anmerkung } = req.body;

    if (!gast_name || !personen || !datum) {
      res.status(400).json({ fehler: 'gast_name, personen und datum sind erforderlich' });
      return;
    }
    if (parseInt(personen) < 1 || parseInt(personen) > 50) {
      res.status(400).json({ fehler: 'Personenzahl muss zwischen 1 und 50 liegen' });
      return;
    }

    // Prüfen ob Restaurant existiert
    const restaurant = await q1<{ id: string }>(
      'SELECT id FROM restaurants WHERE id = $1', [restaurantId]
    );
    if (!restaurant) {
      res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return;
    }

    const eintrag = await WartelisteModel.erstellen({
      restaurant_id: restaurantId,
      gast_name: gast_name.trim(),
      telefon: telefon?.trim() || null,
      email: email?.trim() || null,
      personen: parseInt(personen),
      datum,
      anmerkung: anmerkung?.trim() || null,
      quelle: 'online',
    });

    const io = req.app.get('io');
    if (io) io.to(`restaurant:${restaurantId}`).emit('warteliste_neu', eintrag);

    res.status(201).json(eintrag);
  })
);

// PATCH /api/warteliste/:id/bestaetigen
// Admin bestätigt: Gast bekommt Tisch → aus Warteliste entfernen
router.patch('/:id/bestaetigen', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const eintrag = await WartelisteModel.nachId(req.params.id, req.auth!.restaurantId);
    if (!eintrag) { res.status(404).json({ fehler: 'Eintrag nicht gefunden' }); return; }

    const aktualisiert = await WartelisteModel.statusAendern(
      req.params.id, req.auth!.restaurantId, 'bestaetigt'
    );

    // Positionen der Wartenden neu nummerieren
    await WartelisteModel.positionenNeuordnen(req.auth!.restaurantId, eintrag.datum);

    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('warteliste_aktualisiert', aktualisiert);

    res.json(aktualisiert);
  })
);

// PATCH /api/warteliste/:id/stornieren
// Gast storniert selbst oder Admin entfernt
router.patch('/:id/stornieren', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const eintrag = await WartelisteModel.nachId(req.params.id, req.auth!.restaurantId);
    if (!eintrag) { res.status(404).json({ fehler: 'Eintrag nicht gefunden' }); return; }

    const aktualisiert = await WartelisteModel.statusAendern(
      req.params.id, req.auth!.restaurantId, 'storniert'
    );

    await WartelisteModel.positionenNeuordnen(req.auth!.restaurantId, eintrag.datum);

    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('warteliste_aktualisiert', aktualisiert);

    res.json(aktualisiert);
  })
);

// POST /api/warteliste/nachruecken
// Wird intern aufgerufen wenn eine Reservierung storniert wird.
// Benachrichtigt den nächsten Wartenden per Email.
export async function wartelisteNachruecken(
  restaurantId: string,
  datum: string,
  restaurantName: string,
  io?: SocketServer
): Promise<void> {
  const naechster = await WartelisteModel.naechsterWartender(restaurantId, datum);
  if (!naechster) return; // Warteliste leer

  // Als "benachrichtigt" markieren
  const aktualisiert = await WartelisteModel.benachrichtigt(naechster.id, restaurantId);

  // Socket.io Update
  if (io) io.to(`restaurant:${restaurantId}`).emit('warteliste_aktualisiert', aktualisiert);

  // Email senden wenn vorhanden
  if (naechster.email) {
    wartelisteBenachrichtigungSenden(
      naechster.email,
      naechster.gast_name,
      restaurantName,
      naechster.datum,
      naechster.personen
    ).catch((e) => console.error('[Warteliste Email]', e));
  }

  console.log(`[Warteliste] ${naechster.gast_name} benachrichtigt für ${datum}`);
}

export default router;
