import { PlayerState, GameEvent, GameEventChoice, Club, Foot } from '../types';
import { D1_CLUBS, D2_CLUBS, LIBRE_CLUB, isD1Club, isD2Club } from '../coperoData';
import { seededRandom, shuffleArray } from './random';

function parseOvrFromLabel(label: string): number {
  if (!label) return -2;
  const match = label.match(/(-|\+)?\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  return -2;
}

/**
 * Calculates position-appropriate realistic goals and assists for a season based on player's position and OVR.
 */
export function getPositionStats(position: string, ovr: number): { gls: number; ast: number } {
  const normPos = (position || 'CF').toUpperCase().trim();
  const ovrFactor = 0.5 + (ovr / 100); // Scales performance based on skill level (0.95x to 1.5x)

  let gls = 0;
  let ast = 0;

  if (normPos === 'GK' || normPos === 'ARQUERO' || normPos === 'PO') {
    // Goalkeepers: almost always 0, very rarely 1 goal or 1 assist
    gls = Math.random() < 0.005 ? 1 : 0;
    ast = Math.random() < 0.02 ? 1 : 0;
  } else if (normPos === 'CB' || normPos === 'LB' || normPos === 'RB' || normPos === 'DF' || normPos === 'DEFENSA') {
    // Defenders: very few goals (0-3 max), few assists (0-4 max, fullbacks LB/RB slightly more)
    const isFullback = normPos === 'LB' || normPos === 'RB';
    gls = Math.random() < 0.15 ? Math.floor(Math.random() * 2) + 1 : 0; // 0 to 2 goals
    ast = isFullback 
      ? Math.floor(Math.random() * 4) // 0 to 3 assists
      : (Math.random() < 0.3 ? 1 : 0); // 0 to 1 assist
  } else if (normPos === 'MC' || normPos === 'MCO' || normPos === 'VOLANTE' || normPos === 'MEDIO' || normPos === 'MEDIOCAMPISTA') {
    // Midfielders: more assists (4-14), fewer goals (1-6)
    gls = Math.floor((Math.random() * 5 + 1) * ovrFactor); // 1 to 7 goals
    ast = Math.floor((Math.random() * 9 + 4) * ovrFactor); // 4 to 13 assists
  } else {
    // Forwards (CF, LW, RW, DC, DELANTERO)
    if (normPos === 'CF' || normPos === 'DC' || normPos === 'DELANTERO') {
      // Striker: tons of goals (10-35), fewer assists (2-8)
      gls = Math.floor((Math.random() * 18 + 10) * ovrFactor); // 10 to 42 goals
      ast = Math.floor((Math.random() * 6 + 2) * ovrFactor);   // 2 to 12 assists
    } else {
      // Wingers (LW, RW): high goals (7-22) and high assists (5-15)
      gls = Math.floor((Math.random() * 12 + 6) * ovrFactor);  // 6 to 27 goals
      ast = Math.floor((Math.random() * 10 + 5) * ovrFactor);  // 5 to 22 assists
    }
  }

  return {
    gls: Math.max(0, gls),
    ast: Math.max(0, ast)
  };
}

/**
 * Simulates the trophies won by a player during a season based on division and player OVR.
 * - In D1 teams, it is much easier to win cups (Copa Maradei, Copa ValenCARC).
 * - "Entre más cosas ganadas, más difícil es": multiple titles are scaled down in probability.
 * - Probability scales with player's OVR.
 */
export function simulateSeasonTrophies(
  isD1: boolean,
  ovr: number,
  clubName: string
): Array<{ name: string; category: 'LIGA' | 'COPA'; icon: string }> {
  const trophies: Array<{ name: string; category: 'LIGA' | 'COPA'; icon: string }> = [];

  const normClub = clubName.toLowerCase();
  const isAimstar = normClub.includes('aimstar');
  const isBulls = normClub.includes('bulls');
  const isJF = normClub.includes('jf') || normClub.includes('just fraggins');

  // OVR factor: higher OVR represents better season performance, but keeps things balanced
  const ovrFactor = 0.6 + (ovr / 150); // scales more moderately now

  // Apply club multipliers or flat bonuses - significantly tuned down to avoid inflation
  let multiplier = 1.0;
  let flatBonus = 0.0;

  if (isAimstar) {
    multiplier = 1.35;
  } else if (isBulls) {
    multiplier = 1.2;
  } else if (isJF) {
    flatBonus = 0.03;
  }

  // 1. League title (Highly competitive)
  let leagueChance = 0;
  if (isD1) {
    // 12% base chance for Liga D1
    leagueChance = (0.12 * ovrFactor) * multiplier + flatBonus;
    if (Math.random() < leagueChance) {
      trophies.push({ name: 'Liga D1', category: 'LIGA', icon: '🏆' });
    }
  } else {
    // 15% base chance for Liga D2
    leagueChance = (0.15 * ovrFactor) * multiplier + flatBonus;
    if (Math.random() < leagueChance) {
      trophies.push({ name: 'Liga D2', category: 'LIGA', icon: '🏆' });
    }
  }

  // 2. Copa Maradei
  let maradeiChance = isD1 
    ? 0.15 * ovrFactor   // 15% base in D1
    : 0.05 * ovrFactor;  // 5% base in D2
  
  maradeiChance = maradeiChance * multiplier + flatBonus;

  if (Math.random() < maradeiChance) {
    trophies.push({ name: 'Copa Maradei', category: 'COPA', icon: '🏆' });
  }

  // 3. Copa ValenCARC
  let valencarcChance = isD1 
    ? 0.12 * ovrFactor   // 12% base in D1
    : 0.04 * ovrFactor;  // 4% base in D2

  valencarcChance = valencarcChance * multiplier + flatBonus;

  if (Math.random() < valencarcChance) {
    trophies.push({ name: 'Copa ValenCARC', category: 'COPA', icon: '🏆' });
  }

  // --- "Entre más cosas, más difícil es" (Difficulty penalty for multiple titles) ---
  // Significantly increased penalties to make trebles and doubles rare and historic!
  if (trophies.length === 2) {
    if (Math.random() < 0.45) { // 45% chance to lose one trophy
      const indexToRemove = Math.floor(Math.random() * 2);
      trophies.splice(indexToRemove, 1);
    }
  } else if (trophies.length === 3) {
    const roll = Math.random();
    if (roll < 0.75) { // 75% chance to drop trophies
      if (roll < 0.40) {
        // Keep only 1 trophy
        const keepIndex = Math.floor(Math.random() * 3);
        const kept = trophies[keepIndex];
        trophies.length = 0;
        trophies.push(kept);
      } else {
        // Keep 2 trophies
        const indexToRemove = Math.floor(Math.random() * 3);
        trophies.splice(indexToRemove, 1);
      }
    }
  }

  return trophies;
}

/**
 * Simulates prestigious individual awards (Balon de Oro, Botin de Oro) and Copa America representation.
 */
export function simulateIndividualAwardsAndSelection(
  isD1: boolean,
  ovr: number,
  gls: number,
  ast: number,
  age: number,
  hasWonTeamTrophy: boolean
): Array<{ name: string; category: 'LIGA' | 'COPA' | 'SUPERCOPA' | 'INDIVIDUAL' | 'MUNDIAL'; icon: string }> {
  const awards: Array<{ name: string; category: 'LIGA' | 'COPA' | 'SUPERCOPA' | 'INDIVIDUAL' | 'MUNDIAL'; icon: string }> = [];

  // 1. Botín de Oro (Golden Boot) - Highly coveted, must score extreme goals to have a high chance
  let botinChance = 0;
  if (gls >= 35) {
    botinChance = 0.50;
  } else if (gls >= 25) {
    botinChance = 0.25;
  } else if (gls >= 18) {
    botinChance = 0.10;
  } else if (gls >= 10) {
    botinChance = 0.02;
  }

  // If in D2, winning a national or global Golden Boot is highly restricted
  if (!isD1) {
    botinChance /= 4.0;
  }

  // Moderated OVR boost
  if (ovr > 85) botinChance += 0.10;
  
  if (Math.random() < botinChance) {
    awards.push({ name: 'Botín de Oro', category: 'INDIVIDUAL', icon: '🏆' });
  }

  // 2. Balón de Oro (Ballon d'Or)
  // Strictly restricted to Division 1 players (cannot win if playing in D2!)
  let balonChance = 0;
  if (isD1) {
    if (ovr >= 94) {
      balonChance = 0.18; // Even at 94+, there are other legends!
    } else if (ovr >= 90) {
      balonChance = 0.08;
    } else if (ovr >= 85) {
      balonChance = 0.02;
    }

    // Season contribution multipliers
    const totalContrib = gls + ast;
    if (totalContrib >= 35) {
      balonChance *= 1.4;
    } else if (totalContrib >= 22) {
      balonChance *= 1.2;
    }

    if (hasWonTeamTrophy) {
      balonChance *= 1.3;
    }
  }

  if (Math.random() < balonChance) {
    awards.push({ name: 'Balón de Oro', category: 'INDIVIDUAL', icon: '🏆' });
  }

  // 3. Copa América (played every 4 years)
  if (age % 4 === 0 && ovr >= 65) {
    // 15% base chance to win Copa América, up to 35% for elite players
    const copAmericaChance = 0.15 + (Math.min(20, ovr - 65) / 100);
    if (Math.random() < copAmericaChance) {
      awards.push({ name: 'Copa América', category: 'MUNDIAL', icon: '🏆' });
    }
  }

  return awards;
}

export function generateEvent(player: PlayerState | null): GameEvent {
  if (!player) {
    const tormalina = D2_CLUBS[0];
    const heerenveen = D2_CLUBS[1];
    const casi = D2_CLUBS[2];
    return {
      id: 'cantera_start',
      type: 'CANTERA',
      title: 'Oferta de cantera',
      description: 'Tres clubes quieren sumarte a su proyecto juvenil en Liga D2. Elegí dónde empieza tu carrera.',
      choices: [
        { id: `cantera_${tormalina.id}`, clubTarget: tormalina, title: `Fichar por ${tormalina.name}`, effect: () => ({ ovrChange: 8, glsBonus: 4, astBonus: 2, pjBonus: 32, valueMult: 2.8, nextClub: tormalina, msg: `¡Debutaste profesionalmente en las inferiores de ${tormalina.name}!` }) },
        { id: `cantera_${heerenveen.id}`, clubTarget: heerenveen, title: `Fichar por ${heerenveen.name}`, effect: () => ({ ovrChange: 7, glsBonus: 3, astBonus: 3, pjBonus: 30, valueMult: 2.4, nextClub: heerenveen, msg: `¡Debutaste profesionalmente en ${heerenveen.name}!` }) },
        { id: `cantera_${casi.id}`, clubTarget: casi, title: `Fichar por ${casi.name}`, effect: () => ({ ovrChange: 7, glsBonus: 2, astBonus: 4, pjBonus: 28, valueMult: 2.2, nextClub: casi, msg: `¡Arrancaste tu trayectoria juvenil en ${casi.name}!` }) }
      ]
    };
  }

  const age = player.age;
  const rand = seededRandom(age * 1000 + player.ovr);
  
  // Decide event type: even ages are MERCADO, odd ages are DECISION (perfect alternation starting at age 16)
  const isMercado = age % 2 === 0;

  if (isMercado) {
    // Determine if player gets released/fired from their current club
    let isReleased = false;
    let releaseReason = '';

    if (player.currentClub.id === 'libre') {
      isReleased = true;
      releaseReason = 'Actualmente estás sin club. Varios equipos de Iosoccer se muestran interesados en ficharte. Elegí tu nuevo destino.';
    } else if (player.history && player.history.length > 0) {
      const lastSeason = player.history[player.history.length - 1];
      const pos = (player.position || 'CF').toUpperCase().trim();
      
      // Performance-based release: If stats are too low, the team fires them!
      if (pos === 'CF' || pos === 'LW' || pos === 'RW' || pos === 'DELANTERO') {
        const combined = lastSeason.gls + lastSeason.ast;
        if (combined < 6) {
          isReleased = true;
          releaseReason = `¡Contrato Rescindido! El club decidió liberarte debido a tu bajo rendimiento ofensivo en la temporada pasada (apenas ${lastSeason.gls} goles y ${lastSeason.ast} asistencias). ¡Debes buscar un nuevo equipo!`;
        }
      } else if (pos === 'MC' || pos === 'MCO' || pos === 'VOLANTE' || pos === 'MEDIO' || pos === 'MEDIOCAMPISTA') {
        const combined = lastSeason.gls + lastSeason.ast;
        if (combined < 4) {
          isReleased = true;
          releaseReason = `¡Contrato Rescindido! El cuerpo técnico no quedó conforme con tu aporte de juego y pases en la temporada pasada (${lastSeason.gls} goles y ${lastSeason.ast} asistencias). El club te dejó libre.`;
        }
      } else if (pos === 'CB' || pos === 'LB' || pos === 'RB' || pos === 'DF' || pos === 'DEFENSA') {
        if (lastSeason.pj < 32) {
          isReleased = true;
          releaseReason = `¡Contrato Rescindido! Perdiste la titularidad el año pasado, disputando solo ${lastSeason.pj} partidos, y el club decidió rescindir tu contrato por baja continuidad.`;
        }
      } else if (pos === 'GK' || pos === 'ARQUERO' || pos === 'PO') {
        if (lastSeason.pj < 30 || (player.ovr < 60 && rand() < 0.35)) {
          isReleased = true;
          releaseReason = `¡Contrato Rescindido! El club contrató a otro arquero de mayor categoría y rescindió tu contrato de forma inmediata. ¡Buscá un nuevo destino!`;
        }
      }

      // Crisis-based release (12% chance if not already released, fully deterministic based on age & ovr seed)
      if (!isReleased && rand() < 0.12) {
        isReleased = true;
        const crises = [
          `¡Contrato Rescindido! El presidente de ${player.currentClub.name} vendió la institución a un grupo inversor de Iosoccer que decidió rescindir todos los contratos de la plantilla.`,
          `¡Contrato Rescindido! El nuevo DT de ${player.currentClub.name} asumió sus funciones y declaró ante la prensa que no estás en sus planes deportivos para esta temporada.`,
          `¡Contrato Rescindido! Una grave crisis financiera e institucional obligó a ${player.currentClub.name} a dejar libres a varias de sus figuras, incluyéndote.`
        ];
        const crisisIndex = Math.floor(seededRandom(age * 555 + player.ovr)() * crises.length);
        releaseReason = crises[crisisIndex];
      }
    }

    // Generate MERCADO event
    // CRITICAL BUG FIX: Filter out the current club from the pool to prevent duplicates ( stay and transfer offer for the same club )
    const pool = ((player.ovr > 70) ? D1_CLUBS : D2_CLUBS).filter(c => c.id !== player.currentClub.id);
    const shuffled = shuffleArray(pool, age * 123);
    const clubs = shuffled.slice(0, 2);

    const choices: GameEventChoice[] = [
      {
        id: `transfer_${clubs[0].id}`,
        clubTarget: clubs[0],
        title: `Fichar por ${clubs[0].name}`,
        effect: (p) => {
          const isD1 = isD1Club(clubs[0].name);
          const trophiesWon = simulateSeasonTrophies(isD1, p.ovr, clubs[0].name);
          const stats = getPositionStats(p.position, p.ovr);
          const awards = simulateIndividualAwardsAndSelection(isD1, p.ovr, stats.gls, stats.ast, p.age, trophiesWon.length > 0);
          const allTrophies = [...trophiesWon, ...awards];
          return {
            ovrChange: Math.floor(Math.random() * 4) + 1,
            glsBonus: stats.gls,
            astBonus: stats.ast,
            pjBonus: 30 + Math.floor(Math.random() * 15),
            valueMult: 1.2,
            nextClub: clubs[0],
            trophiesWon: allTrophies.length > 0 ? allTrophies : undefined,
            msg: allTrophies.length > 0 
              ? `¡Excelente año con ${clubs[0].name}! Ganaste: ${allTrophies.map(t => t.name).join(', ')}.` 
              : `¡Completaste la temporada en ${clubs[0].name}!`
          };
        }
      },
      {
        id: `transfer_${clubs[1].id}`,
        clubTarget: clubs[1],
        title: `Fichar por ${clubs[1].name}`,
        effect: (p) => {
          const isD1 = isD1Club(clubs[1].name);
          const trophiesWon = simulateSeasonTrophies(isD1, p.ovr, clubs[1].name);
          const stats = getPositionStats(p.position, p.ovr);
          const awards = simulateIndividualAwardsAndSelection(isD1, p.ovr, stats.gls, stats.ast, p.age, trophiesWon.length > 0);
          const allTrophies = [...trophiesWon, ...awards];
          return {
            ovrChange: Math.floor(Math.random() * 3) + 2,
            glsBonus: stats.gls,
            astBonus: stats.ast,
            pjBonus: 30 + Math.floor(Math.random() * 15),
            valueMult: 1.3,
            nextClub: clubs[1],
            trophiesWon: allTrophies.length > 0 ? allTrophies : undefined,
            msg: allTrophies.length > 0 
              ? `¡Gran temporada en ${clubs[1].name}! Conseguiste: ${allTrophies.map(t => t.name).join(', ')}.` 
              : `¡Buena temporada en ${clubs[1].name}!`
          };
        }
      }
    ];

    // Only allow staying/renewing if NOT released and NOT currently a free agent
    if (!isReleased && player.currentClub.id !== 'libre') {
      choices.push({
        id: `stay_${player.currentClub.id}`,
        clubTarget: player.currentClub,
        title: `Renovar con ${player.currentClub.name}`,
        effect: (p) => {
          const isD1 = isD1Club(p.currentClub.name);
          const trophiesWon = simulateSeasonTrophies(isD1, p.ovr, p.currentClub.name);
          const stats = getPositionStats(p.position, p.ovr);
          const awards = simulateIndividualAwardsAndSelection(isD1, p.ovr, stats.gls, stats.ast, p.age, trophiesWon.length > 0);
          const allTrophies = [...trophiesWon, ...awards];
          return {
            ovrChange: Math.floor(Math.random() * 3) + 1,
            trophiesWon: allTrophies.length > 0 ? allTrophies : undefined,
            glsBonus: stats.gls,
            astBonus: stats.ast,
            pjBonus: 35 + Math.floor(Math.random() * 10),
            valueMult: 1.1,
            nextClub: p.currentClub,
            msg: allTrophies.length > 0 
              ? `¡Renovaste y fuiste clave en ${p.currentClub.name}! Ganaste: ${allTrophies.map(t => t.name).join(', ')}.` 
              : `¡Renovaste y fuiste clave en ${p.currentClub.name}!`
          };
        }
      });
    }

    return {
      id: `mercado_${age}`,
      type: 'MERCADO',
      title: isReleased ? '¡Contrato Rescindido! (Jugador Libre)' : 'Mercado de Pases',
      description: isReleased ? releaseReason : 'Tenés ofertas sobre la mesa. ¿Qué camino vas a tomar esta temporada?',
      choices: choices
    };
  } else {
    const decisions: Array<{
      title: string;
      desc: string;
      c1: string;
      img1: string;
      outcomes1: { type: 'positive'|'negative'|'neutral'; label: string; percentage?: string }[];
      e1: { ovr: number; msg: string; failMsg?: string };
      c2: string;
      img2: string | null;
      outcomes2: { type: 'positive'|'negative'|'neutral'; label: string; percentage?: string }[] | null;
      e2: { ovr: number; msg: string; failMsg?: string };
      condition?: (player: PlayerState) => boolean;
    }> = [
      {
        title: 'Concentración extra',
        desc: 'Una concentración especial puede potenciarte, pero el esfuerzo también puede pasarte factura.',
        c1: 'Hacerla', img1: 'https://images.unsplash.com/photo-1518659728251-2483842c3df4?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+4 OVR', percentage: '65%' },
          { type: 'negative', label: '-3 OVR', percentage: '35%' }
        ],
        e1: { ovr: 4, msg: '¡Mejoraste tu rendimiento con la concentración extra!', failMsg: 'El cansancio te pasó factura y terminaste jugando peor. (-3 OVR)' },
        c2: 'Preparación habitual', img2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Te preparaste con normalidad.' }
      },
      {
        title: 'Las medias robadas',
        desc: 'El Marth decidió robarte las medias para limpiarse el culo. ¿Te peleás para recuperarlas?',
        c1: 'Pelear para recuperarlas',
        img1: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeFzKyekLNiG-ryWwaw_RUO0J9zguait2765tvKJo4Bw9sSkoc1ZH4ZQ&s=10',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '10%' },
          { type: 'negative', label: '-5 OVR', percentage: '90%' }
        ],
        e1: { 
          ovr: 2, 
          msg: '¡Salió bien! Le diste una paliza al Marth, recuperaste tus medias y te ganaste el respeto de todo el vestuario. (+2 OVR)', 
          failMsg: '¡Salió mal! El Marth te re molió a palos. Encima de que te quedaste sin medias, terminaste lesionado en el hospital. (-5 OVR)' 
        },
        c2: 'No darle importancia',
        img2: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Decidiste no darle importancia. Te quedaste sin medias pero evitaste el conflicto.' }
      },
      {
        title: 'La sustancia de Cuca',
        desc: 'Cuca te dio una sustancia misteriosa asegurando que va a mejorar tu rendimiento de forma increíble. ¿La probás?',
        c1: 'Confiar y probarla',
        img1: 'https://victoravilaabogado.com/wp-content/uploads/2024/12/TRAPICHEO.jpg',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '40%' },
          { type: 'negative', label: '-6 OVR', percentage: '60%' }
        ],
        e1: { 
          ovr: 3, 
          msg: '¡Salió bien! Sentiste una energía espectacular, corriste todo el partido y el DT te felicitó. (+3 OVR)', 
          failMsg: 'Era Merca, te agarraron en el antidoping. Te comiste una sanción histórica y bajó tu físico. (-6 OVR)' 
        },
        c2: 'Evitarlo',
        img2: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Decidiste evitarlo y seguir con tu preparación habitual. No cambió nada.' }
      },
      {
        title: 'El stream nocturno',
        desc: 'Un streamer muy famoso te invita a jugar unas partidas y charlar en vivo de madrugada.',
        c1: 'Ir y quedarte hasta tarde', img1: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '50%' },
          { type: 'negative', label: '-2 OVR', percentage: '50%' }
        ],
        e1: { ovr: 2, msg: '¡La rompiste en el stream! Ganaste miles de seguidores y mucha confianza. (+2 OVR)', failMsg: 'Te dormiste en el entrenamiento y el DT te mandó a correr bajo la lluvia. (-2 OVR)' },
        c2: 'Priorizar el descanso', img2: 'https://images.unsplash.com/photo-1520206183501-b80df6103962?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Decidiste dormir temprano. Buen ejemplo de profesionalismo.' }
      },
      {
        title: 'El Penal Decisivo',
        desc: 'Último minuto del partido más importante de la temporada. El pateador oficial tiene miedo. ¿Pedís patearlo?',
        c1: 'Patear el penal', img1: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+4 OVR', percentage: '60%' },
          { type: 'negative', label: '-4 OVR', percentage: '40%' }
        ],
        e1: { ovr: 4, msg: '¡GOOOOOL! La clavaste al ángulo, ganaron el partido y sos el héroe absoluto del club. (+4 OVR)', failMsg: 'La tiraste por arriba del travesaño. La hinchada no te lo va a perdonar por un largo tiempo. (-4 OVR)' },
        c2: 'Dejar que patee otro', img2: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Dejaste que el capitán se haga cargo. Preservaste tu tranquilidad.' }
      },
      {
        title: 'El Asado del Capitán',
        desc: 'El líder del grupo organiza un asado para unir al vestuario. El fernet y la birra fluyen en cantidad.',
        c1: 'Comer y tomar sin límites', img1: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+1 OVR', percentage: '40%' },
          { type: 'negative', label: '-3 OVR', percentage: '60%' }
        ],
        e1: { ovr: 1, msg: '¡Tremenda noche! Sos el alma de la fiesta y un referente en el vestuario. (+1 OVR)', failMsg: 'Te dio un ataque de hígado terrible. No pudiste correr al día siguiente. (-3 OVR)' },
        c2: 'Ir pero cuidarse', img2: 'https://images.unsplash.com/photo-1544025162-8316db186f86?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: '+1 OVR' }
        ],
        e2: { ovr: 1, msg: 'Fuiste, compartiste con el grupo pero tomaste agua. El DT admira tu disciplina. (+1 OVR)' }
      },
      {
        title: 'Oferta de la Kings League',
        desc: 'Te proponen sumarte a la Kings League de Iosoccer. Te ofrecen un salario astronómico, pero alejado del fútbol profesional competitivo.',
        c1: 'Aceptar la oferta', img1: 'https://images.unsplash.com/photo-1504156806644-815c89499d54?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '30%' },
          { type: 'negative', label: '-4 OVR', percentage: '70%' }
        ],
        e1: { ovr: 2, msg: 'Te convertiste en estrella de internet y el show te potenció. (+2 OVR)', failMsg: 'El bajo nivel de exigencia afectó tu rendimiento físico y tu carrera profesional. (-4 OVR)' },
        c2: 'Rechazar la oferta', img2: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: '+1 OVR' }
        ],
        e2: { ovr: 1, msg: 'Te quedaste a pelearla en el fútbol tradicional. Ganaste respeto profesional. (+1 OVR)' }
      },
      {
        title: 'El Caño en el Entrenamiento',
        desc: 'Un pibe de 16 años de las inferiores te tira un caño humillante frente a todos en la práctica de fútbol reducido.',
        c1: 'Ir a cruzarlo duro', img1: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+1 OVR', percentage: '15%' },
          { type: 'negative', label: '-5 OVR', percentage: '85%' }
        ],
        e1: { ovr: 1, msg: 'Le pusiste los puntos. Nadie más se atrevió a sobrar en el entrenamiento. (+1 OVR)', failMsg: 'Le metiste una patada criminal, te expulsaron del entrenamiento y te pusieron una multa enorme. (-5 OVR)' },
        c2: 'Aplaudir y felicitarlo', img2: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: '+2 OVR' }
        ],
        e2: { ovr: 2, msg: 'Tuviste un gesto humilde y excelente. El pibe te adora y el grupo está más unido que nunca. (+2 OVR)' }
      },
      {
        title: 'Plan de alimentación',
        desc: 'Un nutricionista propone ajustar tu dieta. Puede mejorar tu rendimiento o salir mal.',
        c1: 'Seguir el plan', img1: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '60%' },
          { type: 'negative', label: '-2 OVR', percentage: '40%' }
        ],
        e1: { ovr: 3, msg: '¡Mejoraste físicamente con la nueva dieta!', failMsg: 'La dieta te cayó pesadísima y perdiste energía. (-2 OVR)' },
        c2: 'Mantener tu dieta', img2: 'https://images.unsplash.com/photo-1544025162-8316db186f86?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Seguiste comiendo como siempre.' }
      },
      {
        title: 'Salida Nocturna antes del partido',
        desc: 'Tus amigos te invitan a salir de fiesta la noche antes del partido.',
        c1: 'Quedarte durmiendo', img1: 'https://images.unsplash.com/photo-1517618956926-d66820293eb3?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '80%' },
          { type: 'negative', label: '-1 OVR', percentage: '20%' }
        ],
        e1: { ovr: 2, msg: 'Descansaste perfecto y metiste doblete al día siguiente.', failMsg: 'No podías dormir pensando en la fiesta y rendiste menos. (-1 OVR)' },
        c2: 'Ir a la fiesta', img2: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'negative', label: '-3 OVR', percentage: '90%' },
          { type: 'positive', label: '+1 OVR', percentage: '10%' }
        ],
        e2: { ovr: -3, msg: '¡Salió bien! Aunque estabas cansado, jugaste de memoria y zafaste.', failMsg: 'Te quedaste dormido, llegaste tarde al partido y el DT te colgó. (-3 OVR)' }
      },
      {
        title: 'Pelea con el DT',
        desc: 'El DT te puso a jugar en una posición que no te gusta.',
        c1: 'Adaptarte y dar lo mejor', img1: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '70%' },
          { type: 'negative', label: '-1 OVR', percentage: '30%' }
        ],
        e1: { ovr: 3, msg: 'Demostraste tu polivalencia y te ganaste la titularidad indiscutida.', failMsg: 'No te hallaste en la posición y tuviste un partido flojo. (-1 OVR)' },
        c2: 'Discutir frente a todos', img2: 'https://images.unsplash.com/photo-1577224212130-1033b006c9a9?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'negative', label: '-4 OVR', percentage: '85%' },
          { type: 'positive', label: '+1 OVR', percentage: '15%' }
        ],
        e2: { ovr: -4, msg: '¡Zafaste! El DT admitió su error y te devolvió a tu puesto.', failMsg: 'Te colgaron por 5 partidos y perdiste ritmo de juego. (-4 OVR)' }
      },
      {
        title: 'Competencia por el puesto',
        desc: 'El club incorpora a otro jugador para competir por tu lugar.',
        c1: 'Competir', img1: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Titular', percentage: '50%' },
          { type: 'negative', label: 'Rotación baja', percentage: '50%' }
        ],
        e1: { ovr: 4, msg: '¡Te ganaste la titularidad y mejoraste tu nivel con la competencia!', failMsg: 'Te mandaron al banco de suplentes y perdiste confianza. (-2 OVR)' },
        c2: 'Fichar por otro club', img2: null,
        outcomes2: null,
        e2: { ovr: 1, msg: 'Decidiste cambiar de aire y buscar regularidad.' }
      },
      {
        title: 'Problemas con Hacienda',
        desc: 'La fiscalía inicia una investigación penal por presunta evasión de impuestos en tus derechos de imagen.',
        c1: 'Pagar multa millonaria', img1: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'neutral', label: 'Regularizar cuentas (Sin cambios en OVR)' }
        ],
        e1: { ovr: 0, msg: 'Pagaste una fortuna en multas y recargos, pero cerraste la causa penal. Tu cabeza vuelve a estar 100% enfocada en el fútbol.' },
        c2: 'Ir a juicio y apelar', img2: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: 'Declarado Inocente (+2 OVR)', percentage: '35%' },
          { type: 'negative', label: 'Condena y Embargo (-4 OVR)', percentage: '65%' }
        ],
        e2: { ovr: 2, msg: '¡Inocente! La justicia falló a tu favor. Te sacás un peso gigante de encima y jugás con total soltura. (+2 OVR)', failMsg: '¡Culpable! Te aplicaron prisión en suspenso y embargaron tus cuentas. El escándalo mediático arruina tu rendimiento. (-4 OVR)' }
      },
      {
        title: 'La invitación de Casana',
        desc: 'Casana te invita a un boliche la noche anterior al clásico más importante del torneo. Dice que es "solo para tomar una cerveza e irse temprano".',
        c1: 'Aceptar la salida', img1: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '20%' },
          { type: 'negative', label: '-4 OVR', percentage: '80%' }
        ],
        e1: { ovr: 3, msg: '¡Salió bien! Te cruzás con el DT en el boliche, se copan hablando de táctica, terminan de fiesta juntos y entrás motivadísimo al partido. (+3 OVR)', failMsg: '¡Salió mal! Te la pegás en la nuca, te acostás a las 7 AM y llegás al partido vomitando en el vestuario. (-4 OVR)' },
        c2: 'Quedarte a dormir', img2: 'https://images.unsplash.com/photo-1517618956926-d66820293eb3?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Sos un profesional responsable y dormiste genial.' }
      },
      {
        title: 'La Botinera o el Contrato',
        desc: 'Ngolo te presenta a un "representante" que conoció en Instagram. El tipo promete llevarte a un club de Primera si le pagás una comisión por adelantado en criptomonedas.',
        condition: (p) => isD2Club(p.currentClub.name),
        c1: 'Pagarle la comisión', img1: 'https://victoravilaabogado.com/wp-content/uploads/2024/12/TRAPICHEO.jpg',
        outcomes1: [
          { type: 'positive', label: '+5 OVR', percentage: '5%' },
          { type: 'negative', label: '-3 OVR', percentage: '95%' }
        ],
        e1: { ovr: 5, msg: '¡Increíble! Milagrosamente el tipo era posta un scout del City Group y firman un precontrato. (+5 OVR)', failMsg: '¡Estafa! Era un pibe de 15 años metido en una estafa piramidal. Te vació la cuenta, el vestuario se enteró y te re descansan. (-3 OVR)' },
        c2: 'Ignorarlo', img2: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Seguís con tu representante de confianza de toda la vida.' }
      },
      {
        title: 'El Botín "Mágico"',
        desc: 'Lea te vende unos botines usados que supuestamente eran de un crack retirado. Tienen las suelas gastadas pero te promete que "tienen magia".',
        c1: 'Comprarlos y usarlos', img1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '10%' },
          { type: 'negative', label: '-4 OVR', percentage: '90%' }
        ],
        e1: { ovr: 3, msg: '¡La mística existe! Metés dos asistencias y jugás el mejor partido de tu vida con los botines mágicos de Lea. (+3 OVR)', failMsg: '¡Desastre! En el primer pique se te rompe la plantilla, te doblás el tobillo solo y la pelota se te pasa por debajo del pie. (-4 OVR)' },
        c2: 'Usar tus botines de siempre', img2: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Te quedás con tus tapones tradicionales de siempre.' }
      },
      {
        title: 'La Manaos de Uva y el Fernandito',
        desc: 'Después del entrenamiento de un martes con 35°C a la sombra, Zhadow saca del baúl del auto una botella cortada con vino en tetra barato y Manaos tibia. Te dice que es "el elixir del vestuario".',
        c1: 'Tomar de la botella cortada', img1: 'https://images.unsplash.com/photo-1544025162-8316db186f86?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '20%' },
          { type: 'negative', label: '-4 OVR', percentage: '80%' }
        ],
        e1: { ovr: 2, msg: '¡Cobrás inmunidad divina! Te curás todas las contracturas y entrenás como un perro de caza toda la semana. (+2 OVR)', failMsg: '¡Gastroenteritis fulminante! Estás tres días a puro té de yuyos y suero de la farmacia. (-4 OVR)' },
        c2: 'Tomar agua de la canilla', img2: 'https://images.unsplash.com/photo-1520206183501-b80df6103962?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Tomás agua de la canilla del club. Menos épico, pero seguro.' }
      },
      {
        title: 'La Corte de Pelo Desastre',
        desc: 'El día anterior a un partido televisado, Benyi se compra una máquina de cortar pelo en 12 cuotas fijas y te convence de hacerte el degradé que usa Neymar.',
        c1: 'Dejarte cortar el pelo', img1: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '5%' },
          { type: 'negative', label: '-4 OVR', percentage: '95%' }
        ],
        e1: { ovr: 3, msg: '¡Milagrosamente le queda joya! Salís en TikTok como "el mas fachero del futbol" y te sube la autoestima. (+3 OVR)', failMsg: '¡Qué desastre! Te estornuda en la mitad del corte y te vuela un pedazo de pelo. Quedás igual a Krillin pero con tres pelos locos arriba. Toda la tribuna rival te canta "pelado botón". (-4 OVR)' },
        c2: 'Seguir con tu peinado rústico', img2: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Decís que tenés un peluquero de confianza desde los 5 años.' }
      },
      {
        title: 'La canchereada en el penal',
        desc: 'Estás ganando 3-0 en un partido re tranqui y te cobran penal. Ngolo te dice que la piques a lo Abreu, pero el arquero rival te está mirando con cara de pocos amigos.',
        c1: 'Picar el penal (A lo Panenka)', img1: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '25%' },
          { type: 'negative', label: '-4 OVR', percentage: '75%' }
        ],
        e1: { ovr: 3, msg: '¡Sos un genio absoluto! La picaste al medio, el arquero se tiró al palo y todo el estadio se vino abajo. (+3 OVR)', failMsg: '¡Papelón histórico! Te salió un tirito masita, el arquero la agarró parado con una mano, te pegó un empujón y encima el DT te sacó en el entretiempo por canchero. (-4 OVR)' },
        c2: 'Asegurarlo con un fierrazo abajo', img2: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: '+1 OVR' }
        ],
        e2: { ovr: 1, msg: 'La cruzaste fuerte abajo, gol seguro y festejo sobrio con tus compañeros. (+1 OVR)' }
      },
      {
        title: 'El asado con la Barra Brava',
        desc: 'El jefe de la barra brava de tu club te invita a un asado en el club de fomento del barrio para "charlar del equipo" y "apoyar al pibe".',
        c1: 'Ir y ganarte a la hinchada', img1: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '70%' },
          { type: 'negative', label: '-3 OVR', percentage: '30%' }
        ],
        e1: { ovr: 3, msg: '¡Te hiciste amigo del jefe! Te cantan canciones personalizadas en la tribuna y entrás a la cancha motivado al 100%. (+3 OVR)', failMsg: '¡Problemas! El asado se filtró en Twitter, la comisión directiva te multó por relacionarte con barras y perdiste la titularidad una semana. (-3 OVR)' },
        c2: 'Poner una excusa médica', img2: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Dijiste que tenías anginas y te quedaste comiendo pollo hervido en tu casa.' }
      },
      {
        title: 'La oferta de patrocinio "Lio-Ney"',
        desc: 'Una marca de calzoncillos de dudosa procedencia llamada "Lio-Ney" te ofrece ser la cara de su campaña publicitaria en redes sociales a cambio de un pago jugoso y calzoncillos de por vida.',
        c1: 'Aceptar y posar en calzoncillos truchos', img1: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+3 OVR', percentage: '30%' },
          { type: 'negative', label: '-3 OVR', percentage: '70%' }
        ],
        e1: { ovr: 3, msg: '¡Te hiciste ultra viral! El video en TikTok tiene millones de vistas, ganaste un fandom enorme de pibas y pibes y te subió la confianza al cielo. (+3 OVR)', failMsg: '¡Descanso total! La tela de los calzoncillos te dio una alergia bárbara. Encima, en el vestuario imprimieron fotos tuyas posando en bóxer trucho y las pegaron por todas las paredes. Estás re quemado. (-3 OVR)' },
        c2: 'Rechazar dignamente', img2: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Seguís usando tus boxers comunes y corrientes de siempre.' }
      },
      {
        title: 'El mate lavado de Zhadow',
        desc: 'Zhadow te convence de tomar unos mates antes de concentrar, pero cuando te lo pasa, el agua está hirviendo a 100 grados y la yerba está tan lavada que parece sopa de lechuga.',
        c1: 'Tomarlo igual para no ser careta', img1: 'https://images.unsplash.com/photo-1520206183501-b80df6103962?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: '+2 OVR', percentage: '40%' },
          { type: 'negative', label: '-3 OVR', percentage: '60%' }
        ],
        e1: { ovr: 2, msg: '¡Inmune! El mate te dio una resistencia mental legendaria y Zhadow te considera su hermano de sangre. (+2 OVR)', failMsg: '¡Quemadura de tercer grado! Te amollaste toda la lengua con el agua hirviendo y tuviste una acidez que no te dejó correr un solo pique. (-3 OVR)' },
        c2: 'Tirarle el mate y pedir un café', img2: 'https://images.unsplash.com/photo-1544025162-8316db186f86?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Sin cambios' }
        ],
        e2: { ovr: 0, msg: 'Le dijiste que eso es sopa de pasto. Se ofendió un poco pero te cebó un té.' }
      },
      {
        title: 'La fiesta de El consejo del Mate',
        desc: 'El plantel te arrastra a una fiesta clandestina organizada por "El consejo del Mate" tras un gran triunfo. Hay fernet en baldes y cumbia al palo.',
        c1: 'Prenderte en el baile', img1: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Líder del vestuario (+2 OVR)', percentage: '40%' },
          { type: 'negative', label: 'Multado por el club (-3 OVR)', percentage: '60%' }
        ],
        e1: { ovr: 2, msg: '¡Metiste pasito prohibido! Te ganaste la simpatía de todos y el capitán te considera el alma del equipo. (+2 OVR)', failMsg: '¡Descubiertos! Los vecinos llamaron a la policía y saliste escrachado en los programas de chismes. El DT te colgó. (-3 OVR)' },
        c2: 'Volverte temprano a dormir', img2: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Cuidar el físico (Sin cambios)' }
        ],
        e2: { ovr: 0, msg: 'Te pediste un auto y te fuiste calladito a tu casa. Tu disciplina profesional es impecable.' }
      },
      {
        title: 'La Pizza de Cuca',
        desc: 'Cuca te cae de sorpresa a la pensión con tres pizzas de muzarela gigantescas con doble aceituna y faimá caliente. "Un permitido no le hace daño a nadie", insiste.',
        c1: 'Clavarte media pizza solo', img1: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Energía extra (+2 OVR)', percentage: '30%' },
          { type: 'negative', label: 'Exceso de peso (-3 OVR)', percentage: '70%' }
        ],
        e1: { ovr: 2, msg: '¡Un manjar! Digestión legendaria, metiste un golazo al ángulo el domingo gracias a los carbohidratos extra. (+2 OVR)', failMsg: 'Llegaste al entrenamiento del miércoles pesadísimo. El PF te mandó a correr solo con chaleco de arena todo el mes. (-3 OVR)' },
        c2: 'Comer ensalada de lechuga', img2: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Seguir la dieta (Sin cambios)' }
        ],
        e2: { ovr: 0, msg: 'Cuca te trató de aburrido, pero vos mantuviste tu peso ideal de atleta de alto rendimiento.' }
      },
      {
        title: 'El stream picante con el Kun',
        desc: 'El Kun te invita a un stream en directo para hablar de la selección. De golpe, te pide que opines sin filtro de la táctica de tu actual DT.',
        c1: 'Hablar sin casete (Picarla)', img1: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Viral y adorado (+3 OVR)', percentage: '40%' },
          { type: 'negative', label: 'Colgado por el DT (-4 OVR)', percentage: '60%' }
        ],
        e1: { ovr: 3, msg: '¡Tus dichos se hicieron tendencia mundial! Las marcas te aman y jugás súper agrandado en la cancha. (+3 OVR)', failMsg: 'Tus declaraciones cayeron pésimo en el vestuario. El DT te mandó a entrenar en solitario y tuviste que disculparte en público. (-4 OVR)' },
        c2: 'Declarar diplomáticamente', img2: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: 'Respeto institucional (+1 OVR)' }
        ],
        e2: { ovr: 1, msg: 'Respondiste con elegancia y profesionalismo. La directiva del club elogió tu madurez en privado. (+1 OVR)' }
      },
      {
        title: 'La "CoperoCoin"',
        desc: 'Un dudoso broker financiero te propone lanzar tu propia criptomoneda deportiva para tus seguidores. Promete dejarte ganancias millonarias.',
        c1: 'Lanzar tu token deportivo', img1: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Éxito financiero (+4 OVR)', percentage: '20%' },
          { type: 'negative', label: 'Estafa y repudio (-5 OVR)', percentage: '80%' }
        ],
        e1: { ovr: 4, msg: '¡Explotó el mercado! Todo el mundo compró tu moneda, te hiciste millonario y tu moral se fue al cielo. (+4 OVR)', failMsg: 'El token se desplomó a cero en dos días. Tus hinchas te acusan de estafador, te silban en la cancha y tu moral se arruina. (-5 OVR)' },
        c2: 'Rechazar la propuesta', img2: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'neutral', label: 'Cuidar el prestigio (Sin cambios)' }
        ],
        e2: { ovr: 0, msg: 'Decidiste cuidar tu reputación y el cariño genuino de tu hinchada.' }
      },
      {
        title: 'El picado solidario',
        desc: 'Te invitan a jugar un picado solidario a beneficio de un comedor de Iosoccer, pero tu club te pide que no vayas para no arriesgar tu físico.',
        c1: 'Jugar el picado solidario', img1: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        outcomes1: [
          { type: 'positive', label: 'Héroe del barrio (+3 OVR)', percentage: '65%' },
          { type: 'negative', label: 'Lesión absurda (-5 OVR)', percentage: '35%' }
        ],
        e1: { ovr: 3, msg: '¡Fuiste la estrella! Donaron toneladas de comida, te ovacionaron de pie y tu motivación deportiva creció. (+3 OVR)', failMsg: '¡Pésima suerte! Un youtuber rústico te metió un hachazo sin querer en el tobillo. Esguince grave y te perdés el clásico. (-5 OVR)' },
        c2: 'Ir solo a firmar autógrafos', img2: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
        outcomes2: [
          { type: 'positive', label: 'Cariño de la hinchada (+1 OVR)' }
        ],
        e2: { ovr: 1, msg: 'Cumpliste con la causa benéfica, firmaste autógrafos y cuidaste tu físico. Todos te respetan. (+1 OVR)' }
      }
    ];
    
    const availableDecisions = decisions.filter(d => !d.condition || d.condition(player));
    const dec = (availableDecisions.length > 0 ? availableDecisions[Math.floor(rand() * availableDecisions.length)] : null) || decisions[0];

    return {
      id: `decision_${age}`,
      type: 'DECISION',
      title: dec.title,
      description: dec.desc,
      choices: (() => {
        const c1 = {
          id: `dec_1_${age}`,
          title: dec.c1,
          image: dec.img1,
          outcomes: dec.outcomes1,
          effect: () => {
             const isPositive = !dec.outcomes1 || (dec.outcomes1.length === 1 && dec.outcomes1[0].type === 'neutral') || (dec.outcomes1.length === 1 && dec.outcomes1[0].type === 'negative') ? true : (Math.random() * 100 <= parseInt(dec.outcomes1[0].percentage || '50'));
             const actualOvr = (dec.outcomes1 && dec.outcomes1.length === 1 && dec.outcomes1[0].type === 'negative') 
               ? dec.e1.ovr 
               : (isPositive 
                   ? dec.e1.ovr 
                   : (dec.outcomes1[1] ? parseOvrFromLabel(dec.outcomes1[1].label) : -2));
             const stats = getPositionStats(player.position, player.ovr + actualOvr);
             return { 
               ovrChange: actualOvr, 
               glsBonus: stats.gls, 
               astBonus: stats.ast, 
               pjBonus: 32 + Math.floor(Math.random() * 8), 
               valueMult: isPositive ? 1.05 : 0.9, 
               msg: isPositive ? dec.e1.msg : (dec.e1.failMsg || dec.e1.msg) 
             };
          }
        };

        if (dec.outcomes2 === null) {
          const pool = (player.ovr > 70) ? D1_CLUBS : D2_CLUBS;
          const randomClub = pool[Math.floor(Math.random() * pool.length)];
          const c2 = {
            id: `dec_2_transfer_${age}`,
            title: `Fichar por ${randomClub.name}`,
            clubTarget: randomClub,
            effect: () => {
               const stats = getPositionStats(player.position, player.ovr + dec.e2.ovr);
               return { 
                 ovrChange: dec.e2.ovr, 
                 glsBonus: stats.gls, 
                 astBonus: stats.ast, 
                 pjBonus: 35 + Math.floor(Math.random() * 10), 
                 valueMult: 1.1, 
                 nextClub: randomClub, 
                 msg: dec.e2.msg 
               };
            }
          };
          return [c1, c2];
        } else {
          const c2 = {
            id: `dec_2_${age}`,
            title: dec.c2,
            image: dec.img2,
            outcomes: dec.outcomes2,
            effect: () => {
               const isPositive = !dec.outcomes2 || (dec.outcomes2.length === 1 && dec.outcomes2[0].type === 'neutral') || (dec.outcomes2.length === 1 && dec.outcomes2[0].type === 'negative') ? true : (Math.random() * 100 <= parseInt(dec.outcomes2[0].percentage || '50'));
               const actualOvr = isPositive 
                 ? dec.e2.ovr 
                 : (dec.outcomes2[1] ? parseOvrFromLabel(dec.outcomes2[1].label) : -2);
               const stats = getPositionStats(player.position, player.ovr + actualOvr);
               return { 
                 ovrChange: actualOvr, 
                 glsBonus: stats.gls, 
                 astBonus: stats.ast, 
                 pjBonus: 35 + Math.floor(Math.random() * 10), 
                 valueMult: isPositive ? 1.02 : 0.95, 
                 msg: isPositive ? dec.e2.msg : (dec.e2.failMsg || dec.e2.msg) 
               };
            }
          };
          return [c1, c2];
        }
      })()
    };
  }
}
