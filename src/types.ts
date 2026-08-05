export type Position = 'GK' | 'LB' | 'CB' | 'RB' | 'MC' | 'LW' | 'CF' | 'RW';
export type Foot = 'Izquierda' | 'Derecha';

export interface Country {
  code: string;
  name: string;
  flagUrl: string;
}

export interface Club {
  id: string;
  name: string;
  division: 'Division 2' | 'Division 1';
  leagueLabel?: string;
  color: string;
  textColor: string;
  logoSymbol: string;
  crestUrl?: string;
  reputation: number; // 1 to 5
}

export type TrophyCategory = 'LIGA' | 'COPA' | 'SUPERCOPA' | 'INDIVIDUAL' | 'MUNDIAL';

export interface Trophy {
  id: string;
  name: string;
  category: TrophyCategory;
  icon: string;
  count: number;
}

export interface CareerEntry {
  age: number;
  club: Club;
  ovr: number;
  pj: number;
  gls: number;
  ast: number;
  isDescent?: boolean;
  trophiesWon?: string[];
  note?: string;
}

export interface PlayerState {
  lastName: string;
  number: number;
  foot: Foot;
  nationality: Country;
  position: Position;
  age: number;
  ovr: number;
  marketValue: number; // e.g. 100000 -> €100K
  currentClub: Club;
  
  // Accumulated Stats
  totalPj: number;
  totalGls: number;
  totalAst: number;

  // National Team Stats
  nationalPj: number;
  nationalGls: number;
  nationalAst: number;

  // Trophies Cabinet
  trophies: Trophy[];

  // Career History Log
  history: CareerEntry[];
}

export interface GameEventChoice {
  id: string;
  title?: string;
  subtitle?: string;
  clubTarget?: Club;
  image?: string;
  positiveChance?: string;
  negativeChance?: string;
  outcomes?: {
    type: 'positive' | 'negative' | 'neutral';
    label: string;
    percentage?: string;
  }[];
  effect: (player: PlayerState) => {
    ovrChange: number;
    glsBonus: number;
    astBonus: number;
    pjBonus: number;
    valueMult: number;
    nextClub?: Club;
    isDescent?: boolean;
    trophyWon?: { name: string; category: TrophyCategory; icon: string };
    trophiesWon?: { name: string; category: TrophyCategory; icon: string }[];
    msg: string;
  };
}

export interface GameEvent {
  id: string;
  type: 'CANTERA' | 'TATUAJE' | 'MERCADO' | 'COMPETENCIA' | 'DESCENSO' | 'DECISION';
  title: string;
  description: string;
  choices: GameEventChoice[];
}

