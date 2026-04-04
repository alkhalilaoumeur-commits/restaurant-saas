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
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ fehler: 'Nicht authentifiziert' });
    return;
  }
  try {
    req.auth = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as AuthPayload;
    next();
  } catch {
    res.status(401).json({ fehler: 'Token ungültig oder abgelaufen' });
  }
}

export function requireRolle(...rollen: AuthPayload['rolle'][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.auth || !rollen.includes(req.auth.rolle)) {
      res.status(403).json({ fehler: 'Keine Berechtigung' });
      return;
    }
    next();
  };
}
