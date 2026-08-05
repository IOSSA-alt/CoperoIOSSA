import { Country, Club, Position } from './types';

export const COUNTRIES: Country[] = [
  { code: 'ARG', name: 'Argentina', flagUrl: 'https://flagcdn.com/w80/ar.png' },
  { code: 'BRA', name: 'Brasil', flagUrl: 'https://flagcdn.com/w80/br.png' },
  { code: 'URU', name: 'Uruguay', flagUrl: 'https://flagcdn.com/w80/uy.png' },
  { code: 'COL', name: 'Colombia', flagUrl: 'https://flagcdn.com/w80/co.png' },
  { code: 'CHI', name: 'Chile', flagUrl: 'https://flagcdn.com/w80/cl.png' },
  { code: 'ESP', name: 'España', flagUrl: 'https://flagcdn.com/w80/es.png' },
  { code: 'ITA', name: 'Italia', flagUrl: 'https://flagcdn.com/w80/it.png' },
  { code: 'FRA', name: 'Francia', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  { code: 'ENG', name: 'Inglaterra', flagUrl: 'https://flagcdn.com/w80/gb-eng.png' },
  { code: 'DEU', name: 'Alemania', flagUrl: 'https://flagcdn.com/w80/de.png' },
  { code: 'POR', name: 'Portugal', flagUrl: 'https://flagcdn.com/w80/pt.png' },
  { code: 'NLD', name: 'Países Bajos', flagUrl: 'https://flagcdn.com/w80/nl.png' },
  { code: 'MEX', name: 'México', flagUrl: 'https://flagcdn.com/w80/mx.png' },
  { code: 'PAR', name: 'Paraguay', flagUrl: 'https://flagcdn.com/w80/py.png' },
  { code: 'PER', name: 'Perú', flagUrl: 'https://flagcdn.com/w80/pe.png' },
  { code: 'ECU', name: 'Ecuador', flagUrl: 'https://flagcdn.com/w80/ec.png' },
  { code: 'VEN', name: 'Venezuela', flagUrl: 'https://flagcdn.com/w80/ve.png' },
  { code: 'USA', name: 'Estados Unidos', flagUrl: 'https://flagcdn.com/w80/us.png' }
];

export const LIBRE_CLUB: Club = {
  id: 'libre',
  name: 'Libre',
  division: 'Division 2',
  leagueLabel: 'Sin Club',
  color: '#334155',
  textColor: '#ffffff',
  logoSymbol: '❓',
  reputation: 1
};

// DIVISION 2 CLUBS REQUESTED BY USER
export const D2_CLUBS: Club[] = [
  { id: 'tormalina', name: 'Tormalina FC', division: 'Division 2', leagueLabel: 'Liga D2', color: '#16a34a', textColor: '#ffffff', logoSymbol: '💎', crestUrl: 'https://i.imgur.com/EJz34C1.png', reputation: 2 },
  { id: 'acmilan', name: 'AC Milan', division: 'Division 2', leagueLabel: 'Liga D2', color: '#991b1b', textColor: '#ffffff', logoSymbol: '🔴', crestUrl: 'https://i.imgur.com/uCRkMPc.png', reputation: 3 },
  { id: 'alien', name: 'Alien Express', division: 'Division 2', leagueLabel: 'Liga D2', color: '#10b981', textColor: '#ffffff', logoSymbol: '👽', crestUrl: 'https://i.imgur.com/IKDB6T6.png', reputation: 2 },
  { id: 'bobis', name: 'Club Atletico Bobis', division: 'Division 2', leagueLabel: 'Liga D2', color: '#f97316', textColor: '#ffffff', logoSymbol: '🤪', crestUrl: 'https://i.imgur.com/WsnU3t4.png', reputation: 2 },
  { id: 'cebollitas', name: 'Cebollitas FC', division: 'Division 2', leagueLabel: 'Liga D2', color: '#16a34a', textColor: '#ffffff', logoSymbol: '🧅', crestUrl: 'https://i.imgur.com/lMc8Qtn.png', reputation: 3 },
  { id: 'defensores_doctor', name: 'CA Defensores del Doctor', division: 'Division 2', leagueLabel: 'Liga D2', color: '#2563eb', textColor: '#ffffff', logoSymbol: '🏥', crestUrl: 'https://i.imgur.com/rIxjVvv.png', reputation: 2 },
  { id: 'consejo_mate', name: 'El consejo del Mate', division: 'Division 2', leagueLabel: 'Liga D2', color: '#78350f', textColor: '#ffffff', logoSymbol: '🧉', crestUrl: 'https://i.imgur.com/M2cWhGZ.png', reputation: 2 },
  { id: 'ferro', name: 'Ferro', division: 'Division 2', leagueLabel: 'Liga D2', color: '#15803d', textColor: '#ffffff', logoSymbol: '🚂', crestUrl: 'https://i.imgur.com/m4QAUvF.png', reputation: 3 },
  { id: 'pastore', name: 'Fundacion Pastore', division: 'Division 2', leagueLabel: 'Liga D2', color: '#6b21a8', textColor: '#ffffff', logoSymbol: '⛪', crestUrl: 'https://i.imgur.com/VBx9Cj1.png', reputation: 2 },
  { id: 'instituto', name: 'Instituto', division: 'Division 2', leagueLabel: 'Liga D2', color: '#e11d48', textColor: '#ffffff', logoSymbol: '🇦🇹', crestUrl: 'https://i.imgur.com/7SZbPpA.png', reputation: 3 },
  { id: 'jubilados', name: 'Jubilados', division: 'Division 2', leagueLabel: 'Liga D2', color: '#4b5563', textColor: '#ffffff', logoSymbol: '👴', crestUrl: 'https://i.imgur.com/7u6eVjL.png', reputation: 2 },
  { id: 'puro_humo', name: 'Puro Humo', division: 'Division 2', leagueLabel: 'Liga D2', color: '#475569', textColor: '#ffffff', logoSymbol: '💨', crestUrl: 'https://i.imgur.com/FBYkY8u.png', reputation: 2 },
  { id: 'union', name: 'Club Atletico Union', division: 'Division 2', leagueLabel: 'Liga D2', color: '#dc2626', textColor: '#ffffff', logoSymbol: '🔴', crestUrl: 'https://i.imgur.com/uyVWpUg.png', reputation: 3 },
  { id: 'zenith', name: 'Zenith', division: 'Division 2', leagueLabel: 'Liga D2', color: '#7c3aed', textColor: '#ffffff', logoSymbol: '⚡', crestUrl: 'https://i.imgur.com/gZw0gr9.png', reputation: 3 },
  { id: 'casi', name: 'Club Atletico San Isidro', division: 'Division 2', leagueLabel: 'Liga D2', color: '#0284c7', textColor: '#ffffff', logoSymbol: '🛡️', crestUrl: 'https://i.imgur.com/NSR5PWR.png', reputation: 2 },
  { id: 'quilmes', name: 'Quilmes FC', division: 'Division 2', leagueLabel: 'Liga D2', color: '#2563eb', textColor: '#ffffff', logoSymbol: '🍺', crestUrl: 'https://i.imgur.com/I11RjSL.png', reputation: 3 },
  { id: 'escuderos', name: 'Escuderos de la Birra', division: 'Division 2', leagueLabel: 'Liga D2', color: '#b45309', textColor: '#ffffff', logoSymbol: '🍻', crestUrl: 'https://i.imgur.com/EGC3IKc.png', reputation: 2 },
  { id: 'bravona', name: 'Bravona', division: 'Division 2', leagueLabel: 'Liga D2', color: '#dc2626', textColor: '#ffffff', logoSymbol: '🔥', crestUrl: 'https://i.imgur.com/bf2p7nc.png', reputation: 2 },
  { id: 'pibes_chorros', name: 'Pibes Chorros Society', division: 'Division 2', leagueLabel: 'Liga D2', color: '#059669', textColor: '#ffffff', logoSymbol: '⚽', crestUrl: 'https://i.imgur.com/vCE4tQv.png', reputation: 2 },
  { id: 'el_globo', name: 'El Globo', division: 'Division 2', leagueLabel: 'Liga D2', color: '#ef4444', textColor: '#ffffff', logoSymbol: '🎈', crestUrl: 'https://i.imgur.com/bAcJ9sx.png', reputation: 3 },
  { id: 'galactic_boys', name: 'Galactic Boys', division: 'Division 2', leagueLabel: 'Liga D2', color: '#6366f1', textColor: '#ffffff', logoSymbol: '🚀', crestUrl: 'https://i.imgur.com/Qd2Bnkw.png', reputation: 3 }
];

// DIVISION 1 CLUBS REQUESTED BY USER
export const D1_CLUBS: Club[] = [
  { id: 'barderos', name: 'Barderos Crew', division: 'Division 1', leagueLabel: 'Liga D1', color: '#0f172a', textColor: '#fbbf24', logoSymbol: '👑', crestUrl: 'https://i.imgur.com/2bAMrhl.png', reputation: 5 },
  { id: 'hogwarts', name: 'Hogwarts', division: 'Division 1', leagueLabel: 'Liga D1', color: '#7f1d1d', textColor: '#fbbf24', logoSymbol: '🧙', crestUrl: 'https://i.imgur.com/tUYiUiO.png', reputation: 4 },
  { id: 'layuve', name: 'Layuve', division: 'Division 1', leagueLabel: 'Liga D1', color: '#18181b', textColor: '#ffffff', logoSymbol: '🦓', crestUrl: 'https://i.imgur.com/eRTyLHx.png', reputation: 5 },
  { id: 'magorditos', name: 'Los MAGOrditos', division: 'Division 1', leagueLabel: 'Liga D1', color: '#eab308', textColor: '#1e3a8a', logoSymbol: '🍔', crestUrl: 'https://i.imgur.com/VYpbPIH.png', reputation: 4 },
  { id: 'aimstar', name: 'Aimstar', division: 'Division 1', leagueLabel: 'Liga D1', color: '#eab308', textColor: '#000000', logoSymbol: '⭐', crestUrl: 'https://i.imgur.com/r3vufyy.png', reputation: 4 },
  { id: 'shelby', name: 'Academia Shelby', division: 'Division 1', leagueLabel: 'Liga D1', color: '#1e293b', textColor: '#ffffff', logoSymbol: '🎩', crestUrl: 'https://i.imgur.com/KjRBwvO.png', reputation: 4 },
  { id: 'fms', name: 'Freestyle Master Soccer', division: 'Division 1', leagueLabel: 'Liga D1', color: '#8b5cf6', textColor: '#ffffff', logoSymbol: '🎤', crestUrl: 'https://i.imgur.com/q9nb9Pz.png', reputation: 4 },
  { id: 'lobos', name: 'Lobos', division: 'Division 1', leagueLabel: 'Liga D1', color: '#475569', textColor: '#ffffff', logoSymbol: '🐺', crestUrl: 'https://i.imgur.com/P2Muxw8.png', reputation: 4 },
  { id: 'black_united', name: 'Black United', division: 'Division 1', leagueLabel: 'Liga D1', color: '#09090b', textColor: '#ffffff', logoSymbol: '⬛', crestUrl: 'https://i.imgur.com/7GH3tac.png', reputation: 4 },
  { id: 'bulls', name: 'Chicago Bulls', division: 'Division 1', leagueLabel: 'Liga D1', color: '#b91c1c', textColor: '#ffffff', logoSymbol: '🐂', crestUrl: 'https://i.imgur.com/sqbVWeq.png', reputation: 5 },
  { id: 'young_ballins', name: 'Young Ballins', division: 'Division 1', leagueLabel: 'Liga D1', color: '#06b6d4', textColor: '#ffffff', logoSymbol: '🛹', reputation: 4 },
  { id: 'nullified', name: 'Nullified', division: 'Division 1', leagueLabel: 'Liga D1', color: '#64748b', textColor: '#ffffff', logoSymbol: '🚫', reputation: 4 },
  { id: 'bola_murcha', name: 'Bola Murcha FC', division: 'Division 1', leagueLabel: 'Liga D1', color: '#16a34a', textColor: '#ffffff', logoSymbol: '⚽', crestUrl: 'https://i.imgur.com/3e4HyL3.png', reputation: 4 },
  { id: 'dream_seven', name: 'Dream Seven', division: 'Division 1', leagueLabel: 'Liga D1', color: '#3b82f6', textColor: '#ffffff', logoSymbol: '7️⃣', crestUrl: 'https://i.imgur.com/EjKnQyI.png', reputation: 5 },
  { id: 'soccerjam', name: 'SoccerJam', division: 'Division 1', leagueLabel: 'Liga D1', color: '#f97316', textColor: '#ffffff', logoSymbol: '🎸', crestUrl: 'https://i.imgur.com/f63t3XZ.png', reputation: 4 },
  { id: 'meteors', name: 'Meteors Gaming', division: 'Division 1', leagueLabel: 'Liga D1', color: '#d97706', textColor: '#ffffff', logoSymbol: '☄️', reputation: 4 },
  { id: 'ude', name: 'Union Deportivo Empate', division: 'Division 1', leagueLabel: 'Liga D1', color: '#0284c7', textColor: '#ffffff', logoSymbol: '🤝', reputation: 4 },
  { id: 'shaolin', name: 'Shaolin Soccer', division: 'Division 1', leagueLabel: 'Liga D1', color: '#eab308', textColor: '#000000', logoSymbol: '☯️', reputation: 5 },
  { id: 'modo_diablo', name: 'Modo Diablo', division: 'Division 1', leagueLabel: 'Liga D1', color: '#991b1b', textColor: '#ffffff', logoSymbol: '😈', reputation: 5 },
  { id: 'pepsicoleros', name: 'Club Atletico Pepsicoleros', division: 'Division 1', leagueLabel: 'Liga D1', color: '#2563eb', textColor: '#ffffff', logoSymbol: '🥤', reputation: 4 },
  { id: 'viral', name: 'Viral Team', division: 'Division 1', leagueLabel: 'Liga D1', color: '#ec4899', textColor: '#ffffff', logoSymbol: '🔥', reputation: 4 },
  { id: 'caballeros', name: 'Caballeros de la Birra', division: 'Division 1', leagueLabel: 'Liga D1', color: '#ca8a04', textColor: '#ffffff', logoSymbol: '🍺', crestUrl: 'https://i.imgur.com/qpLjY6z.png', reputation: 4 },
  { id: 'just_fraggins', name: 'Just Fraggins', division: 'Division 1', leagueLabel: 'Liga D1', color: '#10b981', textColor: '#ffffff', logoSymbol: '🎯', crestUrl: 'https://i.imgur.com/VwRB6nf.png', reputation: 4 },
  { id: 'painters', name: 'Painters United', division: 'Division 1', leagueLabel: 'Liga D1', color: '#a855f7', textColor: '#ffffff', logoSymbol: '🎨', reputation: 4 }
];

export const CANTERA_CLUBS: Club[] = [
  D2_CLUBS[0], // Tormalina FC
  D2_CLUBS[1], // SC Heerenveen
  D2_CLUBS[2], // CASI
  D2_CLUBS[3], // Zenith
  D2_CLUBS[4], // Olimpo
  D2_CLUBS[5], // Quilmes
];

export const MID_CLUBS: Club[] = [
  ...D2_CLUBS.slice(6),
  ...D1_CLUBS.slice(0, 8)
];

export const ELITE_CLUBS: Club[] = [
  ...D1_CLUBS.slice(8)
];

export const IOSOCCER_D2_CLUBS = D2_CLUBS;
export const IOSOCCER_D1_CLUBS = D1_CLUBS;

export const POSITIONS_LIST: { id: Position; label: string; xPercent: number; yPercent: number }[] = [
  { id: 'GK', label: 'GK', xPercent: 50, yPercent: 92 },
  { id: 'LB', label: 'LB', xPercent: 20, yPercent: 78 },
  { id: 'CB', label: 'CB', xPercent: 50, yPercent: 78 },
  { id: 'RB', label: 'RB', xPercent: 80, yPercent: 78 },
  { id: 'MC', label: 'MC', xPercent: 50, yPercent: 50 },
  { id: 'LW', label: 'LW', xPercent: 20, yPercent: 20 },
  { id: 'CF', label: 'CF', xPercent: 50, yPercent: 15 },
  { id: 'RW', label: 'RW', xPercent: 80, yPercent: 20 },
];

/**
 * Checks if a given club belongs to Division 1 or Division 2
 */
export function isD1Club(clubName: string): boolean {
  const norm = clubName.toLowerCase().trim();
  return D1_CLUBS.some(c => c.name.toLowerCase().trim() === norm) || norm.includes('d1');
}

export function isD2Club(clubName: string): boolean {
  const norm = clubName.toLowerCase().trim();
  return D2_CLUBS.some(c => c.name.toLowerCase().trim() === norm) || norm.includes('d2');
}
