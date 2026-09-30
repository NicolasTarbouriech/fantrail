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

import { CancelRaceCommand } from './CancelRaceCommand';
import { CancelRaceCommandHandler } from './CancelRaceCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('CancelRaceCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: CancelRaceCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new CancelRaceCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new CancelRaceCommand({ raceId: RACE_ID }),
    );
    expect(saved.status).toBe(RaceStatus.Cancelled);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new CancelRaceCommand({ ...{ raceId: RACE_ID }, raceId: 'not-a-uuid' }),
    ).toThrow(ZodError);
  });
});
