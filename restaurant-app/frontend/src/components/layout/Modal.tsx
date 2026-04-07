import { useEffect } from 'react';

interface ModalProps {
  offen: boolean;
  onSchliessen: () => void;
  titel: string;
  breit?: boolean;
  children: React.ReactNode;
}

export default function Modal({ offen, onSchliessen, titel, breit, children }: ModalProps) {
  // Escape-Taste schließt Modal
  useEffect(() => {
    if (!offen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onSchliessen();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [offen, onSchliessen]);

  // Body-Scroll sperren wenn Modal offen
  useEffect(() => {
    if (offen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [offen]);

  if (!offen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onSchliessen}
    >
      {/* Backdrop mit Blur */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Modal-Karte */}
      <div
        className={`relative bg-white dark:bg-[#1A2540] rounded-2xl shadow-2xl shadow-black/10 w-full mx-auto animate-modal-in ring-1 ring-black/5 dark:ring-white/10 ${
          breit ? 'max-w-lg' : 'max-w-md'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-slate-50">{titel}</h2>
          <button
            onClick={onSchliessen}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Trennlinie */}
        <div className="border-b border-gray-100 dark:border-white/10 mx-6 mt-3" />

        {/* Inhalt */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
