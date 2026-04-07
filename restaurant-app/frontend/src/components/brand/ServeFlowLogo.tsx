/**
 * ServeFlow Logo — SVG-Komponente
 *
 * Zeigt das ServeFlow-Logo als Wortmarke mit Icon.
 * - Icon: Stilisierte Servierglocke (Cloche) mit Flow-Linie
 * - Text: "ServeFlow" in geometrischer Schrift
 * - Farben: Blue→Cyan Gradient (DRVN Brand)
 *
 * Props:
 * - variante: 'voll' (Icon + Text), 'icon' (nur Icon), 'text' (nur Text)
 * - groesse: 'sm' | 'md' | 'lg'
 * - className: zusätzliche CSS-Klassen
 */

interface ServeFlowLogoProps {
  variante?: 'voll' | 'icon' | 'text';
  groesse?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GROESSEN = {
  sm: { icon: 28, text: 14, gap: 8, sub: 10 },
  md: { icon: 36, text: 18, gap: 10, sub: 11 },
  lg: { icon: 48, text: 28, gap: 14, sub: 13 },
};

/** Nur das Icon (Servierglocke mit Flow-Kurve) */
function ServeFlowIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Hintergrund-Kreis */}
      <rect width="40" height="40" rx="10" fill="url(#sf-grad)" />

      {/* Cloche (Servierglocke) — stilisiert */}
      {/* Griff oben */}
      <circle cx="20" cy="11" r="2" stroke="white" strokeWidth="1.8" fill="none" />
      {/* Glocken-Kuppel */}
      <path
        d="M10 24 C10 17, 14 13, 20 13 C26 13, 30 17, 30 24"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Teller-Linie */}
      <line x1="8" y1="24" x2="32" y2="24" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

      {/* Flow-Kurve (Dampf/Bewegung) */}
      <path
        d="M15 20 Q18 17, 21 20 Q24 23, 27 20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Fuß / Basis */}
      <path
        d="M13 27 Q13 29, 16 29 L24 29 Q27 29, 27 27"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export default function ServeFlowLogo({
  variante = 'voll',
  groesse = 'md',
  className = '',
}: ServeFlowLogoProps) {
  const g = GROESSEN[groesse];

  if (variante === 'icon') {
    return (
      <div className={className}>
        <ServeFlowIcon size={g.icon} />
      </div>
    );
  }

  if (variante === 'text') {
    return (
      <div className={className}>
        <p style={{ fontSize: g.text }} className="font-semibold text-white tracking-[-0.01em]">
          Serve<span className="text-cyan-400">Flow</span>
        </p>
      </div>
    );
  }

  // variante === 'voll'
  return (
    <div className={`flex items-center ${className}`} style={{ gap: g.gap }}>
      <ServeFlowIcon size={g.icon} />
      <div className="min-w-0">
        <p style={{ fontSize: g.text }} className="font-semibold text-white tracking-[-0.01em] truncate">
          Serve<span className="text-cyan-400">Flow</span>
        </p>
        <p style={{ fontSize: g.sub }} className="text-slate-400 truncate">
          Restaurant Management
        </p>
      </div>
    </div>
  );
}
