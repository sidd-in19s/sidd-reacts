import React, { useState, useEffect, useRef } from 'react';

export interface DecryptedTextProps {
  text?: string;
  speed?: number; // ms per frame
  maxIterations?: number;
  characters?: string;
  revealDirection?: 'start' | 'end' | 'center';
  animateOn?: 'hover' | 'view' | 'auto';
  className?: string;
  glowColor?: string;
}

const CHAR_SETS = {
  matrix: 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890!@#$%^&*()',
  cyber: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  binary: '0101010100110101011001',
};

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text = 'SYSTEM_SECURE: PROTOCOL_INITIALIZED_2026',
  speed = 40,
  maxIterations = 12,
  characters = CHAR_SETS.cyber,
  revealDirection = 'start',
  animateOn = 'hover',
  className = '',
  glowColor = '#38bdf8',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    let iteration = 0;
    const totalLength = text.length;

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let isResolved = false;
            if (revealDirection === 'start') {
              isResolved = index < Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else if (revealDirection === 'end') {
              isResolved = index >= totalLength - Math.floor((iteration / (maxIterations * 2)) * totalLength);
            } else {
              const mid = totalLength / 2;
              const progress = (iteration / (maxIterations * 2)) * mid;
              isResolved = Math.abs(index - mid) <= progress;
            }

            if (isResolved) {
              return text[index];
            }

            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration > maxIterations * 2) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'auto' || animateOn === 'view') {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, maxIterations, characters, revealDirection, animateOn]);

  return (
    <span
      onMouseEnter={() => {
        if (animateOn === 'hover' && !isScrambling) {
          startScramble();
        }
      }}
      onClick={() => {
        if (!isScrambling) startScramble();
      }}
      className={`inline-block cursor-pointer font-mono font-bold tracking-wider select-none transition-colors duration-200 ${className}`}
      style={{
        textShadow: isScrambling ? `0 0 12px ${glowColor}` : 'none',
      }}
    >
      {displayText.split('').map((char, i) => {
        const isResolved = char === text[i];
        return (
          <span
            key={i}
            className={`transition-colors duration-100 ${
              isResolved ? 'text-white' : 'text-cyan-400 font-semibold'
            }`}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default DecryptedText;
