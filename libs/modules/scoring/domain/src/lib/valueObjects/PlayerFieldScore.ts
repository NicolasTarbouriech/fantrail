import { FieldId, UserId } from '../types';
import { FieldScore } from './FieldScore';

export class PlayerFieldScore {
  constructor(
    public readonly userId: UserId,
    public readonly fieldId: FieldId,
    public readonly resultVersion: number,
    public readonly fieldScore: FieldScore,
    public readonly finalizedAt: Date,
  ) {}

  get total(): number {
    return this.fieldScore.total;
  }

  get timeGapInSeconds(): number {
    return this.fieldScore.timeScore.gapInSeconds;
  }
}
