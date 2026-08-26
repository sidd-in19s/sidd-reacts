import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ScrapbookPolaroidProps {
  title?: string;
  caption?: string;
  tapeColor?: string;
  tiltAngle?: number;
  imageUrl?: string;
  className?: string;
}

export const ScrapbookPolaroid: React.FC<ScrapbookPolaroidProps> = ({
  title = 'Neon Horizons 🌆',
  caption = 'Shot on 35mm film • Kyoto 2026',
  tapeColor = 'rgba(251, 191, 36, 0.65)', // Semi-transparent yellow washi tape
  tiltAngle = 4,
  imageUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotate: isHovered ? 0 : tiltAngle,
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -6 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative w-72 rounded-sm bg-white p-3.5 pb-5 shadow-2xl transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] cursor-pointer select-none ${className}`}
    >
      {/* Top Washi Tape (Animated Peel up on hover) */}
      <motion.div
        animate={{
          rotate: isHovered ? -8 : -3,
          y: isHovered ? -4 : 0,
          scaleX: isHovered ? 1.05 : 1,
        }}
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 z-20 backdrop-blur-[2px] shadow-sm"
        style={{
          backgroundColor: tapeColor,
          clipPath: 'polygon(0% 15%, 4% 0%, 96% 5%, 100% 20%, 98% 85%, 94% 100%, 5% 95%, 0% 80%)',
          borderTop: '1px solid rgba(255,255,255,0.4)',
        }}
      />

      {/* Photo Frame */}
      <div className="relative h-60 w-full overflow-hidden bg-zinc-900 rounded-sm">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          onError={(e) => {
            // Procedural gradient fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Handwritten Caption */}
      <div className="pt-3 px-1 text-center space-y-0.5 font-mono">
        <h4 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h4>
        <p className="text-[11px] text-zinc-500 font-serif italic">{caption}</p>
      </div>
    </motion.div>
  );
};

export default ScrapbookPolaroid;
