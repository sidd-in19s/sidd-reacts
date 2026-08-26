import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export interface ElasticSpringModalProps {
  buttonText?: string;
  modalTitle?: string;
  modalDescription?: string;
  accentColor?: string;
  className?: string;
}

export const ElasticSpringModal: React.FC<ElasticSpringModalProps> = ({
  buttonText = 'Open Elastic Modal',
  modalTitle = 'Kinetic Sheet Modal ✨',
  modalDescription = 'Engineered with high-tension Framer Motion physics, drag-to-dismiss momentum, and spring recoil.',
  accentColor = '#6366f1',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex items-center justify-center p-8 select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl border border-indigo-500/40 bg-indigo-600/30 px-6 py-3.5 font-mono text-xs font-bold text-white shadow-xl backdrop-blur-md hover:bg-indigo-600/50 hover:scale-105 transition-all cursor-pointer"
      >
        <Sparkles size={14} className="text-indigo-400" />
        <span>{buttonText}</span>
      </button>

      {/* Modal Dialog with Elastic Physics */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Elastic Sheet Container */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 400) {
                  setIsOpen(false);
                }
              }}
              initial={{ scale: 0.7, y: 150, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 180, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 24,
              }}
              className="relative w-full max-w-md rounded-3xl border border-zinc-700/80 bg-zinc-950 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 space-y-4"
            >
              {/* Drag Handle Bar */}
              <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto cursor-grab active:cursor-grabbing" />

              <div className="flex items-start justify-between pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                    ELASTIC PHYSICS
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {modalTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {modalDescription}
              </p>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  <span>Acknowledge</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElasticSpringModal;
