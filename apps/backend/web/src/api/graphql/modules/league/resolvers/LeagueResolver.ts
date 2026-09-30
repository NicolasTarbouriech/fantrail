import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { GetLeagueLeaderboardQuery } from '@trail/apps/backend/web/leaderboard/feature-leaderboard';
import { ListLeagueFieldPredictionsQuery } from '@trail/apps/backend/web/leaderboard/feature-leaderboard';
import {
  ChangeLeagueVisibilityCommand,
  CreateLeagueCommand,
  DeleteLeagueCommand,
  GetLeagueByInviteCodeQuery,
  GetLeagueQuery,
  JoinLeagueByInviteCodeCommand,
  JoinLeagueCommand,
  LeaveLeagueCommand,
  ListLeaguesQuery,
  RegenerateLeagueInviteCodeCommand,
  RemoveLeagueMemberCommand,
  RenameLeagueCommand,
} from '@trail/modules/league/application';
import {
  LeagueActor,
  LeagueAggregate,
  LeagueVisibility,
} from '@trail/modules/league/domain';
import { UserAggregate } from '@trail/modules/user/domain';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { User } from '../../../../../services/auth/decorators/User';
import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { AuthNotMandatory } from '../../../../../services/auth/guards/AuthNotMandatory';
import { toLeagueActor } from '../../../../../services/auth/toLeagueActor';
import { UserDataLoader } from '../../../../../services/dataloader/UserDataLoader';
import { PredictionType } from '../../prediction/types/PredictionType';
import { LeaderboardEntryType } from '../../scoring/types/LeaderboardEntryType';
import { PlayerType } from '../../scoring/types/PlayerType';
import { LeagueType } from '../types/LeagueType';

@Resolver(() => LeagueType)
export class LeagueResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
    private readonly _userDataLoader: UserDataLoader,
  ) {}

  @Query(() => [LeagueType])
  @UseGuards(AuthGuard)
  async publicLeagues(@User() user: UserAggregate): Promise<LeagueType[]> {
    return this._toTypeList(
      await this._queryBus.execute(
        new ListLeaguesQuery({ visibility: LeagueVisibility.Public }),
      ),
      user,
    );
  }

  @Query(() => [LeagueType])
  @UseGuards(AuthGuard)
  async myLeagues(@User() user: UserAggregate): Promise<LeagueType[]> {
    return this._toTypeList(
      await this._queryBus.execute(new ListLeaguesQuery({ memberId: user.id })),
      user,
    );
  }

  @Query(() => [LeagueType])
  @UseGuards(AuthGuard, AdminGuard)
  async adminLeagues(@User() user: UserAggregate): Promise<LeagueType[]> {
    return this._toTypeList(
      await this._queryBus.execute(new ListLeaguesQuery({})),
      user,
    );
  }

  @Query(() => LeagueType)
  @UseGuards(AuthGuard)
  async league(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._queryBus.execute(
        new GetLeagueQuery({ leagueId, viewer: toLeagueActor(user) }),
      ),
      user,
    );
  }

  @Query(() => LeagueType, {
    description: 'Preview of the league behind an invite link, before joining',
  })
  @UseGuards(AuthGuard)
  @AuthNotMandatory()
  async leagueByInviteCode(
    @User() user: UserAggregate | undefined,
    @Args('inviteCode', { type: () => String }) inviteCode: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._queryBus.execute(
        new GetLeagueByInviteCodeQuery({ inviteCode }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async createLeague(
    @User() user: UserAggregate,
    @Args('name', { type: () => String }) name: string,
    @Args('visibility', { type: () => LeagueVisibility })
    visibility: LeagueVisibility,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new CreateLeagueCommand({ ownerId: user.id, name, visibility }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType, { description: 'Joins a public league' })
  @UseGuards(AuthGuard)
  async joinLeague(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new JoinLeagueCommand({ userId: user.id, leagueId }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async joinLeagueByInviteCode(
    @User() user: UserAggregate,
    @Args('inviteCode', { type: () => String }) inviteCode: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new JoinLeagueByInviteCodeCommand({ userId: user.id, inviteCode }),
      ),
      user,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async leaveLeague(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
  ): Promise<boolean> {
    await this._commandBus.execute(
      new LeaveLeagueCommand({ userId: user.id, leagueId }),
    );
    return true;
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async removeLeagueMember(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new RemoveLeagueMemberCommand({
          actor: toLeagueActor(user),
          leagueId,
          userId,
        }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async renameLeague(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
    @Args('name', { type: () => String }) name: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new RenameLeagueCommand({ actor: toLeagueActor(user), leagueId, name }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async changeLeagueVisibility(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
    @Args('visibility', { type: () => LeagueVisibility })
    visibility: LeagueVisibility,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new ChangeLeagueVisibilityCommand({
          actor: toLeagueActor(user),
          leagueId,
          visibility,
        }),
      ),
      user,
    );
  }

  @Mutation(() => LeagueType)
  @UseGuards(AuthGuard)
  async regenerateLeagueInviteCode(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
  ): Promise<LeagueType> {
    return this._toType(
      await this._commandBus.execute(
        new RegenerateLeagueInviteCodeCommand({
          actor: toLeagueActor(user),
          leagueId,
        }),
      ),
      user,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  deleteLeague(
    @User() user: UserAggregate,
    @Args('leagueId', { type: () => ID }) leagueId: string,
  ): Promise<boolean> {
    return this._commandBus.execute(
      new DeleteLeagueCommand({ actor: toLeagueActor(user), leagueId }),
    );
  }

  @ResolveField(() => [PlayerType])
  async members(@Parent() league: LeagueType): Promise<PlayerType[]> {
    const userList = await this._userDataLoader.loader.loadMany(
      league.aggregate.memberIdList,
    );
    return userList.flatMap((user) =>
      user instanceof Error ? [] : [new PlayerType(user)],
    );
  }

  @ResolveField(() => [LeaderboardEntryType], {
    description: 'Members ranked on one race or on every public race',
  })
  async leaderboard(
    @Parent() league: LeagueType,
    @Args('raceId', { type: () => ID, nullable: true }) raceId?: string | null,
  ): Promise<LeaderboardEntryType[]> {
    const viewer = this._requireViewer(league);
    const entryList = await this._queryBus.execute(
      new GetLeagueLeaderboardQuery({
        leagueId: league.id,
        viewer,
        raceId: raceId ?? undefined,
      }),
    );
    return entryList.map((entry) => new LeaderboardEntryType(entry));
  }

  @ResolveField(() => [PredictionType], {
    description: 'Members predictions on a field, revealed once it locks',
  })
  async fieldPredictions(
    @Parent() league: LeagueType,
    @Args('fieldId', { type: () => ID }) fieldId: string,
  ): Promise<PredictionType[]> {
    const viewer = this._requireViewer(league);
    const predictionList = await this._queryBus.execute(
      new ListLeagueFieldPredictionsQuery({
        leagueId: league.id,
        fieldId,
        viewer,
      }),
    );
    return predictionList.map((prediction) => new PredictionType(prediction));
  }

  // The invite preview is public, what the league contains is not.
  private _requireViewer(league: LeagueType): LeagueActor {
    if (!league.viewer) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
    return league.viewer;
  }

  private _toType(
    league: LeagueAggregate,
    user: UserAggregate | undefined,
  ): LeagueType {
    return new LeagueType(league, user ? toLeagueActor(user) : null);
  }

  private _toTypeList(
    leagueList: LeagueAggregate[],
    user: UserAggregate,
  ): LeagueType[] {
    return leagueList.map((league) => this._toType(league, user));
  }
}
