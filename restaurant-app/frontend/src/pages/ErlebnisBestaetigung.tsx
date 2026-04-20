import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { ErlebnisBuchung } from '../hooks/useErlebnisse';

function preisFormatieren(cent: number) {
  return (cent / 100).toFixed(2).replace('.', ',') + ' €';
}

export default function ErlebnisBestaetigung() {
  const { token } = useParams<{ token: string }>();
  const [buchung, setBuchung] = useState<ErlebnisBuchung | null>(null);
  const [laedt, setLaedt]    = useState(true);
  const [fehler, setFehler]  = useState('');

  useEffect(() => {
    if (!token) return;
    api.get<ErlebnisBuchung>(`/erlebnisse/buchung/${token}`)
      .then(setBuchung)
      .catch(() => setFehler('Buchung nicht gefunden.'))
      .finally(() => setLaedt(false));
  }, [token]);

  if (laedt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fehler || !buchung) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{fehler || 'Buchung nicht gefunden.'}</p>
      </div>
    );
  }

  const bezahlt  = buchung.status === 'bezahlt';
  const datumStr = new Date(buchung.datum + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${bezahlt ? 'bg-green-100' : 'bg-yellow-100'}`}>
          {bezahlt ? (
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {bezahlt ? 'Buchung bestätigt!' : 'Zahlung ausstehend'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {bezahlt
            ? 'Wir freuen uns auf deinen Besuch. Eine Bestätigungs-E-Mail wird in Kürze verschickt.'
            : 'Deine Buchung ist registriert, wartet aber noch auf die Zahlungsbestätigung.'}
        </p>

        {/* Details */}
        <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400">Erlebnis</span>
            <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{buchung.erlebnis_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Datum</span>
            <span className="text-sm font-medium text-gray-700">{datumStr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Uhrzeit</span>
            <span className="text-sm font-medium text-gray-700">{buchung.uhrzeit.slice(0, 5)} Uhr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Personen</span>
            <span className="text-sm font-medium text-gray-700">{buchung.personen} Person{buchung.personen > 1 ? 'en' : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Name</span>
            <span className="text-sm font-medium text-gray-700">{buchung.gast_name}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Bezahlt</span>
            <span className="text-sm font-bold text-gray-900">{preisFormatieren(buchung.preis_cent)}</span>
          </div>
        </div>

        {buchung.anmerkungen && (
          <div className="bg-blue-50 rounded-xl p-3 text-left mb-6">
            <p className="text-xs text-blue-600 font-medium mb-1">Deine Anmerkungen</p>
            <p className="text-sm text-blue-800">{buchung.anmerkungen}</p>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Buchungs-Token: <span className="font-mono">{token?.slice(0, 12)}...</span>
        </p>
      </div>
    </div>
  );
}
