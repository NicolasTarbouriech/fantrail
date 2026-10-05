const OUTSIDER_FAVORITE_RANK = 6;

/** Mirrors the scoring rule: ×1.0 for the favorite, +0.1 per rank, capped at ×2.0. */
export function getMultiplier(favoriteRank: number | null): number {
  if (favoriteRank === null) {
    return 1;
  }
  return Math.min(Math.round((1 + 0.1 * (favoriteRank - 1)) * 10) / 10, 2);
}

export function formatMultiplier(multiplier: number): string {
  return `×${multiplier.toFixed(1)}`;
}

export function isOutsider(favoriteRank: number | null): boolean {
  return favoriteRank !== null && favoriteRank >= OUTSIDER_FAVORITE_RANK;
}

export function formatFavoriteRank(favoriteRank: number | null): string {
  if (favoriteRank === null) {
    return 'Sans index';
  }
  return isOutsider(favoriteRank)
    ? `Favori n°${favoriteRank} · outsider`
    : `Favori n°${favoriteRank}`;
}
