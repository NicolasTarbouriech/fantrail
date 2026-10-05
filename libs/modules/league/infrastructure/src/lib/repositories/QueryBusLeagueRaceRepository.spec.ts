import { ListRacesQuery } from '@trail/modules/race/application';
import { PUBLIC_RACE_STATUS_LIST } from '@trail/modules/race/domain';
import {
  RACE_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { QueryBusLeagueRaceRepository } from './QueryBusLeagueRaceRepository';

describe('QueryBusLeagueRaceRepository', () => {
  it('lists the public races through the race module', async () => {
    const queryBus = {
      execute: jest.fn().mockResolvedValue([buildRaceAggregate()]),
    } as unknown as EnhancedQueryBus;
    await expect(
      new QueryBusLeagueRaceRepository(queryBus).listAvailableRaceIds(),
    ).resolves.toEqual([RACE_ID]);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListRacesQuery({ statusList: PUBLIC_RACE_STATUS_LIST }),
    );
  });
});
