import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Schicht } from '../../types';

interface Props {
  schicht: Schicht;
  farbe: { bg: string; text: string; border: string };
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Eine Schicht-Badge die man ziehen kann.
 * - transform: Verschiebt die Badge während des Ziehens (CSS translate)
 * - isDragging: Macht das Original halbtransparent während es gezogen wird
 * - onClick: Feuert nur wenn kein Drag gestartet wurde (PointerSensor mit distance:8)
 */
export default function DraggableSchicht({ schicht, farbe, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: schicht.id,
    data: { schicht },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        px-2 py-1.5 rounded-lg border text-center
        cursor-grab active:cursor-grabbing
        hover:shadow-sm transition-all select-none
        ${farbe.bg} ${farbe.border}
        ${isDragging ? 'opacity-30 scale-95' : ''}
      `}
    >
      <p className={`text-xs font-semibold ${farbe.text}`}>
        {schicht.beginn.slice(0, 5)}–{schicht.ende.slice(0, 5)}
      </p>
      {schicht.notiz && (
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{schicht.notiz}</p>
      )}
    </div>
  );
}
