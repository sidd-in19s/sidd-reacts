import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface HolographicFoilButtonProps {
  label?: string;
  subtext?: string;
  baseColor?: string;
  className?: string;
  onClick?: () => void;
}

export const HolographicFoilButton: React.FC<HolographicFoilButtonProps> = ({
  label = 'CLAIM FOUNDER BADGE',
  subtext = 'EDITION #001 // RARE',
  baseColor = '#0f172a',
  className = '',
  onClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleClick = () => {
    setIsClicked(true);
    if (onClick) onClick();
    setTimeout(() => setIsClicked(false), 700);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 ${className}`}>
      <motion.button
        ref={buttonRef}
        type="button"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 50, y: 50 });
        }}
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="relative group overflow-hidden rounded-2xl p-[1.5px] font-sans transition-all duration-300 cursor-pointer select-none"
        style={{
          boxShadow: isHovered
            ? '0 12px 30px -5px rgba(236,72,153,0.3), 0 0 20px rgba(56,189,248,0.3)'
            : '0 8px 20px -5px rgba(0,0,0,0.6)',
        }}
      >
        {/* Dynamic Rainbow Holographic Foil Border */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: `conic-gradient(from ${mousePos.x * 3.6}deg at ${mousePos.x}% ${mousePos.y}%, #f43f5e, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #f43f5e)`,
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        {/* Core Button Face */}
        <div
          className="relative rounded-2xl px-8 py-4 flex flex-col items-center justify-center gap-1 transition-colors"
          style={{ backgroundColor: baseColor }}
        >
          {/* Internal Holographic Specular Glare Layer */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.7) 0%, rgba(236,72,153,0.4) 30%, rgba(56,189,248,0.3) 60%, transparent 80%)`,
              opacity: isHovered ? 0.9 : 0.2,
            }}
          />

          {/* Radial Light Beam Sweep on Click */}
          {isClicked && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 via-pink-400 to-amber-300 pointer-events-none mix-blend-screen"
            />
          )}

          {/* Metallic Typography */}
          <span className="relative z-10 text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-white via-pink-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-sm">
            {label}
          </span>
          <span className="relative z-10 text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-pink-300 transition-colors">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default HolographicFoilButton;
