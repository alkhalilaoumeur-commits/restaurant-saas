import { q, q1 } from './db';

// --- Typen ---

export interface ZeitSlot {
  zeit: string;        // "18:00"
  verfuegbar: boolean;
  restplaetze: number;
}

interface Oeffnungszeit {
  von: string;  // "11:00:00"
  bis: string;  // "22:00:00"
  geschlossen: boolean;
}

interface ReservierungSlot {
  datum: string;
  personen: number;
  verweilzeit_min: number;
}

interface RestaurantEinstellungen {
  max_gaeste_pro_slot: number | null;
  reservierung_puffer_min: number;
  buchungsintervall_min: number;
  tisch_dauer_min: number;
  max_gleichzeitige_reservierungen: number | null;
}

interface Tisch {
  id: string;
  kapazitaet: number;
}

// --- Hilfsfunktionen ---

/** Verweilzeit in Minuten basierend auf Gruppengröße */
export function verweilzeitBerechnen(personen: number): number {
  if (personen <= 2) return 75;
  if (personen <= 4) return 90;
  if (personen <= 6) return 105;
  return 120;
}

/** "11:00:00" → Minuten seit Mitternacht (660) */
function zeitZuMinuten(zeit: string): number {
  const teile = zeit.split(':');
  return parseInt(teile[0]) * 60 + parseInt(teile[1]);
}

/** Minuten seit Mitternacht (660) → "11:00" */
function minutenZuZeit(minuten: number): string {
  const h = Math.floor(minuten / 60).toString().padStart(2, '0');
  const m = (minuten % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** Wochentag als 0=Montag..6=Sonntag (wie in oeffnungszeiten-Tabelle) */
function wochentagISO(datum: Date): number {
  const tag = datum.getDay(); // 0=Sonntag, 1=Montag, ...
  return tag === 0 ? 6 : tag - 1;
}

// --- Hauptfunktionen ---

export const VerfuegbarkeitModel = {

  /**
   * Berechnet alle verfügbaren 15-Min-Slots für einen Tag.
   *
   * Logik:
   * 1. Öffnungszeiten für den Wochentag holen
   * 2. Alle 15-Min-Slots zwischen "von" und "bis" generieren
   * 3. Bestehende Reservierungen laden
   * 4. Pro Slot: belegte Plätze berechnen (überlappende Reservierungen)
   * 5. Nur Slots zurückgeben wo noch Platz ist
   */
  async verfuegbareSlots(
    restaurantId: string,
    datum: string,        // "2026-04-10"
    personen: number
  ): Promise<ZeitSlot[]> {

    // 0. Ausnahmetag prüfen (Feiertag / manuell geschlossen) → sofort keine Slots
    const ausnahmetag = await q1<{ id: string }>(
      'SELECT id FROM ausnahmetage WHERE restaurant_id = $1 AND datum = $2',
      [restaurantId, datum]
    );
    if (ausnahmetag) return [];

    // 1. Öffnungszeiten für den Wochentag
    const datumObj = new Date(datum + 'T00:00:00');
    const wochentag = wochentagISO(datumObj);

    const oeffnung = await q1<Oeffnungszeit>(
      'SELECT von, bis, geschlossen FROM oeffnungszeiten WHERE restaurant_id = $1 AND wochentag = $2',
      [restaurantId, wochentag]
    );

    // Kein Eintrag oder geschlossen → keine Slots
    if (!oeffnung || oeffnung.geschlossen) return [];

    // Ungültige Zeiten (00:00-00:00 = Platzhalter für geschlossene Tage) → keine Slots
    if (oeffnung.von === '00:00:00' && oeffnung.bis === '00:00:00') return [];

    // 2. Restaurant-Einstellungen laden (inkl. konfigurierbares Buchungsintervall)
    const einstellungen = await q1<RestaurantEinstellungen>(
      `SELECT max_gaeste_pro_slot, reservierung_puffer_min,
              buchungsintervall_min, tisch_dauer_min, max_gleichzeitige_reservierungen
       FROM restaurants WHERE id = $1`,
      [restaurantId]
    );
    if (!einstellungen) return [];

    const intervall = einstellungen.buchungsintervall_min || 15;

    // Max-Kapazität berechnen: Override oder Summe der Tischkapazitäten
    let maxKapazitaet = einstellungen.max_gaeste_pro_slot;
    if (!maxKapazitaet) {
      const result = await q1<{ summe: string }>(
        'SELECT COALESCE(SUM(kapazitaet), 0) as summe FROM tische WHERE restaurant_id = $1 AND kapazitaet IS NOT NULL',
        [restaurantId]
      );
      maxKapazitaet = parseInt(result?.summe || '0');
    }

    // Wenn keine Kapazität definiert → keine Slots
    if (maxKapazitaet <= 0) return [];

    // 3. Slots generieren (Intervall aus Einstellungen statt hartkodiert 15)
    const vonMin = zeitZuMinuten(oeffnung.von);
    const bisMin = zeitZuMinuten(oeffnung.bis);
    // Verweilzeit: konfigurierte Tischdauer überschreibt die gruppenbasierte Berechnung
    const verweilzeit = einstellungen.tisch_dauer_min || verweilzeitBerechnen(personen);

    const slots: ZeitSlot[] = [];

    // 4. Bestehende Reservierungen für den Tag laden (nicht stornierte)
    const reservierungen = await q<ReservierungSlot>(
      `SELECT datum, personen, verweilzeit_min FROM reservierungen
       WHERE restaurant_id = $1 AND DATE(datum) = $2 AND status != 'storniert'`,
      [restaurantId, datum]
    );

    // 5. Jetzt-Zeitpunkt für "keine Slots in der Vergangenheit"
    const jetzt = new Date();
    const heute = jetzt.toISOString().split('T')[0];
    const jetztMinuten = jetzt.getHours() * 60 + jetzt.getMinutes();

    // 6. Jeden Slot (im konfigurierten Abstand) prüfen
    for (let slotMin = vonMin; slotMin < bisMin; slotMin += intervall) {
      // Verweilzeit muss vor Schließung enden
      if (slotMin + verweilzeit > bisMin) continue;

      // Slot liegt in der Vergangenheit (nur wenn heute) → überspringen
      // Mindestens 2 Stunden Vorlauf
      if (datum === heute && slotMin <= jetztMinuten + 120) continue;

      // Belegte Plätze in diesem Slot berechnen
      let belegtePlaetze = 0;
      let belegteSlots = 0;
      for (const res of reservierungen) {
        const resDatum = new Date(res.datum);
        const resStartMin = resDatum.getHours() * 60 + resDatum.getMinutes();
        const resEndeMin = resStartMin + res.verweilzeit_min;

        // Überlappung prüfen
        const slotEnde = slotMin + verweilzeit;
        if (slotMin < resEndeMin && slotEnde > resStartMin) {
          belegtePlaetze += res.personen;
          belegteSlots += 1;
        }
      }

      // Max gleichzeitige Reservierungen prüfen (falls konfiguriert)
      if (einstellungen.max_gleichzeitige_reservierungen !== null &&
          belegteSlots >= einstellungen.max_gleichzeitige_reservierungen) {
        slots.push({ zeit: minutenZuZeit(slotMin), verfuegbar: false, restplaetze: 0 });
        continue;
      }

      const restplaetze = maxKapazitaet - belegtePlaetze;
      slots.push({
        zeit: minutenZuZeit(slotMin),
        verfuegbar: restplaetze >= personen,
        restplaetze: Math.max(0, restplaetze),
      });
    }

    return slots;
  },

  /**
   * Weist den kleinsten freien Tisch zu, der die Gruppengröße fasst.
   * Berücksichtigt sitzplatz_wunsch (innen/terrasse/bar) → bevorzugt passenden Bereich.
   * Wenn kein Einzeltisch reicht → zwei Tische kombinieren (kleinste mögliche Kombi).
   * Gibt null zurück wenn gar kein Tisch passt.
   *
   * Return: { hauptId, kombinierterTischId } — kombinierterTischId ist null wenn Einzeltisch
   */
  async tischZuweisen(
    restaurantId: string,
    datum: string,              // "2026-04-10"
    zeit: string,               // "18:00"
    personen: number,
    verweilzeitMin: number,
    sitzplatzWunsch?: string | null
  ): Promise<{ hauptId: string; kombinierterTischId: string | null } | null> {

    // Restaurant-Pufferzeit laden
    const einstellungen = await q1<{ reservierung_puffer_min: number }>(
      'SELECT reservierung_puffer_min FROM restaurants WHERE id = $1',
      [restaurantId]
    );
    const puffer = einstellungen?.reservierung_puffer_min || 15;

    const slotMin = zeitZuMinuten(zeit);
    const slotEnde = slotMin + verweilzeitMin;

    // Prüft ob ein einzelner Tisch im Zeitfenster frei ist
    const istTischFrei = async (tischId: string): Promise<boolean> => {
      const belegt = await q<ReservierungSlot>(
        `SELECT datum, verweilzeit_min FROM reservierungen
         WHERE tisch_id = $1 AND DATE(datum) = $2 AND status != 'storniert'`,
        [tischId, datum]
      );
      for (const res of belegt) {
        const resDatum = new Date(res.datum);
        const resStartMin = resDatum.getHours() * 60 + resDatum.getMinutes();
        const resEndeMin = resStartMin + res.verweilzeit_min + puffer;
        if (slotMin < resEndeMin && slotEnde + puffer > resStartMin) return false;
      }
      return true;
    };

    // Ersten freien Einzeltisch aus einer Liste finden
    const findeFreienTisch = async (tische: Tisch[]): Promise<string | null> => {
      for (const tisch of tische) {
        if (await istTischFrei(tisch.id)) return tisch.id;
      }
      return null;
    };

    // Zonen-Keyword aus sitzplatz_wunsch ableiten
    const zoneKeywords: Record<string, string> = { innen: 'innen', terrasse: 'terrasse', bar: 'bar' };
    const zoneKeyword = sitzplatzWunsch ? zoneKeywords[sitzplatzWunsch] : null;

    // ── 1. Einzeltisch im bevorzugten Bereich ──────────────────────────────────
    if (zoneKeyword) {
      const zoneTische = await q<Tisch>(
        `SELECT t.id, t.kapazitaet FROM tische t
         LEFT JOIN bereiche b ON b.id = t.bereich_id
         WHERE t.restaurant_id = $1 AND t.kapazitaet IS NOT NULL AND t.kapazitaet >= $2
           AND b.name ILIKE $3
         ORDER BY t.kapazitaet ASC`,
        [restaurantId, personen, `${zoneKeyword}%`]
      );
      const hauptId = await findeFreienTisch(zoneTische);
      if (hauptId) return { hauptId, kombinierterTischId: null };
    }

    // ── 2. Einzeltisch aus allen Tischen (kleinster zuerst) ───────────────────
    const alleTische = await q<Tisch>(
      `SELECT id, kapazitaet FROM tische
       WHERE restaurant_id = $1 AND kapazitaet IS NOT NULL AND kapazitaet > 0
       ORDER BY kapazitaet ASC`,
      [restaurantId]
    );

    const einzelTischId = await findeFreienTisch(
      alleTische.filter(t => t.kapazitaet >= personen)
    );
    if (einzelTischId) return { hauptId: einzelTischId, kombinierterTischId: null };

    // ── 3. Kombination: zwei Tische zusammenlegen ──────────────────────────────
    // Alle Tisch-Paare prüfen; kleinstes Gesamtgewicht (kapazitaet1+kapazitaet2) first
    const kombinationKandidaten: Array<{ t1: Tisch; t2: Tisch; gesamt: number }> = [];
    for (let i = 0; i < alleTische.length; i++) {
      for (let j = i + 1; j < alleTische.length; j++) {
        const gesamt = alleTische[i].kapazitaet + alleTische[j].kapazitaet;
        if (gesamt >= personen) {
          kombinationKandidaten.push({ t1: alleTische[i], t2: alleTische[j], gesamt });
        }
      }
    }
    // Kleinste Kombination zuerst (minimaler Platzverschwendung)
    kombinationKandidaten.sort((a, b) => a.gesamt - b.gesamt);

    for (const { t1, t2 } of kombinationKandidaten) {
      const beideKandidaten = await Promise.all([istTischFrei(t1.id), istTischFrei(t2.id)]);
      if (beideKandidaten[0] && beideKandidaten[1]) {
        return { hauptId: t1.id, kombinierterTischId: t2.id };
      }
    }

    return null;
  },
};
