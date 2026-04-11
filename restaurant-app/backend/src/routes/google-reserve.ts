/**
 * Google Reserve Webhook — Option B Infrastruktur
 *
 * AKTUELLER STAND (April 2026):
 *   Dieser Endpunkt ist noch NICHT aktiv angebunden. Er definiert die
 *   Datenstruktur, die Google Reserve bei einem echten Partnervertrag
 *   per Webhook schicken würde.
 *
 * WAS NOCH FEHLT FÜR ECHTE GOOGLE RESERVE INTEGRATION:
 *   1. Partnervertrag mit Google abschließen (maps.google.com/business/partners)
 *   2. Google Reserve API-Credentials (Client-ID + Secret) in .env hinterlegen:
 *      GOOGLE_RESERVE_WEBHOOK_SECRET=...
 *   3. HMAC-Signatur-Prüfung aktivieren (Kommentar unten)
 *   4. Rückkanal: Verfügbarkeits-Feed (Merchant Center Feed) bei Google hinterlegen
 *      Dokumentation: https://developers.google.com/maps/documentation/business/manage-place-information
 *
 * BUCHUNGSFLOW DANN:
 *   Gast sucht Restaurant auf Google Maps
 *   → klickt "Reservieren" (erscheint automatisch weil wir Partner sind)
 *   → Google sendet POST an /api/google-reserve/webhook
 *   → Wir legen Reservierung mit quelle='google' an
 *   → Wir antworten mit Bestätigung
 *   → Google zeigt dem Gast die Bestätigung in Maps
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ReservierungModel } from '../models/Reservierung';
import { VerfuegbarkeitModel, verweilzeitBerechnen } from '../models/Verfuegbarkeit';
import { GastModel } from '../models/Gast';
import { q } from '../models/db';
import {
  reservierungBestaetigungSenden,
} from '../services/email';
import { io } from '../server';

const router = Router();

// ─── Typen (Google Reserve API Format) ───────────────────────────────────────
//
// Hinweis: Diese Typen basieren auf der öffentlichen Google Reserve API-Dokumentation.
// Das genaue Format kann sich bei Vertragsabschluss ändern.

interface GoogleReserveBooking {
  /** Eindeutige Buchungs-ID von Google */
  booking_id: string;
  /** Restaurant-ID in Google Merchant Center */
  merchant_id: string;
  /** Service-ID (z.B. "dinner", "brunch") */
  service_id: string;
  /** Startzeit als RFC3339-String, z.B. "2026-04-15T18:00:00+02:00" */
  start_time: string;
  /** Dauer in Sekunden */
  duration: number;
  /** Anzahl Personen */
  party_size: number;
  user_information: {
    user_id: string;
    given_name: string;
    family_name: string;
    address: {
      country: string;
    };
    telephone?: string;
    email?: string;
  };
}

interface GoogleReserveWebhookPayload {
  /** Typ des Events: "new_booking" | "update_booking" | "cancel_booking" */
  type: 'new_booking' | 'update_booking' | 'cancel_booking';
  booking: GoogleReserveBooking;
}

// ─── Hilfsfunktion: Merchant-ID → Restaurant-ID ───────────────────────────────
//
// TODO (wenn echter Partnervertrag aktiv):
// Die `google_merchant_id` Spalte auf der `restaurants`-Tabelle anlegen:
//   ALTER TABLE restaurants ADD COLUMN google_merchant_id TEXT;
// Dann Restaurantbesitzer in den Einstellungen ihre Merchant-ID eintragen lassen.

async function restaurantIdVonMerchantId(merchantId: string): Promise<string | null> {
  // TODO: Aktivieren sobald Spalte existiert:
  // const rows = await q<{ id: string }>(
  //   'SELECT id FROM restaurants WHERE google_merchant_id = $1',
  //   [merchantId]
  // );
  // return rows[0]?.id ?? null;

  // Platzhalter solange nicht aktiv:
  void merchantId;
  return null;
}

// ─── POST /api/google-reserve/webhook ────────────────────────────────────────
// Empfängt Buchungen von Google Reserve
router.post('/webhook', asyncHandler(async (req: Request, res: Response) => {

  // TODO (Schritt 1 bei Aktivierung): HMAC-Signatur von Google prüfen
  // const signature = req.headers['x-google-signature'] as string;
  // const secret = process.env.GOOGLE_RESERVE_WEBHOOK_SECRET;
  // if (!secret || !pruefeGoogleSignatur(req.rawBody, signature, secret)) {
  //   res.status(401).json({ fehler: 'Ungültige Signatur' });
  //   return;
  // }

  const payload = req.body as GoogleReserveWebhookPayload;

  if (!payload?.type || !payload?.booking) {
    res.status(400).json({ fehler: 'Ungültiges Payload-Format' });
    return;
  }

  const { type, booking } = payload;

  // Restaurant-ID via Merchant-ID nachschlagen
  const restaurantId = await restaurantIdVonMerchantId(booking.merchant_id);
  if (!restaurantId) {
    console.error(`[Google Reserve] Unbekannte Merchant-ID: ${booking.merchant_id}`);
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  if (type === 'new_booking') {
    const gast_name = `${booking.user_information.given_name} ${booking.user_information.family_name}`.trim();
    const email = booking.user_information.email;
    const telefon = booking.user_information.telephone ?? null;
    const datum = booking.start_time;
    const personenZahl = booking.party_size;
    const verweilzeit = verweilzeitBerechnen(personenZahl);

    if (!email) {
      // Google Reserve liefert manchmal keine Email — Reservierung trotzdem anlegen
      console.warn(`[Google Reserve] Buchung ohne Email: ${booking.booking_id}`);
    }

    const restaurant = await q<{ name: string; strasse: string | null; plz: string | null; stadt: string | null }>(
      'SELECT name, strasse, plz, stadt FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    const datumObj = new Date(datum);
    const datumStr = datumObj.toISOString().split('T')[0];
    const zeitStr = datumObj.getHours().toString().padStart(2, '0') + ':' +
                    datumObj.getMinutes().toString().padStart(2, '0');

    // Tisch automatisch zuweisen
    const zuweisung = await VerfuegbarkeitModel.tischZuweisen(
      restaurantId, datumStr, zeitStr, personenZahl, verweilzeit, null
    );

    const reservierung = await ReservierungModel.erstellenMitToken({
      restaurant_id: restaurantId,
      tisch_id: zuweisung?.hauptId ?? null,
      gast_name,
      email: email?.toLowerCase() ?? `google-${booking.booking_id}@placeholder.local`,
      telefon,
      datum,
      personen: personenZahl,
      anmerkung: `Google Reserve Buchungs-ID: ${booking.booking_id}`,
      anlass: null,
      sitzplatz_wunsch: null,
      verweilzeit_min: verweilzeit,
      dsgvo_einwilligung: true,  // Google hat DSGVO-Einwilligung auf ihrer Seite eingeholt
      quelle: 'google',
    });

    // Auto-Linking ins Gäste-CRM (fire-and-forget)
    if (reservierung && email) {
      GastModel.smartUpsert({ restaurant_id: restaurantId, name: gast_name, email, telefon })
        .then(async (gastId) => {
          await q('UPDATE reservierungen SET gast_id = $1 WHERE id = $2', [gastId, reservierung.id]);
          GastModel.stammgastAktualisieren(gastId).catch(console.error);
        })
        .catch((err) => console.error('[Gäste-CRM] Google-Reserve Auto-Link Fehler:', err));
    }

    // Bestätigungs-Email senden (fire-and-forget)
    if (reservierung && email && restaurant[0]) {
      const r = restaurant[0];
      const adresse = [r.strasse, [r.plz, r.stadt].filter(Boolean).join(' ')].filter(Boolean).join(', ');
      reservierungBestaetigungSenden(
        email.toLowerCase(), gast_name, r.name, datum, personenZahl,
        reservierung.buchungs_token!, adresse
      ).catch((err) => console.error('[Google Reserve] Email-Fehler:', err));
    }

    // Live-Update an Admin-Dashboard
    io.to(`restaurant:${restaurantId}`).emit('neue_reservierung', {
      id: reservierung?.id,
      gast_name,
      datum,
      personen: personenZahl,
      quelle: 'google',
    });

    // Google erwartet eine Antwort mit der Buchungs-Bestätigung
    res.status(201).json({
      booking_id: booking.booking_id,
      status: 'confirmed',
      confirmation_code: reservierung?.buchungs_token,
    });
    return;
  }

  if (type === 'cancel_booking') {
    // TODO: Per Google-Booking-ID die Reservierung stornieren
    // Dafür brauchen wir eine Spalte `google_booking_id` auf `reservierungen`:
    //   ALTER TABLE reservierungen ADD COLUMN google_booking_id TEXT;
    // Dann:
    //   await q(
    //     "UPDATE reservierungen SET status='storniert' WHERE google_booking_id=$1 AND restaurant_id=$2",
    //     [booking.booking_id, restaurantId]
    //   );
    console.log(`[Google Reserve] Stornierung empfangen: ${booking.booking_id} — TODO: implementieren`);
    res.json({ booking_id: booking.booking_id, status: 'cancelled' });
    return;
  }

  // update_booking: für spätere Implementierung
  res.json({ booking_id: booking.booking_id, status: 'received' });
}));

// ─── GET /api/google-reserve/availability ────────────────────────────────────
// TODO (Option B): Verfügbarkeits-Feed für Google — wird von Google regelmäßig abgefragt
// Format: https://developers.google.com/maps/documentation/business/availability-feed
//
// router.get('/availability/:restaurantId', asyncHandler(async (req, res) => {
//   ...
// }));

export default router;
