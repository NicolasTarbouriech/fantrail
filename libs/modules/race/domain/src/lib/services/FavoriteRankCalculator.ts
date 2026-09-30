import { RunnerId } from '../types';

export interface RankableRunner {
  id: RunnerId;
  index: number | null;
}

// Competition ranking: two runners with the same index share the best rank (1, 2, 2, 4).
export class FavoriteRankCalculator {
  static calculate(
    runnerList: RankableRunner[],
  ): Record<RunnerId, number | null> {
    const indexList = runnerList.flatMap(({ index }) =>
      index === null ? [] : [index],
    );
    return Object.fromEntries(
      runnerList.map(({ id, index }) => [
        id,
        index === null
          ? null
          : 1 + indexList.filter((other) => other > index).length,
      ]),
    );
  }
}
