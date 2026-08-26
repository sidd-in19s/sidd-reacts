import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface LaserSweepBoxProps {
  title?: string;
  description?: string;
  laserColor?: string;
  sweepDuration?: number;
  className?: string;
}

export const LaserSweepBox: React.FC<LaserSweepBoxProps> = ({
  title = 'QUANTUM SECURE VAULT',
  description = 'Continuous orbiting high-intensity laser perimeter with neon phosphor glow and specular corner flares.',
  laserColor = '#38bdf8', // Neon Cyan Laser
  sweepDuration = 4,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative flex items-center justify-center p-8 select-none ${className}`}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.03 }}
        className="relative w-80 rounded-2xl border border-zinc-800 bg-[#090a14] p-6 shadow-2xl overflow-hidden"
      >
        {/* Orbiting Laser Sweep Beam */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: sweepDuration,
            ease: 'linear',
          }}
          className="absolute -inset-[100%] z-0 pointer-events-none opacity-80"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 340deg, ${laserColor} 360deg)`,
          }}
        />

        {/* Inner Card Background Mask */}
        <div className="absolute inset-[2px] rounded-2xl bg-[#090a14] z-10" />

        {/* Content */}
        <div className="relative z-20 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${laserColor}20`,
                color: laserColor,
                border: `1px solid ${laserColor}40`,
              }}
            >
              LASER ARMORED
            </span>
            <span className="text-[10px] font-mono text-zinc-500">SYS_LVL 4</span>
          </div>

          <h3 className="text-lg font-black font-mono tracking-tight text-white">
            {title}
          </h3>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
            <span>PERIMETER: ACTIVE</span>
            <span style={{ color: laserColor }} className="font-bold">
              {isHovered ? 'ACCELERATED' : 'LOCKED'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LaserSweepBox;
