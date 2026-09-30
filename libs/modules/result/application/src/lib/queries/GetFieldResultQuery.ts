import { z } from 'zod';

import { FieldId, FieldResultAggregate } from '@trail/modules/result/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetFieldResultQueryInput = z.object({
  fieldId: FieldId,
});
export type GetFieldResultQueryInput = z.infer<typeof GetFieldResultQueryInput>;

export class GetFieldResultQuery extends Query<FieldResultAggregate> {
  public readonly input: GetFieldResultQueryInput;

  constructor(input: GetFieldResultQueryInput) {
    super();
    this.input = GetFieldResultQueryInput.parse(input);
  }
}
