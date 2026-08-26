import { RegistryItem, CategoryInfo } from './types';
import SpotlightCard from './components/spotlight-card/SpotlightCard';
import TrueFocusText from './components/true-focus/TrueFocusText';
import ParticleVortex from './components/particle-vortex/ParticleVortex';
import AuroraBackground from './components/aurora-background/AuroraBackground';
import MagneticButton from './components/magnetic-button/MagneticButton';
import DecryptedText from './components/decrypted-text/DecryptedText';
import PixelCardReveal from './components/pixel-card-reveal/PixelCardReveal';
import FloatingDock from './components/floating-dock/FloatingDock';
import IridescentGlassCard from './components/iridescent-glass-card/IridescentGlassCard';
import HyperspeedTunnel from './components/hyperspeed-tunnel/HyperspeedTunnel';
import { NEW_COMPONENTS } from './newComponents';
import { BUTTON_COMPONENTS } from './buttonComponents';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'text',
    name: 'Text Animations',
    description: 'Kinetic typography, focus tracking, and cyberpunk decryptor effects.',
    iconName: 'Type',
  },
  {
    id: 'buttons',
    name: 'Buttons',
    description: 'Spring magnetic buttons, tactile neumorphic toggles, rubber stamps, and morphing CTAs.',
    iconName: 'MousePointerClick',
  },
  {
    id: 'backgrounds',
    name: 'Backgrounds',
    description: 'Fluid dynamic auroras, particle vortex fields, and warp tunnels.',
    iconName: 'Sparkles',
  },
  {
    id: 'cards',
    name: 'Cards & Containers',
    description: 'Interactive 3D surfaces, holographic reflections, and glassmorphic cards.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'components',
    name: 'Components',
    description: 'macOS magnification docks, gooey navigation bars, CRT terminals, and HUD reticles.',
    iconName: 'Layers',
  },
  {
    id: 'animations',
    name: 'Animations & FX',
    description: 'Canvas mosaic reveals, physics gravity tag clouds, and floating doodle stickers.',
    iconName: 'Wand2',
  },
];

const INITIAL_REGISTRY: RegistryItem[] = [
  {
    id: 'spotlight-card',
    name: 'Spotlight 3D Card',
    category: 'cards',
    description: 'Cursor-tracking radial light cone with fluid 3D spring tilt physics and dynamic border reflection highlights.',
    badge: 'POPULAR',
    dependencies: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx sidd-reacts add spotlight-card',
    propsConfig: [
      {
        name: 'tiltAmount',
        label: 'Tilt Angle (°)',
        type: 'slider',
        defaultValue: 14,
        min: 0,
        max: 30,
        step: 1,
        description: 'Maximum degree of 3D tilt perspective on cursor movement.',
      },
      {
        name: 'spotlightSize',
        label: 'Spotlight Radius (px)',
        type: 'slider',
        defaultValue: 350,
        min: 150,
        max: 600,
        step: 25,
        description: 'Size of the radial spotlight cone following the cursor.',
      },
      {
        name: 'spotlightColor',
        label: 'Spotlight Glow Color',
        type: 'color',
        defaultValue: '#6366f1',
        description: 'Hex or RGBA glow color for the cursor light cone.',
      },
      {
        name: 'glowOpacity',
        label: 'Glow Intensity',
        type: 'slider',
        defaultValue: 0.8,
        min: 0.1,
        max: 1,
        step: 0.05,
        description: 'Opacity factor for the radial spotlight glow.',
      },
      {
        name: 'borderGlow',
        label: 'Border Glow Highlight',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable dynamic border refraction reflection mask.',
      },
      {
        name: 'title',
        label: 'Card Title',
        type: 'text',
        defaultValue: 'Interactive 3D Spotlight Card',
      },
    ],
    apiDocs: [
      { name: 'spotlightColor', type: 'string', default: "'rgba(99, 102, 241, 0.25)'", description: 'Color of the cursor spotlight' },
      { name: 'spotlightSize', type: 'number', default: '350', description: 'Radius in pixels of the spotlight glow' },
      { name: 'tiltAmount', type: 'number', default: '12', description: 'Degree of maximum 3D tilt perspective' },
      { name: 'borderGlow', type: 'boolean', default: 'true', description: 'Render dynamic mask border highlight' },
      { name: 'glowOpacity', type: 'number', default: '0.8', description: 'Max opacity of the spotlight cone on hover' },
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Custom inner content to render within the 3D surface' },
    ],
    component: SpotlightCard,
    demoUsage: `import { SpotlightCard } from '@/components/SpotlightCard';

export default function Demo() {
  return (
    <SpotlightCard
      spotlightColor="rgba(99, 102, 241, 0.3)"
      spotlightSize={380}
      tiltAmount={15}
      title="High-Performance 3D Card"
      description="Hover to test radial lighting and smooth Framer Motion spring physics."
      tag="FEATURED"
    />
  );
}`,
    codeTSX: `import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface SpotlightCardProps {
  children?: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  tiltAmount?: number;
  borderGlow?: boolean;
  glowOpacity?: number;
  title?: string;
  description?: string;
  tag?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.25)',
  spotlightSize = 350,
  tiltAmount = 12,
  borderGlow = true,
  glowOpacity = 0.8,
  title = 'Interactive 3D Spotlight Card',
  description = 'Hover your cursor across the surface to see radial light tracking and 3D tilt.',
  tag = 'FEATURED',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={\`relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl \${className}\`}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? glowOpacity : 0,
            background: \`radial-gradient(\${spotlightSize}px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
          }}
        />
        {borderGlow && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              opacity: isHovered ? 1 : 0,
              background: \`radial-gradient(200px circle at \${mousePos.x}px \${mousePos.y}px, rgba(255,255,255,0.15), transparent 70%)\`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
        )}
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 space-y-4">
          {children || (
            <>
              <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                {tag}
              </span>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-zinc-400">{description}</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.25)',
  spotlightSize = 350,
  tiltAmount = 12,
  borderGlow = true,
  glowOpacity = 0.8,
  title = 'Interactive 3D Spotlight Card',
  description = 'Hover your cursor across the surface to see radial light tracking and 3D tilt.',
  tag = 'FEATURED',
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={\`relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl \${className}\`}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? glowOpacity : 0,
            background: \`radial-gradient(\${spotlightSize}px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
          }}
        />
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 space-y-4">
          {children || (
            <>
              <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                {tag}
              </span>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-zinc-400">{description}</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}`,
    tailwindConfig: `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#060608',
      },
    },
  },
};`,
  },
  {
    id: 'true-focus',
    name: 'True Focus Split Text',
    category: 'text',
    description: 'Dynamic text focus tracking where words blur smoothly while an animated bounding box snaps to the active target.',
    badge: 'NEW',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add true-focus',
    propsConfig: [
      {
        name: 'sentence',
        label: 'Display Sentence',
        type: 'text',
        defaultValue: 'Craft Modern High-Performance Interfaces With SIDD-Reacts',
      },
      {
        name: 'manualMode',
        label: 'Interactive Hover Mode',
        type: 'boolean',
        defaultValue: false,
        description: 'Toggle between auto-cycling focus and manual cursor hover tracking.',
      },
      {
        name: 'blurAmount',
        label: 'Background Blur (px)',
        type: 'slider',
        defaultValue: 4,
        min: 1,
        max: 10,
        step: 1,
      },
      {
        name: 'borderColor',
        label: 'Focus Box Border Color',
        type: 'color',
        defaultValue: '#6366f1',
      },
      {
        name: 'animationDuration',
        label: 'Cycle Speed (Seconds)',
        type: 'slider',
        defaultValue: 1.8,
        min: 0.8,
        max: 4,
        step: 0.2,
      },
    ],
    apiDocs: [
      { name: 'sentence', type: 'string', default: "'Craft Modern High-Performance Interfaces...'", description: 'String of words to split and track' },
      { name: 'manualMode', type: 'boolean', default: 'false', description: 'Enable manual mouse hover tracking instead of auto timer' },
      { name: 'blurAmount', type: 'number', default: '4', description: 'Blur amount in pixels for unfocused words' },
      { name: 'borderColor', type: 'string', default: "'#6366f1'", description: 'Color for the animated bounding focus box' },
      { name: 'animationDuration', type: 'number', default: '2', description: 'Seconds to remain on each focused word in auto mode' },
    ],
    component: TrueFocusText,
    demoUsage: `import { TrueFocusText } from '@/components/TrueFocusText';

export default function Demo() {
  return (
    <TrueFocusText
      sentence="Elevate Your Web Experience With SIDD-Reacts"
      manualMode={false}
      blurAmount={4}
      borderColor="#38bdf8"
      animationDuration={2}
    />
  );
}`,
    codeTSX: `import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface TrueFocusTextProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  className?: string;
}

export const TrueFocusText: React.FC<TrueFocusTextProps> = ({
  sentence = 'Craft Modern High-Performance Interfaces With SIDD-Reacts',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#6366f1',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  animationDuration = 2,
  className = '',
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const activeIndex = manualMode ? (hoverIndex !== null ? hoverIndex : currentIndex) : currentIndex;

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, animationDuration * 1000);
    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration]);

  useEffect(() => {
    const el = wordRefs.current[activeIndex];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      setFocusRect({
        x: elRect.left - contRect.left - 8,
        y: elRect.top - contRect.top - 4,
        width: elRect.width + 16,
        height: elRect.height + 8,
      });
    }
  }, [activeIndex, sentence]);

  return (
    <div ref={containerRef} className={\`relative inline-flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 p-6 select-none \${className}\`}>
      {focusRect.width > 0 && (
        <motion.div
          animate={{ x: focusRect.x, y: focusRect.y, width: focusRect.width, height: focusRect.height }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="pointer-events-none absolute left-0 top-0 rounded-lg border-2 z-20"
          style={{ borderColor, boxShadow: \`0 0 20px \${glowColor}\` }}
        >
          <span className="absolute -top-1.5 -left-1.5 h-3 w-3 border-t-2 border-l-2" style={{ borderColor }} />
          <span className="absolute -top-1.5 -right-1.5 h-3 w-3 border-t-2 border-r-2" style={{ borderColor }} />
          <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b-2 border-l-2" style={{ borderColor }} />
          <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b-2 border-r-2" style={{ borderColor }} />
        </motion.div>
      )}
      {words.map((word, idx) => {
        const isFocused = idx === activeIndex;
        return (
          <span
            key={idx}
            ref={(el) => { wordRefs.current[idx] = el; }}
            onMouseEnter={() => manualMode && setHoverIndex(idx)}
            onMouseLeave={() => manualMode && setHoverIndex(null)}
            className="relative cursor-pointer text-3xl md:text-4xl font-extrabold tracking-tight transition-all duration-300"
            style={{
              filter: isFocused ? 'blur(0px)' : \`blur(\${blurAmount}px)\`,
              opacity: isFocused ? 1 : 0.35,
              color: isFocused ? '#ffffff' : '#a1a1aa',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};`,
    codeJSX: `import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function TrueFocusText({
  sentence = 'Craft Modern High-Performance Interfaces With SIDD-Reacts',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#6366f1',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  animationDuration = 2,
  className = '',
}) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const wordRefs = useRef([]);

  const activeIndex = manualMode ? (hoverIndex !== null ? hoverIndex : currentIndex) : currentIndex;

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, animationDuration * 1000);
    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration]);

  useEffect(() => {
    const el = wordRefs.current[activeIndex];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      setFocusRect({
        x: elRect.left - contRect.left - 8,
        y: elRect.top - contRect.top - 4,
        width: elRect.width + 16,
        height: elRect.height + 8,
      });
    }
  }, [activeIndex, sentence]);

  return (
    <div ref={containerRef} className={\`relative inline-flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 p-6 \${className}\`}>
      {focusRect.width > 0 && (
        <motion.div
          animate={{ x: focusRect.x, y: focusRect.y, width: focusRect.width, height: focusRect.height }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="pointer-events-none absolute left-0 top-0 rounded-lg border-2 z-20"
          style={{ borderColor, boxShadow: \`0 0 20px \${glowColor}\` }}
        />
      )}
      {words.map((word, idx) => {
        const isFocused = idx === activeIndex;
        return (
          <span
            key={idx}
            ref={(el) => { wordRefs.current[idx] = el; }}
            onMouseEnter={() => manualMode && setHoverIndex(idx)}
            onMouseLeave={() => manualMode && setHoverIndex(null)}
            className="relative cursor-pointer text-3xl font-extrabold transition-all duration-300"
            style={{
              filter: isFocused ? 'blur(0px)' : \`blur(\${blurAmount}px)\`,
              opacity: isFocused ? 1 : 0.35,
              color: isFocused ? '#ffffff' : '#a1a1aa',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}`,
  },
  {
    id: 'particle-vortex',
    name: 'Interactive Particle Vortex Canvas',
    category: 'backgrounds',
    description: 'High-performance HTML5 canvas particle simulation with gravitational vortex mechanics, velocity drag, and proximity mesh linking.',
    badge: 'CANVAS',
    dependencies: [],
    cliCommand: 'npx sidd-reacts add particle-vortex',
    propsConfig: [
      {
        name: 'particleCount',
        label: 'Particle Count',
        type: 'slider',
        defaultValue: 110,
        min: 40,
        max: 250,
        step: 10,
      },
      {
        name: 'vortexStrength',
        label: 'Vortex Gravity Force',
        type: 'slider',
        defaultValue: 1.8,
        min: 0.5,
        max: 4,
        step: 0.1,
      },
      {
        name: 'vortexMode',
        label: 'Vortex Physics Mode',
        type: 'select',
        defaultValue: 'attract',
        options: [
          { label: 'Gravitational Attract', value: 'attract' },
          { label: 'Orbit Spiral', value: 'orbit' },
          { label: 'Repel Push', value: 'repel' },
        ],
      },
      {
        name: 'connectionDistance',
        label: 'Link Line Proximity (px)',
        type: 'slider',
        defaultValue: 90,
        min: 40,
        max: 160,
        step: 5,
      },
      {
        name: 'particleColor',
        label: 'Primary Particle Accent',
        type: 'color',
        defaultValue: '#6366f1',
      },
    ],
    apiDocs: [
      { name: 'particleCount', type: 'number', default: '100', description: 'Total number of active particles simulated on canvas' },
      { name: 'vortexStrength', type: 'number', default: '1.8', description: 'Gravitational pull or orbital angular acceleration' },
      { name: 'vortexMode', type: "'orbit' | 'attract' | 'repel'", default: "'orbit'", description: 'Physics interaction mode with cursor position' },
      { name: 'connectionDistance', type: 'number', default: '90', description: 'Max distance in pixels to draw line linkages between particles' },
      { name: 'speed', type: 'number', default: '1', description: 'Global simulation speed multiplier' },
    ],
    component: ParticleVortex,
    demoUsage: `import { ParticleVortex } from '@/components/ParticleVortex';

export default function Demo() {
  return (
    <ParticleVortex
      particleCount={120}
      vortexStrength={2}
      vortexMode="orbit"
      connectionDistance={100}
      particleColor="#38bdf8"
    />
  );
}`,
    codeTSX: `import React, { useRef, useEffect } from 'react';

export interface ParticleVortexProps {
  particleCount?: number;
  vortexStrength?: number;
  connectionDistance?: number;
  particleColor?: string;
  vortexMode?: 'orbit' | 'attract' | 'repel';
  speed?: number;
}

export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  particleCount = 100,
  vortexStrength = 1.8,
  connectionDistance = 90,
  particleColor = '#6366f1',
  vortexMode = 'orbit',
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const mouse = { x: width / 2, y: height / 2, isHovered: false };
    const particles = [];
    const colors = [particleColor, '#38bdf8', '#ec4899', '#a855f7'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * (Math.min(width, height) * 0.45);
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1.2,
        baseRadius: radius,
        angle: angle,
        angularSpeed: (Math.random() * 0.02 + 0.005) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = mouse.isHovered ? mouse.x : width / 2;
      const cy = mouse.isHovered ? mouse.y : height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.angularSpeed * vortexStrength;
        const targetX = cx + Math.cos(p.angle) * p.baseRadius;
        const targetY = cy + Math.sin(p.angle) * p.baseRadius;

        p.vx += (targetX - p.x) * 0.05;
        p.vy += (targetY - p.y) * 0.05;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
            ctx.globalAlpha = (1 - dist / connectionDistance) * 0.4;
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
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount, vortexStrength, connectionDistance, particleColor, vortexMode, speed]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair block" />
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useEffect } from 'react';

export function ParticleVortex({
  particleCount = 100,
  vortexStrength = 1.8,
  connectionDistance = 90,
  particleColor = '#6366f1',
  vortexMode = 'orbit',
  speed = 1,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const mouse = { x: width / 2, y: height / 2, isHovered: false };
    const particles = [];
    const colors = [particleColor, '#38bdf8', '#ec4899', '#a855f7'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * (Math.min(width, height) * 0.45);
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1.2,
        baseRadius: radius,
        angle: angle,
        angularSpeed: (Math.random() * 0.02 + 0.005) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = mouse.isHovered ? mouse.x : width / 2;
      const cy = mouse.isHovered ? mouse.y : height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.angularSpeed * vortexStrength;
        const targetX = cx + Math.cos(p.angle) * p.baseRadius;
        const targetY = cy + Math.sin(p.angle) * p.baseRadius;

        p.vx += (targetX - p.x) * 0.05;
        p.vy += (targetY - p.y) * 0.05;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount, vortexStrength, connectionDistance, particleColor, vortexMode, speed]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair block" />
    </div>
  );
}`,
  },
  {
    id: 'aurora-background',
    name: 'Aurora Ambient Background',
    category: 'backgrounds',
    description: 'Smooth multi-layered fluid gradient mesh with organic sinusoidal wave distortion and subtle film grain overlay.',
    badge: 'HOT',
    dependencies: [],
    cliCommand: 'npx sidd-reacts add aurora-background',
    propsConfig: [
      {
        name: 'color1',
        label: 'Primary Wave Color',
        type: 'color',
        defaultValue: '#38bdf8',
      },
      {
        name: 'color2',
        label: 'Secondary Wave Color',
        type: 'color',
        defaultValue: '#6366f1',
      },
      {
        name: 'color3',
        label: 'Tertiary Wave Color',
        type: 'color',
        defaultValue: '#ec4899',
      },
      {
        name: 'speed',
        label: 'Flow Speed',
        type: 'slider',
        defaultValue: 1,
        min: 0.2,
        max: 3,
        step: 0.2,
      },
      {
        name: 'blur',
        label: 'Diffusion Blur (px)',
        type: 'slider',
        defaultValue: 60,
        min: 20,
        max: 100,
        step: 5,
      },
      {
        name: 'intensity',
        label: 'Glow Intensity',
        type: 'slider',
        defaultValue: 0.8,
        min: 0.2,
        max: 1.5,
        step: 0.1,
      },
      {
        name: 'showNoise',
        label: 'Film Grain Texture',
        type: 'boolean',
        defaultValue: true,
      },
    ],
    apiDocs: [
      { name: 'color1', type: 'string', default: "'#38bdf8'", description: 'First primary radial gradient wave color' },
      { name: 'color2', type: 'string', default: "'#6366f1'", description: 'Second fluid wave color' },
      { name: 'color3', type: 'string', default: "'#ec4899'", description: 'Third ambient bloom color' },
      { name: 'speed', type: 'number', default: '1', description: 'Sinusoidal oscillation animation speed' },
      { name: 'blur', type: 'number', default: '60', description: 'CSS blur filter strength applied to the canvas' },
      { name: 'showNoise', type: 'boolean', default: 'true', description: 'Overlay SVG fractal noise layer for cinematic texture' },
    ],
    component: AuroraBackground,
    demoUsage: `import { AuroraBackground } from '@/components/AuroraBackground';

export default function Demo() {
  return (
    <AuroraBackground
      color1="#38bdf8"
      color2="#6366f1"
      color3="#ec4899"
      speed={1.2}
      blur={60}
    >
      <h1 className="text-4xl font-extrabold text-white">Aurora Fluid Lighting</h1>
    </AuroraBackground>
  );
}`,
    codeTSX: `import React, { useRef, useEffect } from 'react';

export interface AuroraBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  blur?: number;
  intensity?: number;
  showNoise?: boolean;
  children?: React.ReactNode;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  color1 = '#38bdf8',
  color2 = '#6366f1',
  color3 = '#ec4899',
  speed = 1,
  blur = 60,
  intensity = 0.8,
  showNoise = true,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let time = 0;

    const render = () => {
      time += 0.008 * speed;
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // Blob 1
      const x1 = width * 0.3 + Math.sin(time * 0.7) * (width * 0.25);
      const y1 = height * 0.4 + Math.cos(time * 0.5) * (height * 0.2);
      const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, width * 0.5);
      g1.addColorStop(0, color1);
      g1.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.6 * intensity;
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x1, y1, width * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Blob 2
      const x2 = width * 0.7 + Math.cos(time * 0.9) * (width * 0.25);
      const y2 = height * 0.6 + Math.sin(time * 0.6) * (height * 0.25);
      const g2 = ctx.createRadialGradient(x2, y2, 10, x2, y2, width * 0.55);
      g2.addColorStop(0, color2);
      g2.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.55 * intensity;
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x2, y2, width * 0.55, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [color1, color2, color3, speed, intensity]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] min-h-[380px] flex items-center justify-center">
      <canvas ref={canvasRef} style={{ filter: \`blur(\${blur}px)\` }} className="absolute inset-0 w-full h-full pointer-events-none scale-110" />
      {showNoise && (
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\` }} />
      )}
      <div className="relative z-10 w-full p-8 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useEffect } from 'react';

export function AuroraBackground({
  color1 = '#38bdf8',
  color2 = '#6366f1',
  color3 = '#ec4899',
  speed = 1,
  blur = 60,
  intensity = 0.8,
  showNoise = true,
  children,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let time = 0;

    const render = () => {
      time += 0.008 * speed;
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      const x1 = width * 0.3 + Math.sin(time * 0.7) * (width * 0.25);
      const y1 = height * 0.4 + Math.cos(time * 0.5) * (height * 0.2);
      const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, width * 0.5);
      g1.addColorStop(0, color1);
      g1.addColorStop(0.7, 'transparent');
      ctx.globalAlpha = 0.6 * intensity;
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x1, y1, width * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [color1, color2, color3, speed, intensity]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] min-h-[380px] flex items-center justify-center">
      <canvas ref={canvasRef} style={{ filter: \`blur(\${blur}px)\` }} className="absolute inset-0 w-full h-full pointer-events-none scale-110" />
      <div className="relative z-10 w-full p-8 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}`,
  },
  {
    id: 'magnetic-button',
    name: 'Magnetic Ripple Button',
    category: 'buttons',
    description: 'Interactive CTA button with magnetic spring physics tracking cursor proximity and multi-wave expanding ripple burst on click.',
    badge: 'SPRING',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add magnetic-button',
    propsConfig: [
      {
        name: 'children',
        label: 'Button Label',
        type: 'text',
        defaultValue: 'Explore SIDD-Reacts UI',
      },
      {
        name: 'magneticStrength',
        label: 'Magnetic Pull Strength',
        type: 'slider',
        defaultValue: 0.35,
        min: 0.1,
        max: 0.8,
        step: 0.05,
      },
      {
        name: 'springStiffness',
        label: 'Spring Stiffness',
        type: 'slider',
        defaultValue: 250,
        min: 100,
        max: 500,
        step: 25,
      },
      {
        name: 'springDamping',
        label: 'Spring Damping',
        type: 'slider',
        defaultValue: 18,
        min: 8,
        max: 40,
        step: 2,
      },
      {
        name: 'glowColor',
        label: 'Ambient Glow Color',
        type: 'color',
        defaultValue: '#6366f1',
      },
    ],
    apiDocs: [
      { name: 'magneticStrength', type: 'number', default: '0.35', description: 'Cursor attraction distance pull factor' },
      { name: 'springStiffness', type: 'number', default: '250', description: 'Framer Motion spring stiffness constant' },
      { name: 'springDamping', type: 'number', default: '18', description: 'Spring damping resistance factor' },
      { name: 'rippleColor', type: 'string', default: "'rgba(255, 255, 255, 0.4)'", description: 'Color of expanding click ripple ring' },
      { name: 'onClick', type: '() => void', default: 'undefined', description: 'Callback function triggered when clicked' },
    ],
    component: MagneticButton,
    demoUsage: `import { MagneticButton } from '@/components/MagneticButton';

export default function Demo() {
  return (
    <MagneticButton
      magneticStrength={0.4}
      springStiffness={260}
      glowColor="#38bdf8"
      onClick={() => console.log('Clicked!')}
    >
      Join the Community
    </MagneticButton>
  );
}`,
    codeTSX: `import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface MagneticButtonProps {
  children?: React.ReactNode;
  magneticStrength?: number;
  springStiffness?: number;
  springDamping?: number;
  rippleColor?: string;
  glowColor?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children = 'Explore Components',
  magneticStrength = 0.35,
  springStiffness = 250,
  springDamping = 18,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  glowColor = 'rgba(99, 102, 241, 0.5)',
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: springDamping, stiffness: springStiffness, mass: 0.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * magneticStrength);
    mouseY.set((e.clientY - centerY) * magneticStrength);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const newRipple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 800);
    if (onClick) onClick();
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      onClick={handleClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className="group relative overflow-hidden rounded-full border border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl backdrop-blur-md"
    >
      <div className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-75" style={{ background: glowColor }} />
      <div className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: \`radial-gradient(120px circle at \${mousePos.x}px \${mousePos.y}px, rgba(255,255,255,0.35), transparent 80%)\` }} />
      {ripples.map((ripple) => (
        <span key={ripple.id} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping" style={{ left: ripple.x, top: ripple.y, width: '160px', height: '160px', background: rippleColor }} />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticButton({
  children = 'Explore Components',
  magneticStrength = 0.35,
  springStiffness = 250,
  springDamping = 18,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  glowColor = 'rgba(99, 102, 241, 0.5)',
  onClick,
}) {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: springDamping, stiffness: springStiffness, mass: 0.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * magneticStrength);
    mouseY.set((e.clientY - centerY) * magneticStrength);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleClick = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const newRipple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 800);
    if (onClick) onClick();
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      onClick={handleClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className="group relative overflow-hidden rounded-full border border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl"
    >
      <div className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-75" style={{ background: glowColor }} />
      {ripples.map((ripple) => (
        <span key={ripple.id} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping" style={{ left: ripple.x, top: ripple.y, width: '160px', height: '160px', background: rippleColor }} />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}`,
  },
  {
    id: 'decrypted-text',
    name: 'Decrypted Scramble Text',
    category: 'text',
    description: 'Cyberpunk-inspired text decoder that scrambles randomized matrix glyphs and ASCII characters before sequentially resolving to target string.',
    badge: 'HOT',
    dependencies: [],
    cliCommand: 'npx sidd-reacts add decrypted-text',
    propsConfig: [
      {
        name: 'text',
        label: 'Target Text',
        type: 'text',
        defaultValue: 'SYSTEM_SECURE: PROTOCOL_INITIALIZED_2026',
      },
      {
        name: 'speed',
        label: 'Scramble Speed (ms)',
        type: 'slider',
        defaultValue: 35,
        min: 15,
        max: 100,
        step: 5,
      },
      {
        name: 'maxIterations',
        label: 'Scramble Iterations',
        type: 'slider',
        defaultValue: 10,
        min: 4,
        max: 25,
        step: 1,
      },
      {
        name: 'revealDirection',
        label: 'Reveal Direction',
        type: 'select',
        defaultValue: 'start',
        options: [
          { label: 'Left to Right', value: 'start' },
          { label: 'Right to Left', value: 'end' },
          { label: 'Center Outward', value: 'center' },
        ],
      },
      {
        name: 'glowColor',
        label: 'Scramble Glow Color',
        type: 'color',
        defaultValue: '#38bdf8',
      },
    ],
    apiDocs: [
      { name: 'text', type: 'string', default: "'SYSTEM_SECURE...'", description: 'String to decode and scramble' },
      { name: 'speed', type: 'number', default: '40', description: 'Interval in milliseconds between scrambling steps' },
      { name: 'maxIterations', type: 'number', default: '12', description: 'Number of random scrambles per character before resolution' },
      { name: 'revealDirection', type: "'start' | 'end' | 'center'", default: "'start'", description: 'Directional path of resolution' },
      { name: 'animateOn', type: "'hover' | 'view' | 'auto'", default: "'hover'", description: 'Event trigger to execute decode sequence' },
    ],
    component: DecryptedText,
    demoUsage: `import { DecryptedText } from '@/components/DecryptedText';

export default function Demo() {
  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
      <DecryptedText
        text="ACCESS_GRANTED_AGENT_007"
        speed={30}
        maxIterations={12}
        revealDirection="start"
      />
    </div>
  );
}`,
    codeTSX: `import React, { useState, useEffect, useRef } from 'react';

export interface DecryptedTextProps {
  text?: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  revealDirection?: 'start' | 'end' | 'center';
  animateOn?: 'hover' | 'view' | 'auto';
  className?: string;
}

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text = 'SYSTEM_SECURE: PROTOCOL_INITIALIZED_2026',
  speed = 40,
  maxIterations = 12,
  characters = CYBER_CHARS,
  revealDirection = 'start',
  animateOn = 'hover',
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    let iteration = 0;
    const totalLength = text.length;

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            let isResolved = false;
            if (revealDirection === 'start') {
              isResolved = index < Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else if (revealDirection === 'end') {
              isResolved = index >= totalLength - Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else {
              const mid = totalLength / 2;
              isResolved = Math.abs(index - mid) <= (iteration / (maxIterations * 2)) * mid;
            }

            if (isResolved) return text[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations * 2) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  return (
    <span
      onMouseEnter={() => animateOn === 'hover' && !isScrambling && startScramble()}
      onClick={() => !isScrambling && startScramble()}
      className={\`inline-block cursor-pointer font-mono font-bold tracking-wider select-none \${className}\`}
    >
      {displayText.split('').map((char, i) => (
        <span key={i} className={char === text[i] ? 'text-white' : 'text-cyan-400 font-semibold'}>
          {char}
        </span>
      ))}
    </span>
  );
};`,
    codeJSX: `import React, { useState, useRef } from 'react';

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function DecryptedText({
  text = 'SYSTEM_SECURE: PROTOCOL_INITIALIZED_2026',
  speed = 40,
  maxIterations = 12,
  characters = CYBER_CHARS,
  revealDirection = 'start',
  animateOn = 'hover',
  className = '',
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    let iteration = 0;
    const totalLength = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            let isResolved = false;
            if (revealDirection === 'start') {
              isResolved = index < Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else if (revealDirection === 'end') {
              isResolved = index >= totalLength - Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else {
              const mid = totalLength / 2;
              isResolved = Math.abs(index - mid) <= (iteration / (maxIterations * 2)) * mid;
            }
            if (isResolved) return text[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations * 2) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  return (
    <span
      onMouseEnter={() => animateOn === 'hover' && !isScrambling && startScramble()}
      onClick={() => !isScrambling && startScramble()}
      className={\`inline-block cursor-pointer font-mono font-bold tracking-wider \${className}\`}
    >
      {displayText.split('').map((char, i) => (
        <span key={i} className={char === text[i] ? 'text-white' : 'text-cyan-400'}>
          {char}
        </span>
      ))}
    </span>
  );
}`,
  },
  {
    id: 'pixel-card-reveal',
    name: 'Pixelated Image Reveal',
    category: 'animations',
    description: 'Dynamic canvas pixel mosaic transition that dissolves retro 8-bit pixelation into ultra crisp 4K imagery on hover.',
    badge: 'CANVAS',
    dependencies: [],
    cliCommand: 'npx sidd-reacts add pixel-card-reveal',
    propsConfig: [
      {
        name: 'title',
        label: 'Card Title',
        type: 'text',
        defaultValue: 'Cyberpunk Architecture',
      },
      {
        name: 'initialPixelSize',
        label: 'Initial Pixel Block Size',
        type: 'slider',
        defaultValue: 28,
        min: 8,
        max: 64,
        step: 2,
      },
      {
        name: 'revealSpeed',
        label: 'De-pixelation Speed',
        type: 'slider',
        defaultValue: 0.08,
        min: 0.02,
        max: 0.25,
        step: 0.01,
      },
      {
        name: 'imageUrl',
        label: 'Image Source URL',
        type: 'text',
        defaultValue: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
    ],
    apiDocs: [
      { name: 'imageUrl', type: 'string', default: "'https://images.unsplash.com/...'", description: 'Source URL of image to render on canvas' },
      { name: 'initialPixelSize', type: 'number', default: '28', description: 'Initial block pixel size when not hovered' },
      { name: 'hoverPixelSize', type: 'number', default: '1', description: 'Target pixel block size on hover (1 = crystal clear)' },
      { name: 'revealSpeed', type: 'number', default: '0.08', description: 'Interpolation speed factor for transition' },
    ],
    component: PixelCardReveal,
    demoUsage: `import { PixelCardReveal } from '@/components/PixelCardReveal';

export default function Demo() {
  return (
    <PixelCardReveal
      title="Futuristic City Skyline"
      subtitle="Hover to transition from 8-bit mosaic to full fidelity"
      initialPixelSize={32}
      revealSpeed={0.1}
    />
  );
}`,
    codeTSX: `import React, { useRef, useEffect, useState } from 'react';

export interface PixelCardRevealProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  initialPixelSize?: number;
  hoverPixelSize?: number;
  revealSpeed?: number;
}

export const PixelCardReveal: React.FC<PixelCardRevealProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  title = 'Cyberpunk Architecture',
  subtitle = 'Hover to dissolve digital pixelation into ultra high-fidelity rendering',
  initialPixelSize = 28,
  hoverPixelSize = 1,
  revealSpeed = 0.08,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentPixelSizeRef = useRef(initialPixelSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const render = () => {
        const targetSize = isHovered ? hoverPixelSize : initialPixelSize;
        currentPixelSizeRef.current += (targetSize - currentPixelSizeRef.current) * revealSpeed;

        const pSize = Math.max(1, Math.round(currentPixelSizeRef.current));
        const width = (canvas.width = 400);
        const height = (canvas.height = 260);

        if (pSize <= 1) {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          const offCanvas = document.createElement('canvas');
          const offCtx = offCanvas.getContext('2d');
          if (offCtx) {
            const w = Math.max(1, Math.floor(width / pSize));
            const h = Math.max(1, Math.floor(height / pSize));
            offCanvas.width = w;
            offCanvas.height = h;
            offCtx.drawImage(img, 0, 0, w, h);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(offCanvas, 0, 0, w, h, 0, 0, width, height);
          }
        }
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    };

    return () => cancelAnimationFrame(animationFrameId);
  }, [imageUrl, isHovered, initialPixelSize, hoverPixelSize, revealSpeed]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-xl bg-zinc-900">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 pt-4">
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useEffect, useState } from 'react';

export function PixelCardReveal({
  imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  title = 'Cyberpunk Architecture',
  subtitle = 'Hover to dissolve digital pixelation into ultra high-fidelity rendering',
  initialPixelSize = 28,
  hoverPixelSize = 1,
  revealSpeed = 0.08,
}) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentPixelSizeRef = useRef(initialPixelSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const render = () => {
        const targetSize = isHovered ? hoverPixelSize : initialPixelSize;
        currentPixelSizeRef.current += (targetSize - currentPixelSizeRef.current) * revealSpeed;
        const pSize = Math.max(1, Math.round(currentPixelSizeRef.current));
        const width = (canvas.width = 400);
        const height = (canvas.height = 260);

        if (pSize <= 1) {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          const offCanvas = document.createElement('canvas');
          const offCtx = offCanvas.getContext('2d');
          if (offCtx) {
            const w = Math.max(1, Math.floor(width / pSize));
            const h = Math.max(1, Math.floor(height / pSize));
            offCanvas.width = w;
            offCanvas.height = h;
            offCtx.drawImage(img, 0, 0, w, h);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(offCanvas, 0, 0, w, h, 0, 0, width, height);
          }
        }
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    };

    return () => cancelAnimationFrame(animationFrameId);
  }, [imageUrl, isHovered, initialPixelSize, hoverPixelSize, revealSpeed]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-xl bg-zinc-900">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 pt-4">
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'floating-dock',
    name: 'Floating Mac Spring Dock',
    category: 'components',
    description: 'macOS inspired floating magnification dock with smooth physics spring scaling, animated tooltips, and interactive icon items.',
    badge: 'SPRING',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add floating-dock',
    propsConfig: [
      {
        name: 'baseSize',
        label: 'Base Icon Size (px)',
        type: 'slider',
        defaultValue: 48,
        min: 36,
        max: 64,
        step: 4,
      },
      {
        name: 'magnificationScale',
        label: 'Max Hover Magnification',
        type: 'slider',
        defaultValue: 1.6,
        min: 1.2,
        max: 2.2,
        step: 0.1,
      },
      {
        name: 'distanceThreshold',
        label: 'Proximity Threshold (px)',
        type: 'slider',
        defaultValue: 140,
        min: 80,
        max: 240,
        step: 10,
      },
    ],
    apiDocs: [
      { name: 'baseSize', type: 'number', default: '48', description: 'Default width and height of dock icon containers in pixels' },
      { name: 'magnificationScale', type: 'number', default: '1.6', description: 'Scale multiplier applied when cursor is directly over icon' },
      { name: 'distanceThreshold', type: 'number', default: '140', description: 'Cursor proximity distance in pixels where magnification begins' },
      { name: 'items', type: 'DockItem[]', default: 'DEFAULT_ITEMS', description: 'Array of dock items with id, title, icon, and onClick' },
    ],
    component: FloatingDock,
    demoUsage: `import { FloatingDock } from '@/components/FloatingDock';

export default function Demo() {
  return (
    <FloatingDock
      baseSize={50}
      magnificationScale={1.7}
      distanceThreshold={150}
    />
  );
}`,
    codeTSX: `import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Home, Terminal, Layers, Sparkles, Settings, Github } from 'lucide-react';

export interface DockItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick?: () => void;
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: 'home', title: 'Home', icon: Home },
  { id: 'components', title: 'Components', icon: Layers },
  { id: 'canvas', title: 'Canvas FX', icon: Sparkles },
  { id: 'terminal', title: 'CLI & Terminal', icon: Terminal },
  { id: 'github', title: 'GitHub Repo', icon: Github },
  { id: 'settings', title: 'Preferences', icon: Settings },
];

function DockIcon({
  item,
  mouseX,
  baseSize,
  magnificationScale,
  distanceThreshold,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnificationScale: number;
  distanceThreshold: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-distanceThreshold, 0, distanceThreshold],
    [baseSize, baseSize * magnificationScale, baseSize]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 14 });
  const IconComponent = item.icon;

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.85 }}
      className="relative flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-white cursor-pointer"
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -44 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-white"
        >
          {item.title}
        </motion.div>
      )}
      <IconComponent size={22} />
    </motion.div>
  );
}

export const FloatingDock: React.FC<{ baseSize?: number; magnificationScale?: number; distanceThreshold?: number }> = ({
  baseSize = 48,
  magnificationScale = 1.6,
  distanceThreshold = 140,
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur-2xl"
      >
        {DEFAULT_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} baseSize={baseSize} magnificationScale={magnificationScale} distanceThreshold={distanceThreshold} />
        ))}
      </motion.div>
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Terminal, Layers, Sparkles, Settings, Github } from 'lucide-react';

const DEFAULT_ITEMS = [
  { id: 'home', title: 'Home', icon: Home },
  { id: 'components', title: 'Components', icon: Layers },
  { id: 'canvas', title: 'Canvas FX', icon: Sparkles },
  { id: 'terminal', title: 'CLI & Terminal', icon: Terminal },
  { id: 'github', title: 'GitHub Repo', icon: Github },
  { id: 'settings', title: 'Preferences', icon: Settings },
];

function DockIcon({ item, mouseX, baseSize, magnificationScale, distanceThreshold }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-distanceThreshold, 0, distanceThreshold],
    [baseSize, baseSize * magnificationScale, baseSize]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 14 });
  const IconComponent = item.icon;

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.85 }}
      className="relative flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-white cursor-pointer"
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -44 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-white"
        >
          {item.title}
        </motion.div>
      )}
      <IconComponent size={22} />
    </motion.div>
  );
}

export function FloatingDock({ baseSize = 48, magnificationScale = 1.6, distanceThreshold = 140 }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur-2xl"
      >
        {DEFAULT_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} baseSize={baseSize} magnificationScale={magnificationScale} distanceThreshold={distanceThreshold} />
        ))}
      </motion.div>
    </div>
  );
}`,
  },
  {
    id: 'iridescent-glass-card',
    name: 'Iridescent Glassmorphic Card',
    category: 'cards',
    description: 'Frosted backdrop-filter glass card with dynamic chromatic aberration rainbow refraction borders responding to cursor angles.',
    badge: 'POPULAR',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add iridescent-glass-card',
    propsConfig: [
      {
        name: 'title',
        label: 'Card Title',
        type: 'text',
        defaultValue: 'Holographic Glassmorphism',
      },
      {
        name: 'iridescenceIntensity',
        label: 'Rainbow Refraction Intensity',
        type: 'slider',
        defaultValue: 0.85,
        min: 0.2,
        max: 1,
        step: 0.05,
      },
      {
        name: 'blurStrength',
        label: 'Frosted Glass Blur (px)',
        type: 'slider',
        defaultValue: 20,
        min: 8,
        max: 40,
        step: 2,
      },
      {
        name: 'glassOpacity',
        label: 'Glass Base Opacity',
        type: 'slider',
        defaultValue: 0.65,
        min: 0.2,
        max: 0.9,
        step: 0.05,
      },
    ],
    apiDocs: [
      { name: 'title', type: 'string', default: "'Holographic Glassmorphism'", description: 'Header text rendered inside card' },
      { name: 'iridescenceIntensity', type: 'number', default: '0.85', description: 'Opacity multiplier for the conic chromatic border' },
      { name: 'blurStrength', type: 'number', default: '20', description: 'Backdrop filter blur radius in pixels' },
      { name: 'glassOpacity', type: 'number', default: '0.65', description: 'Background dark alpha transparency' },
    ],
    component: IridescentGlassCard,
    demoUsage: `import { IridescentGlassCard } from '@/components/IridescentGlassCard';

export default function Demo() {
  return (
    <IridescentGlassCard
      title="Prismatic Glass Container"
      subtitle="Reflective holographic edges track mouse angle in real-time"
      iridescenceIntensity={0.9}
      blurStrength={24}
    />
  );
}`,
    codeTSX: `import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export interface IridescentGlassCardProps {
  title?: string;
  subtitle?: string;
  iridescenceIntensity?: number;
  blurStrength?: number;
  glassOpacity?: number;
}

export const IridescentGlassCard: React.FC<IridescentGlassCardProps> = ({
  title = 'Holographic Glassmorphism',
  subtitle = 'Chromatic aberration with dynamic prismatic refraction along borders.',
  iridescenceIntensity = 0.85,
  blurStrength = 20,
  glassOpacity = 0.65,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, angle: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
    setMousePos({ x, y, angle });
  };

  return (
    <div className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6, scale: 1.01 }}
        style={{
          backdropFilter: \`blur(\${blurStrength}px)\`,
          backgroundColor: \`rgba(13, 14, 24, \${glassOpacity})\`,
        }}
        className="relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl"
      >
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-3xl transition-opacity duration-500"
          style={{
            opacity: isHovered ? iridescenceIntensity : 0.3,
            background: \`conic-gradient(from \${mousePos.angle + 90}deg at \${mousePos.x}px \${mousePos.y}px, #ff0080, #7928ca, #0070f3, #00dfd8, #ff0080)\`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300">
              <Sparkles size={13} className="text-pink-400 animate-spin" />
              IRIDESCENT
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white flex items-center justify-between">
              {title}
              <ArrowUpRight className="text-zinc-400" size={20} />
            </h3>
            <p className="text-sm text-zinc-300">{subtitle}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export function IridescentGlassCard({
  title = 'Holographic Glassmorphism',
  subtitle = 'Chromatic aberration with dynamic prismatic refraction along borders.',
  iridescenceIntensity = 0.85,
  blurStrength = 20,
  glassOpacity = 0.65,
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, angle: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
    setMousePos({ x, y, angle });
  };

  return (
    <div className="inline-block w-full max-w-md">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6, scale: 1.01 }}
        style={{
          backdropFilter: \`blur(\${blurStrength}px)\`,
          backgroundColor: \`rgba(13, 14, 24, \${glassOpacity})\`,
        }}
        className="relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl"
      >
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-3xl transition-opacity duration-500"
          style={{
            opacity: isHovered ? iridescenceIntensity : 0.3,
            background: \`conic-gradient(from \${mousePos.angle + 90}deg at \${mousePos.x}px \${mousePos.y}px, #ff0080, #7928ca, #0070f3, #00dfd8, #ff0080)\`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />
        <div className="relative z-10 space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300">
            <Sparkles size={13} className="text-pink-400 animate-spin" />
            IRIDESCENT
          </span>
          <h3 className="text-2xl font-extrabold text-white">{title}</h3>
          <p className="text-sm text-zinc-300">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
}`,
  },
  {
    id: 'hyperspeed-tunnel',
    name: 'Hyperspeed Warp Tunnel',
    category: 'backgrounds',
    description: 'Retro-futuristic warp speed starfield tunnel canvas with interactive cursor trajectory steering and custom color palettes.',
    badge: 'CANVAS',
    dependencies: [],
    cliCommand: 'npx sidd-reacts add hyperspeed-tunnel',
    propsConfig: [
      {
        name: 'warpSpeed',
        label: 'Warp Drive Speed',
        type: 'slider',
        defaultValue: 18,
        min: 4,
        max: 40,
        step: 2,
      },
      {
        name: 'starCount',
        label: 'Starfield Density',
        type: 'slider',
        defaultValue: 350,
        min: 100,
        max: 800,
        step: 50,
      },
      {
        name: 'streakLength',
        label: 'Streak Trail Length',
        type: 'slider',
        defaultValue: 2.5,
        min: 1,
        max: 5,
        step: 0.2,
      },
      {
        name: 'colorTheme',
        label: 'Starfield Color Scheme',
        type: 'select',
        defaultValue: 'cyan',
        options: [
          { label: 'Cyber Cyan', value: 'cyan' },
          { label: 'Neon Purple', value: 'purple' },
          { label: 'Hyperdrive Amber', value: 'amber' },
          { label: 'Matrix Emerald', value: 'emerald' },
        ],
      },
      {
        name: 'interactiveSteer',
        label: 'Cursor Trajectory Steering',
        type: 'boolean',
        defaultValue: true,
      },
    ],
    apiDocs: [
      { name: 'warpSpeed', type: 'number', default: '16', description: 'Z-axis forward acceleration speed of the starfield' },
      { name: 'starCount', type: 'number', default: '350', description: 'Total stars instantiated in 3D projection buffer' },
      { name: 'streakLength', type: 'number', default: '2.5', description: 'Multiplier for star motion blur streak tails' },
      { name: 'colorTheme', type: "'cyan' | 'purple' | 'amber' | 'emerald'", default: "'cyan'", description: 'Color palette preset for stars and streaks' },
      { name: 'interactiveSteer', type: 'boolean', default: 'true', description: 'Enable mouse position based trajectory steering' },
    ],
    component: HyperspeedTunnel,
    demoUsage: `import { HyperspeedTunnel } from '@/components/HyperspeedTunnel';

export default function Demo() {
  return (
    <HyperspeedTunnel
      warpSpeed={22}
      starCount={450}
      colorTheme="purple"
      streakLength={3}
    />
  );
}`,
    codeTSX: `import React, { useRef, useEffect } from 'react';

export interface HyperspeedTunnelProps {
  starCount?: number;
  warpSpeed?: number;
  streakLength?: number;
  colorTheme?: 'cyan' | 'purple' | 'amber' | 'emerald';
  fov?: number;
  interactiveSteer?: boolean;
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

    const stars = [];
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveSteer) return;
      const rect = canvas.getBoundingClientRect();
      targetOffsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 120;
      targetOffsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 120;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.06;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.06;

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

        const pk = fov / (star.pz + warpSpeed * streakLength);
        const prevX = star.x * pk + cx;
        const prevY = star.y * pk + cy;

        if (px < 0 || px > width || py < 0 || py > height) continue;

        const alpha = Math.min(1, Math.max(0, (maxZ - star.z) / (maxZ * 0.75)));
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size * (1 - star.z / maxZ) * 2;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [starCount, warpSpeed, streakLength, colorTheme, fov, interactiveSteer]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
    </div>
  );
};`,
    codeJSX: `import React, { useRef, useEffect } from 'react';

const THEME_PALETTES = {
  cyan: ['#38bdf8', '#0284c7', '#e0f2fe', '#818cf8'],
  purple: ['#c084fc', '#9333ea', '#f3e8ff', '#ec4899'],
  amber: ['#fbbf24', '#f59e0b', '#fef3c7', '#ea580c'],
  emerald: ['#34d399', '#059669', '#d1fae5', '#22d3ee'],
};

export function HyperspeedTunnel({
  starCount = 350,
  warpSpeed = 16,
  streakLength = 2.5,
  colorTheme = 'cyan',
  fov = 220,
  interactiveSteer = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);
    const palette = THEME_PALETTES[colorTheme] || THEME_PALETTES.cyan;

    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const stars = [];
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

    const handleMouseMove = (e) => {
      if (!interactiveSteer) return;
      const rect = canvas.getBoundingClientRect();
      targetOffsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 120;
      targetOffsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 120;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.06;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.06;

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

        const pk = fov / (star.pz + warpSpeed * streakLength);
        const prevX = star.x * pk + cx;
        const prevY = star.y * pk + cy;

        if (px < 0 || px > width || py < 0 || py > height) continue;

        const alpha = Math.min(1, Math.max(0, (maxZ - star.z) / (maxZ * 0.75)));
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size * (1 - star.z / maxZ) * 2;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [starCount, warpSpeed, streakLength, colorTheme, fov, interactiveSteer]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
    </div>
  );
}`,
  },
];

export const REGISTRY: RegistryItem[] = [...INITIAL_REGISTRY, ...NEW_COMPONENTS, ...BUTTON_COMPONENTS];

