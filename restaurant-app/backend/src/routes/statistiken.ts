import { Router, Response } from 'express';
import { StatistikModel } from '../models/Statistik';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/statistiken?tage=7  (Admin)
router.get('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const tage = Math.min(Math.max(parseInt(req.query.tage as string) || 7, 1), 365);
  const restaurantId = req.auth!.restaurantId;

  const [zusammenfassung, umsatzProTag, beliebteGerichte, stosszeiten, kategorieUmsatz, crmMetriken] = await Promise.all([
    StatistikModel.zusammenfassung(restaurantId, tage),
    StatistikModel.umsatzProTag(restaurantId, tage),
    StatistikModel.beliebteGerichte(restaurantId, tage),
    StatistikModel.stosszeiten(restaurantId, tage),
    StatistikModel.kategorieUmsatz(restaurantId, tage),
    StatistikModel.crmMetriken(restaurantId, tage),
  ]);

  res.json({
    zeitraum: tage,
    zusammenfassung,
    umsatzProTag,
    beliebteGerichte,
    stosszeiten,
    kategorieUmsatz,
    crmMetriken,
  });
}));

export default router;
