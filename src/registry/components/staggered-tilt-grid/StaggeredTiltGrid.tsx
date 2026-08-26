import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface StaggeredTiltGridProps {
  cardCount?: number;
  hoverGlowColor?: string;
  className?: string;
}

const GRID_ITEMS = [
  { id: 1, title: 'Quantum Shader', tag: 'CANVAS', color: '#6366f1' },
  { id: 2, title: 'Kinetic Spring', tag: 'FRAMER', color: '#ec4899' },
  { id: 3, title: 'Vortex Gravity', tag: 'PHYSICS', color: '#38bdf8' },
  { id: 4, title: 'Aurora Mesh', tag: 'WEBGL', color: '#10b981' },
];

export const StaggeredTiltGrid: React.FC<StaggeredTiltGridProps> = ({
  cardCount = 4,
  hoverGlowColor = '#6366f1',
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`relative flex items-center justify-center p-6 select-none ${className}`}>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {GRID_ITEMS.slice(0, cardCount).map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isNeighbor = hoveredIdx !== null && hoveredIdx !== idx;

          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{
                scale: isHovered ? 1.08 : isNeighbor ? 0.95 : 1,
                rotateZ: isHovered ? 2 : isNeighbor ? (idx % 2 === 0 ? -3 : 3) : 0,
                y: isHovered ? -6 : 0,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative h-36 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between"
              style={{
                borderColor: isHovered ? item.color : 'rgba(39, 39, 42, 0.8)',
                boxShadow: isHovered ? `0 12px 30px ${item.color}35` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  {item.tag}
                </span>
                <span className="text-xs font-mono text-zinc-500">#{item.id}</span>
              </div>

              <div>
                <h4 className="text-sm font-black font-mono tracking-tight text-white">
                  {item.title}
                </h4>
                <p className="text-[10px] font-mono text-zinc-500">Proximity Stagger</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StaggeredTiltGrid;
