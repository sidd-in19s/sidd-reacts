import React from 'react';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { GithubIcon, TwitterIcon } from '../icons/BrandIcons';

export interface FooterProps {
  onNavigateHome: () => void;
  onSelectComponent: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome, onSelectComponent }) => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#060608] py-12 px-6 sm:px-8 lg:px-12">
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-pink-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c0d14]">
                  <Zap size={14} className="text-cyan-400" />
                </div>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                SIDD<span className="text-indigo-400">-Reacts</span>
              </span>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An open-source collection of production-grade animated components, kinetic cards, and WebGL visual effects for modern React applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-xs text-zinc-400">
            <div className="space-y-2">
              <span className="font-semibold uppercase tracking-wider text-zinc-200 text-[11px] block">
                Featured Components
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('spotlight-card')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Spotlight 3D Card
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('true-focus')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    True Focus Text
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('particle-vortex')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Particle Vortex Canvas
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold uppercase tracking-wider text-zinc-200 text-[11px] block">
                Shaders & Ambient FX
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('aurora-background')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Aurora Fluid Mesh
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('hyperspeed-tunnel')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Hyperspeed Starfield
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectComponent('floating-dock')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Mac Spring Dock
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 gap-4">
          <p>© 2026 SIDD-Reacts. Crafted with Framer Motion, Tailwind CSS & React.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
