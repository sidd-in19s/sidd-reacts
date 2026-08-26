import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface TrueFocusTextProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  className?: string;
}

export const TrueFocusText: React.FC<TrueFocusTextProps> = ({
  sentence = 'Craft Modern High-Performance Interfaces With SIDD-Reacts',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#6366f1',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  animationDuration = 2,
  className = '',
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const activeIndex = manualMode ? (hoverIndex !== null ? hoverIndex : currentIndex) : currentIndex;

  // Auto cycling
  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, animationDuration * 1000);
    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration]);

  // Update focus bounding box coordinates
  useEffect(() => {
    const el = wordRefs.current[activeIndex];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      setFocusRect({
        x: elRect.left - contRect.left - 8,
        y: elRect.top - contRect.top - 4,
        width: elRect.width + 16,
        height: elRect.height + 8,
      });
    }
  }, [activeIndex, sentence]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 p-6 select-none ${className}`}
    >
      {/* Animated Focus Box with Corner Brackets */}
      {focusRect.width > 0 && (
        <motion.div
          animate={{
            x: focusRect.x,
            y: focusRect.y,
            width: focusRect.width,
            height: focusRect.height,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 28,
          }}
          className="pointer-events-none absolute left-0 top-0 rounded-lg border-2 z-20"
          style={{
            borderColor: borderColor,
            boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px ${glowColor}`,
          }}
        >
          {/* Glowing Top-Left Bracket */}
          <span
            className="absolute -top-1.5 -left-1.5 h-3 w-3 border-t-2 border-l-2"
            style={{ borderColor: borderColor }}
          />
          {/* Top-Right Bracket */}
          <span
            className="absolute -top-1.5 -right-1.5 h-3 w-3 border-t-2 border-r-2"
            style={{ borderColor: borderColor }}
          />
          {/* Bottom-Left Bracket */}
          <span
            className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b-2 border-l-2"
            style={{ borderColor: borderColor }}
          />
          {/* Bottom-Right Bracket */}
          <span
            className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b-2 border-r-2"
            style={{ borderColor: borderColor }}
          />
        </motion.div>
      )}

      {/* Words Rendering */}
      {words.map((word, idx) => {
        const isFocused = idx === activeIndex;
        return (
          <span
            key={`${word}-${idx}`}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            onMouseEnter={() => {
              if (manualMode) setHoverIndex(idx);
            }}
            onMouseLeave={() => {
              if (manualMode) setHoverIndex(null);
            }}
            className="relative cursor-pointer text-2xl md:text-4xl font-extrabold tracking-tight transition-all duration-300 z-10"
            style={{
              filter: isFocused ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isFocused ? 1 : 0.35,
              color: isFocused ? '#ffffff' : '#a1a1aa',
              transform: isFocused ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default TrueFocusText;
