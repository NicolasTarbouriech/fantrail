import { z } from 'zod';

import {
  FieldId,
  PredictionAggregate,
  UserId,
} from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListPredictionsByFieldQueryInput = z.object({
  fieldId: FieldId,
  userIdList: z.array(UserId).optional(),
});
export type ListPredictionsByFieldQueryInput = z.infer<
  typeof ListPredictionsByFieldQueryInput
>;

export class ListPredictionsByFieldQuery extends Query<PredictionAggregate[]> {
  public readonly input: ListPredictionsByFieldQueryInput;

  constructor(input: ListPredictionsByFieldQueryInput) {
    super();
    this.input = ListPredictionsByFieldQueryInput.parse(input);
  }
}
