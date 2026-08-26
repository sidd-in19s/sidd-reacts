import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface MagneticButtonProps {
  children?: React.ReactNode;
  magneticStrength?: number;
  springStiffness?: number;
  springDamping?: number;
  rippleColor?: string;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children = 'Explore Components',
  magneticStrength = 0.35,
  springStiffness = 250,
  springDamping = 18,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  glowColor = 'rgba(99, 102, 241, 0.5)',
  className = '',
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: springDamping, stiffness: springStiffness, mass: 0.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * magneticStrength;
    const distanceY = (e.clientY - centerY) * magneticStrength;

    mouseX.set(distanceX);
    mouseY.set(distanceY);

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now(),
      x: rippleX,
      y: rippleY,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    if (onClick) onClick();
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={`group relative overflow-hidden rounded-full border border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl ${className}`}
    >
      {/* Outer ambient glow pulse */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-75"
        style={{ background: glowColor }}
      />

      {/* Cursor tracking spotlight on button surface */}
      <div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.35), transparent 80%)`,
        }}
      />

      {/* Ripple Waves */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '160px',
            height: '160px',
            background: rippleColor,
            animationDuration: '0.8s',
          }}
        />
      ))}

      {/* Button Text / Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-base font-medium tracking-wide">
        {children}
        <motion.span
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          →
        </motion.span>
      </span>
    </motion.button>
  );
};

export default MagneticButton;
