import { z } from 'zod';

import {
  FieldId,
  PredictionAggregate,
  UserId,
} from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetPredictionQueryInput = z.object({
  userId: UserId,
  fieldId: FieldId,
});
export type GetPredictionQueryInput = z.infer<typeof GetPredictionQueryInput>;

export class GetPredictionQuery extends Query<PredictionAggregate | null> {
  public readonly input: GetPredictionQueryInput;

  constructor(input: GetPredictionQueryInput) {
    super();
    this.input = GetPredictionQueryInput.parse(input);
  }
}
