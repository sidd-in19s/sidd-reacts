import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export interface LiquidMorphButtonProps {
  label?: string;
  successLabel?: string;
  fillColor?: string;
  className?: string;
}

export const LiquidMorphButton: React.FC<LiquidMorphButtonProps> = ({
  label = 'Deploy to Production',
  successLabel = 'Deployed Successfully!',
  fillColor = '#10b981', // Emerald Success
  className = '',
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    }, 1600);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-8 select-none ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={status !== 'idle'}
        layout
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-900 px-8 py-4 font-mono text-sm font-black text-white shadow-2xl cursor-pointer focus:outline-none"
        style={{
          minWidth: status === 'loading' ? '56px' : '220px',
          height: '56px',
        }}
      >
        {/* Animated Rising Liquid Level Background */}
        <AnimatePresence>
          {(status === 'loading' || status === 'success') && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 z-0"
              style={{ backgroundColor: fillColor }}
            />
          )}
        </AnimatePresence>

        {/* Content States */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {status === 'idle' && <span>{label}</span>}
          {status === 'loading' && (
            <Loader2 size={20} className="animate-spin text-white" />
          )}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-zinc-950 font-black"
            >
              <Check size={18} />
              <span>{successLabel}</span>
            </motion.div>
          )}
        </div>
      </motion.button>

      <span className="mt-4 text-[11px] font-mono text-zinc-500">
        Click to initiate liquid morph transition
      </span>
    </div>
  );
};

export default LiquidMorphButton;
