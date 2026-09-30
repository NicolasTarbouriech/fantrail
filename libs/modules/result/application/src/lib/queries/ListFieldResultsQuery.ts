import { z } from 'zod';

import { FieldId, FieldResultAggregate } from '@trail/modules/result/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListFieldResultsQueryInput = z.object({
  fieldIdList: z.array(FieldId),
});
export type ListFieldResultsQueryInput = z.infer<
  typeof ListFieldResultsQueryInput
>;

export class ListFieldResultsQuery extends Query<FieldResultAggregate[]> {
  public readonly input: ListFieldResultsQueryInput;

  constructor(input: ListFieldResultsQueryInput) {
    super();
    this.input = ListFieldResultsQueryInput.parse(input);
  }
}
