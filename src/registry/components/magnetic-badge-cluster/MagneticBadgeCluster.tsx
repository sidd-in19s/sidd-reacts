import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface MagneticBadgeClusterProps {
  centerLabel?: string;
  clusterRadius?: number;
  className?: string;
}

const BADGES = [
  { id: '1', text: '⚡ FAST', color: '#6366f1', baseX: -60, baseY: -50 },
  { id: '2', text: '💎 60 FPS', color: '#ec4899', baseX: 65, baseY: -45 },
  { id: '3', text: '🛡️ TYPE-SAFE', color: '#10b981', baseX: -70, baseY: 40 },
  { id: '4', text: '🔥 KINETIC', color: '#f59e0b', baseX: 60, baseY: 45 },
  { id: '5', text: '🚀 PRO v2.4', color: '#38bdf8', baseX: 0, baseY: -75 },
];

export const MagneticBadgeCluster: React.FC<MagneticBadgeClusterProps> = ({
  centerLabel = 'SIDD-REACTS',
  clusterRadius = 120,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex h-72 w-80 items-center justify-center p-8 select-none ${className}`}
    >
      {/* Central Core Emblem */}
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        className="relative z-20 h-24 w-24 rounded-full border border-indigo-500/40 bg-indigo-950/80 p-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-xl flex items-center justify-center text-center"
      >
        <span className="font-mono text-xs font-black tracking-tighter text-white">
          {centerLabel}
        </span>
      </motion.div>

      {/* Dispersing / Magnetic Orbital Badges */}
      {BADGES.map((b) => {
        const scatterMultiplier = isHovered ? 1.6 : 1;
        return (
          <motion.div
            key={b.id}
            animate={{
              x: b.baseX * scatterMultiplier,
              y: b.baseY * scatterMultiplier,
              rotate: isHovered ? [0, 8, -8, 0] : 0,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="absolute z-10 px-3 py-1 rounded-full border border-white/20 text-xs font-mono font-bold text-white shadow-xl backdrop-blur-md cursor-pointer hover:scale-115 transition-transform"
            style={{
              backgroundColor: `${b.color}25`,
              borderColor: b.color,
              boxShadow: `0 0 15px ${b.color}40`,
            }}
          >
            {b.text}
          </motion.div>
        );
      })}
    </div>
  );
};

export default MagneticBadgeCluster;
