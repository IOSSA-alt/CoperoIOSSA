import { generateEvent } from './utils/events';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Country, Club, Position, Foot, PlayerState, GameEvent, GameEventChoice, Trophy, TrophyCategory } from './types';
import { COUNTRIES, D1_CLUBS, D2_CLUBS, CANTERA_CLUBS, LIBRE_CLUB, POSITIONS_LIST, isD1Club, isD2Club } from './coperoData';
import { Search, RefreshCw, Sparkles, Crown, CheckCircle2, ArrowUpRight, ArrowDownRight, ArrowRight, Shield, Award, Download } from 'lucide-react';
import { TrophyIcon } from './components/TrophyIcon';
import { ClubLogo } from './components/ClubLogo';
import { SummaryView } from './components/SummaryView';
import { AnimatedNumber } from './components/AnimatedNumber';
import { TrophyStack } from './components/TrophyStack';
import JSZip from 'jszip';

// Raw imports for codebase ZIP download
import AppRaw from './App.tsx?raw';
import CoperoGameRaw from './CoperoGame.tsx?raw';
import typesRaw from './types.ts?raw';
import coperoDataRaw from './coperoData.ts?raw';
import mainRaw from './main.tsx?raw';
import indexCssRaw from './index.css?raw';

import AnimatedNumberRaw from './components/AnimatedNumber.tsx?raw';
import ClubLogoRaw from './components/ClubLogo.tsx?raw';
import SeasonTransitionModalRaw from './components/SeasonTransitionModal.tsx?raw';
import SummaryViewRaw from './components/SummaryView.tsx?raw';
import TrophyIconRaw from './components/TrophyIcon.tsx?raw';
import TrophyStackRaw from './components/TrophyStack.tsx?raw';

import utilsEventsRaw from './utils/events.ts?raw';
import utilsRandomRaw from './utils/random.ts?raw';

import indexHtmlRaw from '../index.html?raw';
import packageJsonRaw from '../package.json?raw';
import tsconfigJsonRaw from '../tsconfig.json?raw';
import viteConfigTsRaw from '../vite.config.ts?raw';
import metadataRaw from '../metadata.json?raw';


const getOvrStyles = (ovr: number) => {
  if (ovr >= 95) return 'bg-gradient-to-b from-purple-500 via-purple-700 to-purple-900 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(147,51,234,0.6)]';
  if (ovr >= 90) return 'bg-gradient-to-b from-cyan-400 via-cyan-600 to-cyan-800 border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.6)]';
  if (ovr >= 75) return 'bg-gradient-to-b from-[#ca8a04] via-[#b45309] to-[#78350f] border-amber-300 text-white shadow-[0_0_25px_rgba(202,138,4,0.4)]';
  if (ovr >= 65) return 'bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 border-slate-200 text-white shadow-[0_0_15px_rgba(148,163,184,0.4)]';
  return 'bg-gradient-to-b from-[#8B5A2B] via-[#654321] to-[#3b2512] border-[#CD853F] text-orange-100 shadow-[0_0_15px_rgba(139,90,43,0.4)]';
};

const getOvrHistoryBadgeStyle = (ovr: number) => {
  if (ovr >= 95) return 'bg-purple-950/40 text-purple-300 border-purple-500/30';
  if (ovr >= 90) return 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 font-black';
  if (ovr >= 75) return 'bg-amber-950/40 text-amber-300 border-amber-500/30 font-black';
  if (ovr >= 65) return 'bg-slate-800/40 text-slate-300 border-slate-500/30 font-black';
  return 'bg-amber-950/10 text-orange-400 border-orange-900/20 font-black';
};

export function getTrophyOrderRank(name: string): number {
  const norm = name.toLowerCase().trim();
  if (norm.includes('mundial') || norm.includes('iosoccer')) return 1;
  if (norm.includes('américa') || norm.includes('america')) return 2;
  if (norm.includes('balón') || norm.includes('balon')) return 3;
  if (norm.includes('botín') || norm.includes('botin')) return 4;
  if (norm.includes('liga d1') || norm.includes('d1')) return 5;
  if (norm.includes('maradei')) return 6;
  if (norm.includes('valencarc')) return 7;
  if (norm.includes('liga d2') || norm.includes('d2')) return 8;
  return 9;
}

export function sortTrophies(trophies: Trophy[]): Trophy[] {
  return [...trophies].sort((a, b) => {
    const rankA = getTrophyOrderRank(a.name);
    const rankB = getTrophyOrderRank(b.name);
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });
}

export function sortTrophyNames(names: string[]): string[] {
  return [...names].sort((a, b) => {
    const rankA = getTrophyOrderRank(a);
    const rankB = getTrophyOrderRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return a.localeCompare(b);
  });
}

const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 }
    });
  } catch (e) {
    console.warn('Confetti unavailable', e);
  }
};

// ---------- ANIMATED COUNTER COMPONENTS ----------
function AnimatedMarketValue({ value }: { value: number }) {
  const safeValue = isNaN(value) ? 0 : value;
  const [displayValue, setDisplayValue] = useState(safeValue);
  const prevValueRef = useRef(safeValue);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = isNaN(value) ? 0 : value;
    if (startValue === endValue) return;

    const duration = 2200; // Slower, more visible change (2.2 seconds)
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quadratic ease-out for a very smooth and fully visible counting sequence
      const easeOut = progress * (2 - progress);
      const current = Math.round(startValue + (endValue - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        prevValueRef.current = endValue;
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  const formatVal = (num: number) => {
    if (isNaN(num) || num <= 0) return '€0';
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    }
    return `€${Math.round(num / 1000)}K`;
  };

  return <span className="font-mono font-black text-white text-base sm:text-lg">{formatVal(displayValue)}</span>;
}

// ---------- REALISTIC MARKET VALUE CALCULATOR ----------
function calculateRealisticMarketValue(ovr: number, age: number): number {
  let baseVal = 100000;
  if (ovr <= 50) baseVal = 100000 + (ovr - 45) * 20000;
  else if (ovr <= 60) baseVal = 200000 + (ovr - 50) * 150000;
  else if (ovr <= 70) baseVal = 1700000 + (ovr - 60) * 1000000;
  else if (ovr <= 78) baseVal = 11700000 + (ovr - 70) * 3500000;
  else if (ovr <= 85) baseVal = 39700000 + (ovr - 78) * 7500000;
  else if (ovr <= 90) baseVal = 92200000 + (ovr - 85) * 14000000;
  else baseVal = 162200000 + (ovr - 90) * 25000000;

  let ageMult = 1.0;
  if (age <= 20) ageMult = 1.25;
  else if (age <= 27) ageMult = 1.1;
  else if (age <= 30) ageMult = 0.95;
  else if (age <= 33) ageMult = 0.8;
  else if (age <= 35) ageMult = 0.65;
  else ageMult = 0.5;

  let finalVal = Math.round(baseVal * ageMult);

  // Enforce a strict rule: if OVR >= 90, value is at least €100M
  if (ovr >= 90 && finalVal < 100000000) {
    finalVal = 100000000 + (ovr - 90) * 12000000;
  } else if (ovr >= 85 && finalVal < 60000000) {
    finalVal = 60000000 + (ovr - 85) * 5000000;
  }

  return finalVal;
}

export default function CoperoGame() {
  // Phase state
  const [phase, setPhase] = useState<'CREATION' | 'CAREER' | 'RETIREMENT' | 'SUMMARY'>('CREATION');

  // ---------- CREATION FORM STATES ----------
  const [lastName, setLastName] = useState('MARTÍNEZ');
  const [number, setNumber] = useState<number>(10);
  const [foot, setFoot] = useState<Foot>('Derecha');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Argentina
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Position>('DC');

  // ---------- CAREER ACTIVE STATE ----------
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // ---------- TROPHY WIN ANIMATION MODAL STATE ----------
  const [isProcessingNextSeason, setIsProcessingNextSeason] = useState(false);
  const [wonTrophyModal, setWonTrophyModal] = useState<{ name: string; category: TrophyCategory; icon: string } | null>(null);
  const [isFlyingToVitrina, setIsFlyingToVitrina] = useState(false);

  const triggerTrophyCelebration = (trophy: { name: string; category: TrophyCategory; icon: string }, onComplete?: () => void) => {
    setWonTrophyModal(trophy);
    setIsFlyingToVitrina(false);
    triggerConfetti();

    setTimeout(() => {
      setIsFlyingToVitrina(true);
      setTimeout(() => {
        setWonTrophyModal(null);
        setIsFlyingToVitrina(false);
        if (onComplete) onComplete();
      }, 750);
    }, 1850);
  };

  // ---------- INLINE RISK DECISION STATE ----------
  const [inlineRiskChoice, setInlineRiskChoice] = useState<{
    choiceId: string;
    isSpinning: boolean;
    currentFlash: 'UP' | 'DOWN';
    finalResult: {
      isSuccess: boolean;
      outcome: ReturnType<GameEventChoice['effect']>;
      choice: GameEventChoice;
    } | null;
  } | null>(null);

  // ---------- ZIP EXPORTER STATES & FUNCTION ----------
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Add root configuration files
      zip.file("package.json", packageJsonRaw);
      zip.file("tsconfig.json", tsconfigJsonRaw);
      zip.file("vite.config.ts", viteConfigTsRaw);
      zip.file("index.html", indexHtmlRaw);
      zip.file("metadata.json", metadataRaw);
      
      // Standard local .gitignore
      zip.file(".gitignore", `node_modules\ndist\n.env\n.env.local\n.DS_Store\n`);

      // Add src directory
      const srcFolder = zip.folder("src");
      if (srcFolder) {
        srcFolder.file("App.tsx", AppRaw);
        srcFolder.file("CoperoGame.tsx", CoperoGameRaw);
        srcFolder.file("types.ts", typesRaw);
        srcFolder.file("coperoData.ts", coperoDataRaw);
        srcFolder.file("index.css", indexCssRaw);
        srcFolder.file("main.tsx", mainRaw);

        // Add components directory
        const componentsFolder = srcFolder.folder("components");
        if (componentsFolder) {
          componentsFolder.file("AnimatedNumber.tsx", AnimatedNumberRaw);
          componentsFolder.file("ClubLogo.tsx", ClubLogoRaw);
          componentsFolder.file("SeasonTransitionModal.tsx", SeasonTransitionModalRaw);
          componentsFolder.file("SummaryView.tsx", SummaryViewRaw);
          componentsFolder.file("TrophyIcon.tsx", TrophyIconRaw);
          componentsFolder.file("TrophyStack.tsx", TrophyStackRaw);
        }

        // Add utils directory
        const utilsFolder = srcFolder.folder("utils");
        if (utilsFolder) {
          utilsFolder.file("events.ts", utilsEventsRaw);
          utilsFolder.file("random.ts", utilsRandomRaw);
        }
      }

      // Generate the ZIP as a blob
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CoperoIosoccer_codebase.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("No se pudo generar el archivo ZIP del proyecto:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Filtered countries for creation search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countrySearch]);

  // ---------- CREATION SUBMIT ----------
  const handleConfirmIdentity = () => {
    if (!lastName.trim()) return;

    const initialPlayer: PlayerState = {
      lastName: lastName.trim().toUpperCase(),
      number: Number(number) || 10,
      foot,
      nationality: selectedCountry,
      position: selectedPosition,
      age: 16,
      ovr: 50,
      marketValue: calculateRealisticMarketValue(50, 16),
      currentClub: LIBRE_CLUB,
      totalPj: 0,
      totalGls: 0,
      totalAst: 0,
      nationalPj: 0,
      nationalGls: 0,
      nationalAst: 0,
      trophies: [],
      history: []
    };

    setPlayer(initialPlayer);
    setLastNotification(null);
    setPhase('CAREER');
  };

  const getCurrentEvent = (): GameEvent => {
    return generateEvent(player);
  };

  // ---------- APPLY CHOICE FINAL RESULTS ----------
  const applyOutcome = (choice: GameEventChoice, outcome: ReturnType<GameEventChoice['effect']>) => {
    if (!player) return;

    setInlineRiskChoice(null);

    // Calculate performance-based OVR adjustment
    let perfOvrBonus = 0;
    const pos = (player.position || 'CF').toUpperCase().trim();
    const goals = outcome.glsBonus || 0;
    const assists = outcome.astBonus || 0;
    const totalPj = outcome.pjBonus || 0;
    const gAndA = goals + assists;

    // Position-specific logic
    if (pos === 'CF' || pos === 'DC' || pos === 'DELANTERO' || pos === 'LW' || pos === 'RW') {
      if (gAndA >= 30) perfOvrBonus += 4;
      else if (gAndA >= 20) perfOvrBonus += 2;
      else if (gAndA >= 10) perfOvrBonus += 1;
      else if (gAndA < 5 && totalPj > 15) perfOvrBonus -= 2; // Underperformance penalty
    } else if (pos === 'MC' || pos === 'MCO' || pos === 'VOLANTE' || pos === 'MEDIO' || pos === 'MEDIOCAMPISTA') {
      if (gAndA >= 18) perfOvrBonus += 4;
      else if (gAndA >= 10) perfOvrBonus += 2;
      else if (gAndA >= 5) perfOvrBonus += 1;
      else if (gAndA < 3 && totalPj > 15) perfOvrBonus -= 2;
    } else {
      // Defenders or Goalkeepers
      if (totalPj >= 35) perfOvrBonus += 2;
      else if (totalPj >= 25) perfOvrBonus += 1;
      else if (totalPj < 15) perfOvrBonus -= 2;
    }

    // Trophies bonus: cap at max +1 OVR bonus for winning any team titles/individual awards in a season
    const trophiesToAward = outcome.trophiesWon || (outcome.trophyWon ? [outcome.trophyWon] : []);
    if (trophiesToAward.length > 0) {
      perfOvrBonus += 1; 
    }

    // Age factor
    let ageModifier = 0;
    if (player.age < 21) {
      ageModifier = 1; // youth spurt
    } else if (player.age >= 32) {
      ageModifier = -1; // veteran decline
      if (player.age >= 35) {
        ageModifier = -2;
      }
    }

    const rawAdjustment = outcome.ovrChange + perfOvrBonus + ageModifier;
    
    // Apply diminishing returns (difficulty curve) to prevent OVR inflation above 78 OVR, making 93+ extremely hard and 99 legendary
    let totalAdjustment = rawAdjustment;
    let scalingApplied = false;
    
    if (totalAdjustment > 0) {
      if (player.ovr >= 93) {
        // Above 93: extremely hard to grow. Only 15% chance to grow by +1, otherwise +0
        const prev = totalAdjustment;
        totalAdjustment = Math.random() < 0.15 ? 1 : 0;
        if (totalAdjustment < prev) scalingApplied = true;
      } else if (player.ovr >= 90) {
        // Above 90: growth is very slow. Map any positive adjustment to max 1 OVR (25% chance of +1, else +0)
        const prev = totalAdjustment;
        totalAdjustment = Math.min(1, Math.floor(totalAdjustment * 0.15));
        if (totalAdjustment === 0 && Math.random() < 0.25) {
          totalAdjustment = 1;
        }
        if (totalAdjustment < prev) scalingApplied = true;
      } else if (player.ovr >= 85) {
        // Above 85: growth is slow. Map positive adjustment to max 1 or 2 OVR (40% chance of getting at least +1)
        const prev = totalAdjustment;
        totalAdjustment = Math.min(2, Math.floor(totalAdjustment * 0.35));
        if (totalAdjustment === 0 && Math.random() < 0.40) {
          totalAdjustment = 1;
        }
        if (totalAdjustment < prev) scalingApplied = true;
      } else if (player.ovr >= 78) {
        // Above 78: growth is moderated. Map positive adjustment to max 3 OVR
        const prev = totalAdjustment;
        totalAdjustment = Math.min(3, Math.floor(totalAdjustment * 0.6));
        if (totalAdjustment === 0 && Math.random() < 0.60) {
          totalAdjustment = 1;
        }
        if (totalAdjustment < prev) scalingApplied = true;
      }
    }

    const newOvr = Math.min(99, Math.max(45, player.ovr + totalAdjustment));

    // Construct detailed explanation text to display next to outcome message
    let performanceText = '';
    const positiveBreakdowns: string[] = [];
    const negativeBreakdowns: string[] = [];

    if (perfOvrBonus > 0) {
      positiveBreakdowns.push(`+${perfOvrBonus} OVR por rendimiento`);
    } else if (perfOvrBonus < 0) {
      negativeBreakdowns.push(`${perfOvrBonus} OVR por rendimiento`);
    }

    if (ageModifier > 0) {
      positiveBreakdowns.push(`+${ageModifier} OVR de juventud`);
    } else if (ageModifier < 0) {
      negativeBreakdowns.push(`${ageModifier} OVR por edad`);
    }

    const baseChoiceChange = outcome.ovrChange;
    if (baseChoiceChange > 0) {
      positiveBreakdowns.push(`+${baseChoiceChange} base`);
    } else if (baseChoiceChange < 0) {
      negativeBreakdowns.push(`${baseChoiceChange} base`);
    }

    const allBreakdowns = [...positiveBreakdowns, ...negativeBreakdowns];
    if (allBreakdowns.length > 0) {
      let adjustmentLabel = `${totalAdjustment >= 0 ? '+' : ''}${totalAdjustment} OVR`;
      if (scalingApplied) {
        adjustmentLabel += ` (Frenado por curva de dificultad de nivel ${player.ovr} OVR)`;
      }
      performanceText = ` (Cambio total: ${adjustmentLabel}: ${allBreakdowns.join(', ')})`;
    }

    const displayMsg = outcome.msg + performanceText;

    const nextClub = outcome.nextClub || player.currentClub;
    const nextAge = player.age + 1;
    const newValue = calculateRealisticMarketValue(newOvr, nextAge);

    // National team simulation
    let natPjGain = 0;
    let natGlsGain = 0;
    let natAstGain = 0;
    if (newOvr >= 72 && Math.random() < 0.70) {
      natPjGain = Math.floor(Math.random() * 6) + 3;
      natGlsGain = player.position === 'DC' ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 2);
      natAstGain = Math.floor(Math.random() * 3);
    }

    const historyRecordWithoutTrophies = {
      age: player.age,
      club: nextClub,
      ovr: newOvr,
      pj: outcome.pjBonus,
      gls: outcome.glsBonus,
      ast: outcome.astBonus,
      isDescent: outcome.isDescent,
      trophiesWon: [] as string[]
    };

    const updatedPlayerWithoutTrophies: PlayerState = {
      ...player,
      age: nextAge,
      ovr: newOvr,
      marketValue: newValue,
      currentClub: nextClub,
      totalPj: player.totalPj + outcome.pjBonus,
      totalGls: player.totalGls + outcome.glsBonus,
      totalAst: player.totalAst + outcome.astBonus,
      nationalPj: player.nationalPj + natPjGain,
      nationalGls: player.nationalGls + natGlsGain,
      nationalAst: player.nationalAst + natAstGain,
      trophies: player.trophies, // Keep existing trophies for now
      history: [...player.history, historyRecordWithoutTrophies]
    };

    setPlayer(updatedPlayerWithoutTrophies);
    setIsProcessingNextSeason(true);

    if (trophiesToAward.length > 0) {
      setLastNotification(displayMsg + " 🏆 ¡Festejando título!");

      const firstTrophy = trophiesToAward[0];
      const firstTrophyName = firstTrophy.name === 'Mundial' ? 'Mundial de Iosoccer' : firstTrophy.name;

      triggerTrophyCelebration(
        { ...firstTrophy, name: firstTrophyName },
        () => {
          // When flight completes, add all trophies to player vitrina and history
          setPlayer(prevPlayer => {
            if (!prevPlayer) return null;

            const trophiesList = [...prevPlayer.trophies];
            const earnedTrophies: string[] = [];

            trophiesToAward.forEach(t => {
              let tName = t.name === 'Mundial' ? 'Mundial de Iosoccer' : t.name;
              if (!earnedTrophies.includes(tName)) {
                earnedTrophies.push(tName);
              }
              const existing = trophiesList.find(x => x.name === tName);
              if (existing) {
                existing.count += 1;
              } else {
                trophiesList.push({
                  id: tName.toLowerCase().replace(/\s+/g, '_'),
                  name: tName,
                  category: t.category,
                  icon: t.icon,
                  count: 1
                });
              }
            });

            const sortedTrophiesList = sortTrophies(trophiesList);
            const sortedEarnedTrophies = sortTrophyNames(earnedTrophies);

            // Update the last history record with the trophies won
            const updatedHistory = prevPlayer.history.map((h, i) => {
              if (i === prevPlayer.history.length - 1) {
                return {
                  ...h,
                  trophiesWon: sortedEarnedTrophies
                };
              }
              return h;
            });

            setLastNotification(displayMsg + ` 🏆 Título: ${sortedEarnedTrophies.join(', ')}`);

            setIsProcessingNextSeason(false);
            if (nextAge > 38) {
              setPhase('RETIREMENT');
            }

            return {
              ...prevPlayer,
              trophies: sortedTrophiesList,
              history: updatedHistory
            };
          });
        }
      );
    } else {
      setLastNotification(displayMsg);
      setTimeout(() => {
        setIsProcessingNextSeason(false);
        if (nextAge > 38) {
          setPhase('RETIREMENT');
        }
      }, 500);
    }
  };

  // ---------- CHOICE HANDLER (INLINE RISK VS DIRECT) ----------
  const handleSelectChoice = (choice: GameEventChoice) => {
    if (!player || inlineRiskChoice?.isSpinning || isProcessingNextSeason) return;

    if ((choice.positiveChance && choice.negativeChance) || (choice.outcomes && choice.outcomes.some(o => o.type === 'negative'))) {
      const outcome = choice.effect(player);
      const isSuccess = outcome.ovrChange >= 0;

      setInlineRiskChoice({
        choiceId: choice.id,
        isSpinning: true,
        currentFlash: 'UP',
        finalResult: { isSuccess, outcome, choice }
      });
    } else {
      applyOutcome(choice, choice.effect(player));
    }
  };

  // Inline roulette flashing timer
  useEffect(() => {
    if (!inlineRiskChoice || !inlineRiskChoice.isSpinning) return;

    const interval = setInterval(() => {
      setInlineRiskChoice(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentFlash: prev.currentFlash === 'UP' ? 'DOWN' : 'UP'
        };
      });
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setInlineRiskChoice(prev => {
        if (!prev || !prev.finalResult) return null;
        return {
          ...prev,
          isSpinning: false,
          currentFlash: prev.finalResult.isSuccess ? 'UP' : 'DOWN'
        };
      });
    }, 1900);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [inlineRiskChoice?.isSpinning]);

  const handleReset = () => {
    setPlayer(null);
    setLastNotification(null);
    setInlineRiskChoice(null);
    setPhase('CREATION');
  };

  const currentEvent = getCurrentEvent();

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-black flex flex-col">

      {/* Top Header Bar */}
      <header className="border-b border-white/5 bg-[#0e1017]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black shadow-lg text-sm">
            ⚽
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase flex items-center gap-2">
              COPERO <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">IOSOCCER</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all cursor-pointer ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? 'Descargando...' : 'Descargar .ZIP'}
          </button>

          {(phase === 'CAREER' || phase === 'RETIREMENT') && player && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          )}
        </div>
      </header>

      {/* TROPHY CELEBRATION OVERLAY */}
      <AnimatePresence>
        {wonTrophyModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 0, x: 0 }}
              animate={
                isFlyingToVitrina
                  ? { scale: 0.15, opacity: 0, y: 350, x: -250 }
                  : { scale: 1, opacity: 1, y: 0, x: 0 }
              }
              transition={{
                duration: isFlyingToVitrina ? 0.75 : 0.5,
                ease: isFlyingToVitrina ? [0.4, 0, 0.2, 1] : "backOut",
              }}
              className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#101014]/95 border-2 border-amber-400/80 shadow-[0_0_120px_rgba(251,191,36,0.6)] max-w-sm w-full relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-amber-400/10 blur-xl pointer-events-none" />

              <div className="relative mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-2xl animate-pulse" />
                <TrophyIcon name={wonTrophyModal.name} size="xl" />
              </div>

              <div className="relative z-10">
                <span className="bg-amber-400 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block shadow-md">
                  ¡NUEVO TROFEO CONQUISTADO!
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1 font-mono">
                  {wonTrophyModal.name}
                </h3>
                <p className="text-xs text-amber-300 font-mono mt-1 font-bold">
                  Agregado a tu vitrina de trofeos
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== PHASE 1: CREATION SCREEN ==================== */}
      {phase === 'CREATION' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
              Creá tu jugador <span className="text-amber-400 text-sm font-normal">#LigaIOSSA</span>
            </h1>
            <span className="text-xs text-slate-400 font-mono">Paso 1 de 1 - Identidad</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Column 1: Identidad & Jersey */}
            <div className="lg:col-span-4 bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <h2 className="text-center font-bold text-xs text-slate-300 uppercase tracking-widest mb-2 font-mono">
                CAMISETA Y DORSAL
              </h2>

              <div className="flex justify-center my-3 relative">
                <div className="relative w-52 h-60 flex items-center justify-center">
                  <svg viewBox="0 0 200 230" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                    <defs>
                      <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 45 30 L 70 42 C 85 48 115 48 130 42 L 155 30 L 192 70 L 165 105 L 150 90 L 150 215 L 50 215 L 50 90 L 35 105 L 8 70 Z"
                      fill="url(#jerseyGrad)"
                      stroke="#334155"
                      strokeWidth="3"
                    />
                    <rect x="70" y="48" width="16" height="165" fill="url(#stripeGrad)" />
                    <rect x="114" y="48" width="16" height="165" fill="url(#stripeGrad)" />
                    <path d="M 8 70 L 35 105 L 48 90" fill="#0284c7" />
                    <path d="M 192 70 L 165 105 L 152 90" fill="#0284c7" />
                    <path d="M 70 42 C 85 58 115 58 130 42 C 115 48 85 48 70 42 Z" fill="#0284c7" />
                  </svg>

                  <div className="absolute top-12 left-0 right-0 text-center pointer-events-none flex flex-col items-center">
                    <p className="font-black text-white text-[12px] tracking-widest uppercase font-mono drop-shadow-[0_2px_2px_rgba(0,0,0,1)] px-2 truncate max-w-[130px]">
                      {lastName || 'NOMBRE'}
                    </p>
                    <p className="font-black text-white text-6xl tracking-tight leading-none mt-1 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] font-mono">
                      {number || 10}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">NOMBRE</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="NOMBRE"
                      className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm outline-none focus:border-amber-400 transition-all uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">DORSAL</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={number}
                      onChange={e => setNumber(Number(e.target.value))}
                      className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold text-sm text-center outline-none focus:border-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase text-center mb-1">PIERNA HÁBIL</label>
                  <div className="bg-[#08090d] p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setFoot('Izquierda')}
                      className={`py-2 rounded-lg font-bold transition-all ${
                        foot === 'Izquierda' ? 'bg-amber-400 text-black shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Izquierda
                    </button>
                    <button
                      type="button"
                      onClick={() => setFoot('Derecha')}
                      className={`py-2 rounded-lg font-bold transition-all ${
                        foot === 'Derecha' ? 'bg-amber-400 text-black shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Derecha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Nacionalidad */}
            <div className="lg:col-span-4 bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl">
              <h2 className="text-center font-bold text-xs text-slate-300 uppercase tracking-widest mb-3 font-mono">
                NACIONALIDAD
              </h2>

              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  placeholder="Buscar país..."
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div className="flex-1 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar grid grid-cols-1 gap-2">
                {filteredCountries.map((c) => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow-md' 
                          : 'bg-[#08090d] border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <img
                        src={c.flagUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-5 object-cover rounded shadow-sm border border-white/10"
                      />
                      <span className="truncate flex-1">{c.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Posición */}
            <div className="lg:col-span-4 bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
              <h2 className="text-center font-bold text-xs text-slate-300 uppercase tracking-widest mb-3 font-mono">
                POSICIÓN EN CANCHA
              </h2>

              <div className="relative w-full aspect-[3/4] rounded-2xl border-2 border-[#164e32] p-4 overflow-hidden shadow-inner flex items-center justify-center" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #103823, #103823 10%, #0d301e 10%, #0d301e 20%)' }}>
                <div className="absolute inset-2 border border-[#3b82f6]/20 rounded-xl pointer-events-none" />
                <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-[#ffffff]/30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-[#ffffff]/30 rounded-full pointer-events-none" />
                
                {/* Penalty Boxes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-16 border border-[#ffffff]/30 border-t-0 pointer-events-none" />
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-8 border border-[#ffffff]/30 border-t-0 rounded-b-full pointer-events-none" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-16 border border-[#ffffff]/30 border-b-0 pointer-events-none" />
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-8 border border-[#ffffff]/30 border-b-0 rounded-t-full pointer-events-none" />

                {POSITIONS_LIST.map((p) => {
                  const isSelected = selectedPosition === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPosition(p.id)}
                      style={{ left: `${p.xPercent}%`, top: `${p.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer shadow-lg w-12 text-center flex items-center justify-center ${
                        isSelected 
                          ? 'bg-amber-400 text-black border-2 border-white scale-125 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-20' 
                          : 'bg-[#041a12] text-[#6ee7b7] border border-[#6ee7b7]/20 hover:scale-110 hover:border-[#6ee7b7]/60'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <img src={selectedCountry.flagUrl} alt={selectedCountry.name} className="w-5 h-3.5 rounded object-cover" />
              <span>{lastName || 'JUGADOR'} #{number} • {selectedPosition}</span>
            </div>

            <button
              type="button"
              onClick={handleConfirmIdentity}
              disabled={!lastName.trim()}
              className={`px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl ${
                lastName.trim()
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_25px_rgba(251,191,36,0.4)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Confirmar e iniciar carrera
            </button>
          </div>
        </motion.div>
      )}

      {/* ==================== PHASE 2: CAREER DASHBOARD ==================== */}
      {phase === 'CAREER' && player && (
        <motion.div
          key="career_dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 py-6"
        >

          {/* Toast Notification */}
          {lastNotification && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border-l-4 border-amber-400 p-4 rounded-r-2xl text-amber-200 text-xs font-mono font-bold flex items-center justify-between shadow-xl"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {lastNotification}
              </span>
              <button onClick={() => setLastNotification(null)} className="text-slate-400 hover:text-white ml-4 cursor-pointer">✕</button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT PANEL: Player Top Card & Decision Area (6 cols) */}
            <div className="lg:col-span-6 space-y-6">

              {/* Player Top Card */}
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-stretch gap-4">

                  {/* OVR Badge */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`font-black px-4 py-3.5 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[86px] min-h-[90px] ${getOvrStyles(player.ovr)}`}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-200/90 leading-none mb-1">OVR</span>
                    <span className="text-5xl leading-none font-black text-white drop-shadow-md"><AnimatedNumber value={player.ovr} delay={0.1} duration={2.2} /></span>
                  </motion.div>

                  {/* Player Main Details Box */}
                  <div className="flex-1 min-w-0 bg-[#0a0c12] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
                    
                    {/* Top Row: Country Badge + Dorsal Position Pill + Age & Value */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Country Flag Badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-white/10">
                          <img
                            src={player.nationality.flagUrl}
                            alt={player.nationality.name}
                            className="w-4 h-3 rounded object-cover shadow"
                          />
                          <span className="text-[11px] text-slate-200 font-mono font-bold uppercase">{player.nationality.code}</span>
                        </div>

                        {/* Dorsal & Position Pill */}
                        <span className="text-[11px] bg-[#831843] text-pink-200 font-mono font-bold px-2.5 py-0.5 rounded-full border border-pink-500/30">
                          #{player.number} {player.position}
                        </span>
                      </div>

                      {/* Age & Value */}
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-mono uppercase mr-1">EDAD</span>
                        <span className="text-base font-black text-white">{player.age}</span>
                      </div>
                    </div>

                    {/* Bottom Row inside details box */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 truncate">
                        <ClubLogo club={player.currentClub} size="md" />
                        <h2 className="font-black text-2xl sm:text-3xl text-white truncate tracking-tight">
                          {player.currentClub.name}
                        </h2>
                      </div>

                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none mb-0.5">VALOR</span>
                        <AnimatedMarketValue value={player.marketValue} />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 text-center font-mono">
                  <div className="bg-[#08090d]/60 p-3 rounded-2xl border border-white/5">
                    <span className="text-xs sm:text-sm text-amber-300 block uppercase font-black tracking-wider mb-1">PJ</span>
                    <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1.5">
                      <span className="text-emerald-400 text-xl">🟩</span>
                      <AnimatedNumber value={player.totalPj} />
                    </span>
                  </div>
                  <div className="bg-[#08090d]/60 p-3 rounded-2xl border border-white/5">
                    <span className="text-xs sm:text-sm text-emerald-400 block uppercase font-black tracking-wider mb-1">GLS</span>
                    <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1.5">
                      <span className="text-xl">⚽</span>
                      <AnimatedNumber value={player.totalGls} />
                    </span>
                  </div>
                  <div className="bg-[#08090d]/60 p-3 rounded-2xl border border-white/5">
                    <span className="text-xs sm:text-sm text-sky-400 block uppercase font-black tracking-wider mb-1">AST</span>
                    <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1.5">
                      <span className="text-xl">👟</span>
                      <AnimatedNumber value={player.totalAst} />
                    </span>
                  </div>
                </div>

                {/* Vitrina Row: TROPHY DISPLAY (No borders, Standalone logos, Name on hover only) */}
                <div className="mt-5 pt-4 border-t border-white/10 text-center">
                  <h4 className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> VITRINA DE TROFEOS Y DISTINCIONES
                  </h4>
                  {player.trophies.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono py-2">
                      <span className="text-base opacity-40">🏆</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold">VITRINA VACÍA</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap py-2 px-4 select-none">
                      {sortTrophies(player.trophies).map((t) => (
                        <div key={t.id} className="relative transition-all duration-300 hover:scale-125 hover:z-30 hover:mx-1 hover:translate-y-[-6px]">
                          <TrophyStack trophy={t} size="lg" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* CURRENT EVENT DECISION PANEL */}
              {phase === 'RETIREMENT' ? (
                <div className="bg-[#101014] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[350px]">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518605368461-1ee511880907?auto=format&fit=crop&q=80&w=1000)' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/50 to-transparent"></div>
                  <div className="relative z-10 mt-auto w-full pb-4">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-8 drop-shadow-lg shadow-black">Tu carrera llegó a su fin</h3>
                    <div className="flex gap-4 items-center justify-center">
                      <button onClick={() => setPhase('SUMMARY')} className="bg-white hover:bg-slate-200 text-black px-6 py-3 rounded-full font-bold transition-all shadow-xl text-sm">Ver resumen</button>
                      <button onClick={handleReset} className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-full font-bold transition-all text-sm">Volver a jugar</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={"bg-[#101014] border border-white/10 rounded-2xl p-6 shadow-2xl transition-opacity duration-500 " + (isProcessingNextSeason ? "opacity-30 pointer-events-none" : "")}>
                <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                  {currentEvent.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {currentEvent.description}
                </p>

                {/* Event Choice Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentEvent.choices.map((choice, idx) => {
                    const isFullWidth = currentEvent.choices.length === 3 && idx === 2;
                    const isChoiceSelected = inlineRiskChoice?.choiceId === choice.id;

                    return (
                      <motion.div
                        key={choice.id}
                        whileHover={{ y: -3 }}
                        onClick={() => {
                          if (!inlineRiskChoice) {
                            handleSelectChoice(choice);
                          }
                        }}
                        className={`bg-[#08090d] hover:bg-[#151824] border border-white/10 hover:border-amber-400/80 p-5 rounded-2xl text-center transition-all group flex flex-col items-center justify-between shadow-lg relative min-h-[210px] cursor-pointer ${
                          isFullWidth ? 'sm:col-span-2 max-w-sm mx-auto w-full' : ''
                        } ${isChoiceSelected ? 'ring-2 ring-amber-400 border-amber-400 bg-[#121524]' : ''}`}
                      >
                        {/* INLINE RISK ANIMATION DIRECTLY ON CARD */}
                        {isChoiceSelected && inlineRiskChoice ? (
                          <div className="w-full flex-1 flex flex-col items-center justify-center p-2 my-auto text-center" onClick={(e) => e.stopPropagation()}>
                            {inlineRiskChoice.isSpinning ? (
                              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                                <div className={`w-20 h-20 rounded-2xl border-4 flex flex-col items-center justify-center transition-all shadow-xl scale-110 ${
                                  inlineRiskChoice.currentFlash === 'UP'
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/50'
                                    : 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-rose-500/50'
                                }`}>
                                  {inlineRiskChoice.currentFlash === 'UP' ? (
                                    <>
                                      <ArrowUpRight className="w-9 h-9 text-emerald-400 animate-bounce" />
                                      <span className="text-[10px] font-black uppercase tracking-wider">SUBIÓ</span>
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownRight className="w-9 h-9 text-rose-400 animate-bounce" />
                                      <span className="text-[10px] font-black uppercase tracking-wider">BAJÓ</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-[11px] font-mono text-amber-300 font-bold animate-pulse">
                                  Evaluando consecuencia...
                                </p>
                              </div>
                            ) : (
                              /* Result */
                              <div className="w-full flex flex-col items-center justify-between space-y-3 py-1 animate-fade-in">
                                <div className={`w-full py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 shadow-lg ${
                                  inlineRiskChoice.finalResult?.isSuccess
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                    : 'bg-rose-500/20 border-rose-400 text-rose-300'
                                }`}>
                                  {inlineRiskChoice.finalResult?.isSuccess ? (
                                    <>
                                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                                      <span className="font-black text-sm uppercase">¡SUBIÓ! +{inlineRiskChoice.finalResult.outcome.ovrChange} OVR</span>
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownRight className="w-5 h-5 text-rose-400" />
                                      <span className="font-black text-sm uppercase">¡BAJÓ! {inlineRiskChoice.finalResult?.outcome.ovrChange} OVR</span>
                                    </>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-[#0e1017] p-3 rounded-xl border border-white/10 text-center">
                                  {inlineRiskChoice.finalResult?.outcome.msg}
                                </p>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (inlineRiskChoice.finalResult) {
                                      applyOutcome(inlineRiskChoice.finalResult.choice, inlineRiskChoice.finalResult.outcome);
                                    }
                                  }}
                                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs rounded-xl shadow-lg transition-all cursor-pointer tracking-wider mt-1"
                                >
                                  Aceptar y continuar
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Standard Choice Display */
                          <div className="w-full h-full flex flex-col items-center justify-between">
                            {choice.outcomes ? (
                               <div className="w-full flex flex-col h-full">
                                  <p className="text-base font-black text-white text-center mb-3 group-hover:text-amber-300 transition-colors">
                                    {choice.title}
                                  </p>
                                  {choice.image && (
                                    <div className="w-full flex-grow rounded-xl overflow-hidden mb-3 border border-white/10 relative min-h-[120px]">
                                      <img src={choice.image} alt={choice.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                  )}
                                  <div className="w-full flex flex-col gap-1.5 mt-auto">
                                    {choice.outcomes.map((out, idx) => {
                                      if (out.type === 'positive') {
                                        return (
                                          <div key={idx} className="w-full flex justify-between items-center bg-[#062415] border border-emerald-900 px-3 py-2 rounded-xl">
                                            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs"><ArrowUpRight size={14}/> {out.label}</span>
                                            {out.percentage && <span className="bg-[#0b3b24] text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">{out.percentage}</span>}
                                          </div>
                                        )
                                      } else if (out.type === 'negative') {
                                        return (
                                          <div key={idx} className="w-full flex justify-between items-center bg-[#2a0e14] border border-rose-900 px-3 py-2 rounded-xl">
                                            <span className="text-rose-400 font-bold flex items-center gap-1.5 text-xs"><ArrowDownRight size={14}/> {out.label}</span>
                                            {out.percentage && <span className="bg-[#4a1523] text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">{out.percentage}</span>}
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div key={idx} className="w-full flex items-center gap-2 bg-[#1a1a1e] border border-white/5 px-3 py-2.5 rounded-xl">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0"><ArrowRight size={12} className="text-slate-400"/></div>
                                            <span className="text-slate-300 font-bold text-xs">{out.label}</span>
                                          </div>
                                        )
                                      }
                                    })}
                                  </div>
                               </div>
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-between">
                                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-2">
                                    {choice.clubTarget
                                      ? (choice.clubTarget.id === player?.currentClub.id ? 'Renovación de Contrato' : (currentEvent.id.includes('loan') ? 'Ir a préstamo a' : 'Fichar por'))
                                      : (choice.subtitle || 'Opción')}
                                  </p>

                                  {choice.image ? (
                                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-white/10 relative">
                                      <img src={choice.image} alt={choice.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                  ) : choice.clubTarget ? (
                                    <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform p-1">
                                      <ClubLogo club={choice.clubTarget} size="lg" />
                                    </div>
                                  ) : null}

                                  <p className="text-base font-black text-white group-hover:text-amber-300 transition-colors mb-3">
                                    {choice.clubTarget
                                      ? (choice.clubTarget.id === player?.currentClub.id ? `Quedarse en ${choice.clubTarget.name}` : choice.clubTarget.name)
                                      : choice.title}
                                  </p>

                                  <div className="w-full pt-2.5 border-t border-white/5 flex flex-col items-center gap-1.5 text-[10px] font-mono font-bold mt-auto">


                                    {choice.positiveChance && (
                                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full w-full text-center">
                                        ↗️ {choice.positiveChance}
                                      </span>
                                    )}

                                    {choice.negativeChance && (
                                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full w-full text-center">
                                        ↘️ {choice.negativeChance}
                                      </span>
                                    )}
                                  </div>
                               </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
            {/* RIGHT PANEL: Timeline Table (6 cols) */}
            <div className="lg:col-span-6 bg-[#101014] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="grid grid-cols-12 gap-2 text-xs sm:text-sm font-black uppercase tracking-wider pb-3.5 border-b border-white/10 px-2">
                  <span className="col-span-2 text-slate-300">EDAD</span>
                  <span className="col-span-5 text-slate-300">CLUB</span>
                  <span className="col-span-2 text-center text-slate-300">OVR</span>
                  <span className="col-span-1 text-center text-amber-300">PJ</span>
                  <span className="col-span-1 text-center text-emerald-400">GLS</span>
                  <span className="col-span-1 text-center text-sky-400">AST</span>
                </div>

                <div className="space-y-2 mt-3">
                  {[16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38].map((ageVal) => {
                    const record = player.history.find(h => h.age === ageVal);
                    const isCurrent = player.age === ageVal;

                    return (
                      <motion.div
                        key={ageVal}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (ageVal - 16) * 0.02 }}
                        className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border font-mono transition-all ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/30'
                            : record
                            ? 'bg-[#08090d] border-white/5 text-slate-200'
                            : 'bg-transparent border-transparent text-slate-600'
                        }`}
                      >
                        <div className="col-span-2 flex items-center">
                          <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm sm:text-base ${
                            isCurrent 
                              ? 'bg-[#1e2333] border border-amber-400/60 text-amber-300 shadow-md' 
                              : record 
                              ? 'bg-[#0284c7] text-white font-black' 
                              : 'bg-slate-800/40 text-slate-600'
                          }`}>
                            {ageVal}
                          </span>
                        </div>

                        <div className="col-span-5 flex items-center gap-2.5 truncate">
                          {record ? (
                            <>
                              <ClubLogo club={record.club} size="xs" />
                              <span className="font-extrabold text-white text-sm sm:text-base truncate">{record.club.name}</span>
                              {record.trophiesWon && record.trophiesWon.length > 0 && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {sortTrophyNames(record.trophiesWon).map((tName, idx) => (
                                    <span key={idx} title={tName} className="cursor-pointer hover:scale-125 transition-transform">
                                      <TrophyIcon name={tName} size="sm" />
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : isCurrent ? (
                            <span className="text-amber-400 font-bold italic animate-pulse text-xs sm:text-sm">
                              ❓ Eligiendo club...
                            </span>
                          ) : (
                            <span className="text-slate-600 font-normal text-xs sm:text-sm">
                              -
                            </span>
                          )}
                        </div>

                        <div className="col-span-2 flex justify-center">
                          {record ? (
                            <span className={`font-black px-2.5 py-1 rounded-lg text-xs sm:text-sm border ${getOvrHistoryBadgeStyle(record.ovr)}`}>
                              {record.ovr}
                            </span>
                          ) : isCurrent ? (
                            <span className={`font-black px-2.5 py-1 rounded-lg text-xs sm:text-sm shadow border ${getOvrHistoryBadgeStyle(player.ovr)}`}>
                              {player.ovr}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </div>

                        <div className="col-span-1 text-center font-black text-white text-base sm:text-lg">
                          {record ? record.pj : '-'}
                        </div>

                        <div className="col-span-1 text-center font-black text-emerald-400 text-base sm:text-lg">
                          {record ? record.gls : '-'}
                        </div>

                        <div className="col-span-1 text-center font-black text-sky-400 text-base sm:text-lg">
                          {record ? record.ast : '-'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Row: National Team Row */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between bg-[#08090d] p-4 rounded-2xl border border-white/5 font-mono">
                <div className="flex items-center gap-3">
                  <img
                    src={player.nationality.flagUrl}
                    alt={player.nationality.name}
                    className="w-8 h-5 rounded object-cover border border-white/10 shadow"
                  />
                  <span className="font-black text-white text-base sm:text-lg">{player.nationality.name}</span>
                </div>
                <div className="flex items-center gap-6 font-black text-lg sm:text-2xl">
                  <span className="text-white flex items-center gap-1.5"><span className="text-emerald-400 text-base">🟩</span> {player.nationalPj} <span className="text-xs text-amber-300 font-black">PJ</span></span>
                  <span className="text-emerald-400 flex items-center gap-1.5">⚽ {player.nationalGls} <span className="text-xs text-emerald-300 font-black">GLS</span></span>
                  <span className="text-sky-400 flex items-center gap-1.5">👟 {player.nationalAst} <span className="text-xs text-sky-300 font-black">AST</span></span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}


      {/* ==================== PHASE 3: SUMMARY SCREEN ==================== */}
      {phase === 'SUMMARY' && player && (
        <SummaryView player={player} onReset={handleReset} onDownloadZip={handleDownloadZip} isDownloading={isDownloading} />
      )}

    </div>
  );
}
