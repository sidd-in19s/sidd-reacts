import React, { useRef, useEffect } from 'react';

export interface GravityTagCloudProps {
  tags?: string[];
  gravity?: number;
  bounce?: number;
  className?: string;
}

interface PhysicsTag {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  angle: number;
  vAngle: number;
}

const DEFAULT_TAGS = [
  'React 18', 'TypeScript', 'Tailwind', 'Canvas', 'WebGL',
  'Physics 2D', 'Kinetic UI', 'Framer', 'Skins', 'Shaders',
  'Springs', 'Vortex', 'Micro-FX'
];

export const GravityTagCloud: React.FC<GravityTagCloudProps> = ({
  tags = DEFAULT_TAGS,
  gravity = 0.45,
  bounce = 0.65,
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
    let width = (canvas.width = container.clientWidth || 500);
    let height = (canvas.height = container.clientHeight || 320);

    const colors = ['#6366f1', '#38bdf8', '#ec4899', '#10b981', '#f59e0b', '#a855f7'];

    ctx.font = 'bold 12px monospace';

    const pTags: PhysicsTag[] = tags.map((t, i) => {
      const textMetrics = ctx.measureText(t);
      const w = textMetrics.width + 24;
      const h = 28;
      return {
        text: t,
        x: Math.random() * (width - w),
        y: Math.random() * (height * 0.4),
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2,
        width: w,
        height: h,
        color: colors[i % colors.length],
        angle: (Math.random() - 0.5) * 0.2,
        vAngle: (Math.random() - 0.5) * 0.04,
      };
    });

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      pTags.forEach((tag) => {
        const cx = tag.x + tag.width / 2;
        const cy = tag.y + tag.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          tag.vx += (dx / (dist || 1)) * 12;
          tag.vy += (dy / (dist || 1)) * 12 - 4;
          tag.vAngle += (Math.random() - 0.5) * 0.1;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#090a12';
      ctx.fillRect(0, 0, width, height);

      pTags.forEach((tag) => {
        // Gravity & Velocity
        tag.vy += gravity;
        tag.x += tag.vx;
        tag.y += tag.vy;
        tag.angle += tag.vAngle;

        tag.vx *= 0.98;
        tag.vAngle *= 0.95;

        // Bottom collision
        if (tag.y + tag.height > height - 10) {
          tag.y = height - 10 - tag.height;
          tag.vy = -tag.vy * bounce;
          tag.vx *= 0.9;
        }

        // Left / Right collision
        if (tag.x < 10) {
          tag.x = 10;
          tag.vx = -tag.vx * bounce;
        }
        if (tag.x + tag.width > width - 10) {
          tag.x = width - 10 - tag.width;
          tag.vx = -tag.vx * bounce;
        }

        // Draw Rounded Pill Tag
        ctx.save();
        ctx.translate(tag.x + tag.width / 2, tag.y + tag.height / 2);
        ctx.rotate(tag.angle);

        ctx.fillStyle = `${tag.color}25`;
        ctx.strokeStyle = tag.color;
        ctx.lineWidth = 1.5;

        const hw = tag.width / 2;
        const hh = tag.height / 2;

        ctx.beginPath();
        ctx.roundRect(-hw, -hh, tag.width, tag.height, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tag.text, 0, 1);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tags, gravity, bounce]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-lg h-72 rounded-3xl border border-zinc-800 bg-[#090a12] overflow-hidden select-none cursor-pointer ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="pointer-events-none absolute top-3 left-4 text-[10px] font-mono text-zinc-500">
        Kick & disperse tags with cursor momentum
      </div>
    </div>
  );
};

export default GravityTagCloud;
