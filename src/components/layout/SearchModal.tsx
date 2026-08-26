import React, { useState, useEffect, useRef } from 'react';
import { REGISTRY, CATEGORIES } from '../../registry';
import { Search, X, Sparkles, Terminal, ArrowRight, CornerDownLeft } from 'lucide-react';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectComponent,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = REGISTRY.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        onSelectComponent(filtered[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectComponent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0d14] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-zinc-800/80 px-4 py-3.5">
          <Search size={18} className="text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search SIDD-Reacts components, kinetic text, ambient FX..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-white mr-2"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-900">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <Sparkles size={28} className="mx-auto mb-2 text-zinc-600 opacity-60" />
              <p className="text-sm font-medium">No animated components found</p>
              <p className="text-xs text-zinc-600 mt-1">Try searching for "spotlight", "vortex", "aurora", or "dock"</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectComponent(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-zinc-300 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-zinc-900 text-zinc-400'}`}>
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="rounded bg-pink-500/20 px-1.5 py-0.2 text-[9px] font-bold text-pink-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={14} className="text-indigo-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 text-[10px] mr-1">↑</kbd>
              <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 text-[10px] mr-1">↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 text-[10px] mr-1">↵</kbd>
              Select
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {filtered.length} components
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
