import { PICK_WEIGHT_LIST, SCORED_POSITION_COUNT } from '../constants';
import { InvalidPickPositionError } from '../errors';

export class PositionPointsCalculator {
  static calculate(
    pickPosition: number,
    finishPosition: number | null,
  ): number {
    if (
      !Number.isInteger(pickPosition) ||
      pickPosition < 1 ||
      pickPosition > PICK_WEIGHT_LIST.length
    ) {
      throw new InvalidPickPositionError(pickPosition);
    }
    if (finishPosition === null || finishPosition > SCORED_POSITION_COUNT) {
      return 0;
    }
    const weight = PICK_WEIGHT_LIST[pickPosition - 1];
    return (
      (SCORED_POSITION_COUNT - Math.abs(pickPosition - finishPosition)) * weight
    );
  }
}
