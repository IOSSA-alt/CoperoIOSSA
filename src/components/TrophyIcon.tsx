import React from 'react';

interface TrophyIconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TrophyIcon: React.FC<TrophyIconProps> = ({ name, className = '', size = 'md' }) => {
  const norm = name.toLowerCase().trim();

  // Size mapping
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }[size];

  // LIGA D1: Golden Championship Trophy with Crown
  if (norm.includes('liga d1') || norm.includes('d1')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/MZXSMps.png" alt="Liga D1" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // LIGA D2: Silver / Blue Champion Cup
  if (norm.includes('liga d2') || norm.includes('d2')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/06YTzO7.png" alt="Liga D2" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // COPA MARADEI: Golden Kissing Trophy Sculpture
  if (norm.includes('maradei')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/ofU9v1n.png" alt="Copa Maradei" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // COPA VALENCARC: Yellow & Blue Ring Emblem Trophy
  if (norm.includes('valencarc')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/Wy1iMWx.png" alt="Copa ValenCARC" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // MUNDIAL: Golden World Cup Globe Trophy
  if (norm.includes('mundial') || norm.includes('world cup')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 135" className="w-full h-full drop-shadow-lg">
          {/* Globe top */}
          <circle cx="50" cy="28" r="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <path d="M 34 28 C 34 18 66 18 66 28 C 66 38 34 38 34 28 Z" fill="none" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 50 8 L 50 48" fill="none" stroke="#78350f" strokeWidth="1.5" />

          {/* Two holding figures / stem */}
          <path d="M 34 42 Q 22 65 38 90 L 44 105 L 56 105 L 62 90 Q 78 65 66 42 Q 56 55 50 55 Q 44 55 34 42 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          
          {/* Green Rings Base */}
          <rect x="25" y="105" width="50" height="7" rx="2" fill="#15803d" stroke="#166534" strokeWidth="1" />
          <rect x="22" y="114" width="56" height="12" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <rect x="28" y="118" width="44" height="4" fill="#15803d" />
        </svg>
      </div>
    );
  }

  // BALÓN DE ORO (Golden Ball)
  if (norm.includes('balón de oro') || norm.includes('balon') || norm.includes('ballon')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/K4HCkbb.png" alt="Balón de Oro" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // BOTÍN DE ORO (Golden Boot)
  if (norm.includes('botín') || norm.includes('botin') || norm.includes('boot')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/TTKSGyB.png" alt="Botín de Oro" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // COPA AMÉRICA
  if (norm.includes('américa') || norm.includes('america')) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <img src="https://i.imgur.com/2fm46hL.png" alt="Copa América" className="w-full h-full object-contain drop-shadow-md" />
      </div>
    );
  }

  // Fallback Trophy Icon
  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      <span className="text-3xl">🏆</span>
    </div>
  );
};
