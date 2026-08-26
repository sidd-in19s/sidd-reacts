import React, { useState, useEffect, useRef } from 'react';
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
  Filter,
  Check,
  RotateCcw,
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
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find category of currently selected component
  const currentCategory = selectedId
    ? REGISTRY.find((item) => item.id === selectedId)?.category || null
    : null;

  // Track expanded state for each of the primary categories
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

  // Close section dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSectionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Available sections list for dropdown selector
  const SECTION_OPTIONS = [
    { id: 'all', name: 'All Sections', count: REGISTRY.length },
    { id: 'get-started', name: 'Get Started', count: 3 },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      count: REGISTRY.filter((r) => r.category === c.id).length,
    })),
  ];

  const currentSectionLabel =
    SECTION_OPTIONS.find((s) => s.id === selectedSection)?.name || 'All Sections';

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
        {/* Search & Section Selector Header */}
        <div className="p-3 border-b border-zinc-800/60 space-y-2">
          {/* 1. Search Bar */}
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

          {/* 2. Interactive Section Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-900 transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 truncate">
                <Layers size={13} className="text-purple-400 shrink-0" />
                <span className="truncate font-medium">{currentSectionLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {selectedSection !== 'all' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSection('all');
                    }}
                    title="Reset to All Sections"
                    className="p-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <RotateCcw size={11} />
                  </span>
                )}
                <ChevronDown
                  size={13}
                  className={`text-zinc-500 transition-transform duration-200 ${
                    isSectionDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Options Menu */}
            <AnimatePresence>
              {isSectionDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 2, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-800 bg-[#0e1017] p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800/80 mb-1">
                    Select Section
                  </div>
                  {SECTION_OPTIONS.map((sec) => {
                    const isSelected = selectedSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setSelectedSection(sec.id);
                          setIsSectionDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/20 text-purple-300 font-semibold'
                            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isSelected ? (
                            <Check size={12} className="text-purple-400 shrink-0" />
                          ) : (
                            <span className="w-3" />
                          )}
                          <span className="truncate">{sec.name}</span>
                        </div>
                        <span className="ml-2 text-[10px] font-mono text-zinc-500 font-normal">
                          {sec.count}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Nav Tree */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {/* 1. Get Started Section */}
          {(selectedSection === 'all' || selectedSection === 'get-started') && (
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
                    {/* Introduction */}
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

                    {/* CLI & Package */}
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
          )}

          {/* 2. Categorized Components Tree (Filtered by Section) */}
          {CATEGORIES.map((cat) => {
            if (selectedSection !== 'all' && selectedSection !== cat.id) {
              return null;
            }

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
                            {/* Left Border Indicator Pill */}
                            {isSelected && (
                              <span className="absolute -left-[15px] top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                            )}

                            <span className="truncate pr-2">{item.name}</span>

                            {/* Purple Pill Badges */}
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
