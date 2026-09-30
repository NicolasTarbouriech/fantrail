import { QueryHandler } from '@nestjs/cqrs';

import { GetLeagueQuery } from '@trail/modules/league/application';
import { GetLeaderboardQuery } from '@trail/modules/scoring/application';
import { LeaderboardEntry } from '@trail/modules/scoring/domain';
import {
  EnhancedQueryBus,
  IEnhancedQueryHandler,
} from '@trail/shared/cqrs/util-nestjs';

import { GetLeagueLeaderboardQuery } from './GetLeagueLeaderboardQuery';
import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';

@QueryHandler(GetLeagueLeaderboardQuery)
export class GetLeagueLeaderboardQueryHandler implements IEnhancedQueryHandler<GetLeagueLeaderboardQuery> {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  async execute({
    input,
  }: GetLeagueLeaderboardQuery): Promise<LeaderboardEntry[]> {
    const [league, fieldIdList] = await Promise.all([
      this._queryBus.execute(
        new GetLeagueQuery({ leagueId: input.leagueId, viewer: input.viewer }),
      ),
      this._queryBus.execute(
        new ListLeaderboardFieldIdsQuery({ raceId: input.raceId }),
      ),
    ]);
    return this._queryBus.execute(
      new GetLeaderboardQuery({ fieldIdList, userIdList: league.memberIdList }),
    );
  }
}
