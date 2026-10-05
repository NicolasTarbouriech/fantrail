import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { GetCommunityLeaderboardQueryHandler } from './queries/GetCommunityLeaderboardQueryHandler';
import { GetLeagueLeaderboardQueryHandler } from './queries/GetLeagueLeaderboardQueryHandler';
import { GetPlayerTotalPointsQueryHandler } from './queries/GetPlayerTotalPointsQueryHandler';
import { ListLeaderboardFieldIdsQueryHandler } from './queries/ListLeaderboardFieldIdsQueryHandler';
import { ListLeagueFieldPredictionsQueryHandler } from './queries/ListLeagueFieldPredictionsQueryHandler';

@Module({
  imports: [CqrsModule],
  providers: [
    GetCommunityLeaderboardQueryHandler,
    GetLeagueLeaderboardQueryHandler,
    GetPlayerTotalPointsQueryHandler,
    ListLeaderboardFieldIdsQueryHandler,
    ListLeagueFieldPredictionsQueryHandler,
  ],
})
export class LeaderboardModule {}
