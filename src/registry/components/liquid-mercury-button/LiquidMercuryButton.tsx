import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export interface LiquidMercuryButtonProps {
  label?: string;
  metalTint?: string;
  className?: string;
  onClick?: () => void;
}

export const LiquidMercuryButton: React.FC<LiquidMercuryButtonProps> = ({
  label = 'LIQUID MERCURY',
  metalTint = '#e2e8f0', // Silver Chrome
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropletActive, setDropletActive] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x * 0.3);
    mouseY.set(y * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    setDropletActive(true);
    if (onClick) onClick();
    setTimeout(() => setDropletActive(false), 600);
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center p-8 cursor-pointer select-none ${className}`}
    >
      {/* SVG Gooey Filter definition */}
      <svg className="hidden">
        <defs>
          <filter id="mercury-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Fluid Gooey Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ filter: 'url(#mercury-goo)' }}
      >
        {/* Main Liquid Metal Pill Body */}
        <motion.div
          style={{ x: springX, y: springY }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-full px-8 py-3.5 shadow-2xl flex items-center justify-center"
        >
          {/* Chrome Specular Surface Gradient */}
          <div
            className="absolute inset-0 rounded-full border border-white/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.6)]"
            style={{
              background: `linear-gradient(135deg, ${metalTint} 0%, #94a3b8 50%, #475569 100%)`,
            }}
          />

          {/* Liquid Gloss Sheen Highlight */}
          <div className="absolute top-1 left-3 right-3 h-2 rounded-full bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none" />

          <span className="relative z-10 font-mono font-black text-xs tracking-wider text-slate-900 drop-shadow-sm">
            {label}
          </span>
        </motion.div>

        {/* Orbiting / Merging Liquid Droplet on Click */}
        {dropletActive && (
          <motion.div
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              x: [0, 45, 0],
              y: [0, -35, 0],
            }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute w-6 h-6 rounded-full shadow-lg"
            style={{
              background: `radial-gradient(circle, #ffffff 10%, ${metalTint} 70%, #475569 100%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LiquidMercuryButton;
