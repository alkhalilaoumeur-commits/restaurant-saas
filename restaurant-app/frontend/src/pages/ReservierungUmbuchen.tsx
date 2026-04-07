import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { BuchungSelfService, ZeitSlot, BuchungInfo } from '../types';

const API = '';

/** Wochentag ISO: 0=Montag, 6=Sonntag */
function wochentagISO(d: Date): number {
  const tag = d.getDay();
  return tag === 0 ? 6 : tag - 1;
}

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function datumStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function datumFormatiert(datum: string): string {
  const d = new Date(datum);
  const tag = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const zeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${tag} um ${zeit} Uhr`;
}

export default function ReservierungUmbuchen() {
  const { token } = useParams<{ token: string }>();
  const [reservierung, setReservierung] = useState<BuchungSelfService | null>(null);
  const [info, setInfo] = useState<BuchungInfo | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const [umgebucht, setUmgebucht] = useState(false);
  const [sendet, setSendet] = useState(false);

  // Step 1: Datum, Step 2: Slot
  const [schritt, setSchritt] = useState<1 | 2>(1);
  const [datum, setDatum] = useState<string | null>(null);
  const [slots, setSlots] = useState<ZeitSlot[]>([]);
  const [slotsLaden, setSlotsLaden] = useState(false);
  const [neuesDatum, setNeuesDatum] = useState<string | null>(null);

  // Reservierung + Restaurant-Info laden
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/buchung/token/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fehler) { setFehler(data.fehler); return; }
        setReservierung(data);
        // Restaurant-Info laden für Öffnungszeiten
        return fetch(`${API}/api/buchung/${data.restaurant_id}/info`);
      })
      .then((r) => r?.json())
      .then((data) => { if (data && !data.fehler) setInfo(data); })
      .catch(() => setFehler('Reservierung konnte nicht geladen werden'))
      .finally(() => setLaden(false));
  }, [token]);

  // Slots laden
  const slotsLaden_ = useCallback(async () => {
    if (!datum || !reservierung) return;
    setSlotsLaden(true);
    try {
      const res = await fetch(`${API}/api/buchung/${reservierung.restaurant_id}/slots?datum=${datum}&personen=${reservierung.personen}`);
      const data = await res.json();
      setSlots(data.fehler ? [] : data);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLaden(false);
    }
  }, [datum, reservierung]);

  const umbuchen = async (zeit: string) => {
    if (!token || !datum) return;
    setSendet(true);
    setFehler(null);
    const buchungsDatum = `${datum}T${zeit}:00`;
    try {
      const res = await fetch(`${API}/api/buchung/token/${token}/umbuchen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datum: buchungsDatum }),
      });
      const data = await res.json();
      if (data.fehler) { setFehler(data.fehler); setSendet(false); return; }
      setNeuesDatum(buchungsDatum);
      setUmgebucht(true);
    } catch {
      setFehler('Umbuchung fehlgeschlagen');
    } finally {
      setSendet(false);
    }
  };

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      </div>
    );
  }

  if ((fehler && !reservierung) || !reservierung) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center max-w-md">
          <p className="text-gray-600">{fehler || 'Reservierung nicht gefunden'}</p>
        </div>
      </div>
    );
  }

  if (reservierung.status === 'storniert') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center max-w-md">
          <p className="text-gray-600">Diese Reservierung wurde bereits storniert und kann nicht mehr geändert werden.</p>
        </div>
      </div>
    );
  }

  // Erfolgsanzeige
  if (umgebucht && neuesDatum) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold">Reservierung geändert!</h2>
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <p className="font-semibold">{reservierung.restaurant_name}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">📅 {datumFormatiert(neuesDatum)}</p>
              <p className="text-sm">👥 {reservierung.personen} {reservierung.personen === 1 ? 'Person' : 'Personen'}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Eine Bestätigung wurde per E-Mail gesendet.</p>
        </div>
      </div>
    );
  }

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const vorlaufTage = info?.vorlauf_tage || 30;
  const maxDatum = new Date(heute);
  maxDatum.setDate(maxDatum.getDate() + vorlaufTage);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4 pt-8">
        {/* Aktuelle Reservierung */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-bold mb-3">Reservierung ändern</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold">{reservierung.restaurant_name}</p>
            <p className="text-sm text-gray-500 mt-1">Aktuelle Buchung:</p>
            <p className="text-sm mt-1">📅 {datumFormatiert(reservierung.datum)}</p>
            <p className="text-sm">👥 {reservierung.personen} {reservierung.personen === 1 ? 'Person' : 'Personen'}</p>
          </div>
        </div>

        {fehler && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{fehler}</div>
        )}

        {/* Schritt 1: Neues Datum wählen */}
        {schritt === 1 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4">Neues Datum wählen</h3>
            {/* Mini-Kalender: Nächste 14 Tage als schnelle Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: Math.min(vorlaufTage, 21) }).map((_, i) => {
                const d = new Date(heute);
                d.setDate(d.getDate() + i);
                const ds = datumStr(d);
                const wt = wochentagISO(d);
                const oz = info?.oeffnungszeiten.find((o) => o.wochentag === wt);
                const offen = !!oz && !oz.geschlossen;
                const aktiv = ds === datum;

                return (
                  <button
                    key={ds}
                    onClick={() => offen && setDatum(ds)}
                    disabled={!offen}
                    className={`
                      py-3 px-2 rounded-xl text-sm font-medium transition-all
                      ${aktiv ? 'bg-blue-500 text-white' : ''}
                      ${offen && !aktiv ? 'bg-gray-50 hover:bg-gray-100' : ''}
                      ${!offen ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="block text-xs">{WOCHENTAGE[wt]}</span>
                    <span className="block">{d.getDate()}.{d.getMonth() + 1}.</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { slotsLaden_(); setSchritt(2); }}
              disabled={!datum}
              className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              Weiter
            </button>
          </div>
        )}

        {/* Schritt 2: Neue Uhrzeit wählen */}
        {schritt === 2 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Neue Uhrzeit wählen</h3>
              <button onClick={() => setSchritt(1)} className="text-sm text-blue-500 hover:underline">
                Datum ändern
              </button>
            </div>

            {slotsLaden ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <svg className="animate-spin w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Wird geprüft...
              </div>
            ) : slots.filter((s) => s.verfuegbar).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Keine verfügbaren Uhrzeiten an diesem Tag.</p>
                <button onClick={() => setSchritt(1)} className="mt-2 text-blue-500 text-sm hover:underline">
                  Anderes Datum wählen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.filter((s) => s.verfuegbar).map((slot) => (
                  <button
                    key={slot.zeit}
                    onClick={() => umbuchen(slot.zeit)}
                    disabled={sendet}
                    className="py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 disabled:opacity-50"
                  >
                    {slot.zeit}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
