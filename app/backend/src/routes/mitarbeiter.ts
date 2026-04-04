import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '../config/database';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/mitarbeiter (nur Admin)
router.get('/', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const mitarbeiter = await query(
    'SELECT id, restaurant_id, name, email, rolle, aktiv FROM mitarbeiter WHERE restaurant_id = $1',
    [req.auth!.restaurantId]
  );
  res.json(mitarbeiter);
});

// POST /api/mitarbeiter (nur Admin)
router.post('/', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, passwort, rolle } = req.body;

  if (!name || !email || !passwort || !rolle) {
    res.status(400).json({ error: 'name, email, passwort und rolle erforderlich' });
    return;
  }

  const erlaubteRollen = ['admin', 'kellner', 'kueche'];
  if (!erlaubteRollen.includes(rolle)) {
    res.status(400).json({ error: `Rolle muss eine von: ${erlaubteRollen.join(', ')} sein` });
    return;
  }

  const existiert = await queryOne(
    'SELECT id FROM mitarbeiter WHERE email = $1',
    [email.toLowerCase()]
  );
  if (existiert) {
    res.status(409).json({ error: 'Email bereits vergeben' });
    return;
  }

  const passwort_hash = await bcrypt.hash(passwort, 12);

  const mitarbeiter = await queryOne(
    `INSERT INTO mitarbeiter (id, restaurant_id, name, email, passwort_hash, rolle, aktiv)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id, restaurant_id, name, email, rolle, aktiv`,
    [uuidv4(), req.auth!.restaurantId, name, email.toLowerCase(), passwort_hash, rolle]
  );
  res.status(201).json(mitarbeiter);
});

// PATCH /api/mitarbeiter/:id (nur Admin)
router.patch('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, rolle, aktiv } = req.body;

  const mitarbeiter = await queryOne(
    `UPDATE mitarbeiter
     SET name = COALESCE($1, name),
         rolle = COALESCE($2, rolle),
         aktiv = COALESCE($3, aktiv)
     WHERE id = $4 AND restaurant_id = $5
     RETURNING id, restaurant_id, name, email, rolle, aktiv`,
    [name, rolle, aktiv, req.params.id, req.auth!.restaurantId]
  );
  if (!mitarbeiter) {
    res.status(404).json({ error: 'Mitarbeiter nicht gefunden' });
    return;
  }
  res.json(mitarbeiter);
});

export default router;
