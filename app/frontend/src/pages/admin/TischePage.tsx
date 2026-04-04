import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Tisch {
  id: string;
  nummer: number;
  kapazitaet: number | null;
  status: 'frei' | 'besetzt' | 'wartet_auf_zahlung';
  qr_url: string;
}

const STATUS_FARBEN: Record<string, string> = {
  frei: 'bg-green-100 text-green-700',
  besetzt: 'bg-red-100 text-red-700',
  wartet_auf_zahlung: 'bg-yellow-100 text-yellow-700',
};

const STATUS_LABELS: Record<string, string> = {
  frei: 'Frei',
  besetzt: 'Besetzt',
  wartet_auf_zahlung: 'Zahlung',
};

export default function TischePage() {
  const [tische, setTische] = useState<Tisch[]>([]);

  async function laden() {
    const data = await api.get<Tisch[]>('/tische');
    setTische(data);
  }

  useEffect(() => { laden(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tischplan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tische.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">T{t.nummer}</p>
            {t.kapazitaet && <p className="text-xs text-gray-400 mb-2">{t.kapazitaet} Personen</p>}
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_FARBEN[t.status]}`}>
              {STATUS_LABELS[t.status]}
            </span>
            <p className="text-xs text-gray-300 mt-2 truncate">{t.qr_url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
