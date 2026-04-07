import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bestellung } from '../../types';
import { useThemeStore } from '../../store/theme';

interface UmsatzChartProps {
  bestellungen: Bestellung[];
}

function getLetzteStunden(bestellungen: Bestellung[]) {
  const jetzt = new Date();
  const stunden: { zeit: string; umsatz: number; anzahl: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const stunde = new Date(jetzt);
    stunde.setHours(jetzt.getHours() - i, 0, 0, 0);
    const naechste = new Date(stunde);
    naechste.setHours(stunde.getHours() + 1);

    const inStunde = bestellungen.filter((b) => {
      const d = new Date(b.erstellt_am);
      return d >= stunde && d < naechste;
    });

    stunden.push({
      zeit: `${stunde.getHours().toString().padStart(2, '0')}:00`,
      umsatz: inStunde.reduce((s, b) => s + b.gesamtpreis, 0),
      anzahl: inStunde.length,
    });
  }

  return stunden;
}

export default function UmsatzChart({ bestellungen }: UmsatzChartProps) {
  const daten = getLetzteStunden(bestellungen);
  const gesamtUmsatz = daten.reduce((s, d) => s + d.umsatz, 0);
  const gesamtAnzahl = daten.reduce((s, d) => s + d.anzahl, 0);
  const dark = useThemeStore((s) => s.theme === 'dark');
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const tickColor = dark ? '#64748b' : '#94a3b8';

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-400 opacity-80" />
      <div className="p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-blue-500" />
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Umsatz heute</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-400 dark:text-slate-500">Umsatz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-400 dark:text-slate-500">Bestellungen</span>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-6 mb-4">
        <div>
          <p className="text-[28px] font-bold text-gray-900 dark:text-slate-50 leading-tight">
            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(gesamtUmsatz)}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{gesamtAnzahl} Bestellungen in den letzten 7 Stunden</p>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daten} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="umsatzGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={dark ? 0.3 : 0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="anzahlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={dark ? 0.25 : 0.15} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="zeit"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              tickFormatter={(v) => `${v}€`}
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
              labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              formatter={(value, name) => [
                name === 'umsatz'
                  ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(value))
                  : `${value} Stück`,
                name === 'umsatz' ? 'Umsatz' : 'Bestellungen',
              ]}
            />
            <Area
              type="monotone"
              dataKey="umsatz"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#umsatzGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="anzahl"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#anzahlGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
