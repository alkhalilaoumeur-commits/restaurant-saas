import Topbar from '../components/layout/Topbar';
import StatKarte from '../components/dashboard/StatKarte';
import Auslastung from '../components/dashboard/Auslastung';
import { useBestellungen } from '../hooks/useBestellungen';
import { useTische } from '../hooks/useTische';

export default function Dashboard() {
  const { bestellungen } = useBestellungen();
  const { tische } = useTische();

  const offen = bestellungen.filter((b) => b.status === 'offen').length;
  const inZubereitung = bestellungen.filter((b) => b.status === 'in_zubereitung').length;
  const serviert = bestellungen.filter((b) => b.status === 'serviert').length;

  return (
    <div>
      <Topbar titel="Dashboard" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatKarte label="Offene Bestellungen" wert={offen} farbe="bg-yellow-50 text-yellow-700" />
        <StatKarte label="In Zubereitung" wert={inZubereitung} farbe="bg-orange-50 text-orange-700" />
        <StatKarte label="Serviert" wert={serviert} farbe="bg-green-50 text-green-700" />
      </div>

      <Auslastung tische={tische} />
    </div>
  );
}
