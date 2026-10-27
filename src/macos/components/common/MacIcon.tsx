import React from 'react';

interface MacIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const MacIcon: React.FC<MacIconProps> = ({ name, size = 24, className = '' }) => {
  switch (name) {
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      );

    case 'finder':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="finder-bg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#25A0F5" />
              <stop offset="100%" stopColor="#0B6CD9" />
            </linearGradient>
            <linearGradient id="finder-half" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E80DF" />
              <stop offset="100%" stopColor="#71BAFF" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill="url(#finder-bg)" />
          {/* Two-tone face */}
          <path d="M50 8 C65 8 92 12 92 50 C92 88 65 92 50 92 Z" fill="#8FD0FF" />
          <path d="M50 8 C35 8 8 12 8 50 C8 88 35 92 50 92 Z" fill="#2087E8" />
          {/* Dividing line nose */}
          <path d="M50 8 Q44 48 50 62 Q56 48 50 8" fill="#135AA7" />
          {/* Eyes */}
          <ellipse cx="32" cy="40" rx="4.5" ry="6.5" fill="#0A3F7A" />
          <ellipse cx="68" cy="40" rx="4.5" ry="6.5" fill="#0A3F7A" />
          {/* Smile */}
          <path d="M30 65 Q50 85 70 65" fill="none" stroke="#0A3F7A" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );

    case 'safari':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <defs>
            <radialGradient id="safari-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E2E8" />
            </radialGradient>
            <linearGradient id="safari-compass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2CB5FF" />
              <stop offset="100%" stopColor="#0B66E4" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="42" fill="url(#safari-compass)" />
          {/* Compass dial markings */}
          <circle cx="50" cy="50" r="39" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2,3" />
          {/* Needle */}
          <g transform="rotate(45 50 50)">
            <polygon points="50,15 44,50 56,50" fill="#FF3B30" />
            <polygon points="50,85 44,50 56,50" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="3" fill="#D1D1D6" />
          </g>
        </svg>
      );

    case 'settings':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#8E8E93" />
          <defs>
            <linearGradient id="gear-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B0B0B8" />
              <stop offset="100%" stopColor="#5E5E64" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#gear-grad)" />
          {/* Gear teeth */}
          <g transform="translate(50,50)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="-5"
                y="-36"
                width="10"
                height="10"
                rx="2"
                fill="#E5E5EA"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="28" fill="#D1D1D6" />
            <circle cx="0" cy="0" r="14" fill="#5E5E64" />
          </g>
        </svg>
      );

    case 'notes':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#FBF8EF" />
          {/* Top yellow banner */}
          <path d="M0 22 C0 10 10 0 22 0 L78 0 C90 0 100 10 100 22 L100 32 L0 32 Z" fill="#F4CA38" />
          {/* Horizontal lines */}
          <line x1="16" y1="46" x2="84" y2="46" stroke="#E5E0D0" strokeWidth="2" />
          <line x1="16" y1="60" x2="84" y2="60" stroke="#E5E0D0" strokeWidth="2" />
          <line x1="16" y1="74" x2="84" y2="74" stroke="#E5E0D0" strokeWidth="2" />
          <line x1="16" y1="88" x2="60" y2="88" stroke="#E5E0D0" strokeWidth="2" />
        </svg>
      );

    case 'terminal':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#1C1C1E" />
          <rect x="5" y="5" width="90" height="90" rx="18" fill="#000000" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <path d="M24 35 L40 50 L24 65" fill="none" stroke="#30D158" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="48" y1="65" x2="72" y2="65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="trash-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C8C8CE" />
              <stop offset="100%" stopColor="#8A8A94" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill="url(#trash-grad)" />
          {/* Wireframe basket pattern */}
          <rect x="25" y="32" width="50" height="50" rx="6" fill="rgba(255,255,255,0.3)" />
          <line x1="38" y1="40" x2="38" y2="74" stroke="#48484A" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="40" x2="50" y2="74" stroke="#48484A" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="40" x2="62" y2="74" stroke="#48484A" strokeWidth="3" strokeLinecap="round" />
          <rect x="20" y="24" width="60" height="6" rx="3" fill="#48484A" />
        </svg>
      );

    case 'folder':
      return (
        <svg width={size} height={size} viewBox="0 0 80 64" fill="none" className={className}>
          <path d="M4 14C4 9.58 7.58 6 12 6H28L36 14H68C72.42 14 76 17.58 76 22V50C76 54.42 72.42 58 68 58H12C7.58 58 4 54.42 4 50V14Z" fill="#0080FF" />
          <path d="M4 24C4 20.69 6.69 18 10 18H70C73.31 18 76 20.69 76 24V50C76 54.42 72.42 58 68 58H12C7.58 58 4 54.42 4 50V24Z" fill="#38A9FF" />
        </svg>
      );

    default:
      return null;
  }
};
