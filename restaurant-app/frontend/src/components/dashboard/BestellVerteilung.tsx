import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Bestellung } from '../../types';
import { useThemeStore } from '../../store/theme';

interface BestellVerteilungProps {
  bestellungen: Bestellung[];
}

const STATUS_CONFIG = [
  { key: 'offen', label: 'Offen', farbe: '#eab308' },
  { key: 'in_zubereitung', label: 'Zubereitung', farbe: '#f97316' },
  { key: 'serviert', label: 'Serviert', farbe: '#22c55e' },
  { key: 'bezahlt', label: 'Bezahlt', farbe: '#94a3b8' },
] as const;

export default function BestellVerteilung({ bestellungen }: BestellVerteilungProps) {
  const dark = useThemeStore((s) => s.theme === 'dark');
  const daten = STATUS_CONFIG.map(({ key, label, farbe }) => ({
    name: label,
    anzahl: bestellungen.filter((b) => b.status === key).length,
    farbe,
  }));

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-yellow-400" />
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Bestellungen nach Status</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">{bestellungen.length} gesamt</span>
      </div>
      <div className="px-5 pb-5">
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={daten}
            layout="vertical"
            margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            barSize={20}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: dark ? '#64748b' : '#94a3b8' }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: dark ? '#94a3b8' : '#64748b' }}
              width={85}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? '#0F1724' : '#1e293b',
                border: dark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
                padding: '8px 12px',
              }}
              formatter={(value) => [`${value} Bestellungen`, '']}
              cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
            />
            <Bar dataKey="anzahl" radius={[0, 6, 6, 0]}>
              {daten.map((entry, index) => (
                <Cell key={index} fill={entry.farbe} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
