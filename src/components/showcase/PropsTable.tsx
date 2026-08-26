import React from 'react';
import { PropDoc } from '../../registry/types';

export interface PropsTableProps {
  docs: PropDoc[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ docs }) => {
  if (!docs || docs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Default</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {docs.map((prop) => (
              <tr key={prop.name} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-300">
                  {prop.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-amber-300">
                  {prop.type}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                  {prop.default}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-300">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropsTable;
