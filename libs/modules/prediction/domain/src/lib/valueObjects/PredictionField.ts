import { z } from 'zod';

import { PredictionLockedError, PredictionsHiddenError } from '../errors';
import { FieldId, RunnerId } from '../types';

export const PredictionFieldData = z.object({
  fieldId: FieldId,
  pickCount: z.number().int().positive().max(10),
  isOpen: z.boolean(),
  runnerIdList: z.array(RunnerId),
  withdrawnRunnerIdList: z.array(RunnerId),
});
export type PredictionFieldData = z.infer<typeof PredictionFieldData>;

// What a prediction needs to know about its field, read from the race module.
export class PredictionField {
  private constructor(private readonly _data: PredictionFieldData) {}

  static create(data: PredictionFieldData): PredictionField {
    return new PredictionField(PredictionFieldData.parse(data));
  }

  get fieldId(): FieldId {
    return this._data.fieldId;
  }

  get pickCount(): number {
    return this._data.pickCount;
  }

  get isOpen(): boolean {
    return this._data.isOpen;
  }

  assertOpen(): void {
    if (!this._data.isOpen) {
      throw new PredictionLockedError();
    }
  }

  // Before the lock, a player only sees his own prediction.
  assertPredictionsRevealed(): void {
    if (this._data.isOpen) {
      throw new PredictionsHiddenError();
    }
  }

  hasRunner(runnerId: RunnerId): boolean {
    return this._data.runnerIdList.includes(runnerId);
  }

  isWithdrawn(runnerId: RunnerId): boolean {
    return this._data.withdrawnRunnerIdList.includes(runnerId);
  }
}
