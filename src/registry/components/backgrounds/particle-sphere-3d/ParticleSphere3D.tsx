import React, { useRef, useEffect } from 'react';

export interface ParticleSphere3DProps {
  pointCount?: number;
  sphereRadius?: number;
  particleColor?: string;
  rotationSpeed?: number;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export const ParticleSphere3D: React.FC<ParticleSphere3DProps> = ({
  pointCount = 280,
  sphereRadius = 160,
  particleColor = '#38bdf8',
  rotationSpeed = 0.008,
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

    // Generate Fibonacci Sphere Distribution
    const points: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * sphereRadius,
        y: y * sphereRadius,
        z: z * sphereRadius,
        baseX: x * sphereRadius,
        baseY: y * sphereRadius,
        baseZ: z * sphereRadius,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      angleX += rotationSpeed * 0.7;
      angleY += rotationSpeed;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 350;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      points.forEach((p) => {
        // Rotate Y
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate X
        let y1 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Project 3D to 2D screen
        const scale = fov / (fov + z2);
        const x2d = cx + x1 * scale;
        const y2d = cy + y1 * scale;
        const size = Math.max(1, (z2 + sphereRadius) / (sphereRadius * 2) * 3 + 0.8);
        const alpha = Math.max(0.15, (z2 + sphereRadius) / (sphereRadius * 2));

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [pointCount, sphereRadius, particleColor, rotationSpeed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-2xl bg-[#060608] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default ParticleSphere3D;
