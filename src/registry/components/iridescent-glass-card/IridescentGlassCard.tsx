import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

export interface IridescentGlassCardProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  iridescenceIntensity?: number;
  blurStrength?: number;
  glassOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const IridescentGlassCard: React.FC<IridescentGlassCardProps> = ({
  title = 'Holographic Glassmorphism',
  subtitle = 'Chromatic aberration with dynamic prismatic refraction along borders and specular shine layers.',
  tag = 'IRIDESCENT V2',
  iridescenceIntensity = 0.85,
  blurStrength = 20,
  glassOpacity = 0.65,
  className = '',
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, angle: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);

    setMousePos({ x, y, angle });
  };

  return (
    <div className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          backgroundColor: `rgba(13, 14, 24, ${glassOpacity})`,
        }}
        className={`relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl transition-all duration-300 ${className}`}
      >
        {/* Prismatic Rainbow Border / Iridescent Glow */}
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-3xl opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? iridescenceIntensity : 0.3,
            background: `conic-gradient(from ${mousePos.angle + 90}deg at ${mousePos.x}px ${mousePos.y}px, 
              #ff0080 0deg, 
              #7928ca 60deg, 
              #0070f3 120deg, 
              #00dfd8 180deg, 
              #7928ca 240deg, 
              #ff0080 300deg, 
              #ff4d4d 360deg)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />

        {/* Dynamic Specular Holographic Glare */}
        <div
          className="pointer-events-none absolute -inset-full transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0.1,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.4), transparent 70%),
              linear-gradient(${mousePos.angle}deg, rgba(255,0,128,0.15), rgba(0,223,216,0.15), transparent 70%)`,
          }}
        />

        {/* Diagonal Sheen Shimmer */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-white/[0.08] to-transparent opacity-60" />

        {/* Card Content */}
        <div className="relative z-10 space-y-5">
          {children || (
            <>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300 backdrop-blur-md">
                  <Sparkles size={13} className="text-pink-400 animate-spin" />
                  {tag}
                </span>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  Verified
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-between">
                  {title}
                  <ArrowUpRight className="text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-normal">{subtitle}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>Refraction: 1.52 (Glass)</span>
                <span className="text-cyan-300 font-mono">Conic Iridescence</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default IridescentGlassCard;
