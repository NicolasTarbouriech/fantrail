import { z } from 'zod';

import { FieldData, RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const AddFieldCommandInput = z.object({
  raceId: RaceId,
  data: FieldData,
});
export type AddFieldCommandInput = z.infer<typeof AddFieldCommandInput>;

export class AddFieldCommand extends Command<RaceAggregate> {
  public readonly input: AddFieldCommandInput;

  constructor(input: AddFieldCommandInput) {
    super();
    this.input = AddFieldCommandInput.parse(input);
  }
}
