import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { BuchungSelfService } from '../types';

const API = '';

function datumFormatiert(datum: string): string {
  const d = new Date(datum);
  const tag = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const zeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${tag} um ${zeit} Uhr`;
}

export default function ReservierungStornieren() {
  const { token } = useParams<{ token: string }>();
  const [reservierung, setReservierung] = useState<BuchungSelfService | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const [storniert, setStorniert] = useState(false);
  const [sendet, setSendet] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/buchung/token/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fehler) { setFehler(data.fehler); return; }
        setReservierung(data);
        if (data.status === 'storniert') setStorniert(true);
      })
      .catch(() => setFehler('Reservierung konnte nicht geladen werden'))
      .finally(() => setLaden(false));
  }, [token]);

  const stornieren = async () => {
    if (!token) return;
    setSendet(true);
    try {
      const res = await fetch(`${API}/api/buchung/token/${token}/stornieren`, { method: 'POST' });
      const data = await res.json();
      if (data.fehler) { setFehler(data.fehler); setSendet(false); return; }
      setStorniert(true);
    } catch {
      setFehler('Stornierung fehlgeschlagen');
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

  if (fehler && !reservierung) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center max-w-md">
          <p className="text-gray-600">{fehler}</p>
        </div>
      </div>
    );
  }

  if (!reservierung) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md w-full">
        {storniert ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-xl font-bold">Reservierung storniert</h2>
            <p className="text-sm text-gray-500">
              Ihre Reservierung bei <strong>{reservierung.restaurant_name}</strong> wurde storniert.
              Eine Bestätigung wurde per E-Mail gesendet.
            </p>
            {reservierung.restaurant_id && (
              <a
                href={`/buchen/${reservierung.restaurant_id}`}
                className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600"
              >
                Neue Reservierung
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Reservierung stornieren?</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold">{reservierung.restaurant_name}</p>
              {reservierung.restaurant_adresse && (
                <p className="text-sm text-gray-500">{reservierung.restaurant_adresse}</p>
              )}
              <div className="mt-3 space-y-1">
                <p className="text-sm">📅 {datumFormatiert(reservierung.datum)}</p>
                <p className="text-sm">👥 {reservierung.personen} {reservierung.personen === 1 ? 'Person' : 'Personen'}</p>
              </div>
            </div>

            {fehler && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{fehler}</div>
            )}

            <button
              onClick={stornieren}
              disabled={sendet}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
            >
              {sendet ? 'Wird storniert...' : 'Ja, Reservierung stornieren'}
            </button>
            <a
              href={`/buchen/${reservierung.restaurant_id}`}
              className="block text-center py-3 border rounded-xl text-gray-600 font-medium hover:bg-gray-50"
            >
              Abbrechen
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
