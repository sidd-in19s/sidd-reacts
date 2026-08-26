import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ArcadePixelButtonProps {
  label?: string;
  scoreText?: string;
  btnColor?: string;
  shadowColor?: string;
  className?: string;
  onClick?: () => void;
}

interface PixelDust {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const ArcadePixelButton: React.FC<ArcadePixelButtonProps> = ({
  label = 'START GAME',
  scoreText = '+100 PTS',
  btnColor = '#e11d48', // Arcade Crimson Red
  shadowColor = '#881337', // Dark Shadow
  className = '',
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [dustParticles, setDustParticles] = useState<PixelDust[]>([]);

  const handleClick = () => {
    setIsPressed(true);
    setShowScore(true);

    // Spawn 12 pixel dust bits
    const dust: PixelDust[] = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: -Math.random() * 60 - 10,
      color: i % 2 === 0 ? '#facc15' : '#fb7185',
    }));
    setDustParticles(dust);

    if (onClick) onClick();

    setTimeout(() => setIsPressed(false), 150);
    setTimeout(() => setShowScore(false), 900);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      {/* Floating Retro +100 PTS Popup */}
      <AnimatePresence>
        {showScore && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.2 }}
            exit={{ opacity: 0, y: -65 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-0 font-mono font-black text-sm text-yellow-300 pointer-events-none drop-shadow-[0_2px_0_#000000]"
            style={{ imageRendering: 'pixelated' }}
          >
            ★ {scoreText} ★
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel Dust Particles */}
      {dustParticles.map((d) => (
        <motion.div
          key={d.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: d.x, y: d.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-2 h-2 pointer-events-none"
          style={{ backgroundColor: d.color, imageRendering: 'pixelated' }}
        />
      ))}

      <button
        type="button"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
        className="relative font-mono font-black tracking-widest text-white text-xs sm:text-sm uppercase cursor-pointer transition-all duration-75 outline-none"
        style={{
          backgroundColor: btnColor,
          padding: '12px 28px',
          boxShadow: isPressed
            ? `0 0 0 4px #000000, 0 0 0 0 ${shadowColor}`
            : `0 0 0 4px #000000, 0 6px 0 0 ${shadowColor}, 0 10px 0 0 #000000`,
          transform: isPressed ? 'translateY(6px)' : 'translateY(0)',
          imageRendering: 'pixelated',
        }}
      >
        {/* Pixel Highlight Bar on Top */}
        <div className="absolute top-1 left-2 right-2 h-1 bg-white/40 pointer-events-none" />

        <div className="flex items-center gap-2">
          <span className="text-yellow-300">▶</span>
          <span>{label}</span>
        </div>
      </button>
    </div>
  );
};

export default ArcadePixelButton;
