import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TypewriterKeyButtonProps {
  char?: string;
  sublabel?: string;
  keyColor?: string;
  rimColor?: string;
  className?: string;
  onClick?: () => void;
}

export const TypewriterKeyButton: React.FC<TypewriterKeyButtonProps> = ({
  char = 'Q',
  sublabel = 'TYPEWRITER KEY',
  keyColor = '#fefce8', // Aged Vintage Ivory
  rimColor = '#94a3b8', // Polished Chrome
  className = '',
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [strikeActive, setStrikeActive] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setStrikeActive(true);
    if (onClick) onClick();

    setTimeout(() => setIsPressed(false), 140);
    setTimeout(() => setStrikeActive(false), 400);
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-6 select-none ${className}`}>
      {/* Mechanical Strike Bar Accent behind key */}
      {strikeActive && (
        <motion.div
          initial={{ y: -30, opacity: 0.8, scaleY: 1.5 }}
          animate={{ y: 0, opacity: 0, scaleY: 0.8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute -top-6 w-1.5 h-10 bg-zinc-400 rounded-full pointer-events-none shadow-md"
        />
      )}

      {/* Mechanical Key Housing Socket */}
      <div className="relative rounded-full p-2 bg-[#12131a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.9),0_6px_12px_rgba(0,0,0,0.8)] border border-zinc-800">
        {/* Physical Mechanical Key Top */}
        <motion.button
          type="button"
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onClick={handleClick}
          animate={{
            y: isPressed ? 6 : 0,
            scale: isPressed ? 0.96 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="relative w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all"
          style={{
            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${rimColor} 50%, #334155 100%)`,
            boxShadow: isPressed
              ? '0 2px 4px rgba(0,0,0,0.8)'
              : '0 8px 16px rgba(0,0,0,0.9), inset 0 2px 3px rgba(255,255,255,0.8)',
          }}
        >
          {/* Inner Ivory Glass Disk */}
          <div
            className="w-15 h-15 rounded-full flex flex-col items-center justify-center border border-zinc-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
            style={{ backgroundColor: keyColor }}
          >
            {/* Key Character */}
            <span className="font-serif font-black text-2xl text-zinc-900 tracking-tighter leading-none">
              {char}
            </span>
          </div>
        </motion.button>
      </div>

      <span className="mt-3 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
        {sublabel}
      </span>
    </div>
  );
};

export default TypewriterKeyButton;
