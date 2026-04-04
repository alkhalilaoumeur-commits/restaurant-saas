import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Stellt sicher, dass restaurantId aus dem Token mit der Route übereinstimmt
export function requireTenant(req: AuthRequest, res: Response, next: NextFunction): void {
  const restaurantIdParam = req.params.restaurantId || req.query.restaurantId as string;
  if (restaurantIdParam && req.auth && restaurantIdParam !== req.auth.restaurantId) {
    res.status(403).json({ error: 'Zugriff auf fremdes Restaurant nicht erlaubt' });
    return;
  }
  next();
}
