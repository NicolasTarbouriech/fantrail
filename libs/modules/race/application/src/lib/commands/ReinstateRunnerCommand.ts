import { z } from 'zod';

import {
  FieldId,
  RunnerId,
  StartListAggregate,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const ReinstateRunnerCommandInput = z.object({
  fieldId: FieldId,
  runnerId: RunnerId,
});
export type ReinstateRunnerCommandInput = z.infer<
  typeof ReinstateRunnerCommandInput
>;

export class ReinstateRunnerCommand extends Command<StartListAggregate> {
  public readonly input: ReinstateRunnerCommandInput;

  constructor(input: ReinstateRunnerCommandInput) {
    super();
    this.input = ReinstateRunnerCommandInput.parse(input);
  }
}
