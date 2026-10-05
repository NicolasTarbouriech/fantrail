import { QueryHandler } from '@nestjs/cqrs';

import { GetLeaderboardQuery } from '@trail/modules/scoring/application';
import {
  EnhancedQueryBus,
  IEnhancedQueryHandler,
} from '@trail/shared/cqrs/util-nestjs';

import { GetPlayerTotalPointsQuery } from './GetPlayerTotalPointsQuery';
import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';

@QueryHandler(GetPlayerTotalPointsQuery)
export class GetPlayerTotalPointsQueryHandler implements IEnhancedQueryHandler<GetPlayerTotalPointsQuery> {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  async execute({ input }: GetPlayerTotalPointsQuery): Promise<number> {
    const fieldIdList = await this._queryBus.execute(
      new ListLeaderboardFieldIdsQuery({}),
    );
    const [entry] = await this._queryBus.execute(
      new GetLeaderboardQuery({ fieldIdList, userIdList: [input.userId] }),
    );
    return entry?.total ?? 0;
  }
}
