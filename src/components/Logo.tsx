import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 38, text: 'text-2xl', gap: 'gap-2' },
    lg: { icon: 52, text: 'text-3xl', gap: 'gap-2.5' },
    xl: { icon: 72, text: 'text-4xl', gap: 'gap-3' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} select-none font-bold tracking-tight ${className}`}>
      {/* 3D Stylized TaskBD Brand Mark */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md transition-transform hover:scale-105 duration-200"
      >
        <defs>
          {/* Blue 3D 'T' Gradient */}
          <linearGradient id="tBlueGrad" x1="10" y1="10" x2="60" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Green Dynamic Figure Gradient */}
          <linearGradient id="greenArcGrad" x1="30" y1="30" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Red Bangladesh Accent Gradient */}
          <linearGradient id="redAccentGrad" x1="20" y1="90" x2="90" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Laptop Gradient */}
          <linearGradient id="laptopGrad" x1="70" y1="15" x2="110" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Gloss overlay */}
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 3D Bold Blue Curved 'T' Body */}
        <path
          d="M20 22 C20 16, 26 12, 36 12 L78 12 C86 12, 90 16, 90 22 C90 27, 85 30, 74 30 L58 30 C55 30, 52 33, 52 38 L52 76 C52 86, 44 94, 34 94 C26 94, 20 86, 20 78 L20 22 Z"
          fill="url(#tBlueGrad)"
        />
        {/* 'T' highlight */}
        <path
          d="M24 16 L76 16 C80 16, 84 18, 84 21 C84 23, 80 25, 74 25 L34 25 C28 25, 24 21, 24 16 Z"
          fill="url(#gloss)"
        />

        {/* Dynamic Green Swirl / Figure Body */}
        <path
          d="M25 82 C28 102, 60 110, 84 98 C102 88, 110 68, 98 52 C90 42, 75 42, 68 50 C60 58, 62 72, 74 76 C84 80, 92 74, 94 66 C95 62, 88 58, 82 64 C78 68, 76 72, 70 70 C66 68, 66 62, 70 58 C74 54, 82 54, 88 60 C96 70, 88 84, 76 88 C58 94, 38 88, 34 76 C32 72, 25 74, 25 82 Z"
          fill="url(#greenArcGrad)"
        />

        {/* Bangladesh Red Swoosh Rim */}
        <path
          d="M26 86 C32 104, 62 110, 82 100 C74 105, 48 103, 34 92 C28 87, 26 86, 26 86 Z"
          fill="url(#redAccentGrad)"
        />

        {/* Green Head / Sphere */}
        <circle cx="75" cy="40" r="11" fill="url(#greenArcGrad)" />
        <circle cx="72" cy="37" r="4" fill="#ffffff" opacity="0.6" />

        {/* Bangladesh Red Round Dot (Sun) */}
        <circle cx="98" cy="85" r="9" fill="url(#redAccentGrad)" />
        <circle cx="96" cy="83" r="3" fill="#ffffff" opacity="0.5" />

        {/* Top-Right Mini Laptop with Green Checkmark */}
        <g transform="translate(68, 8)">
          {/* Screen */}
          <rect x="6" y="2" width="26" height="18" rx="2" fill="url(#laptopGrad)" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="8" y="4" width="22" height="14" rx="1" fill="#ffffff" />
          {/* Green Checkmark */}
          <path d="M12 11 L16 15 L26 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Base */}
          <path d="M2 20 L36 20 L34 23 L4 23 Z" fill="url(#laptopGrad)" />
          {/* Floating Data Pixels */}
          <rect x="0" y="4" width="2" height="2" fill="#38bdf8" />
          <rect x="2" y="0" width="2.5" height="2.5" fill="#38bdf8" />
          <rect x="34" y="0" width="2.5" height="2.5" fill="#4ade80" />
        </g>
      </svg>

      {/* TaskBD Brand Wordmark */}
      {showText && (
        <span className={`${current.text} tracking-tight font-extrabold flex items-center leading-none`}>
          <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 dark:from-sky-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent italic">
            Task
          </span>
          <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-500 bg-clip-text text-transparent ml-0.5">
            BD
          </span>
        </span>
      )}
    </div>
  );
};
