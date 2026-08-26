import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface RubberStampPressProps {
  stampText?: string;
  stampSubtext?: string;
  inkColor?: string;
  className?: string;
}

export const RubberStampPress: React.FC<RubberStampPressProps> = ({
  stampText = 'APPROVED',
  stampSubtext = 'SIDD-REACTS QA VERIFIED',
  inkColor = '#ef4444', // Red rubber stamp ink
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [stampedCount, setStampedCount] = useState(1);

  const handlePress = () => {
    setIsPressed(true);
    setStampedCount((c) => c + 1);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-8 select-none ${className}`}>
      <motion.button
        type="button"
        onClick={handlePress}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.88, rotate: -4 }}
        animate={{
          rotate: isPressed ? -12 : -6,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="relative group px-8 py-5 rounded-2xl cursor-pointer focus:outline-none backdrop-blur-md"
        style={{
          border: `4px dashed ${inkColor}`,
          backgroundColor: `${inkColor}15`,
          boxShadow: isPressed
            ? `0 0 0 rgba(0,0,0,0)`
            : `6px 8px 0px ${inkColor}40, 0 10px 25px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Distress Texture Overlay */}
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: inkColor }} />
            <span
              className="text-3xl font-black font-mono tracking-widest uppercase"
              style={{ color: inkColor }}
            >
              {stampText}
            </span>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: inkColor }} />
          </div>

          <div
            className="text-[10px] font-mono font-bold tracking-widest border-t-2 border-dashed pt-1"
            style={{ color: inkColor, borderColor: `${inkColor}60` }}
          >
            {stampSubtext} • #{stampedCount}
          </div>
        </div>
      </motion.button>

      <span className="mt-4 text-[11px] font-mono text-zinc-500">
        Click to press tactile rubber stamp
      </span>
    </div>
  );
};

export default RubberStampPress;
