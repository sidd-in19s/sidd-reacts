import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface MarkerHighlightTextProps {
  prefixText?: string;
  highlightText?: string;
  suffixText?: string;
  highlightColor?: string;
  triggerMode?: 'hover' | 'always';
  className?: string;
}

export const MarkerHighlightText: React.FC<MarkerHighlightTextProps> = ({
  prefixText = 'Build interfaces that feel',
  highlightText = 'alive and truly organic',
  suffixText = 'with kinetic animations.',
  highlightColor = '#facc15', // Vibrant Highlighter Yellow
  triggerMode = 'hover',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(triggerMode === 'always');

  return (
    <div
      onMouseEnter={() => triggerMode === 'hover' && setIsHovered(true)}
      onMouseLeave={() => triggerMode === 'hover' && setIsHovered(false)}
      className={`relative inline-flex flex-wrap items-center justify-center gap-x-2 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-white cursor-pointer select-none p-6 ${className}`}
    >
      <span>{prefixText}</span>

      {/* Target Highlight Word Container */}
      <span className="relative inline-block px-2 py-0.5">
        {/* Animated Hand-Drawn Thick Marker Swath */}
        <motion.div
          initial={false}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -inset-x-1.5 -inset-y-1 -z-0 origin-left rounded-md shadow-md"
          style={{
            backgroundColor: highlightColor,
            transform: 'skewX(-4deg) rotate(-0.5deg)',
            boxShadow: `0 0 20px ${highlightColor}60`,
          }}
        >
          {/* Organic rough marker streak SVG texture */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply"
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,15 Q 25,5 50,18 T 100,12 L 98,28 Q 70,22 45,26 T 2,24 Z"
              fill={highlightColor}
            />
          </svg>
        </motion.div>

        {/* Text with dynamic high-contrast color transition */}
        <motion.span
          animate={{
            color: isHovered ? '#090a0f' : '#ffffff',
          }}
          transition={{ duration: 0.2 }}
          className="relative z-10 font-black tracking-tight"
        >
          {highlightText}
        </motion.span>
      </span>

      <span>{suffixText}</span>
    </div>
  );
};

export default MarkerHighlightText;
