import { z } from 'zod';

import { FieldId, PlayerFieldScore } from '@trail/modules/scoring/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const ComputeFieldScoresCommandInput = z.object({
  fieldId: FieldId,
});
export type ComputeFieldScoresCommandInput = z.infer<
  typeof ComputeFieldScoresCommandInput
>;

export class ComputeFieldScoresCommand extends Command<PlayerFieldScore[]> {
  public readonly input: ComputeFieldScoresCommandInput;

  constructor(input: ComputeFieldScoresCommandInput) {
    super();
    this.input = ComputeFieldScoresCommandInput.parse(input);
  }
}
