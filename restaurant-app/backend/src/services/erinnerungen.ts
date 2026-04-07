import cron from 'node-cron';
import { ReservierungModel } from '../models/Reservierung';
import { reservierungErinnerungSenden } from './email';

/**
 * Startet den Erinnerungs-Cron-Job.
 *
 * Läuft alle 15 Minuten und prüft:
 * 1. Reservierungen in ~24h → sendet 24h-Erinnerung
 * 2. Reservierungen in ~3h → sendet 3h-Erinnerung
 * 3. Einmal täglich um 3:00 → DSGVO-Cleanup (personenbezogene Daten nach 30 Tagen löschen)
 */
export function starteErinnerungen(): void {
  // Alle 15 Minuten: Erinnerungen prüfen und senden
  cron.schedule('*/15 * * * *', async () => {
    try {
      // 24h-Erinnerungen
      const faellig24h = await ReservierungModel.faelligeErinnerungen('24h');
      for (const res of faellig24h) {
        if (!res.email || !res.buchungs_token) continue;
        await reservierungErinnerungSenden(
          res.email, res.gast_name, res.restaurant_name,
          res.datum, res.personen, res.buchungs_token, '24h'
        );
        await ReservierungModel.erinnerungAktualisieren(res.id, '24h');
        console.log(`[Erinnerung] 24h gesendet an ${res.email}`);
      }

      // 3h-Erinnerungen
      const faellig3h = await ReservierungModel.faelligeErinnerungen('3h');
      for (const res of faellig3h) {
        if (!res.email || !res.buchungs_token) continue;
        await reservierungErinnerungSenden(
          res.email, res.gast_name, res.restaurant_name,
          res.datum, res.personen, res.buchungs_token, '3h'
        );
        await ReservierungModel.erinnerungAktualisieren(res.id, '3h');
        console.log(`[Erinnerung] 3h gesendet an ${res.email}`);
      }
    } catch (err) {
      console.error('[Erinnerung] Fehler:', err);
    }
  });

  // Täglich um 3:00 Uhr: DSGVO-Cleanup
  cron.schedule('0 3 * * *', async () => {
    try {
      await ReservierungModel.dsgvoAufraeumen();
      console.log('[DSGVO] Personenbezogene Daten bereinigt (> 30 Tage)');
    } catch (err) {
      console.error('[DSGVO] Cleanup-Fehler:', err);
    }
  });

  console.log('[Erinnerung] Cron-Jobs gestartet (alle 15 Min + DSGVO täglich 3:00)');
}
