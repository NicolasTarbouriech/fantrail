const POINTS_FORMAT = new Intl.NumberFormat('fr-FR');

export function formatPoints(points: number): string {
  return POINTS_FORMAT.format(points).replace(/\u202f/g, '\u00a0');
}

export function formatRank(rank: number): string {
  return rank === 1 ? '1ᵉʳ' : `${rank}ᵉ`;
}

export function formatPlayerCount(count: number): string {
  return count > 1 ? `${count} joueurs` : `${count} joueur`;
}
