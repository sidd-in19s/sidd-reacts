import React, { useRef, useEffect } from 'react';

export interface AuroraBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  speed?: number;
  blur?: number;
  intensity?: number;
  showNoise?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  color1 = '#38bdf8', // Cyan
  color2 = '#6366f1', // Indigo
  color3 = '#ec4899', // Pink
  color4 = '#10b981', // Emerald
  speed = 1,
  blur = 60,
  intensity = 0.8,
  showNoise = true,
  children,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    let time = 0;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.008 * speed;
      ctx.clearRect(0, 0, width, height);

      // Dark base
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // Aurora Wave Blob 1
      const x1 = width * 0.3 + Math.sin(time * 0.7) * (width * 0.25);
      const y1 = height * 0.4 + Math.cos(time * 0.5) * (height * 0.2);
      const r1 = Math.min(width, height) * 0.65;
      const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, r1);
      g1.addColorStop(0, color1);
      g1.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.6 * intensity;
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      // Aurora Wave Blob 2
      const x2 = width * 0.7 + Math.cos(time * 0.9) * (width * 0.25);
      const y2 = height * 0.6 + Math.sin(time * 0.6) * (height * 0.25);
      const r2 = Math.min(width, height) * 0.7;
      const g2 = ctx.createRadialGradient(x2, y2, 10, x2, y2, r2);
      g2.addColorStop(0, color2);
      g2.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.55 * intensity;
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      // Aurora Wave Blob 3
      const x3 = width * 0.5 + Math.sin(time * 1.2 + 2) * (width * 0.3);
      const y3 = height * 0.2 + Math.cos(time * 0.8 + 1) * (height * 0.18);
      const r3 = Math.min(width, height) * 0.55;
      const g3 = ctx.createRadialGradient(x3, y3, 10, x3, y3, r3);
      g3.addColorStop(0, color3);
      g3.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.5 * intensity;
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(x3, y3, r3, 0, Math.PI * 2);
      ctx.fill();

      // Aurora Wave Blob 4 (Accent)
      const x4 = width * 0.4 + Math.cos(time * 0.4 + 3) * (width * 0.2);
      const y4 = height * 0.8 + Math.sin(time * 1.1 + 2) * (height * 0.2);
      const r4 = Math.min(width, height) * 0.6;
      const g4 = ctx.createRadialGradient(x4, y4, 10, x4, y4, r4);
      g4.addColorStop(0, color4);
      g4.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.45 * intensity;
      ctx.fillStyle = g4;
      ctx.beginPath();
      ctx.arc(x4, y4, r4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color1, color2, color3, color4, speed, intensity]);

  return (
    <div className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] flex items-center justify-center ${className}`}>
      {/* Dynamic Aurora Canvas */}
      <canvas
        ref={canvasRef}
        style={{ filter: `blur(${blur}px)` }}
        className="absolute inset-0 w-full h-full pointer-events-none scale-110"
      />

      {/* Subtle Noise / Film Grain Layer */}
      {showNoise && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Foreground Content */}
      {children && (
        <div className="relative z-10 w-full p-8 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default AuroraBackground;
