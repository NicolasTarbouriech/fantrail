import { z } from 'zod';

import {
  FieldId,
  RunnerData,
  StartListAggregate,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const AddRunnerListCommandInput = z.object({
  fieldId: FieldId,
  dataList: z.array(RunnerData).min(1).max(200),
});
export type AddRunnerListCommandInput = z.infer<
  typeof AddRunnerListCommandInput
>;

export class AddRunnerListCommand extends Command<StartListAggregate> {
  public readonly input: AddRunnerListCommandInput;

  constructor(input: AddRunnerListCommandInput) {
    super();
    this.input = AddRunnerListCommandInput.parse(input);
  }
}
