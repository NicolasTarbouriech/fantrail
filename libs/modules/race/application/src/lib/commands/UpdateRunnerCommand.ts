import { z } from 'zod';

import {
  FieldId,
  RunnerData,
  RunnerId,
  StartListAggregate,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const UpdateRunnerCommandInput = z.object({
  fieldId: FieldId,
  runnerId: RunnerId,
  data: RunnerData,
});
export type UpdateRunnerCommandInput = z.infer<typeof UpdateRunnerCommandInput>;

export class UpdateRunnerCommand extends Command<StartListAggregate> {
  public readonly input: UpdateRunnerCommandInput;

  constructor(input: UpdateRunnerCommandInput) {
    super();
    this.input = UpdateRunnerCommandInput.parse(input);
  }
}
