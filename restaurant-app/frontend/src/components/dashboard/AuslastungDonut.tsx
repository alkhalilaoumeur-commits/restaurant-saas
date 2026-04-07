import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tisch } from '../../types';

interface AuslastungDonutProps {
  tische: Tisch[];
}

const FARBEN = {
  frei: '#22c55e',
  besetzt: '#ef4444',
  wartet_auf_zahlung: '#eab308',
};

const LABELS = {
  frei: 'Frei',
  besetzt: 'Besetzt',
  wartet_auf_zahlung: 'Zahlung',
};

export default function AuslastungDonut({ tische }: AuslastungDonutProps) {
  const gesamt = tische.length;
  const frei = tische.filter((t) => t.status === 'frei').length;
  const besetzt = tische.filter((t) => t.status === 'besetzt').length;
  const wartet = tische.filter((t) => t.status === 'wartet_auf_zahlung').length;

  const daten = [
    { name: 'frei', wert: frei },
    { name: 'besetzt', wert: besetzt },
    { name: 'wartet_auf_zahlung', wert: wartet },
  ].filter((d) => d.wert > 0);

  // Fallback wenn keine Tische
  if (gesamt === 0) {
    return (
      <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Tischauslastung</p>
        <p className="text-sm text-gray-400 dark:text-slate-500">Keine Tische vorhanden.</p>
      </div>
    );
  }

  const prozent = Math.round(((besetzt + wartet) / gesamt) * 100);

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 opacity-60" />
      <div className="p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Tischauslastung</p>
      </div>

      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={daten}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                dataKey="wert"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {daten.map((entry) => (
                  <Cell key={entry.name} fill={FARBEN[entry.name as keyof typeof FARBEN]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Zahl in der Mitte */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold text-gray-900 dark:text-slate-50 leading-none">{prozent}%</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">belegt</span>
          </div>
        </div>

        {/* Legende */}
        <div className="flex flex-col gap-3 flex-1">
          {[
            { key: 'frei' as const, anzahl: frei },
            { key: 'besetzt' as const, anzahl: besetzt },
            { key: 'wartet_auf_zahlung' as const, anzahl: wartet },
          ].map(({ key, anzahl }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: FARBEN[key] }}
                />
                <span className="text-xs text-gray-500 dark:text-slate-400">{LABELS[key]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{anzahl}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">
                  ({gesamt ? Math.round((anzahl / gesamt) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-100 dark:border-white/10 pt-2 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-slate-500">Gesamt</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{gesamt} Tische</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
