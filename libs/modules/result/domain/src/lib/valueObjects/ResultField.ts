import { z } from 'zod';

import { ResultFieldNotLockedError } from '../errors';
import { FieldId, RunnerId } from '../types';

export const ResultFieldData = z.object({
  fieldId: FieldId,
  isLocked: z.boolean(),
  runnerIdList: z.array(RunnerId),
});
export type ResultFieldData = z.infer<typeof ResultFieldData>;

// What a result needs to know about its field, read from the race module.
export class ResultField {
  private constructor(private readonly _data: ResultFieldData) {}

  static create(data: ResultFieldData): ResultField {
    return new ResultField(ResultFieldData.parse(data));
  }

  get fieldId(): FieldId {
    return this._data.fieldId;
  }

  assertLocked(): void {
    if (!this._data.isLocked) {
      throw new ResultFieldNotLockedError();
    }
  }

  hasRunner(runnerId: RunnerId): boolean {
    return this._data.runnerIdList.includes(runnerId);
  }
}
