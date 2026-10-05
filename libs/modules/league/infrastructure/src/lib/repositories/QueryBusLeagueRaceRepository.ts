import { Injectable } from '@nestjs/common';

import { LeagueRaceRepository, RaceId } from '@trail/modules/league/domain';
import { ListRacesQuery } from '@trail/modules/race/application';
import { PUBLIC_RACE_STATUS_LIST } from '@trail/modules/race/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

// Reads the races through the race module queries, never through its tables.
@Injectable()
export class QueryBusLeagueRaceRepository extends LeagueRaceRepository {
  constructor(private readonly _queryBus: EnhancedQueryBus) {
    super();
  }

  async listAvailableRaceIds(): Promise<RaceId[]> {
    const raceList = await this._queryBus.execute(
      new ListRacesQuery({ statusList: PUBLIC_RACE_STATUS_LIST }),
    );
    return raceList.map(({ id }) => id);
  }
}
