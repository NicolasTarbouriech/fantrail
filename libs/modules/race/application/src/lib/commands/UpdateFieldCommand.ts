import { z } from 'zod';

import { FieldData, FieldId, RaceAggregate } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const UpdateFieldCommandInput = z.object({
  fieldId: FieldId,
  data: FieldData,
});
export type UpdateFieldCommandInput = z.infer<typeof UpdateFieldCommandInput>;

export class UpdateFieldCommand extends Command<RaceAggregate> {
  public readonly input: UpdateFieldCommandInput;

  constructor(input: UpdateFieldCommandInput) {
    super();
    this.input = UpdateFieldCommandInput.parse(input);
  }
}
