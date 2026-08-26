import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface MarkerHighlightTextProps {
  prefixText?: string;
  highlightText?: string;
  suffixText?: string;
  highlightColor?: string;
  strokeHeight?: number;
  triggerMode?: 'hover' | 'always';
  className?: string;
}

export const MarkerHighlightText: React.FC<MarkerHighlightTextProps> = ({
  prefixText = 'Build interfaces that feel',
  highlightText = 'alive and truly organic',
  suffixText = 'with kinetic micro-animations.',
  highlightColor = '#facc15', // Vibrant Marker Yellow
  strokeHeight = 18,
  triggerMode = 'hover',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(triggerMode === 'always');

  return (
    <div
      onMouseEnter={() => triggerMode === 'hover' && setIsHovered(true)}
      onMouseLeave={() => triggerMode === 'hover' && setIsHovered(false)}
      className={`relative inline-flex flex-wrap items-center justify-center gap-x-2 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-white cursor-pointer select-none p-4 ${className}`}
    >
      <span>{prefixText}</span>

      {/* Highlighted Word Container */}
      <span className="relative inline-block px-1">
        <span className="relative z-10 text-zinc-950 font-black tracking-tight">
          {highlightText}
        </span>

        {/* Animated Hand-Drawn Marker SVG Streak */}
        <motion.svg
          className="absolute left-0 bottom-0.5 -z-0 w-full overflow-visible"
          style={{ height: `${strokeHeight}px` }}
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          initial={false}
          animate={{
            clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Organic double marker stroke */}
          <path
            d="M 0,10 Q 25,4 50,11 T 100,8 L 99,19 Q 75,14 48,18 T 0,15 Z"
            fill={highlightColor}
            opacity="0.92"
          />
          <path
            d="M 2,6 Q 30,12 60,7 T 98,11"
            stroke={highlightColor}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </motion.svg>
      </span>

      <span>{suffixText}</span>
    </div>
  );
};

export default MarkerHighlightText;
