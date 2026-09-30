import { z } from 'zod';

import { FieldId, StartListAggregate } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListStartListsQueryInput = z.object({
  fieldIdList: z.array(FieldId),
});
export type ListStartListsQueryInput = z.infer<typeof ListStartListsQueryInput>;

export class ListStartListsQuery extends Query<StartListAggregate[]> {
  public readonly input: ListStartListsQueryInput;

  constructor(input: ListStartListsQueryInput) {
    super();
    this.input = ListStartListsQueryInput.parse(input);
  }
}
