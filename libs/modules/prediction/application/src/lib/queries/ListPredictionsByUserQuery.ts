import { z } from 'zod';

import { PredictionAggregate, UserId } from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListPredictionsByUserQueryInput = z.object({
  userId: UserId,
});
export type ListPredictionsByUserQueryInput = z.infer<
  typeof ListPredictionsByUserQueryInput
>;

export class ListPredictionsByUserQuery extends Query<PredictionAggregate[]> {
  public readonly input: ListPredictionsByUserQueryInput;

  constructor(input: ListPredictionsByUserQueryInput) {
    super();
    this.input = ListPredictionsByUserQueryInput.parse(input);
  }
}
