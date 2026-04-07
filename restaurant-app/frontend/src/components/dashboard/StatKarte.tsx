interface StatKarteProps {
  label: string;
  wert: string | number;
  icon?: React.ReactNode;
  akzentFarbe?: string;
}

export default function StatKarte({ label, wert, icon, akzentFarbe = 'bg-blue-500' }: StatKarteProps) {
  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden card-hover group">
      {/* Farbiger Top-Akzent-Streifen */}
      <div className={`h-1 ${akzentFarbe} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-gray-500 dark:text-slate-400 font-medium">{label}</p>
            <p className="text-[28px] font-bold text-gray-900 dark:text-slate-50 mt-1 leading-tight">{wert}</p>
          </div>
          {icon && (
            <div className={`w-10 h-10 rounded-xl ${akzentFarbe} bg-opacity-90 dark:bg-opacity-20 flex items-center justify-center text-white dark:text-current shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
