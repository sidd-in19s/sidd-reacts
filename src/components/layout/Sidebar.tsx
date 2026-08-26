import React, { useState, useEffect } from 'react';
import { REGISTRY, CATEGORIES } from '../../registry';
import { ComponentCategory } from '../../registry/types';
import {
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  Terminal,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SidebarProps {
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onNavigateHome: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedId,
  onSelectComponent,
  onNavigateHome,
  isOpen,
  onCloseMobile,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Find category of currently selected component
  const currentCategory = selectedId
    ? REGISTRY.find((item) => item.id === selectedId)?.category || null
    : null;

  // Track expanded state for each of the primary categories (all open by default)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'get-started': true,
    text: true,
    buttons: true,
    backgrounds: true,
    cards: true,
    components: true,
    animations: true,
  });

  // Ensure current category is automatically expanded when user selects a component
  useEffect(() => {
    if (currentCategory) {
      setExpandedCategories((prev) => ({
        ...prev,
        [currentCategory]: true,
      }));
    }
  }, [currentCategory]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredItems = REGISTRY.filter(
    (item) =>
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
        className={`fixed top-16 bottom-0 left-0 z-30 w-68 flex-col border-r border-zinc-800/60 bg-[#07070b]/98 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex'
        }`}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-zinc-800/60">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search components..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/60 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Sidebar Nav Tree */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {/* 1. Get Started Section */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => toggleCategory('get-started')}
              className="flex w-full items-center justify-between py-1 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none"
            >
              <span>Get Started</span>
              <div className="flex items-center gap-1">
                {expandedCategories['get-started'] ? (
                  <ChevronDown size={13} className="text-zinc-500" />
                ) : (
                  <ChevronRight size={13} className="text-zinc-500" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedCategories['get-started'] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative border-l border-zinc-800/80 ml-1.5 pl-3.5 space-y-0.5 overflow-hidden"
                >
                  {/* Overview */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateHome();
                      onCloseMobile();
                    }}
                    className={`group relative flex w-full items-center justify-between py-1.5 text-xs transition-colors cursor-pointer text-left ${
                      selectedId === null
                        ? 'text-purple-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {/* Active left indicator pill */}
                    {selectedId === null && (
                      <span className="absolute -left-[15px] top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                    )}
                    <span>Introduction</span>
                  </button>

                  {/* Installation */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateHome();
                      onCloseMobile();
                    }}
                    className="flex w-full items-center justify-between py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-left"
                  >
                    <span>Installation</span>
                  </button>

                  {/* CLI & MCP */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateHome();
                      onCloseMobile();
                    }}
                    className="flex w-full items-center justify-between py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-left"
                  >
                    <span>CLI & Package</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Streamlined 7 Primary Categories */}
          {CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat.id);
            if (catItems.length === 0) return null;

            const isExpanded = expandedCategories[cat.id] ?? true;
            const hasActiveChild = catItems.some((i) => i.id === selectedId);

            return (
              <div key={cat.id} className="space-y-1.5">
                {/* Category Header with Dropdown Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="flex w-full items-center justify-between py-1 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none"
                >
                  <span className={hasActiveChild ? 'text-purple-300' : 'text-zinc-400'}>
                    {cat.name}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-600 font-normal">
                      {catItems.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={13} className="text-zinc-500" />
                    ) : (
                      <ChevronRight size={13} className="text-zinc-500" />
                    )}
                  </div>
                </button>

                {/* Collapsible Component Links Tree */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative border-l border-zinc-800/80 ml-1.5 pl-3.5 space-y-0.5 overflow-hidden"
                    >
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
                            className={`group relative flex w-full items-center justify-between py-1.5 text-xs transition-colors cursor-pointer text-left ${
                              isSelected
                                ? 'text-purple-300 font-semibold'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {/* ReactBits Style Left Border Indicator Pill */}
                            {isSelected && (
                              <span className="absolute -left-[15px] top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                            )}

                            <span className="truncate pr-2">{item.name}</span>

                            {/* Purple Pill Badges (Matching ReactBits) */}
                            {item.badge && (
                              <span
                                className={`ml-auto shrink-0 rounded-md px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                                  isSelected
                                    ? 'bg-purple-600 text-white shadow-[0_0_10px_#a855f7]'
                                    : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/80">
          <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-950/20 px-3 py-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-purple-400" />
              <span className="text-[11px] font-mono font-semibold">SIDD-Reacts</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold">
              {REGISTRY.length} Items
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
