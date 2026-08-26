import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint } from 'lucide-react';

export interface BiometricScanButtonProps {
  label?: string;
  scannerColor?: string;
  successColor?: string;
  className?: string;
  onClick?: () => void;
}

export const BiometricScanButton: React.FC<BiometricScanButtonProps> = ({
  label = 'AUTHENTICATE ACCESS',
  scannerColor = '#06b6d4', // Cyan Laser
  successColor = '#22c55e', // Green Success
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'granted'>('idle');

  const handleClick = () => {
    if (authStatus !== 'idle') return;
    setAuthStatus('scanning');

    setTimeout(() => {
      setAuthStatus('granted');
      if (onClick) onClick();

      setTimeout(() => {
        setAuthStatus('idle');
      }, 1500);
    }, 1000);
  };

  const currentColor = authStatus === 'granted' ? successColor : scannerColor;

  return (
    <div className={`relative inline-flex items-center justify-center p-6 select-none ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group overflow-hidden rounded-2xl border bg-[#060810] px-8 py-4 font-mono transition-all duration-300 cursor-pointer"
        style={{
          borderColor: `${currentColor}60`,
          boxShadow: isHovered || authStatus !== 'idle'
            ? `0 0 25px ${currentColor}40, inset 0 0 15px ${currentColor}20`
            : '0 8px 25px rgba(0,0,0,0.8)',
        }}
      >
        {/* Sweeping Laser Line when Hovered or Scanning */}
        {(isHovered || authStatus === 'scanning') && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="absolute inset-x-0 h-1 pointer-events-none shadow-lg z-20"
            style={{
              backgroundColor: currentColor,
              boxShadow: `0 0 12px ${currentColor}`,
            }}
          />
        )}

        <div className="relative z-10 flex items-center gap-3">
          {/* Fingerprint / Shield Icon Indicator */}
          <div className="relative flex items-center justify-center">
            {authStatus === 'granted' ? (
              <ShieldCheck size={22} className="text-emerald-400 animate-bounce" />
            ) : (
              <Fingerprint
                size={22}
                className="transition-colors duration-300"
                style={{ color: currentColor }}
              />
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-wider text-white">
              {authStatus === 'idle' && label}
              {authStatus === 'scanning' && 'BIOMETRIC SCANNING...'}
              {authStatus === 'granted' && 'ACCESS GRANTED // CLEARANCE: 1'}
            </span>
            <span
              className="text-[9px] font-mono tracking-widest uppercase transition-colors"
              style={{ color: currentColor }}
            >
              {authStatus === 'idle' && 'RETINA & FINGERPRINT ID'}
              {authStatus === 'scanning' && 'ENCRYPTING 4096-BIT TELEMETRY'}
              {authStatus === 'granted' && 'AUTHORIZED PROTOCOL ACTIVE'}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default BiometricScanButton;
