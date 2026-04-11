import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BuchungSelfService } from '../types';

const API = '';

function statusFarbe(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'bestaetigt': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bestätigt' };
    case 'storniert': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Storniert' };
    default: return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Ausstehend' };
  }
}

/**
 * Öffentliche Detailseite für eine Reservierung — erreichbar über den QR-Code in der Email.
 * Route: /reservierung/:token
 *
 * Der Gast zeigt diese Seite im Restaurant vor. Staff sieht: Name, Datum, Personen, Status.
 * Von hier aus kann der Gast auch stornieren oder umbuchen.
 */
export default function ReservierungDetail() {
  const { token } = useParams<{ token: string }>();
  const [reservierung, setReservierung] = useState<BuchungSelfService | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/buchung/token/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fehler) { setFehler(data.fehler); return; }
        setReservierung(data);
      })
      .catch(() => setFehler('Reservierung konnte nicht geladen werden'))
      .finally(() => setLaden(false));
  }, [token]);

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (fehler || !reservierung) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{fehler || 'Reservierung nicht gefunden'}</p>
        </div>
      </div>
    );
  }

  const status = statusFarbe(reservierung.status);
  const istStorniert = reservierung.status === 'storniert';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm max-w-md w-full overflow-hidden">
        {/* Header mit Status */}
        <div className={`px-6 py-4 ${istStorniert ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">Ihre Reservierung</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{reservierung.restaurant_name}</p>
          {reservierung.restaurant_adresse && (
            <p className="text-xs text-gray-400">{reservierung.restaurant_adresse}</p>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl">📅</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {new Date(reservierung.datum).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(reservierung.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl">👥</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {reservierung.personen} {reservierung.personen === 1 ? 'Person' : 'Personen'}
              </p>
              <p className="text-xs text-gray-500">Reserviert für</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Name</p>
            <p className="text-sm font-semibold text-gray-800">{reservierung.gast_name}</p>
          </div>

          {/* Anlass + Sitzplatz Badges */}
          {(reservierung.anlass || reservierung.sitzplatz_wunsch) && (
            <div className="flex gap-2 flex-wrap">
              {reservierung.anlass && (
                <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 font-medium">
                  {reservierung.anlass === 'geburtstag' && '🎂 Geburtstag'}
                  {reservierung.anlass === 'jubilaeum' && '💍 Jubiläum'}
                  {reservierung.anlass === 'date_night' && '❤️ Date Night'}
                  {reservierung.anlass === 'geschaeft' && '💼 Geschäftsessen'}
                  {reservierung.anlass === 'feier' && '🥂 Feier'}
                  {reservierung.anlass === 'sonstiges' && '✨ Sonstiges'}
                </span>
              )}
              {reservierung.sitzplatz_wunsch && (
                <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                  {reservierung.sitzplatz_wunsch === 'innen' && 'Innen'}
                  {reservierung.sitzplatz_wunsch === 'terrasse' && 'Terrasse'}
                  {reservierung.sitzplatz_wunsch === 'bar' && 'Bar'}
                  {reservierung.sitzplatz_wunsch === 'fenster' && 'Fensterplatz'}
                  {reservierung.sitzplatz_wunsch === 'ruhig' && 'Ruhige Ecke'}
                </span>
              )}
            </div>
          )}

          {reservierung.anmerkung && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Anmerkung</p>
              <p className="text-sm text-gray-700">{reservierung.anmerkung}</p>
            </div>
          )}

          {/* Aktionen — nur wenn nicht storniert */}
          {!istStorniert && (
            <div className="space-y-2 pt-2">
              <Link
                to={`/reservierung/${token}/aendern`}
                className="block w-full py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-600 transition-colors"
              >
                Reservierung ändern
              </Link>
              <Link
                to={`/reservierung/${token}/stornieren`}
                className="block w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm text-center hover:bg-gray-50 transition-colors"
              >
                Stornieren
              </Link>
            </div>
          )}

          {/* Storniert — neue Reservierung anbieten */}
          {istStorniert && reservierung.restaurant_id && (
            <Link
              to={`/buchen/${reservierung.restaurant_id}`}
              className="block w-full py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-600 transition-colors"
            >
              Neue Reservierung
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 text-center">
          <p className="text-[11px] text-gray-400">Powered by ServeFlow</p>
        </div>
      </div>
    </div>
  );
}
