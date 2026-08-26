import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Check, Copy } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
  allowToggleFormat?: boolean;
  jsxCode?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  showLineNumbers = true,
  filename,
  allowToggleFormat = false,
  jsxCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [isJSX, setIsJSX] = useState(false);

  const activeCode = isJSX && jsxCode ? jsxCode : code;
  const activeLang = isJSX ? 'jsx' : language;

  useEffect(() => {
    Prism.highlightAll();
  }, [activeCode, activeLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeCode.trim().split('\n');

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-zinc-800/90 bg-[#09090e] shadow-2xl font-mono text-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-zinc-400 font-medium">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* TSX / JSX Toggle */}
          {allowToggleFormat && jsxCode && (
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-0.5 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setIsJSX(false)}
                className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
                  !isJSX ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                TSX
              </button>
              <button
                type="button"
                onClick={() => setIsJSX(true)}
                className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
                  isJSX ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                JSX
              </button>
            </div>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-sans font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="max-h-[520px] overflow-auto p-4 flex">
        {showLineNumbers && (
          <div className="select-none pr-4 text-right font-mono text-xs text-zinc-600 border-r border-zinc-800/80 mr-4">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <pre className="flex-1 overflow-x-auto m-0 p-0 bg-transparent text-sm leading-6">
          <code className={`language-${activeLang}`}>{activeCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
