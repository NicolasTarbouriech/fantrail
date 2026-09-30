import { TIME_POINTS_MAX } from '../constants';
import { DurationInSeconds, TimeTolerancePercent } from '../types';
import { TimeScore } from '../valueObjects';

export class TimePointsCalculator {
  static calculate(
    estimateInSeconds: DurationInSeconds,
    actualInSeconds: DurationInSeconds,
    timeTolerancePercent: TimeTolerancePercent,
  ): TimeScore {
    const toleranceInSeconds = (actualInSeconds * timeTolerancePercent) / 100;
    const gapInSeconds = Math.abs(estimateInSeconds - actualInSeconds);
    const points = Math.round(
      TIME_POINTS_MAX * Math.max(0, 1 - gapInSeconds / toleranceInSeconds),
    );
    return new TimeScore(
      estimateInSeconds,
      actualInSeconds,
      toleranceInSeconds,
      points,
    );
  }
}
