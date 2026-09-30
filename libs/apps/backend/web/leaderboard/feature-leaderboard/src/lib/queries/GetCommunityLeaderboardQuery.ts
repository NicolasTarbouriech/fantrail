import { z } from 'zod';

import { RaceId } from '@trail/modules/race/domain';
import { LeaderboardEntry } from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetCommunityLeaderboardQueryInput = z.object({
  raceId: RaceId.optional(),
});
export type GetCommunityLeaderboardQueryInput = z.infer<
  typeof GetCommunityLeaderboardQueryInput
>;

// Every player of the site, on one race or on every public race.
export class GetCommunityLeaderboardQuery extends Query<LeaderboardEntry[]> {
  public readonly input: GetCommunityLeaderboardQueryInput;

  constructor(input: GetCommunityLeaderboardQueryInput) {
    super();
    this.input = GetCommunityLeaderboardQueryInput.parse(input);
  }
}
