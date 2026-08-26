import React, { useState } from 'react';
import { REGISTRY, CATEGORIES } from '../../registry';
import { ComponentCategory } from '../../registry/types';
import {
  Sparkles,
  LayoutGrid,
  Type,
  MousePointerClick,
  Wand2,
  BookOpen,
  Search,
  ChevronRight,
  Zap,
  Terminal,
  Pencil,
  Stamp,
  Flame,
  Layers,
} from 'lucide-react';

export interface SidebarProps {
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onNavigateHome: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ICONS: Record<ComponentCategory, React.ComponentType<{ size?: number; className?: string }>> = {
  cards: LayoutGrid,
  text: Type,
  backgrounds: Sparkles,
  ui: MousePointerClick,
  fx: Wand2,
  sketch: Pencil,
  stickers: Stamp,
  cyberpunk: Terminal,
  kinetic: Flame,
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedId,
  onSelectComponent,
  onNavigateHome,
  isOpen,
  onCloseMobile,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredItems = REGISTRY.filter((item) =>
    item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-72 flex-col border-r border-zinc-800/80 bg-[#060608]/95 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex'
        }`}
      >
        {/* Sidebar Search Filter */}
        <div className="p-4 border-b border-zinc-800/80">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter components..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Getting Started Section */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Getting Started
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onCloseMobile();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                selectedId === null
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={14} className={selectedId === null ? 'text-indigo-400' : 'text-zinc-500'} />
                <span>Overview & SIDD CLI</span>
              </div>
              {selectedId === null && <ChevronRight size={12} className="text-indigo-400" />}
            </button>
          </div>

          {/* Categorized Components */}
          {CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat.id);
            if (catItems.length === 0) return null;

            const Icon = CATEGORY_ICONS[cat.id];

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-zinc-500" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {catItems.length}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {catItems.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectComponent(item.id);
                          onCloseMobile();
                        }}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 text-white font-semibold border border-indigo-500/30 shadow-sm'
                            : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? 'bg-indigo-400 shadow-[0_0_8px_#6366f1]' : 'bg-zinc-700 group-hover:bg-zinc-500'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`ml-2 shrink-0 rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                              item.badge === 'HOT'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : item.badge === 'NEW'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : item.badge === 'CANVAS'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-2.5 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              <span className="text-[11px] font-semibold">SIDD-Reacts Engine</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              v2.4
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
