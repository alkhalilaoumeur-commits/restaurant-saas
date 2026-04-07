import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { BuchungInfo, ZeitSlot, Oeffnungszeit } from '../types';

const API = '';

// ─── Hilfsfunktionen ──────────────────────────────────────────────

/** Wochentag ISO: 0=Montag, 6=Sonntag (wie in DB) */
function wochentagISO(d: Date): number {
  const tag = d.getDay();
  return tag === 0 ? 6 : tag - 1;
}

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONAT_NAMEN = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function datumStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function datumFormatiert(datum: string): string {
  const d = new Date(datum);
  const tag = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const zeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${tag} um ${zeit} Uhr`;
}

// ─── Kalender-Komponente ──────────────────────────────────────────

function Kalender({
  ausgewaehlt,
  onAuswahl,
  oeffnungszeiten,
  vorlaufTage,
}: {
  ausgewaehlt: string | null;
  onAuswahl: (datum: string) => void;
  oeffnungszeiten: Oeffnungszeit[];
  vorlaufTage: number;
}) {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const [monat, setMonat] = useState(heute.getMonth());
  const [jahr, setJahr] = useState(heute.getFullYear());

  const maxDatum = new Date(heute);
  maxDatum.setDate(maxDatum.getDate() + vorlaufTage);

  // Erster Tag des Monats + Offset für den Wochentag
  const ersterTag = new Date(jahr, monat, 1);
  const startOffset = wochentagISO(ersterTag); // 0=Mo
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  // Ist ein Tag buchbar?
  const istBuchbar = (tag: number): boolean => {
    const d = new Date(jahr, monat, tag);
    if (d < heute) return false;
    if (d > maxDatum) return false;
    const wt = wochentagISO(d);
    const oz = oeffnungszeiten.find((o) => o.wochentag === wt);
    return !!oz && !oz.geschlossen;
  };

  const monatZurueck = () => {
    if (monat === 0) { setMonat(11); setJahr(jahr - 1); }
    else setMonat(monat - 1);
  };
  const monatVor = () => {
    if (monat === 11) { setMonat(0); setJahr(jahr + 1); }
    else setMonat(monat + 1);
  };

  // Nicht weiter zurück als aktueller Monat
  const kannZurueck = monat !== heute.getMonth() || jahr !== heute.getFullYear();
  const kannVor = new Date(jahr, monat + 1, 1) <= maxDatum;

  return (
    <div>
      {/* Monat-Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={monatZurueck}
          disabled={!kannZurueck}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-semibold text-lg">{MONAT_NAMEN[monat]} {jahr}</span>
        <button
          onClick={monatVor}
          disabled={!kannVor}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Wochentag-Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WOCHENTAGE.map((t) => (
          <div key={t} className="text-center text-xs font-medium text-gray-400 py-1">{t}</div>
        ))}
      </div>

      {/* Tage-Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leere Zellen vor dem 1. */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`leer-${i}`} />
        ))}
        {Array.from({ length: tageImMonat }).map((_, i) => {
          const tag = i + 1;
          const d = datumStr(new Date(jahr, monat, tag));
          const buchbar = istBuchbar(tag);
          const aktiv = d === ausgewaehlt;
          const istHeute = d === datumStr(heute);

          return (
            <button
              key={tag}
              onClick={() => buchbar && onAuswahl(d)}
              disabled={!buchbar}
              className={`
                relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${aktiv ? 'text-white shadow-md' : ''}
                ${buchbar && !aktiv ? 'hover:bg-gray-100 cursor-pointer' : ''}
                ${!buchbar ? 'text-gray-300 cursor-not-allowed' : ''}
              `}
              style={aktiv ? { backgroundColor: 'var(--buchung-farbe, #3B82F6)' } : undefined}
            >
              {tag}
              {istHeute && !aktiv && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Personen-Auswahl ─────────────────────────────────────────────

function PersonenAuswahl({ wert, onChange }: { wert: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">Anzahl Personen</label>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`
              w-12 h-12 rounded-xl font-semibold text-sm transition-all
              ${wert === n ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
            style={wert === n ? { backgroundColor: 'var(--buchung-farbe, #3B82F6)' } : undefined}
          >
            {n}
          </button>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={9}
            max={20}
            placeholder="9+"
            value={wert > 8 ? wert : ''}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= 20) onChange(v);
            }}
            className="w-16 h-12 rounded-xl border text-center text-sm font-semibold focus:ring-2 focus:outline-none"
            style={{ borderColor: wert > 8 ? 'var(--buchung-farbe, #3B82F6)' : undefined }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Slot-Grid ────────────────────────────────────────────────────

function SlotGrid({
  slots,
  laden,
  onAuswahl,
}: {
  slots: ZeitSlot[];
  laden: boolean;
  onAuswahl: (zeit: string) => void;
}) {
  if (laden) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <svg className="animate-spin w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        Verfügbarkeit wird geprüft...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">Keine verfügbaren Uhrzeiten</p>
        <p className="text-sm">Bitte wählen Sie ein anderes Datum oder eine kleinere Gruppengröße.</p>
      </div>
    );
  }

  const verfuegbare = slots.filter((s) => s.verfuegbar);
  const belegt = slots.filter((s) => !s.verfuegbar);

  return (
    <div>
      {verfuegbare.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{verfuegbare.length} Uhrzeiten verfügbar</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {verfuegbare.map((slot) => (
              <button
                key={slot.zeit}
                onClick={() => onAuswahl(slot.zeit)}
                className="py-3 px-2 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: 'var(--buchung-farbe, #3B82F6)' }}
              >
                {slot.zeit}
              </button>
            ))}
          </div>
        </div>
      )}
      {belegt.length > 0 && (
        <div className={verfuegbare.length > 0 ? 'mt-4' : ''}>
          {verfuegbare.length > 0 && <p className="text-xs text-gray-400 mb-2">Bereits belegt</p>}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {belegt.map((slot) => (
              <div
                key={slot.zeit}
                className="py-3 px-2 rounded-xl bg-gray-100 text-gray-400 text-sm text-center line-through"
              >
                {slot.zeit}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hauptseite ───────────────────────────────────────────────────

export default function Buchen() {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  // State
  const [info, setInfo] = useState<BuchungInfo | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [schritt, setSchritt] = useState(1); // 1=Datum, 2=Slot, 3=Kontakt, 4=Bestätigt

  // Schritt 1
  const [datum, setDatum] = useState<string | null>(null);
  const [personen, setPersonen] = useState(2);

  // Schritt 2
  const [slots, setSlots] = useState<ZeitSlot[]>([]);
  const [slotsLaden, setSlotsLaden] = useState(false);
  const [gewaehlteZeit, setGewaehlteZeit] = useState<string | null>(null);

  // Schritt 3
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [anmerkung, setAnmerkung] = useState('');
  const [dsgvo, setDsgvo] = useState(false);
  const [sendet, setSendet] = useState(false);

  // Restaurant-Info laden
  useEffect(() => {
    if (!restaurantId) return;
    fetch(`${API}/api/buchung/${restaurantId}/info`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fehler) { setFehler(data.fehler); return; }
        setInfo(data);
        // Primärfarbe als CSS-Variable setzen
        document.documentElement.style.setProperty('--buchung-farbe', data.primaerfarbe || '#3B82F6');
      })
      .catch(() => setFehler('Restaurant konnte nicht geladen werden'));
  }, [restaurantId]);

  // Slots laden wenn Datum + Personen gesetzt
  const slotsLaden_ = useCallback(async () => {
    if (!datum || !restaurantId) return;
    setSlotsLaden(true);
    try {
      const res = await fetch(`${API}/api/buchung/${restaurantId}/slots?datum=${datum}&personen=${personen}`);
      const data = await res.json();
      setSlots(data.fehler ? [] : data);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLaden(false);
    }
  }, [datum, personen, restaurantId]);

  // Reservierung absenden
  const absenden = async () => {
    if (!restaurantId || !datum || !gewaehlteZeit) return;
    setSendet(true);
    setFehler(null);

    try {
      const buchungsDatum = `${datum}T${gewaehlteZeit}:00`;
      const res = await fetch(`${API}/api/buchung/${restaurantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gast_name: name,
          email,
          telefon: telefon || undefined,
          datum: buchungsDatum,
          personen,
          anmerkung: anmerkung || undefined,
          dsgvo_einwilligung: dsgvo,
        }),
      });
      const data = await res.json();
      if (data.fehler) { setFehler(data.fehler); setSendet(false); return; }
      setSchritt(4); // Bestätigt!
    } catch {
      setFehler('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setSendet(false);
    }
  };

  // ─── Zu Schritt 2 wechseln ───
  const weiterZuSlots = () => {
    if (!datum) return;
    slotsLaden_();
    setSchritt(2);
  };

  // ─── Slot auswählen → Schritt 3 ───
  const slotAuswaehlen = (zeit: string) => {
    setGewaehlteZeit(zeit);
    setSchritt(3);
  };

  // ─── Loading / Fehler ───
  if (fehler && !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">{fehler}</p>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white py-8 px-4" style={{ backgroundColor: 'var(--buchung-farbe, #3B82F6)' }}>
        <div className="max-w-lg mx-auto text-center">
          {info.logo_url && <img src={info.logo_url} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover bg-white/20" />}
          <h1 className="text-2xl font-bold">{info.name}</h1>
          {info.adresse && <p className="text-white/80 text-sm mt-1">{info.adresse}</p>}
          <p className="text-white/90 text-sm mt-2">Tisch reservieren</p>
        </div>
      </div>

      {/* Fortschrittsanzeige */}
      {schritt < 4 && (
        <div className="max-w-lg mx-auto px-4 pt-6">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: s <= schritt ? 'var(--buchung-farbe, #3B82F6)' : '#e5e7eb',
                  }}
                />
                <p className={`text-xs mt-1 ${s <= schritt ? 'font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Datum' : s === 2 ? 'Uhrzeit' : 'Kontakt'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pb-12">
        {/* Fehler-Banner */}
        {fehler && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {fehler}
          </div>
        )}

        {/* ─── Schritt 1: Datum + Personen ─── */}
        {schritt === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Wann möchten Sie kommen?</h2>
              <Kalender
                ausgewaehlt={datum}
                onAuswahl={setDatum}
                oeffnungszeiten={info.oeffnungszeiten}
                vorlaufTage={info.vorlauf_tage}
              />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <PersonenAuswahl wert={personen} onChange={setPersonen} />
            </div>

            <button
              onClick={weiterZuSlots}
              disabled={!datum}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: 'var(--buchung-farbe, #3B82F6)' }}
            >
              Weiter
            </button>
          </div>
        )}

        {/* ─── Schritt 2: Slot wählen ─── */}
        {schritt === 2 && (
          <div className="space-y-4">
            {/* Zusammenfassung */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {datum && new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-gray-500">{personen} {personen === 1 ? 'Person' : 'Personen'}</p>
              </div>
              <button
                onClick={() => setSchritt(1)}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--buchung-farbe, #3B82F6)' }}
              >
                Ändern
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Uhrzeit wählen</h2>
              <SlotGrid slots={slots} laden={slotsLaden} onAuswahl={slotAuswaehlen} />
            </div>

            <button
              onClick={() => setSchritt(1)}
              className="w-full py-3 rounded-xl border text-gray-600 font-medium hover:bg-gray-50"
            >
              Zurück
            </button>
          </div>
        )}

        {/* ─── Schritt 3: Kontaktdaten ─── */}
        {schritt === 3 && (
          <div className="space-y-4">
            {/* Zusammenfassung */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {datum && new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {' '}um {gewaehlteZeit} Uhr
                </p>
                <p className="text-sm text-gray-500">{personen} {personen === 1 ? 'Person' : 'Personen'}</p>
              </div>
              <button
                onClick={() => setSchritt(2)}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--buchung-farbe, #3B82F6)' }}
              >
                Ändern
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Ihre Kontaktdaten</h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">E-Mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max@beispiel.de"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Telefon (optional)</label>
                <input
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="+49 123 456789"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Besondere Wünsche (optional)</label>
                <textarea
                  value={anmerkung}
                  onChange={(e) => setAnmerkung(e.target.value)}
                  placeholder="Allergien, Kinderstuhl, Fensterplatz..."
                  rows={3}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dsgvo}
                  onChange={(e) => setDsgvo(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Ich stimme der Verarbeitung meiner Daten zur Reservierung zu.
                  Meine Daten werden spätestens 30 Tage nach dem Reservierungsdatum gelöscht.
                </span>
              </label>
            </div>

            <button
              onClick={absenden}
              disabled={!name || !email || !dsgvo || sendet}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: 'var(--buchung-farbe, #3B82F6)' }}
            >
              {sendet ? 'Wird gesendet...' : 'Reservierung abschließen'}
            </button>

            <button
              onClick={() => setSchritt(2)}
              className="w-full py-3 rounded-xl border text-gray-600 font-medium hover:bg-gray-50"
            >
              Zurück
            </button>
          </div>
        )}

        {/* ─── Schritt 4: Bestätigung ─── */}
        {schritt === 4 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: 'var(--buchung-farbe, #3B82F6)' }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold">Reservierung bestätigt!</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <p className="font-semibold text-lg">{info.name}</p>
              {info.adresse && <p className="text-sm text-gray-500 mt-1">{info.adresse}</p>}
              <div className="mt-3 space-y-1">
                <p className="text-sm">
                  📅 {datum && gewaehlteZeit && datumFormatiert(`${datum}T${gewaehlteZeit}:00`)}
                </p>
                <p className="text-sm">👥 {personen} {personen === 1 ? 'Person' : 'Personen'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Eine Bestätigung wurde an <strong>{email}</strong> gesendet.
              Dort finden Sie auch Links zum Stornieren oder Umbuchen.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-300">
        Powered by ServeFlow
      </div>
    </div>
  );
}
