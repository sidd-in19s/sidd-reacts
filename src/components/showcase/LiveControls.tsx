import React from 'react';
import { PropControl } from '../../registry/types';
import { Sliders, RotateCcw } from 'lucide-react';
import { SiddColorPicker } from '../ui/SiddColorPicker';

export interface LiveControlsProps {
  controls: PropControl[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onReset: () => void;
}

export const LiveControls: React.FC<LiveControlsProps> = ({
  controls,
  values,
  onChange,
  onReset,
}) => {
  if (!controls || controls.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Interactive Props & Physics
          </h4>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Reset to default props"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {controls.map((control) => {
          const val = values[control.name] !== undefined ? values[control.name] : control.defaultValue;

          if (control.type === 'slider') {
            return (
              <div key={control.name} className="space-y-1.5 rounded-xl border border-zinc-900 bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">{control.label}</span>
                  <span className="font-mono text-indigo-400 font-semibold">{val}</span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step || 1}
                  value={val}
                  onChange={(e) => onChange(control.name, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            );
          }

          if (control.type === 'color') {
            return (
              <div key={control.name} className="space-y-1.5 rounded-xl border border-zinc-900 bg-zinc-900/40 p-3">
                <span className="text-xs font-medium text-zinc-300 block">{control.label}</span>
                <SiddColorPicker
                  value={val}
                  onChange={(hex) => onChange(control.name, hex)}
                  label={control.label}
                />
              </div>
            );
          }

          if (control.type === 'boolean') {
            return (
              <div key={control.name} className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/40 p-3">
                <span className="text-xs font-medium text-zinc-300">{control.label}</span>
                <button
                  type="button"
                  onClick={() => onChange(control.name, !val)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    val ? 'bg-indigo-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      val ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          }

          if (control.type === 'select') {
            return (
              <div key={control.name} className="space-y-1.5 rounded-xl border border-zinc-900 bg-zinc-900/40 p-3">
                <span className="text-xs font-medium text-zinc-300 block">{control.label}</span>
                <select
                  value={val}
                  onChange={(e) => onChange(control.name, e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                >
                  {control.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (control.type === 'text') {
            return (
              <div key={control.name} className="space-y-1.5 rounded-xl border border-zinc-900 bg-zinc-900/40 p-3 sm:col-span-2">
                <span className="text-xs font-medium text-zinc-300 block">{control.label}</span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => onChange(control.name, e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default LiveControls;
