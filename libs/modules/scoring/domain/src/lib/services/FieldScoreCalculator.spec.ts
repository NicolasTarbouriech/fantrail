import { ZodError } from 'zod';

import { buildRunnerId, buildScoringInput } from '../testing';
import { FieldScoreCalculator } from './FieldScoreCalculator';

const r = buildRunnerId;

describe('FieldScoreCalculator', () => {
  it('scores a perfect prediction without outsider multiplier at 4400 points', () => {
    const fieldScore = FieldScoreCalculator.calculate(
      buildScoringInput({ favoriteRankByRunnerId: {} }),
    );
    expect(fieldScore.positionPoints).toBe(2300);
    expect(fieldScore.timeScore.points).toBe(200);
    expect(fieldScore.bonusPoints).toBe(1900);
    expect(fieldScore.total).toBe(4400);
    expect(
      fieldScore.pickScoreList.every((pickScore) => pickScore.isExact),
    ).toBe(true);
  });

  it('multiplies the favorites 2 to 5 by ×1.1 to ×1.4', () => {
    const fieldScore = FieldScoreCalculator.calculate(buildScoringInput());
    expect(fieldScore.pickScoreList.map(({ points }) => points)).toEqual([
      500, 528, 552, 572, 588,
    ]);
    expect(fieldScore.positionPoints).toBe(2740);
  });

  it('multiplies position points by the outsider rank, not the bonuses', () => {
    const input = buildScoringInput();
    const fieldScore = FieldScoreCalculator.calculate({
      ...input,
      prediction: {
        ...input.prediction,
        pickList: [r(1), r(7), r(8), r(9), r(10)],
      },
      favoriteRankByRunnerId: { ...input.favoriteRankByRunnerId, [r(1)]: 6 },
    });
    const [winnerPick] = fieldScore.pickScoreList;
    expect(winnerPick.positionPoints).toBe(500);
    expect(winnerPick.multiplierInTenths).toBe(15);
    expect(winnerPick.points).toBe(750);
    expect(fieldScore.bonusPoints).toBe(75);
  });

  it('gives 0 to a pick outside the ranking and ×1.0 to a runner without index', () => {
    const input = buildScoringInput();
    const fieldScore = FieldScoreCalculator.calculate({
      ...input,
      prediction: {
        ...input.prediction,
        pickList: [r(42), r(2), r(3), r(4), r(5)],
      },
      favoriteRankByRunnerId: { ...input.favoriteRankByRunnerId, [r(2)]: null },
    });
    const [outsidePick, noIndexPick] = fieldScore.pickScoreList;
    expect(outsidePick).toMatchObject({
      finishPosition: null,
      favoriteRank: null,
      points: 0,
      isExact: false,
    });
    expect(noIndexPick).toMatchObject({
      finishPosition: 2,
      multiplierInTenths: 10,
      points: 480,
    });
  });

  it('rejects a prediction picking the same runner twice', () => {
    const input = buildScoringInput();
    expect(() =>
      FieldScoreCalculator.calculate({
        ...input,
        prediction: {
          ...input.prediction,
          pickList: [r(1), r(1), r(3), r(4), r(5)],
        },
      }),
    ).toThrow(ZodError);
  });

  it('rejects a ranking listing the same runner twice', () => {
    const input = buildScoringInput();
    expect(() =>
      FieldScoreCalculator.calculate({
        ...input,
        result: { ...input.result, rankingList: [r(1), r(1)] },
      }),
    ).toThrow(ZodError);
  });
});
