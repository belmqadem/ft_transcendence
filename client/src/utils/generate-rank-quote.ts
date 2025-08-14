export function generateRankQuote(rank: number): string {
  const quotes = {
    champion: [
      "Crowned as a Club Champion — the table trembles at your name.",
      "You’ve conquered the court — a true Club Champion.",
      "Victory follows you like a loyal shadow. Club Champion forever.",
    ],
    elite: [
      "An Elite Contender — your rallies are poetry in motion.",
      "Grace and power — hallmarks of a true Elite Contender.",
      "Just a step from the throne. Keep swinging, Elite Contender.",
    ],
    veteran: [
      "A Veteran Player — seasoned, sharp, and steady under fire.",
      "Wisdom at the table, strength in the serve — a Veteran Player shines.",
      "You've seen it all. A steady hand in the storm — Veteran Player.",
    ],
    challenger: [
      "Still a Challenger — every match is a step toward glory.",
      "A Challenger today, a Champion tomorrow. Stay sharp.",
      "Your journey has just begun, Challenger — paddle up.",
    ],
  };

  const pickRandom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  if (rank <= 5) return pickRandom(quotes.champion);
  if (rank <= 10) return pickRandom(quotes.elite);
  if (rank <= 20) return pickRandom(quotes.veteran);
  return pickRandom(quotes.challenger);
}
