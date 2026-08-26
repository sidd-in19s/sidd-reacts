import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface SpotlightCardProps {
  children?: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  tiltAmount?: number;
  borderGlow?: boolean;
  glowOpacity?: number;
  title?: string;
  description?: string;
  tag?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.25)',
  spotlightSize = 350,
  tiltAmount = 12,
  borderGlow = true,
  glowOpacity = 0.8,
  title = 'Interactive 3D Spotlight Card',
  description = 'Hover your cursor across the surface to see the radial light tracking and fluid spring-physics 3D tilt perspective.',
  tag = 'FEATURED',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Spring physics for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Normalized coordinates (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${
          isHovered ? 'border-zinc-700/80' : ''
        } ${className}`}
      >
        {/* Radial Spotlight Light Cone */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? glowOpacity : 0,
            background: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />

        {/* Dynamic Border Glow Reflection */}
        {borderGlow && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 70%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
        )}

        {/* Card Content with 3D Depth */}
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 space-y-4">
          {children || (
            <>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  {tag}
                </span>
                <div className="flex space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-500/60" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">
                  <span>Tilt Physics: Active</span>
                  <span className="text-indigo-400 font-medium">Framer Motion</span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default SpotlightCard;
