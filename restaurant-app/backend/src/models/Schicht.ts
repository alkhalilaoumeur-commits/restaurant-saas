import { q, q1 } from './db';

// ─── ArbZG-Hilfsfunktionen ───────────────────────────────────────────────────

/** "09:30" oder "09:30:00" → Minuten seit Mitternacht (570) */
function zeitZuMin(zeit: string): number {
  const [h, m] = zeit.slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

/** Wie viele Tage liegt datumA nach baseDatum? (-1, 0, +1) */
function tagOffset(datumA: string, baseDatum: string): number {
  const a = new Date(datumA + 'T00:00:00').getTime();
  const b = new Date(baseDatum + 'T00:00:00').getTime();
  return Math.round((a - b) / 86400000);
}

export interface ArbzgPruefung {
  warnungen: string[]; // Gelb — ArbZG-Verstöße, Schicht trotzdem gespeichert
  konflikte: string[]; // Rot — Doppelbuchung, Schicht NICHT gespeichert
}

export interface Schicht {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  mitarbeiter_name?: string;
  mitarbeiter_rolle?: string;
  datum: string;
  beginn: string;
  ende: string;
  notiz: string | null;
  erstellt_am: string;
}

export const SchichtModel = {
  /** Alle Schichten in einem Datumsbereich */
  nachZeitraum(restaurantId: string, start: string, ende: string) {
    return q<Schicht>(`
      SELECT s.*, m.name AS mitarbeiter_name, m.rolle AS mitarbeiter_rolle
      FROM schichten s
      JOIN mitarbeiter m ON s.mitarbeiter_id = m.id
      WHERE s.restaurant_id = $1
        AND s.datum >= $2
        AND s.datum <= $3
      ORDER BY s.datum, s.beginn
    `, [restaurantId, start, ende]);
  },

  erstellen(data: {
    restaurant_id: string;
    mitarbeiter_id: string;
    datum: string;
    beginn: string;
    ende: string;
    notiz?: string;
  }) {
    return q1<Schicht>(`
      INSERT INTO schichten (restaurant_id, mitarbeiter_id, datum, beginn, ende, notiz)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [data.restaurant_id, data.mitarbeiter_id, data.datum, data.beginn, data.ende, data.notiz || null]);
  },

  aktualisieren(id: string, restaurantId: string, felder: {
    mitarbeiter_id?: string;
    datum?: string;
    beginn?: string;
    ende?: string;
    notiz?: string | null;
  }) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.mitarbeiter_id !== undefined) { sets.push(`mitarbeiter_id = $${idx++}`); vals.push(felder.mitarbeiter_id); }
    if (felder.datum !== undefined) { sets.push(`datum = $${idx++}`); vals.push(felder.datum); }
    if (felder.beginn !== undefined) { sets.push(`beginn = $${idx++}`); vals.push(felder.beginn); }
    if (felder.ende !== undefined) { sets.push(`ende = $${idx++}`); vals.push(felder.ende); }
    if (felder.notiz !== undefined) { sets.push(`notiz = $${idx++}`); vals.push(felder.notiz); }
    if (sets.length === 0) return null;
    vals.push(id, restaurantId);
    return q1<Schicht>(
      `UPDATE schichten SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
      vals
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1<Schicht>(
      'DELETE FROM schichten WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [id, restaurantId]
    );
  },

  /** Einzelne Schicht per ID laden (für PATCH-Validierung) */
  nachId(id: string, restaurantId: string) {
    return q1<Schicht>(
      'SELECT * FROM schichten WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  /**
   * ArbZG-Prüfung: Gibt Konflikte (Doppelbuchung) und Warnungen (Ruhezeit, Max-Stunden, Pausen) zurück.
   *
   * Konflikte = harte Fehler → Schicht wird NICHT gespeichert (409).
   * Warnungen = weiche Hinweise → Schicht wird trotzdem gespeichert, Warnung im Response.
   *
   * Geprüft wird:
   * 1. Doppelbuchung — Überschneidung mit anderer Schicht des MA am selben Tag
   * 2. 11h Ruhezeit — Abstand zur vorherigen/nächsten Schicht (§ 5 ArbZG)
   * 3. Max 10h/Tag — Gesamtstunden am selben Tag (§ 3 ArbZG)
   * 4. Pflichtpausen — 30 Min ab 6h, 45 Min ab 9h (§ 4 ArbZG)
   *
   * @param ausschlussId — Bei PATCH: eigene Schicht-ID ausschließen
   */
  async arbzgPruefen(
    restaurantId: string,
    mitarbeiterId: string,
    datum: string,       // "2026-04-09"
    beginn: string,      // "09:00"
    ende: string,        // "17:00"
    ausschlussId?: string
  ): Promise<ArbzgPruefung> {
    const warnungen: string[] = [];
    const konflikte: string[] = [];

    const beginnMin = zeitZuMin(beginn);
    const endeMin = zeitZuMin(ende);
    const schichtDauerMin = endeMin - beginnMin;

    // 3-Tage-Fenster: Vortag + heute + nächster Tag (für Ruhezeit-Prüfung)
    const datumObj = new Date(datum + 'T00:00:00');
    const vorherStr = new Date(datumObj.getTime() - 86400000).toISOString().slice(0, 10);
    const nachherStr = new Date(datumObj.getTime() + 86400000).toISOString().slice(0, 10);

    let queryStr = `
      SELECT datum, beginn, ende FROM schichten
      WHERE restaurant_id = $1 AND mitarbeiter_id = $2
        AND datum BETWEEN $3 AND $4
    `;
    const params: unknown[] = [restaurantId, mitarbeiterId, vorherStr, nachherStr];
    if (ausschlussId) {
      queryStr += ' AND id != $5';
      params.push(ausschlussId);
    }

    const umliegend = await q<{ datum: string; beginn: string; ende: string }>(queryStr, params);

    // Tagesstunden: Neue Schicht bereits einrechnen
    let tagesMinutenGesamt = schichtDauerMin;

    for (const s of umliegend) {
      const sDatum = s.datum.slice(0, 10);
      const sBeginnMin = zeitZuMin(s.beginn);
      const sEndeMin = zeitZuMin(s.ende);
      const offset = tagOffset(sDatum, datum); // -1=gestern, 0=heute, +1=morgen

      if (offset === 0) {
        // ── Gleicher Tag: Doppelbuchung + Tagesstunden ──────────────────────
        tagesMinutenGesamt += sEndeMin - sBeginnMin;

        // Zeitüberschneidung: neue Schicht [beginnMin, endeMin] ∩ [sBeginnMin, sEndeMin]
        if (beginnMin < sEndeMin && endeMin > sBeginnMin) {
          konflikte.push(
            `Doppelbuchung: Überschneidung mit bestehender Schicht ${s.beginn.slice(0, 5)}–${s.ende.slice(0, 5)}`
          );
        }
      } else {
        // ── Anderer Tag: Ruhezeit prüfen ────────────────────────────────────
        // Absolute Minuten relativ zu Mitternacht des neuen Arbeitstages
        const sAbsEnde = offset * 1440 + sEndeMin;
        const sAbsBeginn = offset * 1440 + sBeginnMin;

        // Fall A: Andere Schicht liegt VOR der neuen (sAbsEnde < beginnMin)
        if (sAbsEnde < beginnMin) {
          const ruhezeit = beginnMin - sAbsEnde;
          if (ruhezeit < 660) { // 11h = 660 Min
            const std = Math.floor(ruhezeit / 60);
            const min = ruhezeit % 60;
            warnungen.push(
              `Ruhezeit zu kurz: nur ${std}h${min > 0 ? ` ${min}min` : ''} nach vorheriger Schicht (Minimum 11h, § 5 ArbZG)`
            );
          }
        }

        // Fall B: Andere Schicht liegt NACH der neuen (endeMin < sAbsBeginn)
        if (endeMin < sAbsBeginn) {
          const ruhezeit = sAbsBeginn - endeMin;
          if (ruhezeit < 660) {
            const std = Math.floor(ruhezeit / 60);
            const min = ruhezeit % 60;
            warnungen.push(
              `Ruhezeit zu kurz: nur ${std}h${min > 0 ? ` ${min}min` : ''} bis zur nächsten Schicht (Minimum 11h, § 5 ArbZG)`
            );
          }
        }
      }
    }

    // ── Max 10h/Tag (§ 3 ArbZG) ─────────────────────────────────────────────
    if (tagesMinutenGesamt > 600) {
      const std = Math.floor(tagesMinutenGesamt / 60);
      const min = tagesMinutenGesamt % 60;
      warnungen.push(
        `Tagesmaximum überschritten: ${std}h${min > 0 ? ` ${min}min` : ''} geplant (Maximum 10h/Tag, § 3 ArbZG)`
      );
    }

    // ── Pflichtpausen (§ 4 ArbZG) ────────────────────────────────────────────
    if (schichtDauerMin > 540) {
      warnungen.push('Pflichtpause: 45 Min. bei Schichten über 9h einplanen (§ 4 ArbZG)');
    } else if (schichtDauerMin > 360) {
      warnungen.push('Pflichtpause: 30 Min. bei Schichten über 6h einplanen (§ 4 ArbZG)');
    }

    return { warnungen, konflikte };
  },
};
