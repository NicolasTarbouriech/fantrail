import { FavoriteRankCalculator } from './FavoriteRankCalculator';

describe('FavoriteRankCalculator', () => {
  it('ranks runners by decreasing index', () => {
    expect(
      FavoriteRankCalculator.calculate([
        { id: 'a', index: 800 },
        { id: 'b', index: 920 },
        { id: 'c', index: 850 },
      ]),
    ).toEqual({ a: 3, b: 1, c: 2 });
  });

  it('gives the same rank to runners with the same index', () => {
    expect(
      FavoriteRankCalculator.calculate([
        { id: 'a', index: 900 },
        { id: 'b', index: 850 },
        { id: 'c', index: 850 },
        { id: 'd', index: 800 },
      ]),
    ).toEqual({ a: 1, b: 2, c: 2, d: 4 });
  });

  it('gives no rank to a runner without index', () => {
    expect(
      FavoriteRankCalculator.calculate([
        { id: 'a', index: null },
        { id: 'b', index: 700 },
      ]),
    ).toEqual({ a: null, b: 1 });
  });
});
