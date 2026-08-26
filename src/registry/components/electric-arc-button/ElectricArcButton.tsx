import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ElectricArcButtonProps {
  label?: string;
  subtext?: string;
  voltageColor?: string;
  className?: string;
  onClick?: () => void;
}

export const ElectricArcButton: React.FC<ElectricArcButtonProps> = ({
  label = 'HIGH VOLTAGE ENGAGE',
  subtext = '240,000 VOLTS ACTIVE',
  voltageColor = '#38bdf8', // Electric Cyan
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSparking, setIsSparking] = useState(false);

  const handleClick = () => {
    setIsSparking(true);
    if (onClick) onClick();
    setTimeout(() => setIsSparking(false), 500);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      {/* Outer Glow Aura */}
      <div
        className="absolute inset-2 rounded-2xl filter blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: voltageColor,
          opacity: isHovered ? 0.35 : 0.1,
        }}
      />

      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="relative group overflow-hidden rounded-xl border border-zinc-800/80 bg-[#080b12]/90 backdrop-blur-xl px-8 py-4 font-mono transition-all duration-200 cursor-pointer"
        style={{
          boxShadow: isHovered
            ? `0 0 20px ${voltageColor}40, inset 0 0 15px ${voltageColor}20`
            : '0 8px 25px rgba(0,0,0,0.8)',
        }}
      >
        {/* Continuous Racing Laser Arc Border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="12"
            fill="none"
            stroke={voltageColor}
            strokeWidth={isHovered ? 2.5 : 1.5}
            strokeDasharray="40 180"
            className="transition-all"
            style={{
              filter: `drop-shadow(0 0 6px ${voltageColor})`,
              animation: isHovered
                ? 'dash 1.2s linear infinite'
                : 'dash 2.5s linear infinite',
            }}
          />
        </svg>

        {/* Spark Crackle Particles on Click / Hover */}
        {isSparking && (
          <motion.div
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-xl bg-white/20 pointer-events-none mix-blend-screen"
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: voltageColor }}
            />
            <span className="text-xs sm:text-sm font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {label}
            </span>
          </div>

          <span
            className="text-[9px] font-mono tracking-widest uppercase transition-colors"
            style={{ color: voltageColor }}
          >
            {subtext}
          </span>
        </div>
      </motion.button>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -220;
          }
        }
      `}</style>
    </div>
  );
};

export default ElectricArcButton;
