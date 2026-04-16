import { q } from '../models/db';

/**
 * No-Show-Automatik:
 * Reservierungen die mehr als 30 Minuten überschritten haben
 * und noch als 'ausstehend' oder 'bestaetigt' gespeichert sind
 * → automatisch auf 'no_show' setzen.
 *
 * Läuft alle 15 Minuten (gestartet aus server.ts).
 */
export async function noShowSetzen(): Promise<void> {
  try {
    const result = await q<{ id: string }>(
      `UPDATE reservierungen
       SET status = 'no_show'
       WHERE status IN ('ausstehend', 'bestaetigt')
         AND datum < NOW() - INTERVAL '30 minutes'
       RETURNING id`,
      []
    );
    if (result.length > 0) {
      console.log(`[No-Show] ${result.length} Reservierung(en) als no_show markiert.`);
    }
  } catch (err) {
    console.error('[No-Show] Fehler beim automatischen Setzen:', err);
  }
}

export function starteNoShowCron(): void {
  // Sofort beim Start einmal ausführen
  noShowSetzen();
  // Dann alle 15 Minuten
  setInterval(noShowSetzen, 15 * 60 * 1000);
  console.log('[No-Show] Cronjob gestartet (alle 15 Minuten).');
}
