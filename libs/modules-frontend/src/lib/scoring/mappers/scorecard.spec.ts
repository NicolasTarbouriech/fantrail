import { BonusType } from '@trail/shared/apps/backend/web/data-access-graphql-types';

import {
  countExactPicks,
  describePickScore,
  getBonusLabel,
  getToleranceUsage,
  isExactPick,
} from './index';

describe('scorecard', () => {
  const pick = {
    pickPosition: 3,
    finishPosition: 3,
    positionPoints: 460,
    multiplier: 1.1,
  };

  it('labels the bonuses', () => {
    expect(getBonusLabel(BonusType.Winner, 0)).toBe('Vainqueur trouvé');
    expect(getBonusLabel(BonusType.MultipleExactPositions, 2)).toBe(
      '2 positions exactes',
    );
  });

  it('describes a pick', () => {
    expect(describePickScore(pick, false)).toBe('Arrivé 3ᵉ · 460 × 1.1');
    expect(describePickScore({ ...pick, finishPosition: 1 }, false)).toBe(
      'Arrivé 1ᵉʳ · 460 × 1.1',
    );
    expect(describePickScore({ ...pick, finishPosition: null }, false)).toBe(
      'Hors du top 10',
    );
    expect(describePickScore(pick, true)).toBe('Retiré avant le départ');
  });

  it('counts exact picks', () => {
    expect(isExactPick(pick)).toBe(true);
    expect(countExactPicks([pick, { ...pick, finishPosition: 4 }])).toBe(1);
  });

  it('measures the tolerance usage', () => {
    expect(getToleranceUsage(780, 84_720, 3)).toBeCloseTo(0.307, 2);
    expect(getToleranceUsage(-9000, 84_720, 3)).toBe(1);
    expect(getToleranceUsage(10, 0, 3)).toBe(1);
  });
});
