import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface SoundwaveEqButtonProps {
  label?: string;
  subtext?: string;
  waveColor?: string;
  className?: string;
  onClick?: () => void;
}

export const SoundwaveEqButton: React.FC<SoundwaveEqButtonProps> = ({
  label = 'PLAY SOUNDTRACK',
  subtext = 'FREQUENCY SPECTRUM 48kHz',
  waveColor = '#38bdf8', // Sound Cyan
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAcousticRipple, setIsAcousticRipple] = useState(false);

  const handleClick = () => {
    setIsAcousticRipple(true);
    if (onClick) onClick();
    setTimeout(() => setIsAcousticRipple(false), 700);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      {/* Acoustic Ring Ripple on Click */}
      {isAcousticRipple && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
        />
      )}

      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative group overflow-hidden rounded-full border border-zinc-800 bg-[#090b14] px-8 py-3.5 shadow-2xl transition-all cursor-pointer"
        style={{
          boxShadow: isHovered
            ? `0 0 25px ${waveColor}35, inset 0 0 15px ${waveColor}15`
            : '0 8px 20px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Animated Dancing Equalizer Bars */}
          <div className="flex items-center gap-1 h-5">
            {[0.4, 0.9, 0.6, 1.0, 0.7, 0.3].map((height, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: isHovered
                    ? [0.2, 1, 0.4, 0.9, 0.3]
                    : [height, height * 0.5, height],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isHovered ? 0.4 + i * 0.1 : 1.2 + i * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-1 rounded-full origin-bottom"
                style={{
                  height: '100%',
                  backgroundColor: waveColor,
                  boxShadow: `0 0 6px ${waveColor}`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-white">
              {label}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              {subtext}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default SoundwaveEqButton;
