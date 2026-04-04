interface StatKarteProps {
  label: string;
  wert: string | number;
  farbe?: string;
}

export default function StatKarte({ label, wert, farbe = 'bg-white' }: StatKarteProps) {
  return (
    <div className={`rounded-xl p-5 shadow-sm ${farbe}`}>
      <p className="text-sm text-current opacity-70 font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1">{wert}</p>
    </div>
  );
}
