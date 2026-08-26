import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CyberShatterButtonProps {
  label?: string;
  subtext?: string;
  cyanColor?: string;
  magentaColor?: string;
  className?: string;
  onClick?: () => void;
}

interface Shard {
  id: number;
  x: number;
  y: number;
  rot: number;
  size: number;
  color: string;
}

export const CyberShatterButton: React.FC<CyberShatterButtonProps> = ({
  label = 'SYSTEM OVERRIDE',
  subtext = 'SECURITY LEVEL: 05',
  cyanColor = '#06b6d4',
  magentaColor = '#ec4899',
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [shards, setShards] = useState<Shard[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTriggerShatter = () => {
    if (isShattered) return;
    setIsShattered(true);

    // Generate random geometric explosive shards
    const newShards: Shard[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 140,
      rot: (Math.random() - 0.5) * 360,
      size: Math.floor(Math.random() * 14) + 6,
      color: i % 2 === 0 ? cyanColor : magentaColor,
    }));
    setShards(newShards);

    if (onClick) onClick();

    // Snap back together with CRT recovery
    setTimeout(() => {
      setIsShattered(false);
      setShards([]);
    }, 650);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 ${className}`}>
      {/* Explosive Glass Shards on Shatter */}
      <AnimatePresence>
        {isShattered && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {shards.map((s) => (
              <motion.div
                key={s.id}
                initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                animate={{
                  x: s.x,
                  y: s.y,
                  scale: [1, 1.2, 0],
                  rotate: s.rot,
                  opacity: [1, 0.9, 0],
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute shadow-lg"
                style={{
                  width: `${s.size}px`,
                  height: `${s.size * 0.7}px`,
                  backgroundColor: s.color,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 80%)',
                  boxShadow: `0 0 12px ${s.color}`,
                }}
              />
            ))}
            {/* CRT Flash Overlay */}
            <motion.div
              initial={{ opacity: 0.9, scale: 1.1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-xl bg-white mix-blend-screen pointer-events-none"
            />
          </div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTriggerShatter}
        animate={
          isShattered
            ? { scale: [1, 0.92, 1], filter: 'blur(2px) contrast(200%)' }
            : { scale: 1, filter: 'none' }
        }
        transition={{ duration: 0.2 }}
        className="relative group overflow-hidden rounded-xl border border-zinc-700/80 bg-[#090b14] px-8 py-4 font-mono font-bold tracking-widest text-white shadow-2xl transition-all duration-200 cursor-pointer select-none"
        style={{
          boxShadow: isHovered
            ? `0 0 25px ${cyanColor}40, inset 0 0 15px ${magentaColor}30`
            : '0 10px 25px rgba(0,0,0,0.8)',
        }}
      >
        {/* Animated Cyber Glitch Scanline Jitter */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent mix-blend-screen"
          />
        )}

        {/* Neon Dual-Tone Glowing Angle Borders */}
        <div
          className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 transition-all duration-300"
          style={{ borderColor: cyanColor }}
        />
        <div
          className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 transition-all duration-300"
          style={{ borderColor: magentaColor }}
        />
        <div
          className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 transition-all duration-300"
          style={{ borderColor: magentaColor }}
        />
        <div
          className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 transition-all duration-300"
          style={{ borderColor: cyanColor }}
        />

        {/* Glitch Slicing RGB Chromatic Split Labels */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="relative">
            {/* Red/Magenta Channel Offset */}
            {isHovered && (
              <span
                className="absolute inset-0 font-black text-xs sm:text-sm tracking-widest select-none pointer-events-none opacity-80"
                style={{
                  color: magentaColor,
                  transform: 'translate(-2px, 1px)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                }}
              >
                {label}
              </span>
            )}
            {/* Cyan Channel Offset */}
            {isHovered && (
              <span
                className="absolute inset-0 font-black text-xs sm:text-sm tracking-widest select-none pointer-events-none opacity-80"
                style={{
                  color: cyanColor,
                  transform: 'translate(2px, -1px)',
                  clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                }}
              >
                {label}
              </span>
            )}
            <span className="relative z-10 text-xs sm:text-sm font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              {label}
            </span>
          </div>

          <span className="text-[9px] tracking-widest font-mono text-zinc-400 group-hover:text-cyan-300 transition-colors">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default CyberShatterButton;
