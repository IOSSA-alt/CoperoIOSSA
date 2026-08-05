export function seededRandom(seed: number) {
  let s = seed;
  return function() {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

export function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rand = seededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
