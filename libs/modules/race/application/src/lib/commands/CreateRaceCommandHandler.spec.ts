import { ZodError } from 'zod';

import {
  RaceRepository,
  TrailEventNotFoundError,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  TRAIL_EVENT_ID,
  buildRaceAggregate,
  buildRaceData,
  buildTrailEventAggregate,
} from '@trail/modules/race/domain-testing';

import { CreateRaceCommand } from './CreateRaceCommand';
import { CreateRaceCommandHandler } from './CreateRaceCommandHandler';

describe('CreateRaceCommandHandler', () => {
  const race = buildRaceAggregate();
  let raceRepository: RaceRepository;
  let trailEventRepository: TrailEventRepository;
  let handler: CreateRaceCommandHandler;

  beforeEach(() => {
    raceRepository = {
      create: jest.fn().mockResolvedValue(race),
    } as unknown as RaceRepository;
    trailEventRepository = {
      getById: jest.fn().mockResolvedValue(buildTrailEventAggregate()),
    } as unknown as TrailEventRepository;
    handler = new CreateRaceCommandHandler(
      raceRepository,
      trailEventRepository,
    );
  });

  it('creates the race through the repository', async () => {
    await expect(
      handler.execute(new CreateRaceCommand({ data: buildRaceData() })),
    ).resolves.toBe(race);
    expect(raceRepository.create).toHaveBeenCalledWith(buildRaceData());
    expect(trailEventRepository.getById).not.toHaveBeenCalled();
  });

  it('checks that the trail event of the race exists', async () => {
    const data = buildRaceData({ trailEventId: TRAIL_EVENT_ID });
    await handler.execute(new CreateRaceCommand({ data }));
    expect(trailEventRepository.getById).toHaveBeenCalledWith(TRAIL_EVENT_ID);
    jest
      .mocked(trailEventRepository.getById)
      .mockRejectedValueOnce(new TrailEventNotFoundError());
    await expect(
      handler.execute(new CreateRaceCommand({ data })),
    ).rejects.toThrow(TrailEventNotFoundError);
    expect(raceRepository.create).toHaveBeenCalledTimes(1);
  });

  it('rejects an invalid pick count', () => {
    expect(
      () =>
        new CreateRaceCommand({
          data: { ...buildRaceData(), pickCount: 4 as 5 },
        }),
    ).toThrow(ZodError);
  });
});
