import React, { useRef, useEffect } from 'react';

export interface FluidLiquidMeshProps {
  colorA?: string;
  colorB?: string;
  colorC?: string;
  waveSpeed?: number;
  waveFrequency?: number;
  className?: string;
}

export const FluidLiquidMesh: React.FC<FluidLiquidMeshProps> = ({
  colorA = '#6366f1',
  colorB = '#ec4899',
  colorC = '#38bdf8',
  waveSpeed = 1,
  waveFrequency = 0.02,
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

    let time = 0;
    const mouse = { x: width / 2, y: height / 2, radius: 150 };

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.015 * waveSpeed;
      ctx.clearRect(0, 0, width, height);

      // Base Dark Fill
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      const rows = 14;
      const cols = 24;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x = c * cellW;
          const baseY = r * cellH + cellH / 2;

          // Sinusoidal multi-wave displacement
          const wave1 = Math.sin(c * waveFrequency * 10 + time + r * 0.4) * 22;
          const wave2 = Math.cos(r * 0.6 + time * 0.8 + c * 0.2) * 14;

          // Mouse proximity displacement
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseDisplace = dist < mouse.radius ? Math.sin((1 - dist / mouse.radius) * Math.PI) * 28 : 0;

          const y = baseY + wave1 + wave2 + mouseDisplace;

          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Dynamic Gradient Stroke per layer
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, colorA);
        grad.addColorStop(0.5, colorB);
        grad.addColorStop(1, colorC);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.35 + (r / rows) * 0.45;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [colorA, colorB, colorC, waveSpeed, waveFrequency]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl bg-[#060608] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
    </div>
  );
};

export default FluidLiquidMesh;
