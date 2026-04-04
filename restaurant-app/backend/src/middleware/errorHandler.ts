import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Fehler]', err.message);
  res.status(500).json({ fehler: 'Interner Serverfehler' });
}
