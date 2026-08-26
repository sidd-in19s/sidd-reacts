import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Home, Terminal, Layers, Sparkles, Settings, Compass, Palette } from 'lucide-react';
import { GithubIcon } from '../../../components/icons/BrandIcons';

export interface DockItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  onClick?: () => void;
  badge?: string;
}

export interface FloatingDockProps {
  items?: DockItem[];
  baseSize?: number;
  magnificationScale?: number;
  distanceThreshold?: number;
  className?: string;
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: 'home', title: 'Home', icon: Home },
  { id: 'components', title: 'Components', icon: Layers, badge: 'New' },
  { id: 'canvas', title: 'Canvas FX', icon: Sparkles },
  { id: 'terminal', title: 'CLI & Terminal', icon: Terminal },
  { id: 'themes', title: 'Theme Presets', icon: Palette },
  { id: 'explore', title: 'Explore', icon: Compass },
  { id: 'github', title: 'GitHub Repo', icon: GithubIcon },
  { id: 'settings', title: 'Preferences', icon: Settings },
];

function DockIcon({
  item,
  mouseX,
  baseSize,
  magnificationScale,
  distanceThreshold,
  activeId,
  setActiveId,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnificationScale: number;
  distanceThreshold: number;
  activeId: string;
  setActiveId: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-distanceThreshold, 0, distanceThreshold],
    [baseSize, baseSize * magnificationScale, baseSize]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 14 });

  const IconComponent = item.icon;
  const isActive = activeId === item.id;

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setActiveId(item.id);
        if (item.onClick) item.onClick();
      }}
      whileTap={{ scale: 0.85 }}
      className={`relative flex items-center justify-center rounded-2xl border transition-colors cursor-pointer ${
        isActive
          ? 'border-indigo-500/80 bg-indigo-600/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
          : 'border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-800/90'
      }`}
    >
      {/* Floating Animated Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          animate={{ opacity: 1, y: -48, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700/80 bg-zinc-950/95 px-3 py-1 text-xs font-semibold text-white shadow-2xl backdrop-blur-md"
        >
          {item.title}
          {item.badge && (
            <span className="ml-1.5 rounded-full bg-indigo-500 px-1.5 py-0.2 text-[9px] font-bold uppercase text-white">
              {item.badge}
            </span>
          )}
        </motion.div>
      )}

      <IconComponent size={22} className="relative z-10" />

      {/* Active Indicator Dot */}
      {isActive && (
        <motion.span
          layoutId="dock-dot"
          className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-indigo-400"
        />
      )}
    </motion.div>
  );
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  items = DEFAULT_ITEMS,
  baseSize = 48,
  magnificationScale = 1.6,
  distanceThreshold = 140,
  className = '',
}) => {
  const mouseX = useMotionValue(Infinity);
  const [activeId, setActiveId] = useState('components');

  return (
    <div className={`relative flex items-center justify-center p-6 ${className}`}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur-2xl"
      >
        {items.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            baseSize={baseSize}
            magnificationScale={magnificationScale}
            distanceThreshold={distanceThreshold}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingDock;
