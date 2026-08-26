import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface HudTargetReticleProps {
  reticleColor?: string;
  targetName?: string;
  reticleSize?: number;
  className?: string;
}

export const HudTargetReticle: React.FC<HudTargetReticleProps> = ({
  reticleColor = '#38bdf8', // Neon Cyan HUD
  targetName = 'HOSTILE_DRONE_ALPHA',
  reticleSize = 90,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    setCoords({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsLocked(true)}
      onMouseLeave={() => setIsLocked(false)}
      className={`relative w-full max-w-lg h-72 rounded-3xl border border-zinc-800 bg-[#06070e] overflow-hidden select-none cursor-crosshair flex items-center justify-center p-6 ${className}`}
    >
      {/* Background Target Radar Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-0 text-center space-y-1 pointer-events-none">
        <h4 className="text-lg font-black font-mono tracking-widest text-zinc-400">
          HUD RADAR SCANNER
        </h4>
        <p className="text-xs font-mono text-zinc-600">
          Move cursor across viewport to track telemetry
        </p>
      </div>

      {/* Kinetic Holographic Reticle Crosshair */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          width: reticleSize,
          height: reticleSize,
          translateX: -reticleSize / 2,
          translateY: -reticleSize / 2,
        }}
        className="absolute pointer-events-none z-20 flex items-center justify-center"
      >
        {/* Outer Rotating Segment Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: reticleColor }}
        />

        {/* Center Target Dot */}
        <div
          className="h-2 w-2 rounded-full animate-ping"
          style={{ backgroundColor: reticleColor }}
        />

        {/* Corner Brackets */}
        <div
          className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor: reticleColor }}
        />
        <div
          className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor: reticleColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor: reticleColor }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor: reticleColor }}
        />

        {/* Dynamic Telemetry Box */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border text-[9px] font-mono font-bold"
          style={{ color: reticleColor, borderColor: `${reticleColor}50` }}
        >
          {isLocked ? `LOCKED: [X:${coords.x} Y:${coords.y}]` : 'SEEKING...'}
        </div>
      </motion.div>
    </div>
  );
};

export default HudTargetReticle;
