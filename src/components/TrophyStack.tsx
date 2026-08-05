import React from 'react';
import { Trophy } from '../types';
import { TrophyIcon } from './TrophyIcon';

interface TrophyStackProps {
  trophy: Trophy;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const TrophyStack: React.FC<TrophyStackProps> = ({ trophy, size = 'lg', showLabel = false }) => {
  const count = Math.max(1, trophy.count || 1);
  const items = Array.from({ length: count });

  // Negative margin for stacking overlap based on size (making repeated ones overlap more tightly)
  const offsetClass = {
    sm: '-ml-[18px]',  // w-6 is 24px, 18px overlap (75%)
    md: '-ml-[30px]',  // w-10 is 40px, 30px overlap (75%)
    lg: '-ml-[48px]',  // w-16 is 64px, 48px overlap (75%)
    xl: '-ml-[72px]',  // w-24 is 96px, 72px overlap (75%)
  }[size];

  return (
    <div className="relative group cursor-pointer flex flex-col items-center p-1.5 transition-transform duration-200 hover:scale-110">
      <div className="flex items-center justify-center relative">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`transition-transform duration-200 ${idx > 0 ? offsetClass : ''}`}
            style={{
              zIndex: idx + 1,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
            }}
          >
            <TrophyIcon name={trophy.name} size={size} />
          </div>
        ))}
      </div>

      {showLabel && (
        <span className="text-[11px] font-bold text-slate-200 font-mono mt-1 whitespace-nowrap">
          {trophy.name}
        </span>
      )}

      {/* Hover Tooltip showing trophy name and quantity */}
      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
        <span className="bg-[#181b28] text-amber-300 border border-amber-400/50 text-[11px] font-black px-3 py-1 rounded-xl shadow-2xl whitespace-nowrap">
          {trophy.name} {count > 1 ? `(x${count})` : ''}
        </span>
      </div>
    </div>
  );
};
