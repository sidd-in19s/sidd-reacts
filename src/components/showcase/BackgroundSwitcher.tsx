import React from 'react';
import { Grid, Disc, Moon, Sparkles, Square, Sun } from 'lucide-react';

export type BackgroundStyle = 'grid' | 'dots' | 'dark' | 'glow' | 'checker' | 'light';

interface BackgroundSwitcherProps {
  current: BackgroundStyle;
  onChange: (bg: BackgroundStyle) => void;
}

const PRESETS: { id: BackgroundStyle; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'grid', label: 'Dark Grid', icon: Grid },
  { id: 'dots', label: 'Dot Matrix', icon: Disc },
  { id: 'dark', label: 'Pitch Black', icon: Moon },
  { id: 'glow', label: 'Radial Glow', icon: Sparkles },
  { id: 'checker', label: 'Checkerboard', icon: Square },
  { id: 'light', label: 'Light Mesh', icon: Sun },
];

export const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/90 p-1 backdrop-blur-md">
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isActive = current === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            title={preset.label}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              isActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-indigo-400' : ''} />
            <span className="hidden sm:inline">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BackgroundSwitcher;
