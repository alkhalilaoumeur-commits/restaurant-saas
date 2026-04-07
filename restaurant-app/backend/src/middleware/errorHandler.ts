import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * asyncHandler: Wickelt async Route-Handler so ein, dass Fehler automatisch
 * an Express' Error-Handler weitergeleitet werden.
 *
 * Problem: Express 4 fängt KEINE Fehler aus async-Funktionen ab.
 * Ohne diesen Wrapper stürzt der Server bei jedem unerwarteten DB-Fehler ab.
 *
 * Nutzung: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn: (...args: Parameters<RequestHandler>) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

/**
 * Globaler Error-Handler — fängt alle Fehler die über next(err) oder asyncHandler kommen.
 * Gibt dem Client eine generische Fehlermeldung, loggt den echten Fehler auf dem Server.
 */
export function errorHandler(
  err: Error & { code?: string; constraint?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Fehler]', err.message);

  // PostgreSQL Unique-Constraint-Verletzung (z.B. Tischnummer existiert schon)
  if (err.code === '23505') {
    res.status(409).json({ fehler: 'Ein Eintrag mit diesen Daten existiert bereits' });
    return;
  }

  // PostgreSQL Foreign-Key-Verletzung (z.B. Kategorie-ID existiert nicht)
  if (err.code === '23503') {
    res.status(400).json({ fehler: 'Verknüpfter Datensatz nicht gefunden' });
    return;
  }

  res.status(500).json({ fehler: 'Interner Serverfehler' });
}
