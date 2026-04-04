import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne } from '../config/database';

const router = Router();

interface Mitarbeiter {
  id: string;
  restaurant_id: string;
  name: string;
  email: string;
  passwort_hash: string;
  rolle: 'admin' | 'kellner' | 'kueche';
  aktiv: boolean;
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, passwort } = req.body;

  if (!email || !passwort) {
    res.status(400).json({ error: 'Email und Passwort erforderlich' });
    return;
  }

  const mitarbeiter = await queryOne<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE email = $1 AND aktiv = true',
    [email.toLowerCase()]
  );

  if (!mitarbeiter) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    return;
  }

  const passwortKorrekt = await bcrypt.compare(passwort, mitarbeiter.passwort_hash);
  if (!passwortKorrekt) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    return;
  }

  const token = jwt.sign(
    {
      mitarbeiterId: mitarbeiter.id,
      restaurantId: mitarbeiter.restaurant_id,
      rolle: mitarbeiter.rolle,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    token,
    mitarbeiter: {
      id: mitarbeiter.id,
      name: mitarbeiter.name,
      email: mitarbeiter.email,
      rolle: mitarbeiter.rolle,
      restaurantId: mitarbeiter.restaurant_id,
    },
  });
});

// POST /api/auth/passwort-aendern
router.post('/passwort-aendern', async (req: Request, res: Response): Promise<void> => {
  // TODO: requireAuth Middleware + Passwort-Änderung implementieren
  res.status(501).json({ error: 'Noch nicht implementiert' });
});

export default router;
