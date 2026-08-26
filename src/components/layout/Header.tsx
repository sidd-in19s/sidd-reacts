import React, { useState } from 'react';
import { Search, Sparkles, Menu, X, Star, Terminal, Zap } from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';
import confetti from 'canvas-confetti';

export interface HeaderProps {
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onSelectCategory?: (category: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onNavigateHome,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [stars, setStars] = useState(5420);
  const [hasStarred, setHasStarred] = useState(false);

  const handleStar = () => {
    if (!hasStarred) {
      setStars((s) => s + 1);
      setHasStarred(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.1, x: 0.92 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#6366f1'],
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060608]/90 backdrop-blur-xl transition-all">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Custom SIDD-Reacts Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c0d14]">
                <Zap size={19} className="text-cyan-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-black tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  SIDD<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">-Reacts</span>
                </span>
                <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2 py-0.2 text-[10px] font-extrabold text-indigo-300">
                  PRO v2.4
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Full-Spanning Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400 shadow-inner backdrop-blur-md transition-all hover:border-indigo-500/40 hover:bg-zinc-900/90 hover:text-zinc-200"
          >
            <div className="flex items-center gap-2.5">
              <Search size={15} className="text-indigo-400" />
              <span>Search SIDD-Reacts kinetic components, shaders, text FX...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 rounded border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: CLI badge, Star Counter & GitHub */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Search size={18} />
          </button>

          {/* Quick CLI Pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 font-mono text-xs text-zinc-400">
            <Terminal size={13} className="text-indigo-400" />
            <span>npx sidd-reacts</span>
          </div>

          {/* GitHub Star Button with Live Counter */}
          <button
            type="button"
            onClick={handleStar}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold shadow-md transition-all cursor-pointer ${
              hasStarred
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <Star
              size={14}
              className={hasStarred ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}
            />
            <span className="hidden sm:inline">Star on GitHub</span>
            <span className="font-mono text-zinc-400 text-[11px] border-l border-zinc-700 pl-2">
              {stars.toLocaleString()}
            </span>
          </button>

          {/* Direct Repository Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
            title="GitHub Repository"
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
