import { z } from 'zod';

import { FieldId, PredictionField } from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetPredictionFieldQueryInput = z.object({
  fieldId: FieldId,
});
export type GetPredictionFieldQueryInput = z.infer<
  typeof GetPredictionFieldQueryInput
>;

export class GetPredictionFieldQuery extends Query<PredictionField> {
  public readonly input: GetPredictionFieldQueryInput;

  constructor(input: GetPredictionFieldQueryInput) {
    super();
    this.input = GetPredictionFieldQueryInput.parse(input);
  }
}
