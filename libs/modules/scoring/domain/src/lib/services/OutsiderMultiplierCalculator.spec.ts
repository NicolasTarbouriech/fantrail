import { OutsiderMultiplierCalculator } from './OutsiderMultiplierCalculator';

describe('OutsiderMultiplierCalculator', () => {
  it.each([
    { favoriteRank: 1, multiplierInTenths: 10 },
    { favoriteRank: 2, multiplierInTenths: 11 },
    { favoriteRank: 6, multiplierInTenths: 15 },
    { favoriteRank: 11, multiplierInTenths: 20 },
    { favoriteRank: 30, multiplierInTenths: 20 },
  ])(
    'multiplies favorite rank $favoriteRank by $multiplierInTenths tenths',
    ({ favoriteRank, multiplierInTenths }) => {
      expect(OutsiderMultiplierCalculator.calculateInTenths(favoriteRank)).toBe(
        multiplierInTenths,
      );
    },
  );

  it('keeps ×1.0 for a runner without index', () => {
    expect(OutsiderMultiplierCalculator.calculateInTenths(null)).toBe(10);
  });

  it('rounds the multiplied points to the nearest integer', () => {
    expect(OutsiderMultiplierCalculator.apply(294, 13)).toBe(382);
    expect(OutsiderMultiplierCalculator.apply(425, 11)).toBe(468);
    expect(OutsiderMultiplierCalculator.apply(0, 20)).toBe(0);
  });
});
