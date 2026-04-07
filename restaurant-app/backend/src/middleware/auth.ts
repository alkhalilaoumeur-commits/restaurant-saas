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

/**
 * optionalAuth: Liest den JWT aus dem Authorization-Header, WENN einer vorhanden ist.
 * Blockiert aber NICHT, wenn kein Token da ist → req.auth bleibt dann undefined.
 * Nützlich für Routen die sowohl öffentlich (Gäste) als auch authentifiziert (Mitarbeiter) funktionieren.
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.auth = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as AuthPayload;
    } catch {
      // Ungültiger Token → ignorieren, req.auth bleibt undefined
    }
  }
  next();
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
