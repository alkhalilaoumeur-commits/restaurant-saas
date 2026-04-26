import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Erlebnis } from '../hooks/useErlebnisse';

function preisFormatieren(cent: number) {
  return (cent / 100).toFixed(2).replace('.', ',') + ' €';
}

function dauerFormatieren(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// Heute + 30 Tage als ISO-Datum-String
function minDatum() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
function maxDatum() {
  const d = new Date();
  d.setDate(d.getDate() + 180);
  return d.toISOString().split('T')[0];
}

export default function ErlebnisDetail() {
  const { restaurantId, erlebnisId } = useParams<{ restaurantId: string; erlebnisId: string }>();
  const [searchParams] = useSearchParams();
  const abgebrochen = searchParams.get('abgebrochen') === '1';

  const [erlebnis, setErlebnis] = useState<Erlebnis | null>(null);
  const [laedt, setLaedt]       = useState(true);
  const [fehler, setFehler]     = useState('');

  // Formular-State
  const [datum, setDatum]             = useState('');
  const [uhrzeit, setUhrzeit]         = useState('19:00');
  const [personen, setPersonen]       = useState(2);
  const [gastName, setGastName]       = useState('');
  const [gastEmail, setGastEmail]     = useState('');
  const [gastTelefon, setGastTelefon] = useState('');
  const [anmerkungen, setAnmerkungen] = useState('');
  const [schritt, setSchritt]         = useState(1);
  const [buchungLaedt, setBuchungLaedt] = useState(false);
  const [buchungFehler, setBuchungFehler] = useState('');

  useEffect(() => {
    if (!erlebnisId) return;
    api.get<Erlebnis[]>(`/erlebnisse/public/${restaurantId}`)
      .then((liste: Erlebnis[]) => {
        const gefunden = liste.find((e: Erlebnis) => e.id === erlebnisId) || null;
        setErlebnis(gefunden);
      })
      .catch(() => setFehler('Erlebnis konnte nicht geladen werden.'))
      .finally(() => setLaedt(false));
  }, [restaurantId, erlebnisId]);

  const handleBuchen = async () => {
    if (!erlebnis) return;
    setBuchungFehler('');
    setBuchungLaedt(true);
    try {
      const { buchung_token } = await api.post<{ buchung_token: string }>(`/erlebnisse/${erlebnis.id}/buchen`, {
        gast_name: gastName.trim(),
        gast_email: gastEmail.trim().toLowerCase(),
        gast_telefon: gastTelefon || null,
        datum, uhrzeit, personen: Number(personen), anmerkungen: anmerkungen || null,
      });
      window.location.href = `/erlebnis-bestaetigung/${buchung_token}`;
    } catch (err) {
      setBuchungFehler((err as Error).message || 'Buchung fehlgeschlagen');
      setBuchungLaedt(false);
    }
  };

  if (laedt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fehler || !erlebnis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">{fehler || 'Erlebnis nicht gefunden.'}</p>
          <a href="/" className="text-blue-600 text-sm hover:underline">Zurück zur Startseite</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Erlebnis-Buchung</p>
          <h1 className="text-xl font-bold text-gray-900">{erlebnis.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Abgebrochen-Hinweis */}
        {abgebrochen && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            Die Zahlung wurde abgebrochen. Du kannst es erneut versuchen.
          </div>
        )}

        {/* Erlebnis-Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          {erlebnis.bild_url && (
            <img src={erlebnis.bild_url} alt={erlebnis.name} className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          {erlebnis.beschreibung && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{erlebnis.beschreibung}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {dauerFormatieren(erlebnis.dauer_min)}
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Max. {erlebnis.max_personen} Personen
            </div>
            <div className="ml-auto text-xl font-bold text-gray-900">{preisFormatieren(erlebnis.preis_cent)}</div>
          </div>
        </div>

        {/* Schritt-Anzeige */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                schritt === s ? 'bg-blue-600 text-white' : schritt > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {schritt > s ? '✓' : s}
              </div>
              <span className={`text-xs ${schritt === s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Datum & Zeit' : s === 2 ? 'Personen' : 'Kontakt'}
              </span>
              {s < 3 && <div className="h-px w-6 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Formular */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          {/* Schritt 1: Datum + Uhrzeit */}
          {schritt === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Wann möchtest du kommen?</h2>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Datum *</label>
                <input
                  type="date" value={datum}
                  min={minDatum()} max={maxDatum()}
                  onChange={e => setDatum(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Uhrzeit *</label>
                <div className="grid grid-cols-4 gap-2">
                  {['17:00', '18:00', '19:00', '20:00', '18:30', '19:30', '20:30', '21:00'].map(t => (
                    <button
                      key={t} onClick={() => setUhrzeit(t)}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        uhrzeit === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="time" value={uhrzeit} onChange={e => setUhrzeit(e.target.value)}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <button
                onClick={() => { if (datum && uhrzeit) setSchritt(2); }}
                disabled={!datum || !uhrzeit}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Weiter
              </button>
            </div>
          )}

          {/* Schritt 2: Personen + Anmerkungen */}
          {schritt === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Wie viele Personen?</h2>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Anzahl Personen *</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPersonen(p => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg font-medium"
                  >−</button>
                  <span className="text-2xl font-bold text-gray-900 w-8 text-center">{personen}</span>
                  <button
                    onClick={() => setPersonen(p => Math.min(erlebnis.max_personen, p + 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg font-medium"
                  >+</button>
                  <span className="text-xs text-gray-400">(max. {erlebnis.max_personen})</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Anmerkungen (optional)</label>
                <textarea
                  value={anmerkungen} onChange={e => setAnmerkungen(e.target.value)} rows={2}
                  placeholder="Allergien, besondere Wünsche, Anlass..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSchritt(1)} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Zurück
                </button>
                <button
                  onClick={() => setSchritt(3)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}

          {/* Schritt 3: Kontaktdaten + Bezahlen */}
          {schritt === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Deine Kontaktdaten</h2>

              {/* Zusammenfassung */}
              <div className="bg-blue-50 rounded-xl p-3 text-sm space-y-1">
                <p className="font-medium text-blue-900">{erlebnis.name}</p>
                <p className="text-blue-700">
                  {new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })} · {uhrzeit} Uhr · {personen} Person{personen > 1 ? 'en' : ''}
                </p>
                <p className="font-bold text-blue-900 text-base">{preisFormatieren(erlebnis.preis_cent)}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Name *</label>
                <input
                  type="text" value={gastName} onChange={e => setGastName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">E-Mail *</label>
                <input
                  type="email" value={gastEmail} onChange={e => setGastEmail(e.target.value)}
                  placeholder="max@beispiel.de"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Telefon (optional)</label>
                <input
                  type="tel" value={gastTelefon} onChange={e => setGastTelefon(e.target.value)}
                  placeholder="+49 151 12345678"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {buchungFehler && <p className="text-sm text-red-500">{buchungFehler}</p>}

              <div className="flex gap-2">
                <button onClick={() => setSchritt(2)} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Zurück
                </button>
                <button
                  onClick={handleBuchen}
                  disabled={buchungLaedt || !gastName.trim() || !gastEmail.trim()}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {buchungLaedt ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Wird gebucht...</>
                  ) : (
                    <>Jetzt verbindlich buchen — {preisFormatieren(erlebnis.preis_cent)}</>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Zahlung erfolgt vor Ort im Restaurant · Bargeld oder Karte
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
