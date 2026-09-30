import { InvalidPickPositionError } from '../errors';
import { PositionPointsCalculator } from './PositionPointsCalculator';

describe('PositionPointsCalculator', () => {
  it.each([
    { pickPosition: 1, finishPosition: 1, points: 500 },
    { pickPosition: 1, finishPosition: 3, points: 400 },
    { pickPosition: 5, finishPosition: 2, points: 294 },
    { pickPosition: 2, finishPosition: 2, points: 480 },
    { pickPosition: 5, finishPosition: 10, points: 210 },
    { pickPosition: 10, finishPosition: 10, points: 320 },
  ])(
    'gives $points to pick $pickPosition finishing $finishPosition',
    ({ pickPosition, finishPosition, points }) => {
      expect(
        PositionPointsCalculator.calculate(pickPosition, finishPosition),
      ).toBe(points);
    },
  );

  it('gives 0 to a pick finishing outside the top 10', () => {
    expect(PositionPointsCalculator.calculate(3, 11)).toBe(0);
  });

  it('gives 0 to a pick that did not finish', () => {
    expect(PositionPointsCalculator.calculate(1, null)).toBe(0);
  });

  it.each([0, 11, 1.5])('rejects pick position %p', (pickPosition) => {
    expect(() => PositionPointsCalculator.calculate(pickPosition, 1)).toThrow(
      InvalidPickPositionError,
    );
  });
});
