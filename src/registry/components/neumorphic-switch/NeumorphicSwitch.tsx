import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

export interface NeumorphicSwitchProps {
  label?: string;
  activeColor?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const NeumorphicSwitch: React.FC<NeumorphicSwitchProps> = ({
  label = 'Quantum Power Engine',
  activeColor = '#38bdf8',
  defaultChecked = true,
  onChange,
  className = '',
}) => {
  const [isOn, setIsOn] = useState(defaultChecked);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onChange?.(next);
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 select-none ${className}`}>
      {/* Neumorphic Switch Container */}
      <button
        type="button"
        onClick={toggle}
        className="relative h-20 w-36 rounded-full cursor-pointer focus:outline-none p-2.5 transition-all duration-300"
        style={{
          backgroundColor: '#181924',
          boxShadow: isOn
            ? 'inset 6px 6px 12px #0c0d13, inset -6px -6px 12px #242535'
            : '8px 8px 16px #0c0d13, -8px -8px 16px #242535',
        }}
      >
        {/* Sliding Thumb Knob */}
        <motion.div
          animate={{
            x: isOn ? 64 : 0,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="relative h-15 w-15 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: '#1e1f2d',
            boxShadow: isOn
              ? `0 0 20px ${activeColor}80, 4px 4px 10px #0c0d13, -4px -4px 10px #2a2b3d`
              : '4px 4px 10px #0c0d13, -4px -4px 10px #2a2b3d',
          }}
        >
          <Power
            size={22}
            className="transition-colors duration-300"
            style={{
              color: isOn ? activeColor : '#64748b',
              filter: isOn ? `drop-shadow(0 0 8px ${activeColor})` : 'none',
            }}
          />
        </motion.div>
      </button>

      {/* Label and Status */}
      <div className="mt-4 text-center space-y-0.5">
        <h4 className="text-sm font-bold text-white font-mono">{label}</h4>
        <span
          className="text-xs font-mono font-semibold transition-colors duration-300"
          style={{ color: isOn ? activeColor : '#64748b' }}
        >
          {isOn ? '● ONLINE' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
};

export default NeumorphicSwitch;
