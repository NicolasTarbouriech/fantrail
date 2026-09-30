import { BonusType } from '../enums';
import { buildRunnerId } from '../testing';
import { BonusCalculator } from './BonusCalculator';

const r = buildRunnerId;
const RANKING = Array.from({ length: 10 }, (_, index) => r(index + 1));

describe('BonusCalculator', () => {
  it('stacks every bonus for an exact top 5', () => {
    const bonusList = BonusCalculator.calculate(RANKING.slice(0, 5), RANKING);
    expect(bonusList.map(({ type, points }) => [type, points])).toEqual([
      [BonusType.Winner, 75],
      [BonusType.Top3Unordered, 150],
      [BonusType.Top3Exact, 300],
      [BonusType.Top5Unordered, 250],
      [BonusType.Top5Exact, 500],
      [BonusType.MultipleExactPositions, 625],
    ]);
  });

  it('gives the unordered bonuses without the exact ones', () => {
    const bonusList = BonusCalculator.calculate(
      [r(3), r(1), r(2), r(5), r(4)],
      RANKING,
    );
    expect(bonusList.map(({ type }) => type)).toEqual([
      BonusType.Top3Unordered,
      BonusType.Top5Unordered,
    ]);
  });

  it('gives the winner bonus alone when only pick 1 is exact', () => {
    const bonusList = BonusCalculator.calculate(
      [r(1), r(7), r(8), r(9), r(10)],
      RANKING,
    );
    expect(bonusList.map(({ type }) => type)).toEqual([BonusType.Winner]);
  });

  it('squares the exact positions count from two exact picks', () => {
    const bonusList = BonusCalculator.calculate(
      [r(6), r(2), r(7), r(4), r(9)],
      RANKING,
    );
    expect(bonusList).toEqual([
      expect.objectContaining({
        type: BonusType.MultipleExactPositions,
        points: 100,
      }),
    ]);
  });

  it('gives no top 5 bonus to a 3 picks prediction', () => {
    const bonusList = BonusCalculator.calculate(RANKING.slice(0, 3), RANKING);
    expect(bonusList.map(({ type }) => type)).toEqual([
      BonusType.Winner,
      BonusType.Top3Unordered,
      BonusType.Top3Exact,
      BonusType.MultipleExactPositions,
    ]);
  });

  it('gives no top bonus when fewer runners are ranked than the top size', () => {
    const bonusList = BonusCalculator.calculate(
      RANKING.slice(0, 5),
      RANKING.slice(0, 2),
    );
    expect(bonusList.map(({ type }) => type)).toEqual([
      BonusType.Winner,
      BonusType.MultipleExactPositions,
    ]);
  });
});
