import { QueryHandler } from '@nestjs/cqrs';

import { GetLeaderboardQuery } from '@trail/modules/scoring/application';
import { LeaderboardEntry } from '@trail/modules/scoring/domain';
import { ListUsersQuery } from '@trail/modules/user/application';
import {
  EnhancedQueryBus,
  IEnhancedQueryHandler,
} from '@trail/shared/cqrs/util-nestjs';

import { GetCommunityLeaderboardQuery } from './GetCommunityLeaderboardQuery';
import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';

@QueryHandler(GetCommunityLeaderboardQuery)
export class GetCommunityLeaderboardQueryHandler implements IEnhancedQueryHandler<GetCommunityLeaderboardQuery> {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  async execute({
    input,
  }: GetCommunityLeaderboardQuery): Promise<LeaderboardEntry[]> {
    const [fieldIdList, userList] = await Promise.all([
      this._queryBus.execute(
        new ListLeaderboardFieldIdsQuery({ raceId: input.raceId }),
      ),
      this._queryBus.execute(new ListUsersQuery()),
    ]);
    return this._queryBus.execute(
      new GetLeaderboardQuery({
        fieldIdList,
        userIdList: userList
          .filter((user) => !user.isDisabled)
          .map(({ id }) => id),
      }),
    );
  }
}
