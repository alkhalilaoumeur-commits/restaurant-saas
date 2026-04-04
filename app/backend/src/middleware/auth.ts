import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  mitarbeiterId: string;
  restaurantId: string;
  rolle: 'admin' | 'kellner' | 'kueche';
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Nicht authentifiziert' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token ungültig oder abgelaufen' });
  }
}

export function requireRolle(...rollen: AuthPayload['rolle'][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.auth || !rollen.includes(req.auth.rolle)) {
      res.status(403).json({ error: 'Keine Berechtigung' });
      return;
    }
    next();
  };
}
