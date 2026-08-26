import React from 'react';
import { motion } from 'framer-motion';

export interface DoodleFloatingStickersProps {
  glowColor?: string;
  className?: string;
}

const STICKERS = [
  { id: 'star', text: '★ WOW!', color: '#fbbf24', rotate: -12, x: -90, y: -40, type: 'star' },
  { id: 'smile', text: '◕‿◕ YAY', color: '#38bdf8', rotate: 15, x: 80, y: -50, type: 'smile' },
  { id: 'heart', text: '♥ COOL', color: '#ec4899', rotate: -8, x: -70, y: 50, type: 'heart' },
  { id: 'badge', text: '⚡ FAST', color: '#a855f7', rotate: 10, x: 90, y: 45, type: 'badge' },
];

export const DoodleFloatingStickers: React.FC<DoodleFloatingStickersProps> = ({
  glowColor = '#6366f1',
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-md h-72 rounded-3xl border border-zinc-800 bg-zinc-950/80 flex items-center justify-center p-6 select-none overflow-hidden ${className}`}>
      {/* Central Canvas Board Area */}
      <div className="text-center space-y-1 z-0 pointer-events-none">
        <h4 className="text-xl font-extrabold text-white font-mono">Doodle Sticker Board</h4>
        <p className="text-xs text-zinc-400">Drag, toss, and recoil physics stickers</p>
      </div>

      {/* Physics Draggable Doodle Stickers */}
      {STICKERS.map((sticker) => (
        <motion.div
          key={sticker.id}
          drag
          dragConstraints={{ left: -140, right: 140, top: -90, bottom: 90 }}
          dragElastic={0.25}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
          whileHover={{ scale: 1.15, rotate: sticker.rotate * 1.3, zIndex: 40 }}
          whileDrag={{ scale: 1.25, zIndex: 50, cursor: 'grabbing' }}
          initial={{ x: sticker.x, y: sticker.y, rotate: sticker.rotate }}
          className="absolute cursor-grab px-3.5 py-2 rounded-2xl shadow-2xl border-2 border-black/80 flex items-center gap-1.5 backdrop-blur-md transition-shadow"
          style={{
            backgroundColor: sticker.color,
            boxShadow: `4px 6px 0px rgba(0,0,0,0.8), 0 0 20px ${sticker.color}30`,
          }}
        >
          <span className="text-xs font-black text-black font-mono tracking-tight">
            {sticker.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default DoodleFloatingStickers;
