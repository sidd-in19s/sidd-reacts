import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface WaxSealButtonProps {
  monogram?: string;
  sealColor?: string;
  goldColor?: string;
  className?: string;
  onClick?: () => void;
}

export const WaxSealButton: React.FC<WaxSealButtonProps> = ({
  monogram = 'SR',
  sealColor = '#991b1b', // Deep Crimson Wax
  goldColor = '#fbbf24', // Gold Leaf
  className = '',
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    if (onClick) onClick();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-6 select-none ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{
          scale: isPressed ? 0.92 : isHovered ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative w-22 h-22 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
        style={{
          backgroundColor: sealColor,
          boxShadow: isPressed
            ? '0 2px 8px rgba(0,0,0,0.8), inset 0 6px 12px rgba(0,0,0,0.7)'
            : '0 12px 28px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.4)',
        }}
      >
        {/* Irregular Organic Wax Edge Ring */}
        <div
          className="absolute inset-0 rounded-full border-4 opacity-90 transition-all"
          style={{
            borderColor: goldColor,
            clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 75% 100%, 25% 95%, 0% 65%, 15% 20%)',
          }}
        />

        {/* Embossed Inner Monogram Crest */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span
            className="font-serif font-black text-2xl tracking-widest leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{ color: goldColor }}
          >
            {monogram}
          </span>
          <span className="text-[7px] font-mono tracking-widest text-amber-200 mt-1 uppercase">
            SEALED
          </span>
        </div>

        {/* Candlelight Specular Glimmer */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2], rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)',
            }}
          />
        )}
      </motion.button>

      <span className="mt-3 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
        AUTHENTIC WAX SEAL
      </span>
    </div>
  );
};

export default WaxSealButton;
