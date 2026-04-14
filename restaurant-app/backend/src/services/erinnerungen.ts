import cron from 'node-cron';
import { ReservierungModel } from '../models/Reservierung';
import { reservierungErinnerungSenden } from './email';
import { gastSmsSenden, gastSms24h, gastSms3h } from './sms-gast';
import { q } from '../models/db';

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
        if (!res.buchungs_token) continue;

        // E-Mail (wenn vorhanden)
        if (res.email) {
          await reservierungErinnerungSenden(
            res.email, res.gast_name, res.restaurant_name,
            res.datum, res.personen, res.buchungs_token, '24h'
          ).catch(err => console.error(`[Erinnerung] 24h E-Mail Fehler (${res.id}):`, err));
        }

        // SMS (wenn Telefon vorhanden — 95% Öffnungsrate)
        if (res.telefon) {
          await gastSmsSenden(
            res.telefon,
            gastSms24h(res.gast_name, res.restaurant_name, res.datum, res.personen)
          ).catch(err => console.error(`[Erinnerung] 24h SMS Fehler (${res.id}):`, err));
        }

        await ReservierungModel.erinnerungAktualisieren(res.id, '24h');
        console.log(`[Erinnerung] 24h gesendet (Reservierung ${res.id}, Email: ${!!res.email}, SMS: ${!!res.telefon})`);
      }

      // 3h-Erinnerungen
      const faellig3h = await ReservierungModel.faelligeErinnerungen('3h');
      for (const res of faellig3h) {
        if (!res.buchungs_token) continue;

        // E-Mail (wenn vorhanden)
        if (res.email) {
          await reservierungErinnerungSenden(
            res.email, res.gast_name, res.restaurant_name,
            res.datum, res.personen, res.buchungs_token, '3h'
          ).catch(err => console.error(`[Erinnerung] 3h E-Mail Fehler (${res.id}):`, err));
        }

        // SMS (wenn Telefon vorhanden)
        if (res.telefon) {
          await gastSmsSenden(
            res.telefon,
            gastSms3h(res.gast_name, res.restaurant_name, res.datum, res.personen)
          ).catch(err => console.error(`[Erinnerung] 3h SMS Fehler (${res.id}):`, err));
        }

        await ReservierungModel.erinnerungAktualisieren(res.id, '3h');
        console.log(`[Erinnerung] 3h gesendet (Reservierung ${res.id}, Email: ${!!res.email}, SMS: ${!!res.telefon})`);
      }
    } catch (err) {
      console.error('[Erinnerung] Fehler:', err);
    }
  });

  // Täglich um 3:00 Uhr: DSGVO-Cleanup
  cron.schedule('0 3 * * *', async () => {
    try {
      await ReservierungModel.dsgvoAufraeumen();
      console.log('[DSGVO] Reservierungen: personenbezogene Daten bereinigt (> 30 Tage)');

      // Gäste-CRM: Profile löschen deren Speicherfrist abgelaufen ist (2 Jahre ohne Aktivität)
      const result = await q<{ id: string }>(
        `DELETE FROM gaeste WHERE loeschen_nach < CURRENT_DATE RETURNING id`
      );
      if (result.length > 0) {
        console.log(`[DSGVO] Gäste-CRM: ${result.length} Profile gelöscht (Speicherfrist abgelaufen)`);
      }
    } catch (err) {
      console.error('[DSGVO] Cleanup-Fehler:', err);
    }
  });

  console.log('[Erinnerung] Cron-Jobs gestartet (alle 15 Min + DSGVO täglich 3:00)');
}
