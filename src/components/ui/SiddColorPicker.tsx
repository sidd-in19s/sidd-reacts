import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Pipette, Check, Plus, Copy, X } from 'lucide-react';

// ==================== Color Conversion Utilities ====================

interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 1
  v: number; // 0 - 1
}

interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return { r: 99, g: 102, b: 241 };
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(b)}`.toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  b /= 255;
  g /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

function hsvToRgb(h: number, s: number, v: number): RGB {
  let r = 0, g = 0, b = 0;
  const i = Math.floor((h / 60) % 6);
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Preset Swatches modeled after Image 2
const PRESET_PALETTES = [
  '#a855f7', // Purple
  '#6366f1', // Indigo
  '#3b82f6', // Royal Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ec4899', // Pink
  '#ef4444', // Red
];

const BASE_SWATCHES = ['#ffffff', '#64748b', '#000000'];

// ==================== Component ====================

export interface SiddColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
}

export const SiddColorPicker: React.FC<SiddColorPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [hsv, setHsv] = useState<HSV>(() => {
    const rgb = hexToRgb(value || '#6366f1');
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });
  const [customSwatches, setCustomSwatches] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const satValBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef(false);
  const isDraggingHue = useRef(false);

  // Sync HSV when external value changes
  useEffect(() => {
    if (value) {
      const rgb = hexToRgb(value);
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    }
  }, [value]);

  // Calculate portal viewport coordinates so it never gets clipped or hidden
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 330;
    const popoverHeight = 390;

    let left = rect.left;
    let top = rect.bottom + 8;

    // Check right screen boundary
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    if (left < 16) left = 16;

    // Check bottom screen boundary (flip up if too close to bottom)
    if (top + popoverHeight > window.innerHeight - 16 && rect.top - popoverHeight > 16) {
      top = rect.top - popoverHeight - 8;
    }

    setCoords({ top, left });
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Update position on scroll/resize and click-outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  const currentRgb = useMemo(() => hsvToRgb(hsv.h, hsv.s, hsv.v), [hsv]);
  const currentHex = useMemo(() => rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b), [currentRgb]);

  // Update Saturation / Value on Drag
  const handleSatValMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!satValBoxRef.current) return;
      const rect = satValBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = x / rect.width;
      const v = 1 - y / rect.height;

      setHsv((prev) => {
        const next = { ...prev, s, v };
        const rgb = hsvToRgb(next.h, next.s, next.v);
        onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
        return next;
      });
    },
    [onChange]
  );

  // Update Hue on Drag
  const handleHueMove = useCallback(
    (clientX: number, rect: DOMRect) => {
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const h = (x / rect.width) * 360;

      setHsv((prev) => {
        const next = { ...prev, h };
        const rgb = hsvToRgb(next.h, next.s, next.v);
        onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
        return next;
      });
    },
    [onChange]
  );

  // Global mouse handlers for drag experience
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSatVal.current) {
        handleSatValMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleSatValMove]);

  const handleEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          onChange(result.sRGBHex);
        }
      } catch {
        // User cancelled picker
      }
    }
  };

  const handleAddCustomSwatch = () => {
    if (!customSwatches.includes(currentHex)) {
      setCustomSwatches((prev) => [...prev.slice(-5), currentHex]);
    }
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(currentHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Portal Popover Modal (Always renders top-level in document.body at z-[999999])
  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 999999,
      }}
      className="w-80 rounded-3xl border border-zinc-700/80 bg-[#12131b]/98 p-4.5 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(99,102,241,0.2)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* 1. 2D Saturation / Value Gradient Canvas */}
      <div
        ref={satValBoxRef}
        onMouseDown={(e) => {
          isDraggingSatVal.current = true;
          handleSatValMove(e.clientX, e.clientY);
        }}
        className="relative h-44 w-full cursor-crosshair overflow-hidden rounded-2xl border border-zinc-700/60 shadow-inner"
        style={{
          backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
        }}
      >
        {/* White-to-transparent horizontal gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        {/* Black-to-transparent vertical gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Glowing Glass Dragger Ring with Ripple Trail */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
          }}
        >
          <div className="relative flex h-7 w-7 items-center justify-center">
            {/* Ripple glow halo */}
            <div
              className="absolute h-9 w-9 rounded-full opacity-60 blur-[3px]"
              style={{ backgroundColor: currentHex }}
            />
            {/* Metallic Glass Ring */}
            <div
              className="h-5 w-5 rounded-full border-2 border-white bg-transparent shadow-[0_0_8px_rgba(0,0,0,0.8),inset_0_0_4px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* 2. Rainbow Hue Slider Bar */}
      <div className="mt-4 flex items-center gap-3">
        {typeof window !== 'undefined' && 'EyeDropper' in window && (
          <button
            type="button"
            onClick={handleEyeDropper}
            title="Eyedropper"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
          >
            <Pipette size={14} />
          </button>
        )}

        <div
          onMouseDown={(e) => {
            isDraggingHue.current = true;
            const rect = e.currentTarget.getBoundingClientRect();
            handleHueMove(e.clientX, rect);

            const moveHandler = (me: MouseEvent) => {
              if (isDraggingHue.current) handleHueMove(me.clientX, rect);
            };
            const upHandler = () => {
              isDraggingHue.current = false;
              window.removeEventListener('mousemove', moveHandler);
              window.removeEventListener('mouseup', upHandler);
            };
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
          }}
          className="relative h-4 flex-1 cursor-pointer rounded-full border border-zinc-700/60 shadow-inner"
          style={{
            background:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        >
          {/* Metallic Hue Dragger Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(hsv.h / 360) * 100}%` }}
          >
            <div
              className="h-5 w-5 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.7)] transition-transform hover:scale-110"
              style={{
                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Glossy Preset Palette Swatches (Row 1) */}
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-10 gap-1.5">
          {PRESET_PALETTES.map((swatchHex) => {
            const isSelected = currentHex.toLowerCase() === swatchHex.toLowerCase();
            return (
              <button
                key={swatchHex}
                type="button"
                onClick={() => onChange(swatchHex)}
                className={`relative h-6 w-full rounded-lg transition-all duration-150 hover:scale-110 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#12131b] scale-105 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'border border-white/10 hover:border-white/30'
                }`}
                style={{ backgroundColor: swatchHex }}
              >
                {/* Specular sheen reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/25" />
              </button>
            );
          })}
        </div>

        {/* Base Swatches + Custom Swatches (Row 2) */}
        <div className="flex items-center gap-1.5">
          {BASE_SWATCHES.map((swatchHex) => {
            const isSelected = currentHex.toLowerCase() === swatchHex.toLowerCase();
            return (
              <button
                key={swatchHex}
                type="button"
                onClick={() => onChange(swatchHex)}
                className={`relative h-6 w-7 rounded-lg transition-all duration-150 hover:scale-110 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#12131b] scale-105 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'border border-white/15 hover:border-white/30'
                }`}
                style={{ backgroundColor: swatchHex }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/25" />
              </button>
            );
          })}

          {/* Custom Saved Swatches */}
          {customSwatches.map((swatchHex, i) => (
            <button
              key={`${swatchHex}-${i}`}
              type="button"
              onClick={() => onChange(swatchHex)}
              className="relative h-6 w-7 rounded-lg border border-white/20 transition-all hover:scale-110 cursor-pointer overflow-hidden"
              style={{ backgroundColor: swatchHex }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/25" />
            </button>
          ))}

          {/* Add current color to palette */}
          <button
            type="button"
            onClick={handleAddCustomSwatch}
            title="Save current color"
            className="flex h-6 w-7 items-center justify-center rounded-lg border border-dashed border-zinc-600 bg-zinc-800/60 text-zinc-400 hover:border-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* 4. Bottom Metric & Info Panel (Image 2) */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-2.5">
        {/* Hex Display + Copy */}
        <div
          onClick={handleCopyHex}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-mono font-bold text-white cursor-pointer hover:bg-zinc-800 transition-colors"
          title="Click to copy HEX"
        >
          <span>{currentHex}</span>
          {copied ? (
            <Check size={12} className="text-emerald-400" />
          ) : (
            <Copy size={11} className="text-zinc-500" />
          )}
        </div>

        {/* RGB Breakdown */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="text-zinc-500">RGB</span>
          <span className="text-red-400">{currentRgb.r}</span>
          <span className="text-emerald-400">{currentRgb.g}</span>
          <span className="text-blue-400">{currentRgb.b}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} className="relative w-full">
      {/* Input Trigger Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className="group relative flex h-9 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-md transition-all hover:scale-105 hover:border-indigo-500 cursor-pointer overflow-hidden"
          style={{
            boxShadow: `0 0 14px ${value}40`,
          }}
        >
          {/* Color Preview Swatch */}
          <div
            className="h-full w-full rounded-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: value }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-200 uppercase tracking-wider focus:border-indigo-500 focus:outline-none transition-colors shadow-inner"
        />
      </div>

      {/* Top-Level Portal (Ensures color picker is NEVER behind anything) */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(popoverContent, document.body)}
    </div>
  );
};

export default SiddColorPicker;
