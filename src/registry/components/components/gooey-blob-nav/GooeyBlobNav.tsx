import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface GooeyBlobNavProps {
  blobColor?: string;
  className?: string;
}

const TABS = ['Overview', 'Components', 'Playground', 'Docs', 'Pricing'];

export const GooeyBlobNav: React.FC<GooeyBlobNavProps> = ({
  blobColor = '#6366f1',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`relative flex flex-col items-center justify-center p-8 select-none ${className}`}>
      {/* SVG Gooey Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Navigation Container */}
      <div className="relative flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl backdrop-blur-xl">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(idx)}
              className="relative px-5 py-2.5 rounded-full text-xs font-bold font-mono transition-colors duration-200 z-10 cursor-pointer focus:outline-none"
              style={{
                color: isActive ? '#ffffff' : '#a1a1aa',
              }}
            >
              {tab}

              {/* Animated Floating Blob Pill */}
              {isActive && (
                <motion.div
                  layoutId="gooey-pill"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                  }}
                  className="absolute inset-0 -z-10 rounded-full shadow-lg"
                  style={{
                    backgroundColor: blobColor,
                    boxShadow: `0 0 20px ${blobColor}60`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <span className="mt-4 text-[11px] font-mono text-zinc-500">
        Click tabs to trigger fluid spring blob morphing
      </span>
    </div>
  );
};

export default GooeyBlobNav;
