import React, { useRef, useEffect } from 'react';

export interface HyperspeedTunnelProps {
  starCount?: number;
  warpSpeed?: number;
  streakLength?: number;
  colorTheme?: 'cyan' | 'purple' | 'amber' | 'emerald';
  fov?: number;
  interactiveSteer?: boolean;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
  size: number;
}

const THEME_PALETTES = {
  cyan: ['#38bdf8', '#0284c7', '#e0f2fe', '#818cf8'],
  purple: ['#c084fc', '#9333ea', '#f3e8ff', '#ec4899'],
  amber: ['#fbbf24', '#f59e0b', '#fef3c7', '#ea580c'],
  emerald: ['#34d399', '#059669', '#d1fae5', '#22d3ee'],
};

export const HyperspeedTunnel: React.FC<HyperspeedTunnelProps> = ({
  starCount = 350,
  warpSpeed = 16,
  streakLength = 2.5,
  colorTheme = 'cyan',
  fov = 220,
  interactiveSteer = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const palette = THEME_PALETTES[colorTheme] || THEME_PALETTES.cyan;

    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const stars: Star[] = [];
    const maxZ = 1200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * maxZ + 1,
        pz: maxZ,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: Math.random() * 1.5 + 0.8,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveSteer) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetOffsetX = nx * 120;
      targetOffsetY = ny * 120;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Smooth steering interpolation
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.06;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.06;

      // Dark trail clear
      ctx.fillStyle = 'rgba(6, 6, 8, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + currentOffsetX;
      const cy = height / 2 + currentOffsetY;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.pz = star.z;
        star.z -= warpSpeed;

        if (star.z <= 0) {
          star.z = maxZ;
          star.pz = maxZ;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = fov / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = fov / (star.pz + (warpSpeed * streakLength));
        const prevX = star.x * pk + cx;
        const prevY = star.y * pk + cy;

        // Skip if outside viewport
        if (px < 0 || px > width || py < 0 || py > height) continue;

        const alpha = Math.min(1, Math.max(0, (maxZ - star.z) / (maxZ * 0.75)));

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size * (1 - star.z / maxZ) * 2;
        ctx.globalAlpha = alpha;
        ctx.stroke();

        // Star tip head
        ctx.beginPath();
        ctx.arc(px, py, star.size * (1 - star.z / maxZ), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [starCount, warpSpeed, streakLength, colorTheme, fov, interactiveSteer]);

  return (
    <div className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Retro Tunnel Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(6,6,8,0.9) 100%)',
        }}
      />

      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        Warp Drive Active • Move cursor to steer tunnel trajectory
      </div>
    </div>
  );
};

export default HyperspeedTunnel;
