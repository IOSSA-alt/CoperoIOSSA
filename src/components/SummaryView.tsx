import React from 'react';
import { PlayerState, Trophy } from '../types';
import { ClubLogo } from './ClubLogo';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface SummaryViewProps {
  player: PlayerState;
  onReset: () => void;
  onDownloadZip?: () => void;
  isDownloading?: boolean;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ player, onReset, onDownloadZip, isDownloading }) => {
  // Aggregate stats per club stint
  const clubStints: { club: any; pj: number; gls: number; ast: number; trophies: string[] }[] = [];
  let currentStint = null;

  for (const entry of player.history) {
    if (!currentStint || currentStint.club.id !== entry.club.id) {
      if (currentStint) clubStints.push(currentStint);
      currentStint = {
        club: entry.club,
        pj: entry.pj || 0,
        gls: entry.gls || 0,
        ast: entry.ast || 0,
        trophies: [...(entry.trophiesWon || [])]
      };
    } else {
      currentStint.pj += entry.pj || 0;
      currentStint.gls += entry.gls || 0;
      currentStint.ast += entry.ast || 0;
      if (entry.trophiesWon) {
        currentStint.trophies.push(...entry.trophiesWon);
      }
    }
  }
  if (currentStint) clubStints.push(currentStint);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    return `€${(value / 1000).toFixed(0)}K`;
  };

  const getOvrColor = (ovr: number) => {
    if (ovr >= 95) return 'bg-gradient-to-b from-purple-500 via-purple-700 to-purple-900 border border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(147,51,234,0.6)]';
    if (ovr >= 90) return 'bg-gradient-to-b from-cyan-400 via-cyan-600 to-cyan-800 border border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.6)]';
    if (ovr >= 75) return 'bg-gradient-to-b from-[#ca8a04] via-[#b45309] to-[#78350f] border border-amber-300 text-white shadow-[0_0_25px_rgba(202,138,4,0.4)]';
    if (ovr >= 65) return 'bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 border border-slate-200 text-white shadow-[0_0_15px_rgba(148,163,184,0.4)]';
    return 'bg-gradient-to-b from-[#8B5A2B] via-[#654321] to-[#3b2512] border border-[#CD853F] text-orange-100 shadow-[0_0_15px_rgba(139,90,43,0.4)]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Main Player Info */}
        <div className="flex-1 bg-[#101014] rounded-2xl p-6 border border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Carrera Finalizada</span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{player.lastName}</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-white/10 text-slate-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">#{player.number}</span>
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">{player.position}</span>
            </div>
            
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono font-bold mb-1">PJ</span>
                <span className="text-lg font-black text-white">{player.totalPj}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono font-bold mb-1">GLS</span>
                <span className="text-lg font-black text-white">{player.totalGls}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono font-bold mb-1">AST</span>
                <span className="text-lg font-black text-white">{player.totalAst}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-mono font-bold">VALOR</span>
              <span className="text-xl font-black text-white">{formatCurrency(player.marketValue)}</span>
            </div>
            <div className="bg-[#1a1a20] p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center min-w-[80px]">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mb-1">OVR</span>
              <span className={`text-4xl font-black leading-none ${getOvrColor(player.ovr)}`}>{player.ovr}</span>
            </div>
          </div>
        </div>

        {/* National & Individual Stats Column */}
        <div className="flex flex-col gap-4 flex-1">
          {/* National Team */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-green-600/20 border border-yellow-500/30 rounded-2xl p-6 min-w-[280px]">
          <div className="flex items-center gap-3 mb-4">
            <img src={player.nationality.flagUrl} alt={player.nationality.name} className="w-8 h-6 object-cover rounded shadow-sm border border-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-yellow-500/80 font-mono font-bold uppercase leading-none">Selección</span>
              <span className="text-lg font-black text-white leading-none">{player.nationality.name}</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-black/20 rounded-xl p-3 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-yellow-500/70 font-mono font-bold">PJ</span>
              <span className="text-sm font-black text-white">{player.nationalPj}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-yellow-500/70 font-mono font-bold">GLS</span>
              <span className="text-sm font-black text-white">{player.nationalGls}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-yellow-500/70 font-mono font-bold">AST</span>
              <span className="text-sm font-black text-white">{player.nationalAst}</span>
            </div>
          </div>
          <div className="flex justify-center">
            {player.trophies.some(t => t.category === 'MUNDIAL' || t.name.toLowerCase().includes('copa américa')) ? (
              <div className="flex gap-2">
                {player.trophies.filter(t => t.category === 'MUNDIAL' || t.name.toLowerCase().includes('copa américa')).map((t, idx) => (
                  <span key={idx} className="text-xl" title={t.name}>{t.icon}</span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-yellow-500/50 font-mono uppercase tracking-widest">Vitrina Vacía</span>
            )}
          </div>
        </div>

          {/* Individual Awards */}
          <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 flex-1 min-h-[140px] flex flex-col">
            <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest mb-4">Premios Individuales</span>
            <div className="flex-1 flex justify-center items-center">
              {player.trophies.some(t => t.category === 'INDIVIDUAL') ? (
                <div className="flex gap-2 flex-wrap">
                  {player.trophies.filter(t => t.category === 'INDIVIDUAL').map((t, idx) => (
                    <span key={idx} className="text-2xl drop-shadow-md" title={t.name}>{t.icon}</span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">Vitrina Vacía</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Clubs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {clubStints.map((stint, idx) => (
          <div key={idx} className="bg-[#101014] border-t-4 rounded-2xl p-5 flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1" style={{ borderTopColor: stint.club.color, backgroundColor: `${stint.club.color}11` }}>
            <div className="w-12 h-12 mb-3">
              <ClubLogo club={stint.club} size="md" />
            </div>
            <span className="text-sm font-black text-white mb-4 text-center">{stint.club.name}</span>
            
            <div className="w-full flex justify-between px-2 py-2 bg-white/5 rounded-xl mb-4">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-mono font-bold">PJ</span>
                <span className="text-xs font-black text-white">{stint.pj}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-mono font-bold">GLS</span>
                <span className="text-xs font-black text-white">{stint.gls}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-mono font-bold">AST</span>
                <span className="text-xs font-black text-white">{stint.ast}</span>
              </div>
            </div>

            <div className="mt-auto pt-2 min-h-[32px] flex items-center justify-center flex-wrap gap-1">
              {stint.trophies.map((t, i) => (
                <span key={i} className="text-sm" title={t}>🏆</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        {onDownloadZip && (
          <button 
            type="button"
            onClick={onDownloadZip}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold transition-all text-sm cursor-pointer ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Descargando...' : 'Descargar Proyecto .ZIP'}
          </button>
        )}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-all text-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Volver a jugar
        </button>
      </div>

    </motion.div>
  );
};
