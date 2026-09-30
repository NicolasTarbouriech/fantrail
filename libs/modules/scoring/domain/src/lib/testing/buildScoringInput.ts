import { ScoringInput } from '../types';
import { buildRunnerId } from './buildRunnerId';

export function buildScoringInput(
  overrides: Partial<ScoringInput> = {},
): ScoringInput {
  const rankingList = Array.from({ length: 10 }, (_, index) =>
    buildRunnerId(index + 1),
  );
  return {
    prediction: {
      pickList: rankingList.slice(0, 5),
      winnerTimeEstimateInSeconds: 24 * 3600,
    },
    result: { rankingList, winnerTimeInSeconds: 24 * 3600 },
    favoriteRankByRunnerId: Object.fromEntries(
      rankingList.map((runnerId, index) => [runnerId, index + 1]),
    ),
    timeTolerancePercent: 3,
    ...overrides,
  };
}
