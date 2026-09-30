import {
  DuplicatePickError,
  PickCountMismatchError,
  RunnerNotInFieldError,
  WithdrawnRunnerPickError,
} from '../errors';
import { PickSlotList, RunnerId } from '../types';
import { PredictionField } from '../valueObjects';

export class PickListAssertion {
  // A runner who withdrew after being picked may stay where he was, but cannot be picked again.
  static assert(
    pickList: PickSlotList,
    previousPickList: PickSlotList,
    field: PredictionField,
  ): void {
    if (pickList.length !== field.pickCount) {
      throw new PickCountMismatchError(field.pickCount, pickList.length);
    }
    const seen = new Set<RunnerId>();
    for (const runnerId of pickList) {
      if (runnerId === null) {
        continue;
      }
      if (seen.has(runnerId)) {
        throw new DuplicatePickError(runnerId);
      }
      seen.add(runnerId);
      if (!field.hasRunner(runnerId)) {
        throw new RunnerNotInFieldError(runnerId);
      }
      if (field.isWithdrawn(runnerId) && !previousPickList.includes(runnerId)) {
        throw new WithdrawnRunnerPickError(runnerId);
      }
    }
  }
}
