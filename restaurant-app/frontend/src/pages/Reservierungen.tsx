import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import ReservierungZeile from '../components/reservierungen/ReservierungZeile';
import ReservierungFormular from '../components/reservierungen/ReservierungFormular';
import { useReservierungen } from '../hooks/useReservierungen';
import { useAuthStore } from '../store/auth';

export default function Reservierungen() {
  const { mitarbeiter } = useAuthStore();
  const { reservierungen, laden, laden_, statusAendern } = useReservierungen();
  const [formularOffen, setFormularOffen] = useState(false);

  return (
    <div>
      <Topbar
        titel="Reservierungen"
        aktion={
          <button
            onClick={() => setFormularOffen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700"
          >
            + Reservierung
          </button>
        }
      />

      {formularOffen && mitarbeiter && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 max-w-md">
          <h3 className="font-medium text-sm text-gray-700 mb-3">Neue Reservierung</h3>
          <ReservierungFormular
            restaurantId={mitarbeiter.restaurantId}
            onErfolg={() => { setFormularOffen(false); laden_(); }}
            onAbbrechen={() => setFormularOffen(false)}
          />
        </div>
      )}

      {laden && <p className="text-sm text-gray-400">Wird geladen...</p>}

      {!laden && reservierungen.length === 0 && (
        <p className="text-sm text-gray-400">Keine Reservierungen vorhanden.</p>
      )}

      <div className="space-y-3">
        {reservierungen.map((r) => (
          <ReservierungZeile key={r.id} reservierung={r} onStatusAendern={statusAendern} />
        ))}
      </div>
    </div>
  );
}
