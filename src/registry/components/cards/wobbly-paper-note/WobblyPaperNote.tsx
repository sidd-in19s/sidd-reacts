import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface WobblyPaperNoteProps {
  title?: string;
  content?: string;
  author?: string;
  paperColor?: string;
  pinColor?: string;
  tiltAngle?: number;
  wobbleIntensity?: number;
  className?: string;
}

export const WobblyPaperNote: React.FC<WobblyPaperNoteProps> = ({
  title = 'Design Notes & Ideas ✏️',
  content = 'Remember to add organic doodle aesthetics, textured drop-shadows, and imperfect hand-drawn pencil borders to the design system.',
  author = '@sidd_reacts',
  paperColor = '#fef08a', // Pale Yellow Sticky Note
  pinColor = '#ef4444', // Red pushpin
  tiltAngle = -3,
  wobbleIntensity = 1,
  className = '',
}) => {
  const [isWobbling, setIsWobbling] = useState(false);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, rotate: tiltAngle + 5, zIndex: 30 }}
      onHoverStart={() => setIsWobbling(true)}
      onHoverEnd={() => setIsWobbling(false)}
      animate={
        isWobbling
          ? {
              rotate: [tiltAngle, tiltAngle - 3 * wobbleIntensity, tiltAngle + 3 * wobbleIntensity, tiltAngle - 1, tiltAngle],
              transition: { duration: 0.5, ease: 'easeInOut' },
            }
          : { rotate: tiltAngle }
      }
      className={`relative w-72 sm:w-80 cursor-grab active:cursor-grabbing select-none p-6 shadow-[8px_12px_24px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[12px_20px_32px_rgba(0,0,0,0.45)] ${className}`}
      style={{
        backgroundColor: paperColor,
        clipPath: 'polygon(0% 0.5%, 3% 0%, 97% 0.8%, 100% 2%, 99.2% 98%, 97% 100%, 2% 99.4%, 0% 97%)',
      }}
    >
      {/* Pushpin / Tape graphic */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div
          className="h-4 w-4 rounded-full border-2 border-white/60 shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: pinColor }}
        />
        <div className="h-1.5 w-1 bg-zinc-800/40 -mt-0.5 rounded-full" />
      </div>

      {/* Lined notebook texture lines */}
      <div className="space-y-4 pt-3 font-sans text-zinc-900">
        <div className="border-b-2 border-dashed border-zinc-400/50 pb-2">
          <h3 className="font-mono text-base font-bold tracking-tight text-zinc-900">
            {title}
          </h3>
        </div>

        <p className="text-sm font-medium leading-relaxed text-zinc-800/90 font-serif italic">
          "{content}"
        </p>

        <div className="flex items-center justify-between pt-2 text-xs font-mono font-semibold text-zinc-600">
          <span>{author}</span>
          <span className="text-[10px] uppercase bg-black/10 px-2 py-0.5 rounded">Draggable</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WobblyPaperNote;
