import { z } from 'zod';

import {
  FieldId,
  PlayerFieldScore,
  UserId,
} from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetPlayerFieldScoreQueryInput = z.object({
  userId: UserId,
  fieldId: FieldId,
});
export type GetPlayerFieldScoreQueryInput = z.infer<
  typeof GetPlayerFieldScoreQueryInput
>;

export class GetPlayerFieldScoreQuery extends Query<PlayerFieldScore | null> {
  public readonly input: GetPlayerFieldScoreQueryInput;

  constructor(input: GetPlayerFieldScoreQueryInput) {
    super();
    this.input = GetPlayerFieldScoreQueryInput.parse(input);
  }
}
