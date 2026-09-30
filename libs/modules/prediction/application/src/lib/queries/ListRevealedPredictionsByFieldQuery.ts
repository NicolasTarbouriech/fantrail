import { z } from 'zod';

import {
  FieldId,
  PredictionAggregate,
  UserId,
} from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListRevealedPredictionsByFieldQueryInput = z.object({
  fieldId: FieldId,
  userIdList: z.array(UserId),
});
export type ListRevealedPredictionsByFieldQueryInput = z.infer<
  typeof ListRevealedPredictionsByFieldQueryInput
>;

// Other players' predictions, available once the field is locked.
export class ListRevealedPredictionsByFieldQuery extends Query<
  PredictionAggregate[]
> {
  public readonly input: ListRevealedPredictionsByFieldQueryInput;

  constructor(input: ListRevealedPredictionsByFieldQueryInput) {
    super();
    this.input = ListRevealedPredictionsByFieldQueryInput.parse(input);
  }
}
