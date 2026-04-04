import { Tisch } from '../../types';

interface AuslastungProps {
  tische: Tisch[];
}

export default function Auslastung({ tische }: AuslastungProps) {
  const gesamt = tische.length;
  const besetzt = tische.filter((t) => t.status !== 'frei').length;
  const prozent = gesamt ? Math.round((besetzt / gesamt) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500 mb-3">Tischauslastung</p>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-bold text-gray-800">{prozent}%</p>
        <p className="text-sm text-gray-400 mb-1">{besetzt} von {gesamt} Tischen</p>
      </div>
      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${prozent}%` }}
        />
      </div>
    </div>
  );
}
