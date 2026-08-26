import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface CyberMetricGaugeProps {
  label?: string;
  metricValue?: number;
  unit?: string;
  gaugeColor?: string;
  className?: string;
}

export const CyberMetricGauge: React.FC<CyberMetricGaugeProps> = ({
  label = 'CORE QUANTUM FLUX',
  metricValue = 84,
  unit = '%',
  gaugeColor = '#06b6d4', // Cyan
  className = '',
}) => {
  const [val, setVal] = useState(metricValue);

  useEffect(() => {
    setVal(metricValue);
  }, [metricValue]);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (val / 100) * circumference * 0.75; // 270 degree arc

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 select-none ${className}`}>
      {/* Outer Telemetry Circle */}
      <div className="relative flex items-center justify-center">
        <svg className="w-52 h-52 transform -rotate-135" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />

          {/* Glowing Animated Value Arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${gaugeColor})`,
            }}
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute flex flex-col items-center justify-center text-center font-mono">
          <div className="flex items-baseline">
            <span
              className="text-4xl font-black tracking-tighter text-white"
              style={{ textShadow: `0 0 16px ${gaugeColor}80` }}
            >
              {val}
            </span>
            <span className="text-sm font-bold text-zinc-400 ml-0.5">{unit}</span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-1">
            TELEMETRY OK
          </span>
        </div>
      </div>

      {/* Label and Subtitle */}
      <div className="mt-2 text-center space-y-0.5 font-mono">
        <h4 className="text-xs font-black tracking-widest text-white">{label}</h4>
        <p className="text-[10px] text-zinc-500">60 FPS REALTIME MONITOR</p>
      </div>
    </div>
  );
};

export default CyberMetricGauge;
