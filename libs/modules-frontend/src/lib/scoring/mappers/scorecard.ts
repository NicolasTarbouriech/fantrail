import { BonusType } from '@trail/shared/apps/backend/web/data-access-graphql-types';

const BONUS_LABELS: Record<BonusType, string> = {
  [BonusType.Winner]: 'Vainqueur trouvé',
  [BonusType.Top3Unordered]: 'Top 3 dans le désordre',
  [BonusType.Top3Exact]: 'Top 3 dans l’ordre',
  [BonusType.Top5Unordered]: 'Top 5 dans le désordre',
  [BonusType.Top5Exact]: 'Top 5 dans l’ordre',
  [BonusType.MultipleExactPositions]: 'Positions exactes',
};

export function getBonusLabel(type: BonusType, exactCount: number): string {
  return type === BonusType.MultipleExactPositions
    ? `${exactCount} positions exactes`
    : BONUS_LABELS[type];
}

export type PickScoreSource = {
  pickPosition: number;
  finishPosition: number | null;
  positionPoints: number;
  multiplier: number;
};

export function describePickScore(
  pick: PickScoreSource,
  isWithdrawn: boolean,
): string {
  if (isWithdrawn) {
    return 'Retiré avant le départ';
  }
  if (pick.finishPosition === null) {
    return 'Hors du top 10';
  }
  const place = pick.finishPosition === 1 ? '1ᵉʳ' : `${pick.finishPosition}ᵉ`;
  return `Arrivé ${place} · ${pick.positionPoints} × ${pick.multiplier.toFixed(1)}`;
}

export function isExactPick(pick: PickScoreSource): boolean {
  return pick.finishPosition === pick.pickPosition;
}

export function countExactPicks(picks: PickScoreSource[]): number {
  return picks.filter(isExactPick).length;
}

/** Share of the 3 % tolerance the gap used, for the chrono gauge. */
export function getToleranceUsage(
  gapInSeconds: number,
  actualInSeconds: number,
  tolerancePercent: number,
): number {
  const tolerance = (actualInSeconds * tolerancePercent) / 100;
  return tolerance === 0 ? 1 : Math.min(Math.abs(gapInSeconds) / tolerance, 1);
}
