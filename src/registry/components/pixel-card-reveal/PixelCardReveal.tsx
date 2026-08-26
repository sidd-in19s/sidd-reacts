import React, { useRef, useEffect, useState } from 'react';

export interface PixelCardRevealProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  initialPixelSize?: number;
  hoverPixelSize?: number;
  revealSpeed?: number;
  className?: string;
}

export const PixelCardReveal: React.FC<PixelCardRevealProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  title = 'Cyberpunk Architecture & Neon Art',
  subtitle = 'Hover cursor over card to dissolve digital 8-bit pixelation into ultra crisp high-definition resolution.',
  tag = 'PIXEL FX',
  initialPixelSize = 32,
  hoverPixelSize = 1,
  revealSpeed = 0.12,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentPixelSizeRef = useRef(initialPixelSize);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // High resolution procedural graphic generator as guaranteed fallback
    const generateCrispGraphic = (targetCanvas: HTMLCanvasElement | OffscreenCanvas, w: number, h: number) => {
      const gCtx = (targetCanvas as HTMLCanvasElement).getContext('2d');
      if (!gCtx) return;
      // High-res cyberpunk neon art
      const grad = gCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.3, '#312e81');
      grad.addColorStop(0.6, '#ec4899');
      grad.addColorStop(1, '#06b6d4');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, w, h);

      // Neon horizon grid
      gCtx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      gCtx.lineWidth = 2;
      for (let x = 0; x <= w; x += 40) {
        gCtx.beginPath();
        gCtx.moveTo(x, h * 0.5);
        gCtx.lineTo(x * 1.5 - w * 0.25, h);
        gCtx.stroke();
      }
      for (let y = h * 0.5; y <= h; y += 20) {
        gCtx.beginPath();
        gCtx.moveTo(0, y);
        gCtx.lineTo(w, y);
        gCtx.stroke();
      }

      // Neon Sun
      const sunGrad = gCtx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, 90);
      sunGrad.addColorStop(0, '#fbbf24');
      sunGrad.addColorStop(0.5, '#f43f5e');
      sunGrad.addColorStop(1, 'transparent');
      gCtx.fillStyle = sunGrad;
      gCtx.beginPath();
      gCtx.arc(w * 0.5, h * 0.45, 90, 0, Math.PI * 2);
      gCtx.fill();

      // Sharp Cyber Cityscape silhouettes
      gCtx.fillStyle = '#090a14';
      const bWidths = [45, 60, 35, 70, 50, 65, 40, 80, 55];
      let curX = 10;
      bWidths.forEach((bw, idx) => {
        const bh = 80 + (idx % 4) * 35;
        gCtx.fillRect(curX, h * 0.55 - bh, bw, bh + h * 0.5);
        // glowing windows
        gCtx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#ec4899';
        for (let wy = h * 0.55 - bh + 10; wy < h * 0.55 - 10; wy += 14) {
          for (let wx = curX + 6; wx < curX + bw - 6; wx += 12) {
            if ((wx + wy) % 3 === 0) gCtx.fillRect(wx, wy, 4, 6);
          }
        }
        gCtx.fillStyle = '#090a14';
        curX += bw + 8;
      });
    };

    const offscreen = document.createElement('canvas');
    const targetW = 900;
    const targetH = 560;
    offscreen.width = targetW;
    offscreen.height = targetH;

    let sourceDrawable: CanvasImageSource = offscreen;
    generateCrispGraphic(offscreen, targetW, targetH);
    setIsLoaded(true);

    img.onload = () => {
      sourceDrawable = img;
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Use the crisp procedural artwork fallback
      sourceDrawable = offscreen;
      setIsLoaded(true);
    };
    img.src = imageUrl;

    const render = () => {
      const targetSize = isHovered ? hoverPixelSize : initialPixelSize;
      currentPixelSizeRef.current += (targetSize - currentPixelSizeRef.current) * revealSpeed;

      const pSize = currentPixelSizeRef.current;
      const dpr = window.devicePixelRatio || 2;
      const rect = canvas.getBoundingClientRect();
      const displayW = rect.width || 450;
      const displayH = rect.height || 260;

      canvas.width = Math.round(displayW * dpr);
      canvas.height = Math.round(displayH * dpr);

      const renderW = canvas.width;
      const renderH = canvas.height;

      ctx.clearRect(0, 0, renderW, renderH);

      if (pSize <= 1.08) {
        // True Full HD / 4K Crisp Direct Render
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(sourceDrawable, 0, 0, renderW, renderH);
      } else {
        // Pixelated Mosaic Calculation
        const mosaicCanvas = document.createElement('canvas');
        const mCtx = mosaicCanvas.getContext('2d');
        if (mCtx) {
          const scaledBlock = Math.max(2, Math.round(pSize * dpr));
          const w = Math.max(1, Math.floor(renderW / scaledBlock));
          const h = Math.max(1, Math.floor(renderH / scaledBlock));
          mosaicCanvas.width = w;
          mosaicCanvas.height = h;

          mCtx.imageSmoothingEnabled = true;
          mCtx.drawImage(sourceDrawable, 0, 0, w, h);

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(mosaicCanvas, 0, 0, w, h, 0, 0, renderW, renderH);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrl, isHovered, initialPixelSize, hoverPixelSize, revealSpeed]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 cursor-pointer ${className}`}
    >
      {/* High-DPI Canvas Stage */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-900">
        <canvas ref={canvasRef} className="h-full w-full object-cover block" />

        {/* Dynamic Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-lg">
            <span
              className={`h-2 w-2 rounded-full ${
                isHovered ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
              } transition-colors`}
            />
            {isHovered ? 'DE-PIXELATED 4K ULTRA' : tag}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10 shadow-lg">
          {isHovered ? 'Resolution: 100% Crisp' : 'Resolution: 8-Bit Mosaic'}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 pt-4 space-y-1.5">
        <h4 className="text-lg font-bold text-white transition-colors group-hover:text-cyan-400 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-mono font-normal text-zinc-500">
            {isHovered ? '4K Active' : 'Hover to Reveal'}
          </span>
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default PixelCardReveal;
