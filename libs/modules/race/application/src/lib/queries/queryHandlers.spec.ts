import {
  RaceRepository,
  RaceStatus,
  StartListRepository,
} from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  RACE_ID,
  buildRaceAggregate,
  buildStartList,
} from '@trail/modules/race/domain-testing';

import { GetRaceByFieldIdQuery } from './GetRaceByFieldIdQuery';
import { GetRaceByFieldIdQueryHandler } from './GetRaceByFieldIdQueryHandler';
import { GetRaceQuery } from './GetRaceQuery';
import { GetRaceQueryHandler } from './GetRaceQueryHandler';
import { GetStartListQuery } from './GetStartListQuery';
import { GetStartListQueryHandler } from './GetStartListQueryHandler';
import { ListRacesQuery } from './ListRacesQuery';
import { ListRacesQueryHandler } from './ListRacesQueryHandler';
import { ListStartListsQuery } from './ListStartListsQuery';
import { ListStartListsQueryHandler } from './ListStartListsQueryHandler';

describe('race query handlers', () => {
  const race = buildRaceAggregate();
  const startList = buildStartList();
  const raceRepository = {
    list: jest.fn().mockResolvedValue([race]),
    getById: jest.fn().mockResolvedValue(race),
    getByFieldId: jest.fn().mockResolvedValue(race),
  } as unknown as RaceRepository;
  const startListRepository = {
    getByFieldId: jest.fn().mockResolvedValue(startList),
    listByFieldIdList: jest.fn().mockResolvedValue([startList]),
  } as unknown as StartListRepository;

  it('ListRacesQueryHandler filters by status', async () => {
    await expect(
      new ListRacesQueryHandler(raceRepository).execute(
        new ListRacesQuery({ statusList: [RaceStatus.Open] }),
      ),
    ).resolves.toEqual([race]);
    expect(raceRepository.list).toHaveBeenCalledWith({
      statusList: [RaceStatus.Open],
    });
  });

  it('GetRaceQueryHandler reads a race by id', async () => {
    await expect(
      new GetRaceQueryHandler(raceRepository).execute(
        new GetRaceQuery({ raceId: RACE_ID }),
      ),
    ).resolves.toBe(race);
  });

  it('GetRaceByFieldIdQueryHandler reads a race by field id', async () => {
    await expect(
      new GetRaceByFieldIdQueryHandler(raceRepository).execute(
        new GetRaceByFieldIdQuery({ fieldId: MEN_FIELD_ID }),
      ),
    ).resolves.toBe(race);
  });

  it('GetStartListQueryHandler reads the start list of a field', async () => {
    await expect(
      new GetStartListQueryHandler(startListRepository).execute(
        new GetStartListQuery({ fieldId: MEN_FIELD_ID }),
      ),
    ).resolves.toBe(startList);
  });

  it('ListStartListsQueryHandler reads several start lists', async () => {
    await expect(
      new ListStartListsQueryHandler(startListRepository).execute(
        new ListStartListsQuery({ fieldIdList: [MEN_FIELD_ID] }),
      ),
    ).resolves.toEqual([startList]);
  });
});
