import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface VhsRewindButtonProps {
  label?: string;
  timestamp?: string;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export const VhsRewindButton: React.FC<VhsRewindButtonProps> = ({
  label = 'REWIND TAPE ◄◄',
  timestamp = 'SP 0:24:18',
  accentColor = '#ef4444', // Rec Red
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const handleClick = () => {
    setIsRewinding(true);
    if (onClick) onClick();
    setTimeout(() => setIsRewinding(false), 800);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group overflow-hidden rounded-xl border border-zinc-700/80 bg-[#07090e] px-8 py-4 font-mono shadow-2xl transition-all cursor-pointer"
        style={{
          boxShadow: isHovered
            ? '0 0 25px rgba(239,68,68,0.25), inset 0 0 10px rgba(255,255,255,0.05)'
            : '0 8px 20px rgba(0,0,0,0.8)',
        }}
      >
        {/* Fast-Forward / Rewind Tape Warp Distortion Effect on Click */}
        {isRewinding && (
          <motion.div
            initial={{ scaleX: 1, filter: 'blur(0px)' }}
            animate={{
              scaleX: [1, 1.4, 0.8, 1],
              filter: ['blur(0px)', 'blur(4px)', 'blur(1px)', 'blur(0px)'],
            }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cyan-500/20 mix-blend-screen pointer-events-none"
          />
        )}

        {/* VHS Scanlines and Static Jitter */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Camcorder Interface Elements */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[10px] font-black tracking-widest text-red-400">
              REC ● PLAY
            </span>
          </div>

          <span className="text-xs sm:text-sm font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {label}
          </span>

          <span className="text-[9px] font-mono tracking-widest text-zinc-500 group-hover:text-cyan-300 transition-colors">
            {timestamp}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default VhsRewindButton;
