import { Link } from 'react-router-dom';

interface Props {
  variante?: 'kompakt' | 'voll';
}

export default function LegalLinks({ variante = 'kompakt' }: Props) {
  const linkClass = 'hover:text-brand-primary transition-colors';

  if (variante === 'voll') {
    return (
      <footer className="border-t border-gray-200/60 dark:border-white/5 bg-white/40 dark:bg-[#070B14]/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ServeFlow · Al-Khalil Aoumeur</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/impressum" className={linkClass}>Impressum</Link>
            <Link to="/datenschutz" className={linkClass}>Datenschutz</Link>
            <Link to="/agb" className={linkClass}>AGB</Link>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-400 dark:text-slate-500">
      <Link to="/impressum" className={linkClass}>Impressum</Link>
      <span aria-hidden>·</span>
      <Link to="/datenschutz" className={linkClass}>Datenschutz</Link>
      <span aria-hidden>·</span>
      <Link to="/agb" className={linkClass}>AGB</Link>
    </nav>
  );
}
