import { z } from 'zod';

import {
  FieldId,
  FieldResultAggregate,
  FieldResultData,
} from '@trail/modules/result/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const PublishFieldResultCommandInput = z.object({
  fieldId: FieldId,
  data: FieldResultData,
});
export type PublishFieldResultCommandInput = z.infer<
  typeof PublishFieldResultCommandInput
>;

export class PublishFieldResultCommand extends Command<FieldResultAggregate> {
  public readonly input: PublishFieldResultCommandInput;

  constructor(input: PublishFieldResultCommandInput) {
    super();
    this.input = PublishFieldResultCommandInput.parse(input);
  }
}
