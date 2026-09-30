import { z } from 'zod';

import { FieldId, RaceAggregate } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const LockFieldCommandInput = z.object({
  fieldId: FieldId,
});
export type LockFieldCommandInput = z.infer<typeof LockFieldCommandInput>;

export class LockFieldCommand extends Command<RaceAggregate> {
  public readonly input: LockFieldCommandInput;

  constructor(input: LockFieldCommandInput) {
    super();
    this.input = LockFieldCommandInput.parse(input);
  }
}
