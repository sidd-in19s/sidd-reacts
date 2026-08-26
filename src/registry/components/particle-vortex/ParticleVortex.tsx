import React, { useRef, useEffect } from 'react';

export interface ParticleVortexProps {
  particleCount?: number;
  vortexStrength?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  speed?: number;
  vortexMode?: 'orbit' | 'attract' | 'repel';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseRadius: number;
  angle: number;
  angularSpeed: number;
  color: string;
  alpha: number;
}

export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  particleCount = 100,
  vortexStrength = 1.8,
  connectionDistance = 90,
  particleColor = '#6366f1',
  lineColor = 'rgba(99, 102, 241, 0.15)',
  speed = 1,
  vortexMode = 'attract',
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

    const mouse = {
      x: width / 2,
      y: height / 2,
      isHovered: false,
    };

    // Initialize particles (original distribution)
    const particles: Particle[] = [];
    const colors = [particleColor, '#38bdf8', '#ec4899', '#a855f7', '#34d399'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * (Math.min(width, height) * 0.45);
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2.5 + 1.2,
        baseRadius: radius,
        angle: angle,
        angularSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / dist) * 12;
        p.vy += (dy / dist) * 12;
      });
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    // Original animation render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Center vortex position
      const centerX = mouse.isHovered ? mouse.x : width / 2;
      const centerY = mouse.isHovered ? mouse.y : height / 2;

      // Draw subtle vortex center glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 140);
      glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles with original physics formula
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (vortexMode === 'orbit') {
          p.angle += p.angularSpeed * vortexStrength;
          const targetX = centerX + Math.cos(p.angle) * p.baseRadius;
          const targetY = centerY + Math.sin(p.angle) * p.baseRadius;

          p.vx += (targetX - p.x) * 0.05;
          p.vy += (targetY - p.y) * 0.05;
        } else if (vortexMode === 'attract') {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (vortexStrength * 10) / Math.max(dist, 30);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        } else if (vortexMode === 'repel') {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (vortexStrength * 15) / Math.max(dist, 20);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Apply friction
        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = (1 - dist / connectionDistance) * 0.4;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('click', handleClick);
      }
    };
  }, [particleCount, vortexStrength, connectionDistance, particleColor, lineColor, speed, vortexMode]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[480px] overflow-hidden rounded-2xl bg-transparent ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair block absolute inset-0" />
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400 backdrop-blur-md z-10">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        Gravitational Attract • Move mouse to pull particles
      </div>
    </div>
  );
};

export default ParticleVortex;
