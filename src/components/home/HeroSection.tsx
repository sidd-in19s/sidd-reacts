import React, { useState } from 'react';
import { REGISTRY, CATEGORIES } from '../../registry';
import { CodeBlock } from '../showcase/CodeBlock';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Zap,
  Layers,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  Cpu,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface HeroSectionProps {
  onSelectComponent: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectComponent }) => {
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx sidd-reacts add spotlight-card');
    setCopiedCli(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#38bdf8', '#ec4899'],
    });
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Hero Header Section */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-800/90 bg-radial-glow p-8 md:p-14 shadow-2xl">
        {/* Subtle Decorative Ambient Background Elements */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
            <span>SIDD-Reacts Kinetic Design Engine • Production Ready</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Animated React Components & Visual FX{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Engineered for Speed.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-3xl">
            A curated library of {REGISTRY.length} production-ready animated components, 3D interactive cards, fluid ambient backgrounds, and canvas shaders. Completely customizable, copy-paste ready, and installable via the custom <code className="text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded font-mono text-sm">sidd-reacts</code> CLI.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onSelectComponent('spotlight-card')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40 cursor-pointer"
            >
              <span>Explore {REGISTRY.length} Components</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleCopyCli}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-5 py-3.5 font-mono text-xs text-zinc-300 shadow-md backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-white cursor-pointer"
            >
              <Terminal size={15} className="text-indigo-400" />
              <span>npx sidd-reacts add spotlight-card</span>
              {copiedCli ? (
                <Check size={14} className="text-emerald-400 ml-1" />
              ) : (
                <Copy size={14} className="text-zinc-500 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">60 FPS Hardware Physics</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Engineered with Framer Motion spring physics and lightweight HTML5 Canvas routines that properly clean up on unmount.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Palette size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Dark Minimalist Aesthetic</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tailored dark color tokens (`#060608`), subtle borders, glowing ambient radial lighting, and glassmorphic backdrops.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Code2 size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Zero Bloat & CLI Automation</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every component is completely modular and standalone. Install directly with <code className="text-indigo-300 font-mono">npx sidd-reacts add &lt;name&gt;</code> or copy TSX/JSX.
          </p>
        </div>
      </div>

      {/* 10 Components Showcase Grid */}
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Available Components</h2>
            <p className="text-xs text-zinc-400">
              Click any card to launch the interactive live stage with real-time parameter controls and code inspector.
            </p>
          </div>
          <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
            10 Production Components
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {REGISTRY.map((item) => {
            const ComponentPreview = item.component;
            return (
              <div
                key={item.id}
                onClick={() => onSelectComponent(item.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                {/* Mini Preview Stage */}
                <div className="relative h-48 w-full overflow-hidden border-b border-zinc-800/80 bg-[#090a10] bg-grid-pattern flex items-center justify-center p-4">
                  <div className="pointer-events-none scale-75 transform transition-transform group-hover:scale-80">
                    <ComponentPreview {...(item.propsConfig[0] ? { [item.propsConfig[0].name]: item.propsConfig[0].defaultValue } : {})} />
                  </div>

                  {item.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-pink-500/20 border border-pink-500/30 px-2 py-0.5 text-[9px] font-bold uppercase text-pink-300">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {item.category}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {item.dependencies.length} deps
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                      {item.name}
                      <ArrowRight size={16} className="text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>npx sidd-reacts add {item.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Start & Installation Guide */}
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap size={22} className="text-indigo-400" />
            SIDD-Reacts CLI & Quick Start
          </h2>
          <p className="text-xs text-zinc-400">
            Install and integrate any component in your project in seconds using the official CLI.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              1. Add Any Component Directly with SIDD-Reacts CLI
            </h4>
            <CodeBlock
              code={`# Add Spotlight 3D Card
npx sidd-reacts add spotlight-card

# Or add any other component
npx sidd-reacts add particle-vortex
npx sidd-reacts add true-focus`}
              language="bash"
              filename="Terminal"
              showLineNumbers={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              2. Base Animation Dependencies
            </h4>
            <CodeBlock
              code="npm install framer-motion lucide-react clsx tailwind-merge"
              language="bash"
              filename="Terminal"
              showLineNumbers={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              3. Helper Utility (src/utils/cn.ts)
            </h4>
            <CodeBlock
              code={`import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
              language="tsx"
              filename="src/utils/cn.ts"
              showLineNumbers={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
