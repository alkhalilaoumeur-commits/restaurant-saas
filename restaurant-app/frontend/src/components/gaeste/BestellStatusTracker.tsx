import { BestellungStatus } from '../../types';
import { BESTELLUNG_STATUS_LABEL } from '../../lib/utils';

const SCHRITTE: BestellungStatus[] = ['offen', 'in_zubereitung', 'serviert', 'bezahlt'];

const SCHRITT_ICON: Record<BestellungStatus, string> = {
  offen: '📋',
  in_zubereitung: '👨‍🍳',
  serviert: '🍽️',
  bezahlt: '✅',
};

const SCHRITT_TEXT: Record<BestellungStatus, string> = {
  offen: 'Deine Bestellung ist eingegangen.',
  in_zubereitung: 'Dein Essen wird gerade zubereitet!',
  serviert: 'Dein Essen wurde serviert. Guten Appetit!',
  bezahlt: 'Bezahlt – vielen Dank für deinen Besuch!',
};

interface Props {
  status: BestellungStatus;
  gesamtpreis: number;
}

export default function BestellStatusTracker({ status, gesamtpreis }: Props) {
  const aktuellerIndex = SCHRITTE.indexOf(status);

  return (
    <div className="min-h-screen bg-gastro flex items-center justify-center p-6 font-theme-body">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Aktiver Status */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-pulse-dot inline-block">{SCHRITT_ICON[status]}</div>
          <h2 className="text-xl font-semibold text-gastro-text font-theme-heading">
            {BESTELLUNG_STATUS_LABEL[status]}
          </h2>
          <p className="text-sm text-gastro-muted mt-1">{SCHRITT_TEXT[status]}</p>
        </div>

        {/* Fortschrittsleiste */}
        <div className="flex items-center justify-between mb-8 px-2">
          {SCHRITTE.map((schritt, i) => {
            const erledigt = i <= aktuellerIndex;
            const aktiv = i === aktuellerIndex;
            return (
              <div key={schritt} className="flex items-center flex-1 last:flex-none">
                {/* Kreis */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all duration-500 ${
                    erledigt || aktiv
                      ? 'bg-gastro-primary text-gastro-on-primary shadow-lg'
                      : 'bg-gastro-border text-gastro-muted'
                  } ${aktiv ? 'ring-4 ring-gastro-primary/30 scale-110' : ''}`}
                >
                  {erledigt && !aktiv ? '✓' : i + 1}
                </div>
                {/* Verbindungslinie */}
                {i < SCHRITTE.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1.5 rounded-full transition-all duration-500 ${
                      i < aktuellerIndex ? 'bg-gastro-primary' : 'bg-gastro-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Status-Labels unter der Leiste */}
        <div className="flex justify-between mb-8 px-0">
          {SCHRITTE.map((schritt, i) => {
            const erledigt = i <= aktuellerIndex;
            return (
              <p
                key={schritt}
                className={`text-[10px] text-center w-16 leading-tight ${
                  erledigt ? 'text-gastro-text font-medium' : 'text-gastro-muted'
                }`}
              >
                {BESTELLUNG_STATUS_LABEL[schritt]}
              </p>
            );
          })}
        </div>

        {/* Gesamtpreis */}
        <div className="bg-gastro-surface rounded-theme shadow-theme-card border-theme-card border-gastro-border p-5 text-center">
          <p className="text-xs text-gastro-muted uppercase tracking-wider font-medium">Gesamtbetrag</p>
          <p className="text-2xl font-bold text-gastro-primary mt-1 font-theme-heading">
            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(gesamtpreis)}
          </p>
        </div>

        {/* Pulsierender Indikator wenn noch aktiv */}
        {status !== 'bezahlt' && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 rounded-full animate-pulse-dot bg-gastro-primary" />
            <p className="text-xs text-gastro-muted">
              Live-Updates aktiv – diese Seite aktualisiert sich automatisch
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
