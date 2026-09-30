import { FieldScoringSource, PlayerFieldScore } from '../valueObjects';
import { FieldScoreCalculator } from './FieldScoreCalculator';

// Only complete predictions reach the source: an incomplete one scores nothing.
export class FieldScoringCalculator {
  static calculate(source: FieldScoringSource): PlayerFieldScore[] {
    return source.predictionList.map(
      (prediction) =>
        new PlayerFieldScore(
          prediction.userId,
          source.fieldId,
          source.resultVersion,
          FieldScoreCalculator.calculate({
            prediction: {
              pickList: prediction.pickList,
              winnerTimeEstimateInSeconds:
                prediction.winnerTimeEstimateInSeconds,
            },
            result: source.result,
            favoriteRankByRunnerId: source.favoriteRankByRunnerId,
            timeTolerancePercent: source.timeTolerancePercent,
          }),
          prediction.finalizedAt,
        ),
    );
  }
}
