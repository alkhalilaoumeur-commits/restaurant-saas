/**
 * Abo-Cron — läuft täglich um 02:00 Uhr
 * Setzt abgelaufene Abos automatisch auf 'expired'
 * und sendet 7-Tage-Erinnerungs-Email an betroffene Restaurants
 */

import cron from 'node-cron';
import { AboModel } from '../models/Abo';
import { q } from '../models/db';

export function starteAboCron(): void {
  // Täglich um 02:00 Uhr
  cron.schedule('0 2 * * *', async () => {
    console.log('[Abo-Cron] Prüfe abgelaufene Abos...');

    // 1. Abgelaufene Abos deaktivieren
    const anzahl = await AboModel.abgelaufeneAbosDeaktivieren();
    if (anzahl > 0) {
      console.log(`[Abo-Cron] ${anzahl} Abo(s) deaktiviert.`);
    }

    // 2. In 7 Tagen ablaufende Abos → Erinnerungs-Email (TODO: Email-Vorlage)
    const bald = await q<{ id: string; name: string; email: string }>(
      `SELECT r.id, r.name, m.email
       FROM restaurants r
       JOIN mitarbeiter m ON m.restaurant_id = r.id AND m.rolle = 'admin' AND m.aktiv = true
       WHERE r.abo_status = 'active'
         AND r.abo_laeuft_bis BETWEEN NOW() AND NOW() + INTERVAL '7 days'`,
      [],
    );

    if (bald.length > 0) {
      console.log(`[Abo-Cron] ${bald.length} Abo(s) laufen in 7 Tagen ab — Erinnerungen würden gesendet.`);
      // TODO: Erinnerungs-Email senden
    }
  });

  console.log('[Abo-Cron] gestartet (täglich 02:00 Uhr)');
}
