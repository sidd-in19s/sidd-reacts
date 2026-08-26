import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface CosmicOrbitButtonProps {
  label?: string;
  subtext?: string;
  starColor?: string;
  className?: string;
  onClick?: () => void;
}

interface OrbitParticle {
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  size: number;
  color: string;
}

export const CosmicOrbitButton: React.FC<CosmicOrbitButtonProps> = ({
  label = 'WARP SPEED JUMP',
  subtext = 'GRAVITY WELL LOCKED',
  starColor = '#38bdf8',
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSupernova, setIsSupernova] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: OrbitParticle[] = Array.from({ length: 24 }).map((_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.02,
      radiusX: 95 + Math.random() * 20,
      radiusY: 38 + Math.random() * 12,
      size: 1.5 + Math.random() * 2,
      color: i % 2 === 0 ? starColor : '#ec4899',
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach((p) => {
        p.angle += p.speed * (isHovered ? 2.5 : 1);
        const x = centerX + Math.cos(p.angle) * p.radiusX;
        const y = centerY + Math.sin(p.angle) * p.radiusY;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isHovered, starColor]);

  const handleClick = () => {
    setIsSupernova(true);
    if (onClick) onClick();
    setTimeout(() => setIsSupernova(false), 700);
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-8 select-none ${className}`}>
      {/* 2D Canvas for Smooth Orbital Particle Simulation */}
      <canvas
        ref={canvasRef}
        width={320}
        height={160}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Supernova Shockwave on Click */}
      {isSupernova && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle, #ffffff 0%, ${starColor} 40%, transparent 70%)`,
          }}
        />
      )}

      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 group overflow-hidden rounded-full border border-cyan-500/30 bg-[#060814] px-8 py-3.5 shadow-2xl transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: isHovered
            ? `0 0 25px ${starColor}40, inset 0 0 15px rgba(236,72,153,0.3)`
            : '0 8px 25px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-cyan-300">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default CosmicOrbitButton;
