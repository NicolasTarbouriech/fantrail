import { z } from 'zod';

import { LeagueActor, LeagueId } from '@trail/modules/league/domain';
import { RaceId } from '@trail/modules/race/domain';
import { LeaderboardEntry } from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetLeagueLeaderboardQueryInput = z.object({
  leagueId: LeagueId,
  viewer: LeagueActor,
  raceId: RaceId.optional(),
});
export type GetLeagueLeaderboardQueryInput = z.infer<
  typeof GetLeagueLeaderboardQueryInput
>;

// The members of a league, on one of its races or on all of them.
export class GetLeagueLeaderboardQuery extends Query<LeaderboardEntry[]> {
  public readonly input: GetLeagueLeaderboardQueryInput;

  constructor(input: GetLeagueLeaderboardQueryInput) {
    super();
    this.input = GetLeagueLeaderboardQueryInput.parse(input);
  }
}
