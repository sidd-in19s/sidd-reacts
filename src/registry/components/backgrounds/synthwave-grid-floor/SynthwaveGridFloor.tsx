import React, { useRef, useEffect } from 'react';

export interface SynthwaveGridFloorProps {
  gridColor?: string;
  horizonGlowColor?: string;
  speed?: number;
  sunSize?: number;
  className?: string;
}

export const SynthwaveGridFloor: React.FC<SynthwaveGridFloorProps> = ({
  gridColor = '#ec4899', // Cyberpunk Neon Magenta
  horizonGlowColor = '#06b6d4', // Neon Cyan
  speed = 1.2,
  sunSize = 90,
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

    let offset = 0;

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      offset = (offset + speed) % 40;
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
      skyGrad.addColorStop(0, '#06060c');
      skyGrad.addColorStop(0.7, '#1e1035');
      skyGrad.addColorStop(1, '#3b0764');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      // Neon Synthwave Sun
      const horizonY = height * 0.55;
      const sunX = width / 2;
      const sunY = horizonY - 30;

      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunSize);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.4, '#f43f5e');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
      ctx.fill();

      // Horizon Glow Line
      ctx.strokeStyle = horizonGlowColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = horizonGlowColor;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Perspective Grid Floor
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, '#0a0518');
      floorGrad.addColorStop(1, '#05020a');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Perspective Vertical / Radial Grid Lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;

      const lineCount = 28;
      for (let i = -lineCount; i <= lineCount; i++) {
        const xBottom = width / 2 + i * (width / 14);
        ctx.beginPath();
        ctx.moveTo(sunX, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Moving Horizontal Grid Lines
      for (let y = 0; y <= height - horizonY; y += 40) {
        const adjustedY = y + offset;
        const p = adjustedY / (height - horizonY);
        const screenY = horizonY + Math.pow(p, 2.2) * (height - horizonY);

        if (screenY <= height) {
          ctx.beginPath();
          ctx.moveTo(0, screenY);
          ctx.lineTo(width, screenY);
          ctx.stroke();
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
  }, [gridColor, horizonGlowColor, speed, sunSize]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl bg-[#06060c] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SynthwaveGridFloor;
