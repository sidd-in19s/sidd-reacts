import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface OrigamiFoldButtonProps {
  label?: string;
  subtext?: string;
  facetColorA?: string;
  facetColorB?: string;
  className?: string;
  onClick?: () => void;
}

export const OrigamiFoldButton: React.FC<OrigamiFoldButtonProps> = ({
  label = 'FOLD MATRIX',
  subtext = '3D POLYGON PRISM',
  facetColorA = '#6366f1', // Indigo
  facetColorB = '#8b5cf6', // Violet
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative inline-flex items-center justify-center p-8 select-none [perspective:800px] ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94, rotateX: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="relative group overflow-hidden rounded-xl border border-indigo-500/30 bg-[#090b14] px-9 py-4 text-white shadow-2xl transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: isHovered
            ? '0 15px 35px -5px rgba(99,102,241,0.4), inset 0 1px 2px rgba(255,255,255,0.4)'
            : '0 8px 20px rgba(0,0,0,0.6)',
        }}
      >
        {/* Animated Geometric 3D Origami Prism Facets */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 opacity-30 group-hover:opacity-60 transition-opacity">
          {/* Top-Left Facet */}
          <motion.div
            animate={{
              rotateX: isHovered ? 25 : 0,
              rotateY: isHovered ? -25 : 0,
            }}
            transition={{ duration: 0.35 }}
            className="border-r border-b border-white/10"
            style={{ backgroundColor: facetColorA }}
          />
          {/* Top-Right Facet */}
          <motion.div
            animate={{
              rotateX: isHovered ? 25 : 0,
              rotateY: isHovered ? 25 : 0,
            }}
            transition={{ duration: 0.35 }}
            className="border-b border-white/10"
            style={{ backgroundColor: facetColorB }}
          />
          {/* Bottom-Left Facet */}
          <motion.div
            animate={{
              rotateX: isHovered ? -25 : 0,
              rotateY: isHovered ? -25 : 0,
            }}
            transition={{ duration: 0.35 }}
            className="border-r border-white/10"
            style={{ backgroundColor: facetColorB }}
          />
          {/* Bottom-Right Facet */}
          <motion.div
            animate={{
              rotateX: isHovered ? -25 : 0,
              rotateY: isHovered ? 25 : 0,
            }}
            transition={{ duration: 0.35 }}
            className=""
            style={{ backgroundColor: facetColorA }}
          />
        </div>

        {/* Origami Fold Line Accents */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/20 pointer-events-none" />

        {/* Text Container */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-xs sm:text-sm font-mono font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-indigo-300 uppercase">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default OrigamiFoldButton;
