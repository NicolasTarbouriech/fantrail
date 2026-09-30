import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';

import { LockRaceCommand } from './LockRaceCommand';
import { LockRaceCommandHandler } from './LockRaceCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('LockRaceCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: LockRaceCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new LockRaceCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new LockRaceCommand({ raceId: RACE_ID }),
    );
    expect(saved.status).toBe(RaceStatus.Locked);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new LockRaceCommand({ ...{ raceId: RACE_ID }, raceId: 'not-a-uuid' }),
    ).toThrow(ZodError);
  });
});
