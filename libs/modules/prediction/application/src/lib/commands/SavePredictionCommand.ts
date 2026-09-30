import { z } from 'zod';

import {
  FieldId,
  PickSlotList,
  PredictionAggregate,
  UserId,
  WinnerTimeInSeconds,
} from '@trail/modules/prediction/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const SavePredictionCommandInput = z.object({
  userId: UserId,
  fieldId: FieldId,
  pickList: PickSlotList,
  winnerTimeEstimateInSeconds: WinnerTimeInSeconds.nullable(),
});
export type SavePredictionCommandInput = z.infer<
  typeof SavePredictionCommandInput
>;

export class SavePredictionCommand extends Command<PredictionAggregate> {
  public readonly input: SavePredictionCommandInput;

  constructor(input: SavePredictionCommandInput) {
    super();
    this.input = SavePredictionCommandInput.parse(input);
  }
}
