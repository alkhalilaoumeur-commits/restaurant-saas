import { q, q1 } from './db';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ExtrasGruppe {
  id: string;
  gericht_id: string;
  restaurant_id: string;
  name: string;
  pflicht: boolean;
  max_auswahl: number;
  reihenfolge: number;
  extras?: Extra[];
}

export interface Extra {
  id: string;
  gruppe_id: string;
  restaurant_id: string;
  name: string;
  aufpreis: number;
  verfuegbar: boolean;
  reihenfolge: number;
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const ExtrasModel = {

  // ── Öffentlich (Gäste-Seite) ─────────────────────────────────────────────

  /** Alle Extras-Gruppen + Extras eines Gerichts (nur verfügbare) */
  async nachGericht(gerichtId: string): Promise<ExtrasGruppe[]> {
    const gruppen = await q<ExtrasGruppe>(
      `SELECT * FROM extras_gruppen
       WHERE gericht_id = $1
       ORDER BY reihenfolge, name`,
      [gerichtId]
    );

    if (gruppen.length === 0) return [];

    const extras = await q<Extra>(
      `SELECT * FROM extras
       WHERE gruppe_id = ANY($1) AND verfuegbar = true
       ORDER BY reihenfolge, name`,
      [gruppen.map((g) => g.id)]
    );

    // Extras den Gruppen zuordnen
    const extrasMap = new Map<string, Extra[]>();
    for (const extra of extras) {
      const list = extrasMap.get(extra.gruppe_id) || [];
      list.push(extra);
      extrasMap.set(extra.gruppe_id, list);
    }

    return gruppen
      .map((g) => ({ ...g, extras: extrasMap.get(g.id) || [] }))
      .filter((g) => g.extras.length > 0); // Leere Gruppen ausblenden
  },

  /** Extras für mehrere Gerichte auf einmal laden (für Speisekarte-Übersicht) */
  async nachGerichteIds(gerichtIds: string[]): Promise<Map<string, ExtrasGruppe[]>> {
    if (gerichtIds.length === 0) return new Map();

    const gruppen = await q<ExtrasGruppe>(
      `SELECT * FROM extras_gruppen
       WHERE gericht_id = ANY($1)
       ORDER BY reihenfolge, name`,
      [gerichtIds]
    );

    if (gruppen.length === 0) return new Map();

    const extras = await q<Extra>(
      `SELECT * FROM extras
       WHERE gruppe_id = ANY($1) AND verfuegbar = true
       ORDER BY reihenfolge, name`,
      [gruppen.map((g) => g.id)]
    );

    // Extras → Gruppen
    const extrasMap = new Map<string, Extra[]>();
    for (const extra of extras) {
      const list = extrasMap.get(extra.gruppe_id) || [];
      list.push(extra);
      extrasMap.set(extra.gruppe_id, list);
    }

    // Gruppen → Gerichte
    const result = new Map<string, ExtrasGruppe[]>();
    for (const gruppe of gruppen) {
      const gruppeExtras = extrasMap.get(gruppe.id) || [];
      if (gruppeExtras.length === 0) continue;

      const list = result.get(gruppe.gericht_id) || [];
      list.push({ ...gruppe, extras: gruppeExtras });
      result.set(gruppe.gericht_id, list);
    }

    return result;
  },

  // ── Admin CRUD: Gruppen ──────────────────────────────────────────────────

  /** Alle Gruppen eines Gerichts (inkl. nicht-verfügbare Extras, für Admin) */
  async alleGruppenAdmin(gerichtId: string, restaurantId: string): Promise<ExtrasGruppe[]> {
    const gruppen = await q<ExtrasGruppe>(
      `SELECT * FROM extras_gruppen
       WHERE gericht_id = $1 AND restaurant_id = $2
       ORDER BY reihenfolge, name`,
      [gerichtId, restaurantId]
    );

    if (gruppen.length === 0) return [];

    const extras = await q<Extra>(
      `SELECT * FROM extras
       WHERE gruppe_id = ANY($1)
       ORDER BY reihenfolge, name`,
      [gruppen.map((g) => g.id)]
    );

    const extrasMap = new Map<string, Extra[]>();
    for (const extra of extras) {
      const list = extrasMap.get(extra.gruppe_id) || [];
      list.push(extra);
      extrasMap.set(extra.gruppe_id, list);
    }

    return gruppen.map((g) => ({ ...g, extras: extrasMap.get(g.id) || [] }));
  },

  gruppeErstellen(data: { id: string; gericht_id: string; restaurant_id: string; name: string; pflicht?: boolean; max_auswahl?: number; reihenfolge?: number }) {
    return q1<ExtrasGruppe>(
      `INSERT INTO extras_gruppen (id, gericht_id, restaurant_id, name, pflicht, max_auswahl, reihenfolge)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [data.id, data.gericht_id, data.restaurant_id, data.name, data.pflicht ?? false, data.max_auswahl ?? 1, data.reihenfolge ?? 0]
    );
  },

  gruppeAktualisieren(id: string, restaurantId: string, felder: Partial<ExtrasGruppe>) {
    return q1<ExtrasGruppe>(
      `UPDATE extras_gruppen SET
        name = COALESCE($1, name),
        pflicht = COALESCE($2, pflicht),
        max_auswahl = COALESCE($3, max_auswahl),
        reihenfolge = COALESCE($4, reihenfolge)
       WHERE id = $5 AND restaurant_id = $6 RETURNING *`,
      [felder.name, felder.pflicht, felder.max_auswahl, felder.reihenfolge, id, restaurantId]
    );
  },

  gruppeLoeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM extras_gruppen WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },

  // ── Admin CRUD: Extras ───────────────────────────────────────────────────

  extraErstellen(data: { id: string; gruppe_id: string; restaurant_id: string; name: string; aufpreis?: number; reihenfolge?: number }) {
    return q1<Extra>(
      `INSERT INTO extras (id, gruppe_id, restaurant_id, name, aufpreis, reihenfolge)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [data.id, data.gruppe_id, data.restaurant_id, data.name, data.aufpreis ?? 0, data.reihenfolge ?? 0]
    );
  },

  extraAktualisieren(id: string, restaurantId: string, felder: Partial<Extra>) {
    return q1<Extra>(
      `UPDATE extras SET
        name = COALESCE($1, name),
        aufpreis = COALESCE($2, aufpreis),
        verfuegbar = COALESCE($3, verfuegbar),
        reihenfolge = COALESCE($4, reihenfolge)
       WHERE id = $5 AND restaurant_id = $6 RETURNING *`,
      [felder.name, felder.aufpreis, felder.verfuegbar, felder.reihenfolge, id, restaurantId]
    );
  },

  extraLoeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM extras WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },
};
