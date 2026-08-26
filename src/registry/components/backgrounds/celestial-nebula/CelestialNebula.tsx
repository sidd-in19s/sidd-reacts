import React, { useRef, useEffect } from 'react';

export interface CelestialNebulaProps {
  nebulaColor1?: string;
  nebulaColor2?: string;
  starCount?: number;
  rotationSpeed?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
}

export const CelestialNebula: React.FC<CelestialNebulaProps> = ({
  nebulaColor1 = '#6366f1',
  nebulaColor2 = '#ec4899',
  starCount = 140,
  rotationSpeed = 0.002,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current || canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth || 800);
    let height = (canvas.height = container.clientHeight || 500);

    const stars: Star[] = [];
    const starColors = ['#ffffff', '#38bdf8', '#fbbf24', '#c084fc'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        size: Math.random() * 2 + 0.8,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let angle = 0;

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      angle += rotationSpeed;
      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Volumetric Nebula Clouds
      const g1 = ctx.createRadialGradient(cx + Math.cos(angle * 2) * 100, cy + Math.sin(angle * 1.5) * 80, 20, cx, cy, Math.min(width, height) * 0.55);
      g1.addColorStop(0, `${nebulaColor1}50`);
      g1.addColorStop(0.5, `${nebulaColor2}25`);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Starfield Rotation in 3D perspective
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      stars.forEach((star) => {
        const rx = star.x * cosA - star.y * sinA;
        const ry = star.x * sinA + star.y * cosA;

        const k = 400 / star.z;
        const px = cx + rx * k;
        const py = cy + ry * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * k * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nebulaColor1, nebulaColor2, starCount, rotationSpeed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl bg-[#050508] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default CelestialNebula;
