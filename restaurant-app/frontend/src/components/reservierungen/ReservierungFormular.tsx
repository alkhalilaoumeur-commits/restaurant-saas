import { useState, FormEvent } from 'react';
import { api } from '../../lib/api';

interface ReservierungFormularProps {
  restaurantId: string;
  onErfolg: () => void;
  onAbbrechen: () => void;
}

const INPUT_KLASSE = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors';

export default function ReservierungFormular({ restaurantId, onErfolg, onAbbrechen }: ReservierungFormularProps) {
  const [felder, setFelder] = useState({ gast_name: '', email: '', telefon: '', datum: '', personen: '2', anmerkung: '' });
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  function setFeld(key: keyof typeof felder, value: string) {
    setFelder((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      await api.post('/reservierungen', {
        ...felder,
        restaurant_id: restaurantId,
        personen: parseInt(felder.personen),
      });
      onErfolg();
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input placeholder="Name des Gastes" value={felder.gast_name} onChange={(e) => setFeld('gast_name', e.target.value)} required className={INPUT_KLASSE} />
      <input type="email" placeholder="E-Mail (optional)" value={felder.email} onChange={(e) => setFeld('email', e.target.value)} className={INPUT_KLASSE} />
      <input placeholder="Telefon (optional)" value={felder.telefon} onChange={(e) => setFeld('telefon', e.target.value)} className={INPUT_KLASSE} />
      <input type="datetime-local" value={felder.datum} onChange={(e) => setFeld('datum', e.target.value)} required className={INPUT_KLASSE} />
      <input type="number" min="1" placeholder="Personen" value={felder.personen} onChange={(e) => setFeld('personen', e.target.value)} required className={INPUT_KLASSE} />
      <textarea placeholder="Anmerkung (optional)" value={felder.anmerkung} onChange={(e) => setFeld('anmerkung', e.target.value)} rows={2} className={INPUT_KLASSE} />
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={laden} className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
          {laden ? 'Speichern...' : 'Reservierung anlegen'}
        </button>
        <button type="button" onClick={onAbbrechen} className="flex-1 border rounded-lg py-2 text-sm text-gray-600">Abbrechen</button>
      </div>
    </form>
  );
}
