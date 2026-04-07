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

    // 1. Öffnungszeiten für den Wochentag
    const datumObj = new Date(datum + 'T00:00:00');
    const wochentag = wochentagISO(datumObj);

    const oeffnung = await q1<Oeffnungszeit>(
      'SELECT von, bis, geschlossen FROM oeffnungszeiten WHERE restaurant_id = $1 AND wochentag = $2',
      [restaurantId, wochentag]
    );

    // Kein Eintrag oder geschlossen → keine Slots
    if (!oeffnung || oeffnung.geschlossen) return [];

    // 2. Restaurant-Einstellungen laden
    const einstellungen = await q1<RestaurantEinstellungen>(
      'SELECT max_gaeste_pro_slot, reservierung_puffer_min FROM restaurants WHERE id = $1',
      [restaurantId]
    );
    if (!einstellungen) return [];

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

    // 3. Alle 15-Min-Slots generieren
    const vonMin = zeitZuMinuten(oeffnung.von);
    const bisMin = zeitZuMinuten(oeffnung.bis);
    const verweilzeit = verweilzeitBerechnen(personen);

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

    // 6. Jeden 15-Min-Slot prüfen
    for (let slotMin = vonMin; slotMin < bisMin; slotMin += 15) {
      // Verweilzeit muss vor Schließung enden
      if (slotMin + verweilzeit > bisMin) continue;

      // Slot liegt in der Vergangenheit (nur wenn heute) → überspringen
      // Mindestens 2 Stunden Vorlauf
      if (datum === heute && slotMin <= jetztMinuten + 120) continue;

      // Belegte Plätze in diesem Slot berechnen
      let belegtePlaetze = 0;
      for (const res of reservierungen) {
        const resDatum = new Date(res.datum);
        const resStartMin = resDatum.getHours() * 60 + resDatum.getMinutes();
        const resEndeMin = resStartMin + res.verweilzeit_min;

        // Überlappung prüfen: Slot-Zeitfenster [slotMin, slotMin+verweilzeit]
        // überlappt mit Reservierung [resStartMin, resEndeMin]?
        const slotEnde = slotMin + verweilzeit;
        if (slotMin < resEndeMin && slotEnde > resStartMin) {
          belegtePlaetze += res.personen;
        }
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
   * Gibt null zurück wenn kein Tisch passt (Reservierung wird trotzdem akzeptiert).
   */
  async tischZuweisen(
    restaurantId: string,
    datum: string,         // "2026-04-10"
    zeit: string,          // "18:00"
    personen: number,
    verweilzeitMin: number
  ): Promise<string | null> {

    // Alle Tische mit ausreichender Kapazität, sortiert nach Kapazität (kleinster zuerst)
    const tische = await q<Tisch>(
      `SELECT id, kapazitaet FROM tische
       WHERE restaurant_id = $1 AND kapazitaet IS NOT NULL AND kapazitaet >= $2
       ORDER BY kapazitaet ASC`,
      [restaurantId, personen]
    );

    if (tische.length === 0) return null;

    // Restaurant-Pufferzeit laden
    const einstellungen = await q1<{ reservierung_puffer_min: number }>(
      'SELECT reservierung_puffer_min FROM restaurants WHERE id = $1',
      [restaurantId]
    );
    const puffer = einstellungen?.reservierung_puffer_min || 15;

    // Zeitfenster dieses Slots berechnen
    const slotMin = zeitZuMinuten(zeit);
    const slotEnde = slotMin + verweilzeitMin;

    // Für jeden Tisch prüfen ob er frei ist
    for (const tisch of tische) {
      // Bestehende Reservierungen für diesen Tisch am selben Tag
      const belegt = await q<ReservierungSlot>(
        `SELECT datum, verweilzeit_min FROM reservierungen
         WHERE tisch_id = $1 AND DATE(datum) = $2 AND status != 'storniert'`,
        [tisch.id, datum]
      );

      let istFrei = true;
      for (const res of belegt) {
        const resDatum = new Date(res.datum);
        const resStartMin = resDatum.getHours() * 60 + resDatum.getMinutes();
        const resEndeMin = resStartMin + res.verweilzeit_min + puffer;

        // Überlappung mit Puffer prüfen
        if (slotMin < resEndeMin && slotEnde + puffer > resStartMin) {
          istFrei = false;
          break;
        }
      }

      if (istFrei) return tisch.id;
    }

    return null; // Kein Tisch frei, Reservierung ohne Tischzuweisung
  },
};
