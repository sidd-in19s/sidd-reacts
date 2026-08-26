import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RegistryItem } from '../../registry/types';
import { BackgroundSwitcher, BackgroundStyle } from './BackgroundSwitcher';
import { LiveControls } from './LiveControls';
import { CodeBlock } from './CodeBlock';
import { PropsTable } from './PropsTable';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Terminal,
  Code2,
  Play,
  Sliders,
  BookOpen,
  FileCode,
  Check,
  Copy,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ComponentShowcaseProps {
  item: RegistryItem;
  onSelectComponent?: (id: string) => void;
  allComponents?: RegistryItem[];
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  item,
  onSelectComponent,
  allComponents = [],
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tailwind' | 'install' | 'api'>('preview');
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDemoContent, setShowDemoContent] = useState(item.category === 'backgrounds');
  const [keyCounter, setKeyCounter] = useState(0);
  const [copiedCli, setCopiedCli] = useState(false);

  // Synchronize showDemoContent when switching between components
  useEffect(() => {
    setShowDemoContent(item.category === 'backgrounds');
  }, [item.id, item.category]);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Trigger window resize event on fullscreen toggle to update canvases
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }, [isFullscreen]);

  // Initialize props values from registry propsConfig defaults
  const initialValues = useMemo(() => {
    const vals: Record<string, any> = {};
    item.propsConfig.forEach((ctrl) => {
      vals[ctrl.name] = ctrl.defaultValue;
    });
    return vals;
  }, [item]);

  const [propValues, setPropValues] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setPropValues(initialValues);
    setKeyCounter((c) => c + 1);
  }, [item.id, initialValues]);

  const handlePropChange = (name: string, value: any) => {
    setPropValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetProps = () => {
    setPropValues(initialValues);
    setKeyCounter((c) => c + 1);
  };

  const handleReload = () => {
    setKeyCounter((c) => c + 1);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(item.cliCommand);
    setCopiedCli(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#38bdf8', '#ec4899'],
    });
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const ComponentToRender = item.component;

  const bgClasses: Record<BackgroundStyle, string> = {
    grid: 'bg-[#090a10] bg-grid-pattern',
    dots: 'bg-[#090a10] bg-dot-pattern',
    dark: 'bg-[#060608]',
    glow: 'bg-radial-glow',
    checker: 'bg-checkerboard',
    light: 'bg-light-mesh',
  };

  // Dynamic Headline text for background hero demo mockup
  const getDemoHeadline = () => {
    if (item.id === 'aurora-background') return 'Soft rolling gradient waves fading into haze.';
    if (item.id === 'particle-vortex') return 'Interactive gravitational vortex swirling in real-time.';
    if (item.id === 'hyperspeed-tunnel') return 'Hyperspeed starfield warp drive across space.';
    return 'Craft modern high-performance interfaces with SIDD-Reacts.';
  };

  // Full-Edge Stage Content with Pass-Through Mouse Events
  const renderStageContent = () => {
    const isBackground = item.category === 'backgrounds';

    if (!isBackground) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6">
          <ErrorBoundary onReset={handleReload} fallbackTitle={`Error rendering ${item.name}`}>
            <ComponentToRender {...propValues} />
          </ErrorBoundary>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full min-h-[500px] md:min-h-[580px] overflow-hidden flex flex-col justify-between">
        {/* Full-width Canvas / Background component underneath */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
          <ErrorBoundary onReset={handleReload} fallbackTitle={`Error rendering ${item.name}`}>
            <ComponentToRender {...propValues} />
          </ErrorBoundary>
        </div>

        {/* Optional Demo Content Landing Page Mockup (Non-blocking mouse events) */}
        {showDemoContent && (
          <>
            {/* Mock Topbar Navigation (Clean, no overlap with stage toolbar) */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Zap size={13} />
                </div>
                <span className="font-heading font-extrabold text-sm text-white tracking-tight">
                  SIDD-Reacts
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 pointer-events-auto">
                <span className="hover:text-white cursor-pointer transition-colors hidden sm:inline">Features</span>
                <span className="hover:text-white cursor-pointer transition-colors hidden sm:inline">About</span>
                <button
                  type="button"
                  className="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Mock Hero Headline & CTAs (Pointer events none on text so cursor drives canvas) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto space-y-5 pointer-events-none select-none">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-lg pointer-events-auto">
                <span className="rounded bg-white text-zinc-950 px-1.5 py-0.2 text-[10px] font-extrabold uppercase">
                  NEW
                </span>
                <span className="text-zinc-300">Just shipped v2.4</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
                {getDemoHeadline()}
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pointer-events-auto">
                <button
                  type="button"
                  className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-xl hover:bg-zinc-200 transition-all hover:scale-105 cursor-pointer"
                >
                  Get started
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                >
                  Learn more
                </button>
              </div>
            </div>

            {/* Bottom space padding */}
            <div className="relative z-10 h-6 pointer-events-none" />
          </>
        )}
      </div>
    );
  };

  const relatedComponents = allComponents
    .filter((c) => c.id !== item.id)
    .slice(0, 3);

  // Fullscreen Stage Viewport Modal (Takes 100% full screen height and width)
  const fullscreenStageModal = isFullscreen ? (
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#060608] flex flex-col p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Top Controls Bar Outside Canvas Area */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <BackgroundSwitcher current={bgStyle} onChange={setBgStyle} />
          {item.category === 'backgrounds' && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md">
              <span>Demo Content</span>
              <button
                type="button"
                onClick={() => setShowDemoContent(!showDemoContent)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                  showDemoContent ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                    showDemoContent ? 'translate-x-3.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            title="Replay Animation"
            className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/50 bg-indigo-600/40 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-600/60 transition-colors cursor-pointer"
          >
            <Minimize2 size={14} />
            <span>Exit Fullscreen</span>
            <kbd className="rounded border border-indigo-400/40 bg-indigo-950/80 px-1.5 text-[10px] ml-1">ESC</kbd>
          </button>
        </div>
      </div>

      {/* True Full-Height Edge-to-Edge Stage Body */}
      <div className={`flex-1 w-full h-full min-h-0 relative mt-3 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col ${bgClasses[bgStyle]}`}>
        <div key={keyCounter} className="w-full h-full flex-1 flex flex-col relative">
          {renderStageContent()}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* Fullscreen Portal */}
      {fullscreenStageModal && typeof document !== 'undefined' && ReactDOM.createPortal(fullscreenStageModal, document.body)}

      {/* Component Header Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-800/80 pb-6 w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {item.category}
            </span>
            {item.badge && (
              <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-400 animate-pulse">
                {item.badge}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {item.name}
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-zinc-400 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* CLI Quick Copy Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={handleCopyCli}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 font-mono text-xs text-zinc-300 shadow-lg backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-zinc-800/90 hover:text-white cursor-pointer"
          >
            <Terminal size={14} className="text-indigo-400" />
            <span>{item.cliCommand}</span>
            {copiedCli ? (
              <Check size={13} className="text-emerald-400 ml-1" />
            ) : (
              <Copy size={13} className="text-zinc-500 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 w-full">
        <div className="flex space-x-2 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play size={15} />
            <span>Live Stage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 size={15} />
            <span>Code (TSX / JSX)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'install'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal size={15} />
            <span>Installation & CLI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tailwind')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tailwind'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode size={15} />
            <span>Tailwind Config</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'api'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen size={15} />
            <span>Props Reference</span>
          </button>
        </div>
      </div>

      {/* Tab: Live Stage Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4 w-full">
          {/* External Controls Header (Positioned ABOVE stage to eliminate any overlap with canvas) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-1">
            {/* Background Selector */}
            <BackgroundSwitcher current={bgStyle} onChange={setBgStyle} />

            {/* Right Controls: Demo Content Switch & Fullscreen */}
            <div className="flex items-center gap-2">
              {item.category === 'backgrounds' && (
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md">
                  <span>Demo Content</span>
                  <button
                    type="button"
                    onClick={() => setShowDemoContent(!showDemoContent)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                      showDemoContent ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                        showDemoContent ? 'translate-x-3.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/90 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleReload}
                  title="Replay / Re-trigger animation"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  title="Fullscreen Preview"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Clean Stage Container (Dynamic height: full for backgrounds, compact for UI/Cards/Text) */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl transition-all">
            <div
              className={`flex w-full transition-colors duration-300 ${
                item.category === 'backgrounds'
                  ? 'min-h-[500px] md:min-h-[580px]'
                  : 'min-h-[300px] sm:min-h-[360px] py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center'
              } ${bgClasses[bgStyle]}`}
            >
              <div key={keyCounter} className="w-full h-full flex-1 flex flex-col items-center justify-center relative">
                {renderStageContent()}
              </div>
            </div>
          </div>

          {/* Interactive Controls Drawer */}
          {item.propsConfig.length > 0 && (
            <LiveControls
              controls={item.propsConfig}
              values={propValues}
              onChange={handlePropChange}
              onReset={handleResetProps}
            />
          )}

          {/* Quick Demo Usage Code */}
          <div className="space-y-3 pt-4 w-full">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              Quick Usage Example
            </h3>
            <CodeBlock
              code={item.demoUsage}
              language="tsx"
              filename="UsageDemo.tsx"
              showLineNumbers={false}
            />
          </div>
        </div>
      )}

      {/* Tab: Full Component Code */}
      {activeTab === 'code' && (
        <div className="space-y-6 w-full">
          <div>
            <h3 className="text-base font-bold text-white">Component Implementation</h3>
            <p className="text-xs text-zinc-400">
              Copy and paste this component directly into your project's components folder.
            </p>
          </div>
          <CodeBlock
            code={item.codeTSX}
            jsxCode={item.codeJSX}
            allowToggleFormat={true}
            language="tsx"
            filename={`${item.name.replace(/\s+/g, '')}.tsx`}
            showLineNumbers={true}
          />
        </div>
      )}

      {/* Tab: Installation & CLI */}
      {activeTab === 'install' && (
        <div className="space-y-6 w-full">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-indigo-400" />
                1. Add via SIDD-Reacts CLI
              </h3>
              <p className="text-xs text-zinc-400">
                The fastest way to install this component and its configurations directly into your repo.
              </p>
              <CodeBlock
                code={item.cliCommand}
                language="bash"
                filename="terminal"
                showLineNumbers={false}
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800/80">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-indigo-400" />
                2. Manual Installation Steps
              </h3>
              <p className="text-xs text-zinc-400">
                If you prefer manual setup, install the following required packages:
              </p>
              <CodeBlock
                code={`npm install ${item.dependencies.length > 0 ? item.dependencies.join(' ') : 'clsx tailwind-merge'}`}
                language="bash"
                filename="terminal"
                showLineNumbers={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tailwind Config */}
      {activeTab === 'tailwind' && (
        <div className="space-y-6 w-full">
          <div>
            <h3 className="text-base font-bold text-white">Tailwind CSS Setup</h3>
            <p className="text-xs text-zinc-400">
              Ensure your Tailwind configuration and CSS utilities include the required design tokens.
            </p>
          </div>
          <CodeBlock
            code={
              item.tailwindConfig ||
              `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#060608',
      },
    },
  },
};`
            }
            language="tsx"
            filename="tailwind.config.js"
            showLineNumbers={true}
          />
        </div>
      )}

      {/* Tab: Props API Reference */}
      {activeTab === 'api' && (
        <div className="space-y-6 w-full">
          <div>
            <h3 className="text-base font-bold text-white">Props & API Reference</h3>
            <p className="text-xs text-zinc-400">
              All customizable parameters, TypeScript types, and default values.
            </p>
          </div>
          <PropsTable docs={item.apiDocs} />
        </div>
      )}

      {/* Related Components Footer */}
      {relatedComponents.length > 0 && onSelectComponent && (
        <div className="space-y-4 pt-12 border-t border-zinc-800/80 w-full">
          <h3 className="text-lg font-bold text-white">Explore More Components</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedComponents.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => onSelectComponent(rel.id)}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 text-left transition-all hover:border-indigo-500/50 hover:bg-zinc-900/80 hover:shadow-xl cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                      {rel.category}
                    </span>
                    {rel.badge && (
                      <span className="text-[9px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                        {rel.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {rel.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>View Component</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentShowcase;
