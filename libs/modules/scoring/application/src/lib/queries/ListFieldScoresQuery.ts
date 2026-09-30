import { z } from 'zod';

import {
  FieldId,
  PlayerFieldScore,
  UserId,
} from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListFieldScoresQueryInput = z.object({
  fieldIdList: z.array(FieldId),
  userIdList: z.array(UserId).optional(),
});
export type ListFieldScoresQueryInput = z.infer<
  typeof ListFieldScoresQueryInput
>;

export class ListFieldScoresQuery extends Query<PlayerFieldScore[]> {
  public readonly input: ListFieldScoresQueryInput;

  constructor(input: ListFieldScoresQueryInput) {
    super();
    this.input = ListFieldScoresQueryInput.parse(input);
  }
}
