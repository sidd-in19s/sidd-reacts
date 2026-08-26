import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ThermalHeatmapButtonProps {
  label?: string;
  subtext?: string;
  className?: string;
  onClick?: () => void;
}

interface HeatPoint {
  x: number;
  y: number;
  intensity: number;
  radius: number;
}

export const ThermalHeatmapButton: React.FC<ThermalHeatmapButtonProps> = ({
  label = 'INFRARED SENSOR',
  subtext = 'TOUCH HEATMAP ACTIVE',
  className = '',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatPointsRef = useRef<HeatPoint[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render decaying thermal heat circles
      heatPointsRef.current.forEach((hp) => {
        if (hp.intensity <= 0) return;

        const grad = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, hp.radius);
        grad.addColorStop(0, `rgba(239, 68, 68, ${hp.intensity * 0.8})`); // Red Core
        grad.addColorStop(0.3, `rgba(234, 179, 8, ${hp.intensity * 0.7})`); // Yellow
        grad.addColorStop(0.6, `rgba(34, 197, 94, ${hp.intensity * 0.5})`); // Green
        grad.addColorStop(0.85, `rgba(6, 182, 212, ${hp.intensity * 0.3})`); // Cyan
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, hp.radius, 0, Math.PI * 2);
        ctx.fill();

        hp.intensity -= 0.025; // Dissipate heat over time
      });

      // Filter out cold points
      heatPointsRef.current = heatPointsRef.current.filter((hp) => hp.intensity > 0);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heatPointsRef.current.push({
      x,
      y,
      intensity: 1,
      radius: 45,
    });
  };

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      <motion.button
        type="button"
        onMouseMove={handleMouseMove}
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-[#090b14] px-8 py-4 text-white shadow-2xl transition-all cursor-pointer"
      >
        {/* Real-Time Canvas Thermal Layer */}
        <canvas
          ref={canvasRef}
          width={260}
          height={75}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        {/* Text Container */}
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-rose-400">
            {subtext}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default ThermalHeatmapButton;
