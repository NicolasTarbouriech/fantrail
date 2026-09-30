import { ScoringInput } from '../types';
import { FieldScore, PickScore } from '../valueObjects';
import { BonusCalculator } from './BonusCalculator';
import { OutsiderMultiplierCalculator } from './OutsiderMultiplierCalculator';
import { PositionPointsCalculator } from './PositionPointsCalculator';
import { TimePointsCalculator } from './TimePointsCalculator';

export class FieldScoreCalculator {
  static calculate(input: ScoringInput): FieldScore {
    const { prediction, result, favoriteRankByRunnerId, timeTolerancePercent } =
      ScoringInput.parse(input);

    const pickScoreList = prediction.pickList.map((runnerId, index) => {
      const pickPosition = index + 1;
      const finishIndex = result.rankingList.indexOf(runnerId);
      const finishPosition = finishIndex === -1 ? null : finishIndex + 1;
      // A runner missing from the ranks has no known index: the spec gives it ×1.0.
      const favoriteRank = favoriteRankByRunnerId[runnerId] ?? null;
      const positionPoints = PositionPointsCalculator.calculate(
        pickPosition,
        finishPosition,
      );
      const multiplierInTenths =
        OutsiderMultiplierCalculator.calculateInTenths(favoriteRank);
      return new PickScore(
        pickPosition,
        runnerId,
        finishPosition,
        favoriteRank,
        positionPoints,
        multiplierInTenths,
        OutsiderMultiplierCalculator.apply(positionPoints, multiplierInTenths),
      );
    });

    return new FieldScore(
      pickScoreList,
      TimePointsCalculator.calculate(
        prediction.winnerTimeEstimateInSeconds,
        result.winnerTimeInSeconds,
        timeTolerancePercent,
      ),
      BonusCalculator.calculate(prediction.pickList, result.rankingList),
    );
  }
}
