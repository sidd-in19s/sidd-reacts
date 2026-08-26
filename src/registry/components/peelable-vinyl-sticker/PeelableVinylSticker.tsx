import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface PeelableVinylStickerProps {
  title?: string;
  subtitle?: string;
  badgeColor?: string;
  peelAmount?: number;
  className?: string;
}

export const PeelableVinylSticker: React.FC<PeelableVinylStickerProps> = ({
  title = 'SIDD-REACTS',
  subtitle = 'KINETIC VINYL • 100% WATERPROOF',
  badgeColor = '#6366f1',
  peelAmount = 60,
  className = '',
}) => {
  const [isPeeling, setIsPeeling] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [15, -15]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { stiffness: 200, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPeeling(false);
  };

  return (
    <div className={`relative flex items-center justify-center p-8 select-none ${className}`}>
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPeeling(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, perspective: 800 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        className="relative h-44 w-72 rounded-2xl cursor-pointer overflow-hidden border-2 border-white/20 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        {/* Vinyl Base */}
        <div
          className="absolute inset-0 transition-colors"
          style={{
            background: `linear-gradient(135deg, ${badgeColor} 0%, #1e1b4b 100%)`,
          }}
        />

        {/* Glossy Reflective Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* 3D Peeled Corner Effect */}
        <motion.div
          animate={{
            clipPath: isPeeling
              ? 'polygon(0% 0%, 100% 0%, 100% 60%, 75% 100%, 0% 100%)'
              : 'polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col justify-between p-5 z-10"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md">
              AUTHENTIC
            </span>
            <span className="text-xs font-mono font-bold text-white/70">PRO v2.4</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              {title}
            </h3>
            <p className="text-[10px] font-mono tracking-widest text-zinc-300">
              {subtitle}
            </p>
          </div>
        </motion.div>

        {/* Backside Metallic Peel Curl Foil */}
        <motion.div
          initial={false}
          animate={{
            opacity: isPeeling ? 1 : 0,
            scale: isPeeling ? 1 : 0.8,
          }}
          className="absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 shadow-[-4px_-4px_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{
            clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default PeelableVinylSticker;
