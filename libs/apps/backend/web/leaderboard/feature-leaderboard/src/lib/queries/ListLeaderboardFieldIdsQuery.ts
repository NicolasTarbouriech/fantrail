import { z } from 'zod';

import { FieldId, RaceId } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListLeaderboardFieldIdsQueryInput = z.object({
  raceId: RaceId.optional(),
  raceIdList: z.array(RaceId).optional(),
});
export type ListLeaderboardFieldIdsQueryInput = z.infer<
  typeof ListLeaderboardFieldIdsQueryInput
>;

// The fields a leaderboard adds up: one race, the public races among a list, or every public race.
export class ListLeaderboardFieldIdsQuery extends Query<FieldId[]> {
  public readonly input: ListLeaderboardFieldIdsQueryInput;

  constructor(input: ListLeaderboardFieldIdsQueryInput) {
    super();
    this.input = ListLeaderboardFieldIdsQueryInput.parse(input);
  }
}
