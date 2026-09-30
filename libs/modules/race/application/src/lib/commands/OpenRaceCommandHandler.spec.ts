import {
  FieldNotEnoughRunnersError,
  RaceRepository,
  RaceStatus,
  StartListRepository,
} from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  RACE_ID,
  WOMEN_FIELD_ID,
  buildRaceAggregate,
  buildStartList,
} from '@trail/modules/race/domain-testing';

import { OpenRaceCommand } from './OpenRaceCommand';
import { OpenRaceCommandHandler } from './OpenRaceCommandHandler';

describe('OpenRaceCommandHandler', () => {
  function givenStartLists(menRunnerCount: number, womenRunnerCount: number) {
    const race = buildRaceAggregate();
    const raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    const startListRepository = {
      listByFieldIdList: jest.fn().mockResolvedValue([
        buildStartList({
          fieldId: MEN_FIELD_ID,
          runnerCount: menRunnerCount,
        }),
        buildStartList({
          fieldId: WOMEN_FIELD_ID,
          runnerCount: womenRunnerCount,
        }),
      ]),
    } as unknown as StartListRepository;
    return {
      raceRepository,
      startListRepository,
      handler: new OpenRaceCommandHandler(raceRepository, startListRepository),
    };
  }

  it('opens the race when every start list has enough runners', async () => {
    const { handler, startListRepository } = givenStartLists(5, 12);
    const saved = await handler.execute(
      new OpenRaceCommand({ raceId: RACE_ID }),
    );
    expect(saved.status).toBe(RaceStatus.Open);
    expect(startListRepository.listByFieldIdList).toHaveBeenCalledWith([
      MEN_FIELD_ID,
      WOMEN_FIELD_ID,
    ]);
  });

  it('keeps the race closed when a start list is too short', async () => {
    const { handler, raceRepository } = givenStartLists(5, 4);
    await expect(
      handler.execute(new OpenRaceCommand({ raceId: RACE_ID })),
    ).rejects.toThrow(FieldNotEnoughRunnersError);
    expect(raceRepository.save).not.toHaveBeenCalled();
  });
});
