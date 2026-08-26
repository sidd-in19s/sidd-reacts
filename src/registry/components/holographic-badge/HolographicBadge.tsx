import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface HolographicBadgeProps {
  label?: string;
  badgeCode?: string;
  tier?: string;
  className?: string;
}

export const HolographicBadge: React.FC<HolographicBadgeProps> = ({
  label = 'MASTER DEVELOPER',
  badgeCode = 'SR-8921-X',
  tier = 'HOLOGRAPHIC FOIL',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-80, 80], [18, -18]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-18, 18]), { stiffness: 250, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className={`relative flex items-center justify-center p-8 select-none ${className}`}>
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, perspective: 900 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="relative h-64 w-52 rounded-3xl cursor-pointer overflow-hidden border border-white/30 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        {/* Iridescent Rainbow Foil Background */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'linear-gradient(135deg, #ec4899 0%, #a855f7 25%, #3b82f6 50%, #10b981 75%, #f59e0b 100%)',
            opacity: isHovered ? 0.9 : 0.6,
          }}
        />

        {/* Dynamic Hologram Glare & Scanline Texture */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${isHovered ? '60% 40%' : '50% 50%'}, rgba(255,255,255,0.8) 0%, transparent 60%)`,
          }}
        />

        {/* Card Content & Monogram Emblem */}
        <div className="relative z-10 flex h-full flex-col justify-between text-black">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black tracking-widest uppercase bg-black/80 text-white px-2 py-0.5 rounded-full">
              {tier}
            </span>
            <span className="text-xs font-mono font-bold text-black/80">{badgeCode}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <div className="h-16 w-16 rounded-2xl border-2 border-black/80 bg-white/40 backdrop-blur-md flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black font-heading tracking-tighter text-black">
                SR
              </span>
            </div>
            <span className="text-xs font-black font-mono tracking-widest text-black/90">
              VERIFIED PASS
            </span>
          </div>

          <div className="border-t border-black/20 pt-2 text-center">
            <h4 className="text-sm font-black tracking-tight text-black">{label}</h4>
            <p className="text-[9px] font-mono font-bold text-black/70">SIDD-REACTS PROTOCOL</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HolographicBadge;
