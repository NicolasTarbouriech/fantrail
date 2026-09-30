import { TimePointsCalculator } from './TimePointsCalculator';

const hours = (value: number): number => Math.round(value * 3600);

describe('TimePointsCalculator', () => {
  it.each([
    { estimate: hours(24), points: 200 },
    { estimate: hours(23.75), points: 131 },
    { estimate: hours(23.5), points: 61 },
    { estimate: hours(24.5), points: 61 },
    { estimate: hours(25), points: 0 },
  ])(
    'gives $points for an estimate of $estimate s on a 24 h race',
    ({ estimate, points }) => {
      expect(
        TimePointsCalculator.calculate(estimate, hours(24), 3).points,
      ).toBe(points);
    },
  );

  it('scales the tolerance with the winner time', () => {
    const timeScore = TimePointsCalculator.calculate(hours(7), hours(7), 3);
    expect(timeScore.toleranceInSeconds).toBe(756);
  });

  it('exposes the gap used for tie-breaks', () => {
    expect(
      TimePointsCalculator.calculate(hours(23.5), hours(24), 3).gapInSeconds,
    ).toBe(1800);
  });
});
