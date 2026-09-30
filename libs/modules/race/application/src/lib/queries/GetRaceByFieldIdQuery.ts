import { z } from 'zod';

import { FieldId, RaceAggregate } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetRaceByFieldIdQueryInput = z.object({
  fieldId: FieldId,
});
export type GetRaceByFieldIdQueryInput = z.infer<
  typeof GetRaceByFieldIdQueryInput
>;

export class GetRaceByFieldIdQuery extends Query<RaceAggregate> {
  public readonly input: GetRaceByFieldIdQueryInput;

  constructor(input: GetRaceByFieldIdQueryInput) {
    super();
    this.input = GetRaceByFieldIdQueryInput.parse(input);
  }
}
