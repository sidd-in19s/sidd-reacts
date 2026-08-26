import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface AuroraGradientButtonProps {
  label?: string;
  subtext?: string;
  className?: string;
  onClick?: () => void;
}

export const AuroraGradientButton: React.FC<AuroraGradientButtonProps> = ({
  label = 'NORTHERN LIGHTS',
  subtext = 'AURORA MESH GRADIENT',
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      {/* Outer Ambient Aurora Glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-40 blur-xl transition-opacity duration-300 pointer-events-none" />

      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative group overflow-hidden rounded-full border border-white/20 bg-black/40 backdrop-blur-2xl px-8 py-4 font-sans shadow-2xl transition-all cursor-pointer"
      >
        {/* Animated Flowing Multi-Stop Aurora Mesh Background */}
        <motion.div
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '20%', '-20%'],
            rotate: [0, 180, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: 'linear',
          }}
          className="absolute -inset-[100%] pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #10b981 0%, transparent 40%), radial-gradient(circle at 70% 60%, #6366f1 0%, transparent 45%), radial-gradient(circle at 50% 80%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Glass Glare Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />

        {/* Text Container */}
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span className="text-xs sm:text-sm font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-emerald-300">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default AuroraGradientButton;
