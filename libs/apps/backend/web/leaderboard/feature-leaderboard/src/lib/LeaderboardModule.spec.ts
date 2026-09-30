import { MODULE_METADATA } from '@nestjs/common/constants';

import { LeaderboardModule } from './LeaderboardModule';
import { GetCommunityLeaderboardQueryHandler } from './queries/GetCommunityLeaderboardQueryHandler';
import { GetLeagueLeaderboardQueryHandler } from './queries/GetLeagueLeaderboardQueryHandler';
import { ListLeaderboardFieldIdsQueryHandler } from './queries/ListLeaderboardFieldIdsQueryHandler';
import { ListLeagueFieldPredictionsQueryHandler } from './queries/ListLeagueFieldPredictionsQueryHandler';

describe('LeaderboardModule', () => {
  it('registers every leaderboard query handler', () => {
    expect(
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, LeaderboardModule),
    ).toEqual([
      GetCommunityLeaderboardQueryHandler,
      GetLeagueLeaderboardQueryHandler,
      ListLeaderboardFieldIdsQueryHandler,
      ListLeagueFieldPredictionsQueryHandler,
    ]);
  });
});
