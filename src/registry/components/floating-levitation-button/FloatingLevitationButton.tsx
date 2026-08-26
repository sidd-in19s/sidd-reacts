import React, { useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export interface FloatingLevitationButtonProps {
  label?: string;
  subtext?: string;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

export const FloatingLevitationButton: React.FC<FloatingLevitationButtonProps> = ({
  label = 'MAGNETIC LEVITATION',
  subtext = 'ZERO-GRAVITY FIELD',
  glowColor = '#6366f1',
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / 10;
    const y = -(e.clientY - (rect.top + rect.height / 2)) / 10;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center justify-center p-8 select-none [perspective:1000px] ${className}`}
    >
      {/* Floating Magnetic Shadow underneath */}
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.15, 1] : [1, 0.85, 1],
          opacity: isHovered ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-4 w-36 h-4 rounded-full filter blur-md pointer-events-none"
        style={{
          backgroundColor: glowColor,
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Levitation Floating Pill Button */}
      <motion.button
        type="button"
        onClick={onClick}
        animate={{
          y: isHovered ? -12 : [-4, 4, -4],
        }}
        transition={
          isHovered
            ? { duration: 0.2 }
            : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        }
        style={{ rotateX, rotateY }}
        whileTap={{ scale: 0.94, y: 4 }}
        className="relative group overflow-hidden rounded-full border border-indigo-500/30 bg-[#090b14]/90 backdrop-blur-xl px-8 py-4 shadow-2xl transition-all cursor-pointer"
      >
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-indigo-300">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingLevitationButton;
