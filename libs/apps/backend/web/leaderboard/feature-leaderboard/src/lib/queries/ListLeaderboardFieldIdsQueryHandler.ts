import { QueryHandler } from '@nestjs/cqrs';

import { GetRaceQuery, ListRacesQuery } from '@trail/modules/race/application';
import { FieldId, PUBLIC_RACE_STATUS_LIST } from '@trail/modules/race/domain';
import {
  EnhancedQueryBus,
  IEnhancedQueryHandler,
} from '@trail/shared/cqrs/util-nestjs';

import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';

@QueryHandler(ListLeaderboardFieldIdsQuery)
export class ListLeaderboardFieldIdsQueryHandler implements IEnhancedQueryHandler<ListLeaderboardFieldIdsQuery> {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  async execute({ input }: ListLeaderboardFieldIdsQuery): Promise<FieldId[]> {
    const raceList = input.raceId
      ? [
          await this._queryBus.execute(
            new GetRaceQuery({ raceId: input.raceId }),
          ),
        ]
      : await this._queryBus.execute(
          new ListRacesQuery({ statusList: PUBLIC_RACE_STATUS_LIST }),
        );
    return raceList.flatMap((race) => race.fieldList.map(({ id }) => id));
  }
}
