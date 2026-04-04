import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Stats {
  tische_gesamt: number;
  tische_besetzt: number;
  bestellungen_offen: number;
  bestellungen_in_zubereitung: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Daten parallel laden
    Promise.all([
      api.get<{ length: number; filter: (fn: (t: { status: string }) => boolean) => { length: number } }>('/tische'),
      api.get<{ length: number; filter: (fn: (b: { status: string }) => boolean) => { length: number } }>('/bestellungen'),
    ]).then(([tische, bestellungen]) => {
      const t = tische as { status: string }[];
      const b = bestellungen as { status: string }[];
      setStats({
        tische_gesamt: t.length,
        tische_besetzt: t.filter((ti) => ti.status === 'besetzt').length,
        bestellungen_offen: b.filter((be) => be.status === 'offen').length,
        bestellungen_in_zubereitung: b.filter((be) => be.status === 'in_zubereitung').length,
      });
    });
  }, []);

  const karten = [
    { label: 'Tische belegt', wert: stats ? `${stats.tische_besetzt} / ${stats.tische_gesamt}` : '–', farbe: 'bg-blue-50 text-blue-700' },
    { label: 'Offene Bestellungen', wert: stats?.bestellungen_offen ?? '–', farbe: 'bg-yellow-50 text-yellow-700' },
    { label: 'In Zubereitung', wert: stats?.bestellungen_in_zubereitung ?? '–', farbe: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        {karten.map((k) => (
          <div key={k.label} className={`rounded-xl p-5 ${k.farbe}`}>
            <p className="text-sm font-medium opacity-75">{k.label}</p>
            <p className="text-3xl font-bold mt-1">{k.wert}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
