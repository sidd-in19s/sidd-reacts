import React, { useState, useEffect } from 'react';

export interface CrtScanlineTerminalProps {
  systemName?: string;
  phosphorColor?: string;
  initialCommand?: string;
  className?: string;
}

export const CrtScanlineTerminal: React.FC<CrtScanlineTerminalProps> = ({
  systemName = 'SIDD-OS v2.4 (TERMINAL_01)',
  phosphorColor = '#22c55e', // Retro Green Phosphor
  initialCommand = 'npx sidd-reacts init --engine=kinetic',
  className = '',
}) => {
  const [logs, setLogs] = useState<string[]>([
    'BOOT SEQUENCE INITIALIZED...',
    'MEM_CHECK: 640K OK.',
    'LOADING KINETIC SHADERS... DONE.',
    'READY.',
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setLogs((prev) => [...prev, `> ${inputVal}`, `EXEC: Command '${inputVal}' acknowledged.`]);
    setInputVal('');
  };

  return (
    <div
      className={`relative w-full max-w-lg rounded-3xl border-4 border-zinc-800 bg-black p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(0,0,0,0.9)] overflow-hidden font-mono select-none ${className}`}
      style={{
        boxShadow: `0 0 30px ${phosphorColor}20, inset 0 0 50px rgba(0,0,0,0.95)`,
      }}
    >
      {/* CRT Scanline Horizontal Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Curved Vignette Screen Glare */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-radial-glow opacity-30 mix-blend-screen" />

      {/* Terminal Header */}
      <div
        className="flex items-center justify-between border-b-2 pb-2 text-xs font-black tracking-wider"
        style={{ color: phosphorColor, borderColor: `${phosphorColor}40` }}
      >
        <span>{systemName}</span>
        <span className="animate-pulse">● REC</span>
      </div>

      {/* Terminal Body Logs */}
      <div
        className="space-y-1.5 py-4 text-xs font-bold leading-relaxed min-h-[160px] overflow-y-auto"
        style={{
          color: phosphorColor,
          textShadow: `0 0 8px ${phosphorColor}`,
        }}
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-1 pt-2">
          <span className="font-black">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command and hit Enter..."
            className="w-full bg-transparent outline-none text-xs font-bold font-mono"
            style={{
              color: phosphorColor,
              textShadow: `0 0 6px ${phosphorColor}`,
            }}
          />
        </form>
      </div>

      {/* Bottom Status */}
      <div
        className="flex items-center justify-between pt-2 border-t text-[10px]"
        style={{ color: `${phosphorColor}80`, borderColor: `${phosphorColor}30` }}
      >
        <span>BAUD: 9600 • TTY_01</span>
        <span>CRT PHOSPHOR ACTIVE</span>
      </div>
    </div>
  );
};

export default CrtScanlineTerminal;
