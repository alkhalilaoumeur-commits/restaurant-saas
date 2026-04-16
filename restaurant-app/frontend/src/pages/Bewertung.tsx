import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BewertungPublic } from '../types';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Stern-Auswahl ────────────────────────────────────────────────────────────

function SternAuswahl({ wert, onChange }: { wert: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-5xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${n} Stern${n > 1 ? 'e' : ''}`}
        >
          <span className={(hover || wert) >= n ? 'text-amber-400' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Seite ────────────────────────────────────────────────────────────────────

export default function Bewertung() {
  const { token } = useParams<{ token: string }>();

  const [daten, setDaten] = useState<BewertungPublic | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  // Formular-State
  const [stern, setStern] = useState(0);
  const [kommentar, setKommentar] = useState('');
  const [dsgvo, setDsgvo] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [erfolg, setErfolg] = useState<{ googleLink: string | null } | null>(null);

  // Bewertungs-Infos laden
  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND_URL}/api/bewertungen/public/${token}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.fehler || 'Unbekannter Fehler');
        }
        return r.json();
      })
      .then((d: BewertungPublic) => setDaten(d))
      .catch((e) => setFehler(e.message))
      .finally(() => setLaden(false));
  }, [token]);

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stern) { setFehler('Bitte wählen Sie eine Sternbewertung'); return; }
    if (!dsgvo) { setFehler('Bitte stimmen Sie der Datenschutzerklärung zu'); return; }

    setSendet(true);
    setFehler(null);
    try {
      const r = await fetch(`${BACKEND_URL}/api/bewertungen/public/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stern, kommentar: kommentar || null, dsgvo_einwilligung: true }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.fehler || 'Fehler beim Senden');
      setErfolg({ googleLink: body.google_bewertungs_link });
    } catch (e: any) {
      setFehler(e.message);
    } finally {
      setSendet(false);
    }
  };

  // ── Lade-State ──
  if (laden) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Fehler / nicht gefunden ──
  if (!daten || (fehler && !daten)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Link nicht gefunden</h1>
          <p className="text-gray-500 text-sm">
            Dieser Bewertungslink existiert nicht oder ist abgelaufen.
          </p>
        </div>
      </div>
    );
  }

  // ── Bereits bewertet ──
  if (daten.status === 'abgeschlossen') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Bewertung abgegeben</h1>
          <p className="text-gray-500 text-sm">
            Sie haben bereits eine Bewertung für Ihren Besuch bei{' '}
            <strong>{daten.restaurant_name}</strong> abgegeben. Vielen Dank!
          </p>
          <div className="mt-4 flex justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`text-3xl ${(daten.stern || 0) >= n ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          {daten.kommentar && (
            <p className="mt-3 text-gray-600 text-sm italic">„{daten.kommentar}"</p>
          )}
          {daten.antwort_text && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-blue-700 mb-1">Antwort des Restaurants:</p>
              <p className="text-sm text-blue-900">{daten.antwort_text}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Erfolg nach Abgabe ──
  if (erfolg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Vielen Dank!</h1>
          <p className="text-gray-500 text-sm mb-2">
            Ihr Feedback hilft <strong>{daten.restaurant_name}</strong> dabei, noch besser zu werden.
          </p>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`text-3xl ${stern >= n ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>

          {/* Google-Weiterleitungs-Button — nur bei 4-5 Sternen anzeigen */}
          {erfolg.googleLink && stern >= 4 && (
            <div className="mt-6 bg-blue-50 rounded-xl p-5">
              <p className="text-sm font-medium text-blue-900 mb-3">
                Würden Sie auch eine Bewertung auf Google hinterlassen? Das hilft anderen Gästen sehr!
              </p>
              <a
                href={erfolg.googleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"/></svg>
                Auf Google bewerten
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Bewertungsformular ──
  const sternLabel = ['', 'Sehr schlecht', 'Schlecht', 'Okay', 'Gut', 'Hervorragend'][stern] || '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{daten.restaurant_name}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Hallo {daten.gast_name}, wie war Ihr Besuch?
          </p>
        </div>

        <form onSubmit={absenden} className="space-y-6">
          {/* Sterne */}
          <div className="text-center">
            <SternAuswahl wert={stern} onChange={setStern} />
            <p className="mt-2 text-sm font-medium text-gray-600 h-5">{sternLabel}</p>
          </div>

          {/* Kommentar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kommentar <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={kommentar}
              onChange={(e) => setKommentar(e.target.value)}
              rows={4}
              placeholder="Was hat Ihnen besonders gut gefallen? Was können wir verbessern?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* DSGVO */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dsgvo}
              onChange={(e) => setDsgvo(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              Ich stimme zu, dass mein Feedback und Name für interne Qualitätssicherung gespeichert werden.
              Die Daten werden nach 12 Monaten gelöscht.
            </span>
          </label>

          {/* Fehler */}
          {fehler && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
              {fehler}
            </div>
          )}

          {/* Absenden */}
          <button
            type="submit"
            disabled={sendet || !stern}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            {sendet ? 'Wird gesendet…' : 'Bewertung abgeben'}
          </button>
        </form>
      </div>
    </div>
  );
}
