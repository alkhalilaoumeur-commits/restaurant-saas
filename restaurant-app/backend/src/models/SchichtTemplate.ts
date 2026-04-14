import { q, q1 } from './db';

export interface SchichtTemplateEintrag {
  id: string;
  template_id: string;
  mitarbeiter_id: string;
  mitarbeiter_name?: string;
  wochentag: number; // 0=Mo … 6=So
  beginn: string;    // "09:00"
  ende: string;      // "17:00"
  notiz: string | null;
}

export interface SchichtTemplate {
  id: string;
  restaurant_id: string;
  name: string;
  erstellt_am: string;
  eintraege: SchichtTemplateEintrag[];
}

export const SchichtTemplateModel = {

  /** Alle Templates des Restaurants laden — inkl. Einträgen + Mitarbeiternamen */
  alle(restaurantId: string) {
    return q<SchichtTemplate>(`
      SELECT t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id',             e.id,
              'template_id',    e.template_id,
              'mitarbeiter_id', e.mitarbeiter_id,
              'mitarbeiter_name', m.name,
              'wochentag',      e.wochentag,
              'beginn',         TO_CHAR(e.beginn, 'HH24:MI'),
              'ende',           TO_CHAR(e.ende,   'HH24:MI'),
              'notiz',          e.notiz
            ) ORDER BY e.wochentag, e.beginn
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'
        ) AS eintraege
      FROM schicht_templates t
      LEFT JOIN schicht_template_eintraege e ON e.template_id = t.id
      LEFT JOIN mitarbeiter m ON m.id = e.mitarbeiter_id
      WHERE t.restaurant_id = $1
      GROUP BY t.id
      ORDER BY t.erstellt_am DESC
    `, [restaurantId]);
  },

  /**
   * Template erstellen + Einträge in einem Rutsch speichern.
   * Einträge kommen entweder aus der aktuellen Woche (gespeichert per "Diese Woche als Vorlage")
   * oder können leer sein.
   *
   * wochentag: 0=Montag … 6=Sonntag
   */
  async erstellenMitEintraegen(
    restaurantId: string,
    name: string,
    eintraege: Array<{
      mitarbeiter_id: string;
      wochentag: number;
      beginn: string;
      ende: string;
      notiz?: string | null;
    }>
  ): Promise<SchichtTemplate> {
    const template = await q1<SchichtTemplate>(
      'INSERT INTO schicht_templates (restaurant_id, name) VALUES ($1, $2) RETURNING *',
      [restaurantId, name]
    );
    if (!template) throw new Error('Template konnte nicht erstellt werden');

    for (const e of eintraege) {
      await q(
        `INSERT INTO schicht_template_eintraege
           (template_id, mitarbeiter_id, wochentag, beginn, ende, notiz)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [template.id, e.mitarbeiter_id, e.wochentag, e.beginn, e.ende, e.notiz ?? null]
      );
    }

    // Mit Einträgen zurückgeben
    const voll = await SchichtTemplateModel.alle(restaurantId);
    return voll.find(t => t.id === template.id) ?? { ...template, eintraege: [] };
  },

  /**
   * Template auf eine konkrete Woche anwenden.
   * Montag der Zielwoche als Ausgangspunkt, dann + wochentag Tage.
   *
   * Überspringt Einträge wenn:
   * - Mitarbeiter nicht mehr aktiv
   * - Eine Schicht am gleichen Tag + gleicher Beginnzeit schon existiert (Duplikat-Schutz)
   *
   * @returns { erstellt, uebersprungen }
   */
  async anwenden(
    restaurantId: string,
    templateId: string,
    montagDatum: string  // "2026-04-14" — Montag der Zielwoche
  ): Promise<{ erstellt: number; uebersprungen: number }> {
    // Sicherheitscheck: Template gehört zum Restaurant
    const template = await q1<{ id: string }>(
      'SELECT id FROM schicht_templates WHERE id = $1 AND restaurant_id = $2',
      [templateId, restaurantId]
    );
    if (!template) throw new Error('Vorlage nicht gefunden');

    const eintraege = await q<SchichtTemplateEintrag & { mitarbeiter_aktiv: boolean }>(
      `SELECT e.*, TO_CHAR(e.beginn, 'HH24:MI') AS beginn, TO_CHAR(e.ende, 'HH24:MI') AS ende,
              m.aktiv AS mitarbeiter_aktiv
       FROM schicht_template_eintraege e
       JOIN mitarbeiter m ON m.id = e.mitarbeiter_id
       WHERE e.template_id = $1
         AND m.restaurant_id = $2`,
      [templateId, restaurantId]
    );

    const montag = new Date(montagDatum + 'T00:00:00');
    let erstellt = 0;
    let uebersprungen = 0;

    for (const e of eintraege) {
      // Deaktivierte Mitarbeiter überspringen
      if (!e.mitarbeiter_aktiv) { uebersprungen++; continue; }

      const tagDatum = new Date(montag);
      tagDatum.setDate(montag.getDate() + e.wochentag);
      const datumStr = tagDatum.toISOString().slice(0, 10);

      // Duplikat-Schutz: gleiche MA + Datum + Beginnzeit
      const existiert = await q(
        `SELECT id FROM schichten
         WHERE restaurant_id = $1 AND mitarbeiter_id = $2 AND datum = $3
           AND TO_CHAR(beginn, 'HH24:MI') = $4`,
        [restaurantId, e.mitarbeiter_id, datumStr, e.beginn]
      );
      if (existiert.length > 0) { uebersprungen++; continue; }

      await q(
        `INSERT INTO schichten (restaurant_id, mitarbeiter_id, datum, beginn, ende, notiz)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [restaurantId, e.mitarbeiter_id, datumStr, e.beginn, e.ende, e.notiz ?? null]
      );
      erstellt++;
    }

    return { erstellt, uebersprungen };
  },

  /** Template löschen (Einträge werden via ON DELETE CASCADE mitgelöscht) */
  loeschen(restaurantId: string, templateId: string) {
    return q1<{ id: string }>(
      'DELETE FROM schicht_templates WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [templateId, restaurantId]
    );
  },
};
