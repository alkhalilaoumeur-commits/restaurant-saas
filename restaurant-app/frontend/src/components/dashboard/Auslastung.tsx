import { Tisch } from '../../types';

interface AuslastungProps {
  tische: Tisch[];
}

export default function Auslastung({ tische }: AuslastungProps) {
  const gesamt = tische.length;
  const besetzt = tische.filter((t) => t.status !== 'frei').length;
  const prozent = gesamt ? Math.round((besetzt / gesamt) * 100) : 0;

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium text-gray-500 dark:text-slate-400">Tischauslastung</p>
        <span className="text-xs text-gray-400 dark:text-slate-500">{besetzt} von {gesamt} Tischen</span>
      </div>
      <div className="flex items-end gap-3 mb-3">
        <p className="text-[28px] font-bold text-gray-900 dark:text-slate-50 leading-tight">{prozent}%</p>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${prozent}%` }}
        />
      </div>
    </div>
  );
}
