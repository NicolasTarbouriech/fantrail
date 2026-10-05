import { UseGuards } from '@nestjs/common';
import { Args, Float, ID, Query, Resolver } from '@nestjs/graphql';

import {
  GetCommunityLeaderboardQuery,
  GetPlayerTotalPointsQuery,
} from '@trail/apps/backend/web/leaderboard/feature-leaderboard';
import { GetPlayerFieldScoreQuery } from '@trail/modules/scoring/application';
import { UserAggregate } from '@trail/modules/user/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { User } from '../../../../../services/auth/decorators/User';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { LeaderboardEntryType } from '../types/LeaderboardEntryType';
import { ScorecardType } from '../types/ScorecardType';

@Resolver()
export class ScoringResolver {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  @Query(() => [LeaderboardEntryType], {
    description: 'Every player with a prediction on the race',
  })
  @UseGuards(AuthGuard)
  async communityLeaderboard(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<LeaderboardEntryType[]> {
    const entryList = await this._queryBus.execute(
      new GetCommunityLeaderboardQuery({ raceId }),
    );
    return entryList.map((entry) => new LeaderboardEntryType(entry));
  }

  @Query(() => Float, { description: 'My points on every public race' })
  @UseGuards(AuthGuard)
  myTotalPoints(@User() user: UserAggregate): Promise<number> {
    return this._queryBus.execute(
      new GetPlayerTotalPointsQuery({ userId: user.id }),
    );
  }

  @Query(() => ScorecardType, {
    nullable: true,
    description:
      'Null until the field is scored or without complete prediction',
  })
  @UseGuards(AuthGuard)
  async myScorecard(
    @User() user: UserAggregate,
    @Args('fieldId', { type: () => ID }) fieldId: string,
  ): Promise<ScorecardType | null> {
    const score = await this._queryBus.execute(
      new GetPlayerFieldScoreQuery({ userId: user.id, fieldId }),
    );
    return score ? new ScorecardType(score) : null;
  }
}
