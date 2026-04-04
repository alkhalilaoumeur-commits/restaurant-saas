import { BestellungStatus } from '../../types';
import { BESTELLUNG_STATUS_LABEL, BESTELLUNG_STATUS_FARBE } from '../../lib/utils';

export default function StatusBadge({ status }: { status: BestellungStatus }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BESTELLUNG_STATUS_FARBE[status]}`}>
      {BESTELLUNG_STATUS_LABEL[status]}
    </span>
  );
}
