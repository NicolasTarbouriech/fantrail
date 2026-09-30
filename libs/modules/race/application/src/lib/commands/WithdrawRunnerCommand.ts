import { z } from 'zod';

import {
  FieldId,
  RunnerId,
  StartListAggregate,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const WithdrawRunnerCommandInput = z.object({
  fieldId: FieldId,
  runnerId: RunnerId,
});
export type WithdrawRunnerCommandInput = z.infer<
  typeof WithdrawRunnerCommandInput
>;

export class WithdrawRunnerCommand extends Command<StartListAggregate> {
  public readonly input: WithdrawRunnerCommandInput;

  constructor(input: WithdrawRunnerCommandInput) {
    super();
    this.input = WithdrawRunnerCommandInput.parse(input);
  }
}
