import { useDroppable } from '@dnd-kit/core';

interface Props {
  mitarbeiterId: string;
  datum: string;           // "2026-04-09"
  istHeute: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * Eine Tabellenzelle (td) die als Drop-Ziel für Schichten dient.
 * ID-Format: "drop_{mitarbeiterId}_{datum}" — wird in onDragEnd geparst.
 * isOver: Zeigt blauen Highlight wenn eine Schicht über der Zelle schwebt.
 */
export default function DroppableZelle({ mitarbeiterId, datum, istHeute, onClick, children }: Props) {
  const droppableId = `drop_${mitarbeiterId}_${datum}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <td
      ref={setNodeRef}
      className={`
        px-1.5 py-2 align-top cursor-pointer group transition-colors
        ${istHeute ? 'bg-red-50/30 dark:bg-red-900/10' : ''}
        ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-inset ring-blue-300 dark:ring-blue-600 rounded' : ''}
      `}
      onClick={onClick}
    >
      {children}
    </td>
  );
}
