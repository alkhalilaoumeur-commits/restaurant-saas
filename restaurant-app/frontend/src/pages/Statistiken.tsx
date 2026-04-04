import Topbar from '../components/layout/Topbar';

// Phase 4 – echte Statistiken mit Datenbankabfragen
export default function Statistiken() {
  return (
    <div>
      <Topbar titel="Statistiken" />
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <p className="text-gray-400 text-sm">Kommt in Phase 4 – Umsatz, meistbestellte Gerichte, Stoßzeiten.</p>
      </div>
    </div>
  );
}
