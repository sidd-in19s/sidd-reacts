import React, { useState, useEffect } from 'react';
import { REGISTRY } from './registry';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/layout/SearchModal';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && REGISTRY.some((item) => item.id === hash)) {
      return hash;
    }
    return null;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && REGISTRY.some((item) => item.id === hash)) {
        setSelectedId(hash);
      } else if (!hash) {
        setSelectedId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectComponent = (id: string) => {
    setSelectedId(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut: Cmd/Ctrl + K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentItem = REGISTRY.find((item) => item.id === selectedId);

  return (
    <div className="min-h-screen w-full bg-[#060608] text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectComponent={handleSelectComponent}
      />

      {/* Global Full-Width Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateHome={handleNavigateHome}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Full-Width Application Layout */}
      <div className="flex-1 flex w-full">
        {/* Fixed Docked Sidebar */}
        <Sidebar
          selectedId={selectedId}
          onSelectComponent={handleSelectComponent}
          onNavigateHome={handleNavigateHome}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Expansive Full-Width Content Viewport */}
        <main className="flex-1 min-w-0 w-full px-4 py-8 sm:px-6 md:px-8 lg:pl-80 lg:pr-10 xl:pr-14">
          {currentItem ? (
            <ComponentShowcase
              key={currentItem.id}
              item={currentItem}
              onSelectComponent={handleSelectComponent}
              allComponents={REGISTRY}
            />
          ) : (
            <HeroSection onSelectComponent={handleSelectComponent} />
          )}
        </main>
      </div>

      {/* Full-Width Footer */}
      <div className="w-full lg:pl-72">
        <Footer
          onNavigateHome={handleNavigateHome}
          onSelectComponent={handleSelectComponent}
        />
      </div>
    </div>
  );
}

export default App;
