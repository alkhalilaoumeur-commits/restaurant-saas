import Topbar from '../components/layout/Topbar';
import { useTische } from '../hooks/useTische';
import { TischStatus } from '../types';
import { TISCH_STATUS_FARBE, TISCH_STATUS_LABEL } from '../lib/utils';

const STATUS_REIHENFOLGE: TischStatus[] = ['frei', 'besetzt', 'wartet_auf_zahlung'];

export default function Tischplan() {
  const { tische, laden, statusAendern } = useTische();

  function naechsterStatus(status: TischStatus): TischStatus {
    const idx = STATUS_REIHENFOLGE.indexOf(status);
    return STATUS_REIHENFOLGE[(idx + 1) % STATUS_REIHENFOLGE.length];
  }

  return (
    <div>
      <Topbar titel="Tischplan" />

      {laden && <p className="text-sm text-gray-400">Wird geladen...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tische.map((t) => (
          <button
            key={t.id}
            onClick={() => statusAendern(t.id, naechsterStatus(t.status))}
            className={`rounded-2xl p-5 text-center shadow-sm transition-all hover:shadow-md ${TISCH_STATUS_FARBE[t.status]}`}
          >
            <p className="text-2xl font-bold">T{t.nummer}</p>
            {t.kapazitaet && <p className="text-xs opacity-70 mt-0.5">{t.kapazitaet} Pl.</p>}
            <p className="text-xs font-medium mt-2">{TISCH_STATUS_LABEL[t.status]}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">Tisch anklicken um Status zu wechseln</p>
    </div>
  );
}
