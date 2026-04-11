import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Tilt3DKarteProps {
  children: React.ReactNode;
  className?: string;
  /** Maximaler Neigungswinkel in Grad (default: 10) */
  tiltMax?: number;
  /** Spotlight-Stärke 0–1 (default: 0.15) */
  spotlight?: number;
  /** Scale bei Hover (default: 1.03) */
  hoverScale?: number;
  /** Farbe für leuchtenden Rand-Glow, z.B. 'rgba(129,140,248,0.5)'. Ohne = kein Glow. */
  glowColor?: string;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Wrapper der jede Kindkomponente mit 3D-Tilt + Spotlight + optionalem Border-Glow
// versieht. Inspiriert von ngrok.com Karten-Effekten.
//
// Wie es funktioniert:
//   1. perspective: 800px definiert den 3D-Raum
//   2. onMouseMove trackt Mausposition → rotateX/Y berechnen Kippwinkel
//   3. useSpring macht die Animation butterweich (kein abruptes Stoppen)
//   4. Spotlight = radialer weißer Gradient der der Maus folgt
//   5. Border-Glow = radialer Farbgradient, per CSS-Mask nur am Rand sichtbar
//
// Auf Touch-Geräten: onMouseMove feuert nicht → kein Effekt → graceful fallback
//
export default function Tilt3DKarte({
  children,
  className = '',
  tiltMax = 10,
  spotlight: spotlightStrength = 0.15,
  hoverScale = 1.03,
  glowColor,
}: Tilt3DKarteProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion Values → kein Re-Render bei Mausbewegung, direkte CSS-Transform-Updates
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  // Springs: stiffness = Reaktionsgeschwindigkeit, damping = Dämpfung
  const springConfig = { stiffness: 300, damping: 22 };
  const sRotateX = useSpring(rotateX, springConfig);
  const sRotateY = useSpring(rotateY, springConfig);
  const sScale = useSpring(scale, springConfig);

  // Spotlight + Hover State
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    rotateX.set((ny - 0.5) * -tiltMax * 2);
    rotateY.set((nx - 0.5) * tiltMax * 2);
    setSpot({ x: nx * 100, y: ny * 100 });
  }, [tiltMax, rotateX, rotateY]);

  const onEnter = useCallback(() => {
    setHovering(true);
    scale.set(hoverScale);
  }, [hoverScale, scale]);

  const onLeave = useCallback(() => {
    setHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <div style={{ perspective: 800 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          rotateX: sRotateX,
          rotateY: sRotateY,
          scale: sScale,
          transformStyle: 'preserve-3d',
        }}
        className="relative will-change-transform"
      >
        {children}

        {/* Spotlight: Weißer Lichtfleck folgt der Maus */}
        <div
          className="absolute inset-0 rounded-theme pointer-events-none z-10"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,${spotlightStrength}) 0%, transparent 50%)`,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Border-Glow: Leuchtender Rand der der Maus folgt.
            Technik: Radialer Gradient wird per CSS-Mask auf den 1px-Rand beschränkt.
            content-box zeigt nur den Inhalt, die zweite Maske zeigt alles —
            mit maskComposite: exclude bleibt nur der Rand (die 1px padding) übrig. */}
        {glowColor && (
          <div
            className="absolute inset-0 rounded-theme pointer-events-none z-10"
            style={{
              opacity: hovering ? 1 : 0,
              padding: '1px',
              background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${glowColor} 0%, transparent 50%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              transition: 'opacity 0.3s ease',
            } as React.CSSProperties}
          />
        )}
      </motion.div>
    </div>
  );
}
