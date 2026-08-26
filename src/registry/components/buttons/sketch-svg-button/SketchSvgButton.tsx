import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface SketchSvgButtonProps {
  label?: string;
  sublabel?: string;
  strokeColor?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export const SketchSvgButton: React.FC<SketchSvgButtonProps> = ({
  label = 'Sketch Project Idea',
  sublabel = 'Click to scribble & trigger',
  strokeColor = '#38bdf8', // Neon Cyan pencil
  bgColor = '#090a14',
  textColor = '#ffffff',
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);
    onClick?.();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{
          scale: isClicked ? 0.94 : isHovered ? 1.04 : 1,
          rotate: isHovered ? [-0.5, 0.5, -0.5] : 0,
        }}
        transition={{ duration: 0.2 }}
        className="relative group px-8 py-4 rounded-xl cursor-pointer select-none focus:outline-none"
        style={{ backgroundColor: bgColor }}
      >
        {/* Animated Sketchy SVG Outer Paths */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
        >
          {/* Sketch Layer 1 */}
          <motion.rect
            x="2"
            y="2"
            width="196"
            height="56"
            rx="12"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeDasharray="400"
            animate={{
              strokeDashoffset: isHovered ? [400, 0] : 0,
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Sketch Layer 2 (Imperfect rough overlapping pencil trace) */}
          <motion.path
            d="M 6,56 Q 50,58 100,55 T 194,57 Q 198,30 196,6 Q 140,4 98,7 T 4,5 Q 1,30 6,56 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeDasharray="12 4"
            opacity={isHovered ? 0.85 : 0.3}
            animate={isHovered ? { strokeDashoffset: [0, -32] } : { strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          />
        </svg>

        {/* Button Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
          <span
            className="text-base font-extrabold tracking-wide font-mono transition-colors"
            style={{ color: textColor }}
          >
            {label}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {sublabel}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default SketchSvgButton;
