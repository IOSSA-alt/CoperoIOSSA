import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy as TrophyIconLucide, Shield, ArrowRight, Star } from 'lucide-react';
import { Club } from '../types';
import { TrophyIcon } from './TrophyIcon';
import { ClubLogo } from './ClubLogo';

interface SeasonTransitionProps {
  isOpen: boolean;
  oldAge: number;
  newAge: number;
  oldClub: Club;
  newClub: Club;
  ovrChange: number;
  newOvr: number;
  pjBonus: number;
  glsBonus: number;
  astBonus: number;
  trophiesWon: string[];
  msg: string;
  onContinue: () => void;
}

export const SeasonTransitionModal: React.FC<SeasonTransitionProps> = ({
  isOpen,
  oldAge,
  newAge,
  oldClub,
  newClub,
  ovrChange,
  newOvr,
  pjBonus,
  glsBonus,
  astBonus,
  trophiesWon,
  msg,
  onContinue
}) => {
  if (!isOpen) return null;

  const isTransfer = oldClub.id !== newClub.id;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="bg-[#121520] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-[0_0_100px_rgba(251,191,36,0.3)] relative overflow-hidden"
        >
          {/* Top Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> TEMPORADA FINALIZADA
          </motion.div>

          {/* Age Transition Banner */}
          <div className="flex items-center justify-center gap-4 my-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Edad Anterior</span>
              <span className="text-3xl font-black text-slate-400 font-mono">{oldAge}</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-amber-400 text-2xl font-black"
            >
              ➔
            </motion.div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex flex-col items-center bg-amber-500/10 border border-amber-400/40 px-4 py-1.5 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">Nueva Edad</span>
              <span className="text-4xl font-black text-amber-400 font-mono drop-shadow">{newAge}</span>
            </motion.div>
          </div>

          {/* Transfer Notification if changed club */}
          {isTransfer ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="my-5 p-3.5 bg-gradient-to-r from-blue-900/30 via-slate-900 to-blue-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-around"
            >
              <div className="flex flex-col items-center">
                <ClubLogo club={oldClub} size="sm" />
                <span className="text-[10px] font-bold text-slate-400 truncate max-w-[90px] mt-1">{oldClub.name}</span>
              </div>
              <div className="text-blue-400 font-black text-xs px-2 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 font-mono">
                NUEVO CLUB ⚽
              </div>
              <div className="flex flex-col items-center">
                <ClubLogo club={newClub} size="sm" />
                <span className="text-[10px] font-bold text-white truncate max-w-[90px] mt-1">{newClub.name}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-3 text-xs text-slate-300 font-mono font-semibold"
            >
              Continuación en <span className="text-white font-bold">{newClub.name}</span>
            </motion.div>
          )}

          {/* Stat Gains Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-4 gap-2 my-5"
          >
            <div className="bg-[#08090d] border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-mono font-bold">PJ</span>
              <span className="text-sm font-black text-emerald-400 font-mono">+{pjBonus}</span>
            </div>
            <div className="bg-[#08090d] border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-mono font-bold">GLS</span>
              <span className="text-sm font-black text-yellow-400 font-mono">+{glsBonus}</span>
            </div>
            <div className="bg-[#08090d] border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-mono font-bold">AST</span>
              <span className="text-sm font-black text-sky-400 font-mono">+{astBonus}</span>
            </div>
            <div className={`border rounded-xl p-2.5 flex flex-col items-center ${
              ovrChange >= 0
                ? 'bg-amber-500/10 border-amber-400/40 text-amber-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
            }`}>
              <span className="text-[9px] font-mono font-bold">OVR</span>
              <span className="text-sm font-black font-mono">
                {ovrChange >= 0 ? `+${ovrChange}` : ovrChange}
              </span>
            </div>
          </motion.div>

          {/* Trophies Banner */}
          {trophiesWon.length > 0 && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="my-4 p-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-400 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(251,191,36,0.4)]"
            >
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs uppercase tracking-wider mb-2">
                <TrophyIconLucide className="w-4 h-4 text-amber-400" /> ¡TÍTULO GANADO ESTA TEMPORADA!
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap my-1">
                {trophiesWon.map((tName, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <TrophyIcon name={tName} size="lg" className="animate-pulse" />
                    <span className="text-xs font-black text-white font-mono mt-1">{tName}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Narrative Summary */}
          <p className="text-xs text-slate-300 font-medium my-4 px-2 leading-relaxed bg-[#08090d]/80 p-3 rounded-xl border border-white/5">
            {msg}
          </p>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black uppercase text-xs rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all cursor-pointer tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            Continuar a los {newAge} Años <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
