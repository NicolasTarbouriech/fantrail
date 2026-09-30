import { z } from 'zod';

import { RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetRaceQueryInput = z.object({
  raceId: RaceId,
});
export type GetRaceQueryInput = z.infer<typeof GetRaceQueryInput>;

export class GetRaceQuery extends Query<RaceAggregate> {
  public readonly input: GetRaceQueryInput;

  constructor(input: GetRaceQueryInput) {
    super();
    this.input = GetRaceQueryInput.parse(input);
  }
}
