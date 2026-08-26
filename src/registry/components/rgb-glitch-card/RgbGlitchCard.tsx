import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface RgbGlitchCardProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  glitchColorA?: string;
  glitchColorB?: string;
  className?: string;
}

export const RgbGlitchCard: React.FC<RgbGlitchCardProps> = ({
  title = 'CYBERNETIC DISPLACEMENT',
  subtitle = 'Hover cursor over surface to initiate multi-band chromatic RGB split and digital frame slice matrix.',
  tag = 'RGB GLITCH FX',
  glitchColorA = '#06b6d4', // Cyan
  glitchColorB = '#ec4899', // Magenta
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative flex items-center justify-center p-6 select-none ${className}`}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.03 }}
        className="relative w-80 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl cursor-pointer overflow-hidden group"
      >
        {/* RGB Split Ghost Layers (Active on hover) */}
        {isHovered && (
          <>
            <div
              className="absolute inset-0 p-6 pointer-events-none mix-blend-screen opacity-70 transform -translate-x-1.5 translate-y-0.5 animate-pulse"
              style={{ color: glitchColorA }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                <span>{tag}</span>
                <span>011010</span>
              </div>
              <h3 className="text-xl font-black font-mono tracking-wider">{title}</h3>
              <p className="mt-3 text-xs font-mono leading-relaxed opacity-80">{subtitle}</p>
            </div>

            <div
              className="absolute inset-0 p-6 pointer-events-none mix-blend-screen opacity-70 transform translate-x-1.5 -translate-y-0.5 animate-pulse"
              style={{ color: glitchColorB }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                <span>{tag}</span>
                <span>100101</span>
              </div>
              <h3 className="text-xl font-black font-mono tracking-wider">{title}</h3>
              <p className="mt-3 text-xs font-mono leading-relaxed opacity-80">{subtitle}</p>
            </div>
          </>
        )}

        {/* Main Content Layer */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              {tag}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">SYS_CORRUPT: 0x8F</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black font-mono tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              {title}
            </h3>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
            <span>CH_01: RED / GREEN / BLUE</span>
            <span className="text-pink-400 font-bold">{isHovered ? 'GLITCHING' : 'IDLE'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RgbGlitchCard;
