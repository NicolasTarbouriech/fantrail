import { z } from 'zod';

import { FieldId, StartListAggregate } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetStartListQueryInput = z.object({
  fieldId: FieldId,
});
export type GetStartListQueryInput = z.infer<typeof GetStartListQueryInput>;

export class GetStartListQuery extends Query<StartListAggregate> {
  public readonly input: GetStartListQueryInput;

  constructor(input: GetStartListQueryInput) {
    super();
    this.input = GetStartListQueryInput.parse(input);
  }
}
