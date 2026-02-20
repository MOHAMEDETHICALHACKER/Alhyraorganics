
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className = "h-16 w-auto", variant = 'dark' }) => {
  // Dark variant uses the new Deep Malt (organic-900), Light uses cream/white
  const primaryColor = variant === 'light' ? '#F5F5DC' : '#4a2c20'; // Espresso brown for dark
  const leafColor = variant === 'light' ? '#8B5A2B' : '#a66838'; // Bronze for leaf

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-sm">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Leaf Motif */}
        <g transform="translate(70, 0) scale(0.6)">
          <path 
            d="M30 50C30 50 40 20 70 20C70 20 80 50 30 70" 
            fill="none" 
            stroke={leafColor} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M30 70C30 70 0 50 10 20C10 20 40 10 30 50" 
            fill="none" 
            stroke={leafColor} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M30 70C30 70 50 100 80 100" 
            fill="none" 
            stroke={leafColor} 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          {/* Main Leaf */}
          <path 
            d="M35 65C60 30 110 30 110 30C110 30 110 80 35 65Z" 
            fill={variant === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.1)'}
            stroke={leafColor} 
            strokeWidth="3" 
            strokeLinejoin="round"
          />
        </g>
        
        {/* AL HYRA Text */}
        <text 
          x="100" 
          y="75" 
          textAnchor="middle" 
          fill={primaryColor} 
          style={{ font: 'bold 32px serif', letterSpacing: '2px', filter: 'url(#glow)' }}
        >
          AL HYRA
        </text>
        
        {/* Divider and Subtext */}
        <line x1="40" y1="85" x2="90" y2="85" stroke={primaryColor} strokeWidth="1" />
        <path d="M100 80 L98 90 L102 90 Z" fill={leafColor} />
        <line x1="110" y1="85" x2="160" y2="85" stroke={primaryColor} strokeWidth="1" />
        
        <text 
          x="100" 
          y="105" 
          textAnchor="middle" 
          fill={primaryColor} 
          style={{ font: '600 12px sans-serif', letterSpacing: '4px' }}
        >
          PURE MALT
        </text>
      </svg>
    </div>
  );
};
