import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
  TrailEventNotFoundError,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  TRAIL_EVENT_ID,
  buildRaceAggregate,
  buildRaceData,
  buildTrailEventAggregate,
} from '@trail/modules/race/domain-testing';

import { UpdateRaceCommand } from './UpdateRaceCommand';
import { UpdateRaceCommandHandler } from './UpdateRaceCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('UpdateRaceCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let trailEventRepository: TrailEventRepository;
  let handler: UpdateRaceCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    trailEventRepository = {
      getById: jest.fn().mockResolvedValue(buildTrailEventAggregate()),
    } as unknown as TrailEventRepository;
    handler = new UpdateRaceCommandHandler(
      raceRepository,
      trailEventRepository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new UpdateRaceCommand({
        raceId: RACE_ID,
        data: buildRaceData({ name: 'Diagonale 2026' }),
      }),
    );
    expect(saved.name).toBe('Diagonale 2026');
    expect(raceRepository.save).toHaveBeenCalledWith(race);
    expect(trailEventRepository.getById).not.toHaveBeenCalled();
  });

  it('attaches the race to an existing trail event only', async () => {
    const data = buildRaceData({ trailEventId: TRAIL_EVENT_ID });
    const saved = await handler.execute(
      new UpdateRaceCommand({ raceId: RACE_ID, data }),
    );
    expect(saved.data.trailEventId).toBe(TRAIL_EVENT_ID);
    jest
      .mocked(trailEventRepository.getById)
      .mockRejectedValueOnce(new TrailEventNotFoundError());
    await expect(
      handler.execute(new UpdateRaceCommand({ raceId: RACE_ID, data })),
    ).rejects.toThrow(TrailEventNotFoundError);
    expect(raceRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new UpdateRaceCommand({
          ...{
            raceId: RACE_ID,
            data: buildRaceData({ name: 'Diagonale 2026' }),
          },
          raceId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
