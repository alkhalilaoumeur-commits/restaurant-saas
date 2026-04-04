import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

interface Bestellung {
  id: string;
  tisch_nummer: number;
  status: string;
  gesamtpreis: number;
  erstellt_am: string;
  positionen: { gericht_name: string; menge: number; einzelpreis: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  offen: 'Offen',
  in_zubereitung: 'In Zubereitung',
  serviert: 'Serviert',
  bezahlt: 'Bezahlt',
};

const STATUS_FARBEN: Record<string, string> = {
  offen: 'bg-yellow-100 text-yellow-800',
  in_zubereitung: 'bg-orange-100 text-orange-800',
  serviert: 'bg-green-100 text-green-800',
  bezahlt: 'bg-gray-100 text-gray-600',
};

export default function BestellungenPage() {
  const [bestellungen, setBestellungen] = useState<Bestellung[]>([]);
  const socket = useSocket();

  async function laden() {
    const data = await api.get<Bestellung[]>('/bestellungen?status=offen');
    setBestellungen(data);
  }

  useEffect(() => {
    laden();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('neue_bestellung', laden);
    socket.on('bestellung_aktualisiert', laden);
    return () => {
      socket.off('neue_bestellung', laden);
      socket.off('bestellung_aktualisiert', laden);
    };
  }, [socket]);

  async function statusAendern(id: string, status: string) {
    await api.patch(`/bestellungen/${id}/status`, { status });
    laden();
  }

  const naechsterStatus: Record<string, string> = {
    offen: 'in_zubereitung',
    in_zubereitung: 'serviert',
    serviert: 'bezahlt',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Bestellungen</h2>
      <div className="grid grid-cols-1 gap-4">
        {bestellungen.length === 0 && (
          <p className="text-gray-400 text-sm">Keine offenen Bestellungen.</p>
        )}
        {bestellungen.map((b) => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-semibold">Tisch {b.tisch_nummer}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${STATUS_FARBEN[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
              <span className="font-semibold">{Number(b.gesamtpreis).toFixed(2)} €</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              {b.positionen?.map((p, i) => (
                <li key={i}>
                  {p.menge}× {p.gericht_name} ({Number(p.einzelpreis).toFixed(2)} €)
                </li>
              ))}
            </ul>
            {naechsterStatus[b.status] && (
              <button
                onClick={() => statusAendern(b.id, naechsterStatus[b.status])}
                className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700"
              >
                → {STATUS_LABELS[naechsterStatus[b.status]]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
