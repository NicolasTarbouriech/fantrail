import { z } from 'zod';

import { RaceId } from '@trail/modules/race/domain';
import { LeaderboardEntry } from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetCommunityLeaderboardQueryInput = z.object({
  raceId: RaceId,
});
export type GetCommunityLeaderboardQueryInput = z.infer<
  typeof GetCommunityLeaderboardQueryInput
>;

// The community of a race: every active player with a prediction on one of its fields.
export class GetCommunityLeaderboardQuery extends Query<LeaderboardEntry[]> {
  public readonly input: GetCommunityLeaderboardQueryInput;

  constructor(input: GetCommunityLeaderboardQueryInput) {
    super();
    this.input = GetCommunityLeaderboardQueryInput.parse(input);
  }
}
