import React, { useRef, useEffect } from 'react';

export interface VoronoiCellNetworkProps {
  pointCount?: number;
  cellColor?: string;
  wireColor?: string;
  speed?: number;
  className?: string;
}

interface SeedPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const VoronoiCellNetwork: React.FC<VoronoiCellNetworkProps> = ({
  pointCount = 35,
  cellColor = '#3b82f6',
  wireColor = 'rgba(59, 130, 246, 0.35)',
  speed = 0.8,
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

    const points: SeedPoint[] = [];
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2 * speed,
        vy: (Math.random() - 0.5) * 1.2 * speed,
        radius: Math.random() * 3 + 2,
      });
    }

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian base
      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Move points
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = cellColor;
        ctx.fill();
      });

      // Delaunay / Voronoi Mesh Lines
      const maxDistance = 140;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = wireColor;
            ctx.globalAlpha = 1 - dist / maxDistance;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [pointCount, cellColor, wireColor, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl bg-[#06070e] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default VoronoiCellNetwork;
