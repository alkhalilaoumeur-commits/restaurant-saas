import Topbar from '../components/layout/Topbar';
import BestellungKarte from '../components/bestellungen/BestellungKarte';
import { useBestellungen } from '../hooks/useBestellungen';

export default function Bestellungen() {
  const { bestellungen, laden, fehler, statusAendern } = useBestellungen();

  return (
    <div>
      <Topbar titel="Bestellungen" />

      {laden && <p className="text-sm text-gray-400">Wird geladen...</p>}
      {fehler && <p className="text-sm text-red-500">{fehler}</p>}

      {!laden && bestellungen.length === 0 && (
        <p className="text-sm text-gray-400">Keine aktiven Bestellungen.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bestellungen.map((b) => (
          <BestellungKarte key={b.id} bestellung={b} onStatusAendern={statusAendern} />
        ))}
      </div>
    </div>
  );
}
