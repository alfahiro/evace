import React from 'react';

interface EvaceLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color'; // light: for dark backgrounds (white text), dark: for light backgrounds, color: all colored
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function EvaceLogo({
  className = '',
  variant = 'light',
  showText = true,
  size = 'md'
}: EvaceLogoProps) {
  // Determine sizing values
  const sizes = {
    sm: { logo: 'w-8 h-8', evace: 'text-lg', sub: 'text-[8px]' },
    md: { logo: 'w-12 h-12', evace: 'text-2xl', sub: 'text-[9px]' },
    lg: { logo: 'w-20 h-20', evace: 'text-4xl', sub: 'text-xs' }
  };

  const currentSize = sizes[size];

  // Colors based on variant
  const textTitleColor = variant === 'light' ? 'text-white' : 'text-slate-800';
  const textSubColor = variant === 'light' ? 'text-[#a7f3d0]' : 'text-[#065f46]';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`} id="evace-brand-logo">
      {/* SVG Logomark */}
      <div className={`relative shrink-0 ${currentSize.logo}`}>
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Emerald/Green gradient for the leaves to match image perfectly */}
            <linearGradient id="evaceLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f5132" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          {/* Leaf 1: Far left, pointing left and curved up */}
          <path
            d="M 68 76 C 54 75 22 66 12 51 C 28 47 50 63 68 76 Z"
            fill="url(#evaceLeafGrad)"
          />

          {/* Leaf 2: Middle-left, pointing up-left */}
          <path
            d="M 69 76 C 50 56 32 38 22 22 C 38 23 55 46 69 76 Z"
            fill="url(#evaceLeafGrad)"
          />

          {/* Leaf 3: Center-left, pointing up/slighly-left */}
          <path
            d="M 70 76 C 60 48 50 25 45 10 C 58 14 70 38 70 76 Z"
            fill="url(#evaceLeafGrad)"
          />

          {/* Leaf 4: Tallest central/right leaf, pointing up-right */}
          <path
            d="M 71 76 C 79 46 88 23 100 11 C 104 25 93 50 71 76 Z"
            fill="url(#evaceLeafGrad)"
          />

          {/* Leaf 5: Rightmost leaf, pointing right and up */}
          <path
            d="M 72 76 C 88 59 104 45 124 38 C 114 51 96 66 72 76 Z"
            fill="url(#evaceLeafGrad)"
          />

          {/* Open Book Base - upper leaf spine curve */}
          <path
            d="M 8 83 C 25 83 45 77 69 75 C 74 75 79 81 84 81 C 94 81 115 77 185 77"
            stroke="#1b4d3e"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Open Book Base - lower book thickness curve */}
          <path
            d="M 8 91 C 25 91 45 85 69 83 C 74 83 79 89 84 89 C 94 89 115 85 180 85"
            stroke="#0f3426"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Brand typography side-by-side */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.evace} font-black tracking-[0.25em] ${textTitleColor} uppercase leading-none font-sans`}>
            EVACE
          </span>
          <span className={`${currentSize.sub} font-bold tracking-[0.08em] ${textSubColor} uppercase mt-1 leading-none`}>
            CURSOS E TREINAMENTOS
          </span>
        </div>
      )}
    </div>
  );
}
