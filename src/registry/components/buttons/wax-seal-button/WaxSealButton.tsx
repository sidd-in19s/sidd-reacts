import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface WaxSealButtonProps {
  monogram?: string;
  waxColor?: string;
  accentGlow?: string;
  className?: string;
  onClick?: () => void;
}

export const WaxSealButton: React.FC<WaxSealButtonProps> = ({
  monogram = 'SR',
  waxColor = '#9e1b1b', // Authentic Deep Sealing Wax Red
  accentGlow = '#fca5a5',
  className = '',
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleClick = () => {
    setIsPressed(true);
    if (onClick) onClick();
    setTimeout(() => setIsPressed(false), 220);
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-center p-6 select-none cursor-pointer group ${className}`}
    >
      {/* 3D Realistic Molten Wax Seal */}
      <motion.div
        animate={{
          scale: isPressed ? 0.94 : isHovered ? 1.05 : 1,
          y: isPressed ? 4 : 0,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        className="relative w-36 h-36 flex items-center justify-center filter drop-shadow-[0_18px_30px_rgba(0,0,0,0.9)]"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible transition-transform duration-300"
        >
          <defs>
            {/* Outer molten wax radial lighting */}
            <radialGradient
              id="outerWaxGrad"
              cx={`${mousePos.x}%`}
              cy={`${mousePos.y}%`}
              r="75%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor={waxColor} />
              <stop offset="70%" stopColor="#751212" />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>

            {/* Recessed inner stamp center gradient */}
            <radialGradient
              id="innerStampGrad"
              cx="45%"
              cy="40%"
              r="65%"
            >
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="60%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>

            {/* Specular Glare Highlight */}
            <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
            </linearGradient>

            {/* 3D Emboss Filter for crest details */}
            <filter id="waxEmboss" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodColor="#2a0505" floodOpacity="0.9" />
              <feDropShadow dx="-1" dy="-1" stdDeviation="0.8" floodColor="#ffffff" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* 1. Organic Molten Wax Outer Puddle Rim (Exact irregular lobe shape matching reference image) */}
          <path
            d="M 100,8
               C 135,5 155,20 170,45
               C 185,70 198,90 190,120
               C 182,150 165,175 135,188
               C 105,200 70,195 42,178
               C 15,160 5,130 8,95
               C 10,60 30,25 65,12
               C 80,6 90,8 100,8 Z"
            fill="url(#outerWaxGrad)"
            stroke="#450a0a"
            strokeWidth="2"
          />

          {/* 2. Raised Glossy Molten Wax Lip Shadow & Specular Lip Ring */}
          <path
            d="M 100,16
               C 130,14 148,26 160,48
               C 174,70 184,88 178,114
               C 170,140 155,162 128,174
               C 102,185 72,180 48,165
               C 24,150 16,124 18,94
               C 20,64 36,32 68,20
               C 82,14 90,16 100,16 Z"
            fill="none"
            stroke="url(#specularGlint)"
            strokeWidth="8"
            opacity="0.65"
          />

          {/* 3. Deep Recessed Stamped Center Circle Plateau */}
          <circle
            cx="100"
            cy="100"
            r="64"
            fill="url(#innerStampGrad)"
            stroke="#2c0505"
            strokeWidth="3"
            filter="drop-shadow(inset 0 4px 8px rgba(0,0,0,0.8))"
          />

          {/* 4. Concentric Beveled Outer Rings */}
          <circle
            cx="100"
            cy="100"
            r="59"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.8"
            opacity="0.6"
          />
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#450a0a"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* 5. Royal Dashed Collar Ring */}
          <circle
            cx="100"
            cy="100"
            r="49"
            fill="none"
            stroke="#fca5a5"
            strokeWidth="3"
            strokeDasharray="6 4"
            filter="url(#waxEmboss)"
            opacity="0.75"
          />

          {/* 6. Inner Bevel Circle */}
          <circle
            cx="100"
            cy="100"
            r="42"
            fill="none"
            stroke="#450a0a"
            strokeWidth="1.5"
          />

          {/* 7. 3D Embossed Crest Ornamentation */}
          <g filter="url(#waxEmboss)">
            {/* Laurel Wreath Left */}
            <path
              d="M 68,110 C 64,95 68,82 78,72 M 66,102 C 60,98 62,90 70,92 M 68,88 C 62,82 66,76 74,80 M 74,76 C 70,68 78,64 84,70"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Laurel Wreath Right */}
            <path
              d="M 132,110 C 136,95 132,82 122,72 M 134,102 C 140,98 138,90 130,92 M 132,88 C 138,82 134,76 126,80 M 126,76 C 130,68 122,64 116,70"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Central Heraldic Shield / Monogram Container */}
            <path
              d="M 85,78 L 115,78 C 115,78 116,102 100,118 C 84,102 85,78 85,78 Z"
              fill="#7f1d1d"
              stroke="#fca5a5"
              strokeWidth="2"
            />

            {/* Embossed Monogram Letters */}
            <text
              x="100"
              y="102"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Cinzel, Georgia, serif"
              fontWeight="900"
              fontSize="20"
              fill="#fecaca"
              stroke="#450a0a"
              strokeWidth="0.75"
              letterSpacing="1.5"
            >
              {monogram}
            </text>

            {/* Bottom Crest Ribbon Knot */}
            <path
              d="M 88,124 Q 100,132 112,124 Q 100,127 88,124 Z"
              fill="#ef4444"
            />
          </g>

          {/* 8. Specular Wet-Wax Gloss Reflections */}
          <ellipse
            cx="65"
            cy="45"
            rx="24"
            ry="10"
            transform="rotate(-25 65 45)"
            fill="url(#specularGlint)"
            opacity={isHovered ? 0.9 : 0.6}
            className="transition-opacity duration-300 pointer-events-none"
          />
          <ellipse
            cx="155"
            cy="120"
            rx="16"
            ry="7"
            transform="rotate(65 155 120)"
            fill="url(#specularGlint)"
            opacity={isHovered ? 0.8 : 0.5}
            className="transition-opacity duration-300 pointer-events-none"
          />
        </svg>
      </motion.div>

      {/* Subtitle Caption */}
      <span className="mt-3 text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-red-400 uppercase transition-colors">
        CLICK TO BREAK WAX SEAL
      </span>
    </div>
  );
};

export default WaxSealButton;
