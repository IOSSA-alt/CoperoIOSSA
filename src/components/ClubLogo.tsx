import React from 'react';
import { Club } from '../types';

interface ClubLogoProps {
  club?: Club | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({ club, name, size = 'md', className = '' }) => {
  const clubName = club?.name || name || 'Libre';
  const id = (club?.id || clubName).toLowerCase().trim();

  const sizeClasses = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  }[size];

  if (club?.crestUrl) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src={club.crestUrl} alt={`${clubName} logo`} className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // ==================== 1. ACADEMIA SHELBY ====================
  if (id.includes('shelby')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Top Stars */}
          <polygon points="40,8 42,12 46,12 43,15 44,19 40,17 36,19 37,15 34,12 38,12" fill="#f59e0b" />
          <polygon points="60,8 62,12 66,12 63,15 64,19 60,17 56,19 57,15 54,12 58,12" fill="#f59e0b" />
          {/* Main Badge Outer Ring */}
          <circle cx="50" cy="55" r="40" fill="#090a0f" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="50" cy="55" r="35" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" />
          {/* Flat Cap Silhouette (Tommy Shelby) */}
          <path d="M 30 52 C 30 40 42 38 52 40 C 62 38 72 42 74 52 Z" fill="#ffffff" />
          <ellipse cx="56" cy="53" rx="20" ry="4" fill="#090a0f" />
          {/* Visor Brim */}
          <path d="M 32 54 Q 52 50 72 54 Q 52 57 32 54 Z" fill="#ffffff" />
          {/* Collar / Suit Neck */}
          <path d="M 36 68 L 50 85 L 64 68 L 58 68 L 50 78 L 42 68 Z" fill="#ffffff" />
          {/* Text Arc upper */}
          <path id="shelbyArc" d="M 18,55 A 32,32 0 0,1 82,55" fill="none" />
          <text fontSize="5.5" fontWeight="bold" fill="#ffffff" letterSpacing="0.8">
            <textPath href="#shelbyArc" startOffset="50%" textAnchor="middle">
              ACADEMIA SHELBY
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 2. AIMSTAR ====================
  if (id.includes('aimstar')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Pixelated Gold Star (Mario style) */}
          <path
            d="M 50 5 L 61 28 L 86 28 L 66 45 L 74 70 L 50 54 L 26 70 L 34 45 L 14 28 L 39 28 Z"
            fill="#facc15"
            stroke="#854d0e"
            strokeWidth="4"
            strokeLinejoin="miter"
          />
          {/* Inner Highlight */}
          <path
            d="M 50 12 L 58 30 L 78 30 L 62 43 L 68 63 L 50 50 L 32 63 L 38 43 L 22 30 L 42 30 Z"
            fill="#fef08a"
          />
          {/* Eyes */}
          <rect x="42" y="32" width="4" height="12" rx="2" fill="#000000" />
          <rect x="54" y="32" width="4" height="12" rx="2" fill="#000000" />
          <circle cx="43" cy="34" r="1" fill="#ffffff" />
          <circle cx="55" cy="34" r="1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // ==================== 3. BLACK UNITED ====================
  if (id.includes('black_united') || id.includes('black united')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#18181b" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="38" fill="#09090b" stroke="#ffffff" strokeWidth="1" />
          {/* Panther Head Silhouette */}
          <path d="M 32 55 Q 35 32 52 30 Q 68 28 75 42 Q 78 48 72 58 Q 65 65 52 65 Q 42 65 38 60 Z" fill="#27272a" />
          <path d="M 40 48 Q 48 36 62 36 Q 70 36 72 45 Q 68 55 58 58 Q 48 58 40 48 Z" fill="#09090b" />
          {/* Panther Eye */}
          <polygon points="58,42 66,44 60,47" fill="#f59e0b" />
          {/* Text Arc */}
          <path id="buArc" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
          <text fontSize="7" fontWeight="900" fill="#ffffff" letterSpacing="1">
            <textPath href="#buArc" startOffset="50%" textAnchor="middle">
              BLACK UNITED
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 4. BOLA MURCHA FC ====================
  if (id.includes('bola_murcha') || id.includes('bola murcha')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Outer Red Circle */}
          <circle cx="50" cy="50" r="46" fill="#dc2626" stroke="#2563eb" strokeWidth="3" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Inner Blue Checkered Diamonds (Bayern Style) */}
          <circle cx="50" cy="50" r="28" fill="#2563eb" />
          <path d="M 32 32 L 44 50 L 32 68 L 22 50 Z M 50 32 L 62 50 L 50 68 L 38 50 Z M 68 32 L 80 50 L 68 68 L 56 50 Z" fill="#ffffff" opacity="0.85" />
          {/* Text Arc */}
          <path id="bmArcUpper" d="M 12,50 A 38,38 0 0,1 88,50" fill="none" />
          <text fontSize="8" fontWeight="900" fill="#ffffff" letterSpacing="0.5">
            <textPath href="#bmArcUpper" startOffset="50%" textAnchor="middle">
              BOLA MURCHA
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 5. CABALLEROS DE LA BIRRA / ESCUDEROS ====================
  if (id.includes('caballeros') || id.includes('escuderos') || id.includes('lcb') || id.includes('leb')) {
    const isEscuderos = id.includes('escuderos') || id.includes('leb');
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Shield Outline */}
          <path d="M 20 15 L 80 15 L 80 55 C 80 75 50 90 50 90 C 50 90 20 75 20 55 Z" fill={isEscuderos ? '#78350f' : '#0f172a'} stroke="#f59e0b" strokeWidth="3" />
          {/* Laurel Wreath */}
          <path d="M 15 50 Q 15 80 48 88 M 85 50 Q 85 80 52 88" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="3,2" />
          {/* Beer Mug */}
          <rect x="38" y="42" width="22" height="26" rx="3" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 60 46 C 67 46 67 62 60 62" fill="none" stroke="#ffffff" strokeWidth="2" />
          {/* Foam Top */}
          <path d="M 35 42 C 35 35 45 35 48 40 C 52 35 60 35 62 42 Z" fill="#ffffff" />
          {/* Text LCB or LEB */}
          <text x="50" y="30" fontSize="10" fontWeight="900" fill="#f59e0b" textAnchor="middle" fontFamily="monospace">
            {isEscuderos ? 'LEB' : 'LCB'}
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 6. CHICAGO BULLS ====================
  if (id.includes('bulls') || id.includes('chicago')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Red Bull Face */}
          <path d="M 20 25 C 20 10 35 15 42 35 C 46 25 54 25 58 35 C 65 15 80 10 80 25 C 80 35 72 40 68 45 L 68 60 C 68 75 58 85 50 85 C 42 85 32 75 32 60 L 32 45 C 28 40 20 35 20 25 Z" fill="#dc2626" stroke="#000000" strokeWidth="2" />
          {/* Horn Tips White */}
          <path d="M 20 25 C 20 10 32 15 36 28 C 30 22 22 20 20 25 Z" fill="#ffffff" />
          <path d="M 80 25 C 80 10 68 15 64 28 C 70 22 78 20 80 25 Z" fill="#ffffff" />
          {/* Angry Eyes */}
          <polygon points="36,45 46,50 38,52" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <polygon points="64,45 54,50 62,52" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <circle cx="42" cy="49" r="1.5" fill="#000" />
          <circle cx="58" cy="49" r="1.5" fill="#000" />
          {/* Snort Ring Nose */}
          <path d="M 44 68 Q 50 62 56 68" fill="none" stroke="#000000" strokeWidth="2" />
          <circle cx="46" cy="74" r="2" fill="#000" />
          <circle cx="54" cy="74" r="2" fill="#000" />
        </svg>
      </div>
    );
  }

  // ==================== 7. DREAM SEVEN ====================
  if (id.includes('dream_seven') || id.includes('dream seven')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 3 Stars top */}
          <polygon points="30,12 32,16 36,16 33,18 34,22 30,20 26,22 27,18 24,16 28,16" fill="#f59e0b" />
          <polygon points="50,8 52,12 56,12 53,14 54,18 50,16 46,18 47,14 44,12 48,12" fill="#f59e0b" />
          <polygon points="70,12 72,16 76,16 73,18 74,22 70,20 66,22 67,18 64,16 68,16" fill="#f59e0b" />
          {/* Shield */}
          <path d="M 22 22 L 78 22 L 78 60 C 78 78 50 90 50 90 C 50 90 22 78 22 60 Z" fill="#b91c1c" stroke="#dc2626" strokeWidth="3" />
          {/* Lion Silhouette */}
          <circle cx="50" cy="46" r="16" fill="#09090b" />
          <polygon points="50,28 54,34 60,30 57,38 43,38 40,30 46,34" fill="#f59e0b" />
          {/* Banner */}
          <rect x="15" y="70" width="70" height="14" rx="3" fill="#09090b" stroke="#ffffff" strokeWidth="1" />
          <text x="50" y="80" fontSize="7" fontWeight="900" fill="#ffffff" textAnchor="middle">
            DREAM SEVEN
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 8. FREESTYLE MASTER SOCCER ====================
  if (id.includes('fms') || id.includes('freestyle')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 3 Stars Top */}
          <polygon points="32,10 34,14 38,14 35,16 36,20 32,18 28,20 29,16 26,14 30,14" fill="#cbd5e1" />
          <polygon points="50,6 52,10 56,10 53,12 54,16 50,14 46,16 47,12 44,10 48,10" fill="#f59e0b" />
          <polygon points="68,10 70,14 74,14 71,16 72,20 68,18 64,20 65,16 62,14 66,14" fill="#cbd5e1" />
          {/* Shield Body */}
          <path d="M 20 20 L 80 20 L 80 65 C 80 80 50 92 50 92 C 50 92 20 80 20 65 Z" fill="#09090b" stroke="#ffffff" strokeWidth="2.5" />
          {/* Soccer Ball */}
          <circle cx="50" cy="34" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
          {/* Text */}
          <text x="50" y="52" fontSize="6.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
            FREESTYLE
          </text>
          <text x="50" y="64" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">
            MASTER
          </text>
          <text x="50" y="74" fontSize="7" fontWeight="900" fill="#ffffff" textAnchor="middle">
            SOCCER
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 9. JUST FRAGGINS / SOCCERJAM (K Logo) ====================
  if (id.includes('just_fraggins') || id.includes('soccerjam') || id.includes('just fraggins')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Surrounding Stars */}
          <polygon points="50,8 52,12 56,12 53,14 54,18 50,16 46,18 47,14 44,12 48,12" fill="#f59e0b" />
          <polygon points="30,14 32,18 36,18 33,20 34,24 30,22 26,24 27,20 24,18 28,18" fill="#f59e0b" />
          <polygon points="70,14 72,18 76,18 73,20 74,24 70,22 66,24 67,20 64,18 68,18" fill="#f59e0b" />
          {/* Calligraphic K */}
          <path d="M 38 25 C 36 45 36 65 38 82 C 43 82 43 55 46 50 C 52 65 62 75 68 80 C 72 80 62 65 52 52 C 64 42 70 32 66 26 C 60 26 50 38 44 46 Z" fill="url(#kGrad)" stroke="#ec4899" strokeWidth="1" />
          {/* Ribbon */}
          <path d="M 28 50 C 45 25 75 35 68 62 C 60 82 35 70 55 85" fill="none" stroke="#ec4899" strokeWidth="2.5" />
          <defs>
            <linearGradient id="kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // ==================== 10. LOBOS ====================
  if (id.includes('lobos')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path d="M 20 18 L 80 18 L 80 60 C 80 78 50 90 50 90 C 50 90 20 78 20 60 Z" fill="#1e293b" stroke="#0284c7" strokeWidth="3" />
          {/* Wolf Head */}
          <polygon points="50,26 62,40 58,56 50,65 42,56 38,40" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="50,26 40,20 44,36" fill="#475569" />
          <polygon points="50,26 60,20 56,36" fill="#475569" />
          {/* Glowing Blue Eyes */}
          <circle cx="45" cy="44" r="2.5" fill="#38bdf8" />
          <circle cx="55" cy="44" r="2.5" fill="#38bdf8" />
          {/* Text */}
          <text x="50" y="80" fontSize="8" fontWeight="900" fill="#ffffff" textAnchor="middle">
            LOBOS F.C.
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 11. METEORS GAMING ====================
  if (id.includes('meteors')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Gold Star Top */}
          <polygon points="50,5 52,9 56,9 53,11 54,15 50,13 46,15 47,11 44,9 48,9" fill="#f59e0b" />
          {/* Shield */}
          <path d="M 22 18 L 78 18 L 78 60 C 78 78 50 90 50 90 C 50 90 22 78 22 60 Z" fill="#dc2626" stroke="#fbbf24" strokeWidth="2.5" />
          {/* Yellow Vertical Stripes */}
          <rect x="30" y="32" width="7" height="42" fill="#facc15" />
          <rect x="42" y="32" width="7" height="48" fill="#facc15" />
          <rect x="54" y="32" width="7" height="48" fill="#facc15" />
          <rect x="66" y="32" width="7" height="42" fill="#facc15" />
          {/* Text Header */}
          <text x="50" y="27" fontSize="6" fontWeight="bold" fill="#fef08a" textAnchor="middle">
            METEORS GAMING
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 12. MODO DIABLO ====================
  if (id.includes('modo_diablo') || id.includes('modo diablo')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 2 Stars Top */}
          <polygon points="42,5 44,9 48,9 45,11 46,15 42,13 38,15 39,11 36,9 40,9" fill="#f59e0b" />
          <polygon points="58,5 60,9 64,9 61,11 62,15 58,13 54,15 55,11 52,9 56,9" fill="#f59e0b" />
          {/* Diamond Shape */}
          <polygon points="50,16 92,50 50,84 8,50" fill="#581c87" stroke="#f59e0b" strokeWidth="3" />
          {/* Diagonal Yellow Split */}
          <polygon points="50,16 92,50 50,84 50,16" fill="#ca8a04" opacity="0.3" />
          {/* Devil Tail */}
          <path d="M 82 50 C 95 40 98 70 85 75 L 90 82 L 80 80 L 82 72 Z" fill="#dc2626" />
          {/* Soccer Ball */}
          <circle cx="50" cy="65" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
          {/* Text */}
          <text x="35" y="44" fontSize="7" fontWeight="900" fill="#fef08a" transform="rotate(-15 35 44)">
            MODO
          </text>
          <text x="65" y="55" fontSize="7" fontWeight="900" fill="#000000" transform="rotate(-15 65 55)">
            DIABLO
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 13. NULLIFIED ====================
  if (id.includes('nullified')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Metallic Orbit Oval */}
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="#94a3b8" strokeWidth="3" transform="rotate(-20 50 50)" />
          <polygon points="50,15 52,50 50,85 48,50" fill="#cbd5e1" />
          {/* Text nullified */}
          <text x="50" y="55" fontSize="11" fontWeight="900" fill="#ffffff" fontStyle="italic" letterSpacing="-0.5" textAnchor="middle">
            nullified
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 14. PAINTERS UNITED / PUFC ====================
  if (id.includes('painters') || id.includes('pufc') || id.includes('pibes_chorros')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 3 Stars Top */}
          <polygon points="32,8 34,12 38,12 35,14 36,18 32,16 28,18 29,14 26,12 30,12" fill="#f59e0b" />
          <polygon points="50,4 52,8 56,8 53,10 54,14 50,12 46,14 47,10 44,8 48,8" fill="#f59e0b" />
          <polygon points="68,8 70,12 74,12 71,14 72,18 68,16 64,18 65,14 62,12 66,12" fill="#f59e0b" />
          {/* Shield */}
          <path d="M 22 18 L 78 18 L 78 62 C 78 78 50 90 50 90 C 50 90 22 78 22 62 Z" fill="#09090b" stroke="#ec4899" strokeWidth="2.5" />
          {/* Hooded Reaper Face */}
          <path d="M 32 45 C 32 30 68 30 68 45 C 68 62 60 68 50 68 C 40 68 32 62 32 45 Z" fill="#18181b" />
          <circle cx="44" cy="46" r="2" fill="#ef4444" />
          <circle cx="56" cy="46" r="2" fill="#ef4444" />
          {/* Text PUFC */}
          <text x="50" y="80" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">
            PUFC
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 15. PEPSICOLEROS ====================
  if (id.includes('pepsicoleros') || id.includes('pepsi')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bottle Cap Outer Scallop Ring */}
          <circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          {/* Pepsi Wave Top Red */}
          <path d="M 8 50 C 30 35 70 65 92 50 C 92 25 70 8 50 8 C 30 8 8 25 8 50 Z" fill="#dc2626" />
          {/* Pepsi Wave Bottom Blue */}
          <path d="M 8 50 C 30 35 70 65 92 50 C 92 75 70 92 50 92 C 30 92 8 75 8 50 Z" fill="#1d4ed8" />
          {/* Middle White Wave */}
          <path d="M 8 50 C 30 35 70 65 92 50 C 90 58 70 70 50 60 C 30 50 10 58 8 50 Z" fill="#ffffff" />
          {/* Cursive Text */}
          <text x="50" y="52" fontSize="9" fontWeight="bold" fill="#ffffff" fontStyle="italic" textAnchor="middle" transform="rotate(-10 50 52)">
            PEPSI
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 16. SHAOLIN SOCCER ====================
  if (id.includes('shaolin')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#eab308" stroke="#000000" strokeWidth="4" />
          <circle cx="50" cy="50" r="37" fill="#fef08a" stroke="#000000" strokeWidth="1" />
          {/* Kung Fu Martial Artist Sidekick Silhouette */}
          <path d="M 38 65 L 45 42 L 68 32 M 45 42 L 30 32 M 45 48 L 56 68" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="48" cy="30" r="4" fill="#000000" />
          {/* Kicked Soccer Ball */}
          <circle cx="75" cy="26" r="4" fill="#000000" />
          {/* Arc Text */}
          <path id="shaolinArc" d="M 16,50 A 34,34 0 1,0 84,50" fill="none" />
          <text fontSize="6.5" fontWeight="900" fill="#000000" letterSpacing="0.5">
            <textPath href="#shaolinArc" startOffset="50%" textAnchor="middle">
              SHAOLIN SOCCER
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 17. TORMALINA FC ====================
  if (id.includes('tormalina')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 2 Stars Top */}
          <polygon points="42,5 44,9 48,9 45,11 46,15 42,13 38,15 39,11 36,9 40,9" fill="#f59e0b" />
          <polygon points="58,5 60,9 64,9 61,11 62,15 58,13 54,15 55,11 52,9 56,9" fill="#f59e0b" />
          {/* Shield */}
          <path d="M 22 18 L 78 18 L 78 65 C 78 80 50 92 50 92 C 50 92 22 80 22 65 Z" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          {/* Black Vertical Stripes */}
          <rect x="32" y="32" width="7" height="52" fill="#000000" />
          <rect x="46" y="32" width="7" height="58" fill="#000000" />
          <rect x="60" y="32" width="7" height="52" fill="#000000" />
          {/* Gold Bar Horizontal */}
          <rect x="23" y="44" width="54" height="10" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
          {/* Text */}
          <text x="50" y="52" fontSize="6" fontWeight="900" fill="#000000" textAnchor="middle">
            TORMALINA
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 18. UNION DEPORTIVO EMPATE (UDE) ====================
  if (id.includes('ude') || id.includes('empate')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* 5 Stars Top */}
          <polygon points="50,4 52,8 56,8 53,10 54,14 50,12 46,14 47,10 44,8 48,8" fill="#cbd5e1" />
          <polygon points="32,8 34,12 38,12 35,14 36,18 32,16 28,18 29,14 26,12 30,12" fill="#f59e0b" />
          <polygon points="68,8 70,12 74,12 71,14 72,18 68,16 64,18 65,14 62,12 66,12" fill="#f59e0b" />
          {/* Shield */}
          <path d="M 20 18 L 80 18 L 80 62 C 80 78 50 90 50 90 C 50 90 20 78 20 62 Z" fill="#09090b" stroke="#2563eb" strokeWidth="2.5" />
          {/* Top Blue Block */}
          <path d="M 21 19 L 79 19 L 79 48 L 21 48 Z" fill="#1d4ed8" />
          {/* White Vertical Stripes Bottom */}
          <rect x="32" y="48" width="7" height="35" fill="#ffffff" />
          <rect x="46" y="48" width="7" height="40" fill="#ffffff" />
          <rect x="60" y="48" width="7" height="35" fill="#ffffff" />
          {/* Soccer ball center */}
          <circle cx="50" cy="30" r="6" fill="#ffffff" stroke="#000" strokeWidth="1" />
          {/* Text */}
          <text x="50" y="42" fontSize="5.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
            Union Deportivo Empate
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 19. VIRAL TEAM ====================
  if (id.includes('viral')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Sharp Black V Shield */}
          <polygon points="10,10 90,10 50,90" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
          {/* Circle in Center */}
          <circle cx="50" cy="38" r="18" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          {/* Text VIRAL */}
          <text x="50" y="42" fontSize="7" fontWeight="900" fill="#ffffff" textAnchor="middle">
            VIRAL
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 20. YOUNG BALLINS ====================
  if (id.includes('young_ballins') || id.includes('ballin')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Retro Triangle Background */}
          <polygon points="50,15 90,85 10,85" fill="#6366f1" stroke="#38bdf8" strokeWidth="2" />
          {/* Basketball */}
          <circle cx="50" cy="55" r="22" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
          {/* 3D BALLIN Text */}
          <text x="52" y="58" fontSize="13" fontWeight="900" fill="#000000" textAnchor="middle">
            BALLIN
          </text>
          <text x="50" y="56" fontSize="13" fontWeight="900" fill="#38bdf8" textAnchor="middle">
            BALLIN
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 21. BOCA JUNIORS ====================
  if (id.includes('boca')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path d="M 22 18 L 78 18 L 78 62 C 78 78 50 90 50 90 C 50 90 22 78 22 62 Z" fill="#1d4ed8" stroke="#f59e0b" strokeWidth="2.5" />
          <rect x="22" y="40" width="56" height="18" fill="#f59e0b" />
          <text x="50" y="53" fontSize="10" fontWeight="900" fill="#1d4ed8" textAnchor="middle">
            CABJ
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 22. RIVER PLATE ====================
  if (id.includes('river')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path d="M 22 18 L 78 18 L 78 62 C 78 78 50 90 50 90 C 50 90 22 78 22 62 Z" fill="#ffffff" stroke="#dc2626" strokeWidth="2.5" />
          <polygon points="22,18 42,18 78,72 78,82 58,82 22,28" fill="#dc2626" />
          <text x="50" y="53" fontSize="9" fontWeight="900" fill="#000000" textAnchor="middle">
            CARP
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 23. REAL MADRID ====================
  if (id.includes('madrid') || id.includes('realmadrid')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Crown */}
          <polygon points="50,10 56,18 66,12 60,26 40,26 34,12 44,18" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          {/* Circular Shield */}
          <circle cx="50" cy="55" r="32" fill="#ffffff" stroke="#ca8a04" strokeWidth="2.5" />
          <line x1="28" y1="35" x2="72" y2="75" stroke="#9333ea" strokeWidth="6" />
          <text x="50" y="60" fontSize="12" fontWeight="900" fill="#ca8a04" textAnchor="middle">
            MC
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 24. JUVENTUS ====================
  if (id.includes('juventus')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <rect x="25" y="15" width="50" height="70" rx="12" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
          <text x="44" y="62" fontSize="38" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="serif">
            J
          </text>
          <text x="56" y="62" fontSize="38" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="serif">
            J
          </text>
        </svg>
      </div>
    );
  }

  // ==================== 25. QUILMES ====================
  if (id.includes('quilmes')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path d="M 22 18 L 78 18 L 78 62 C 78 78 50 90 50 90 C 50 90 22 78 22 62 Z" fill="#ffffff" stroke="#1d4ed8" strokeWidth="2.5" />
          <line x1="22" y1="45" x2="78" y2="45" stroke="#1d4ed8" strokeWidth="6" />
          <text x="50" y="70" fontSize="11" fontWeight="900" fill="#1d4ed8" textAnchor="middle">
            QAC
          </text>
        </svg>
      </div>
    );
  }

  // ==================== DEFAULT FALLBACK SHIELD ====================
  const bgColor = club?.color || '#3b82f6';
  const txtColor = club?.textColor || '#ffffff';
  const initial = clubName.charAt(0).toUpperCase();

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M 20 15 L 80 15 L 80 60 C 80 78 50 90 50 90 C 50 90 20 78 20 60 Z" fill={bgColor} stroke="#ffffff" strokeWidth="2" />
        <text x="50" y="58" fontSize="28" fontWeight="900" fill={txtColor} textAnchor="middle">
          {initial}
        </text>
      </svg>
    </div>
  );
};
