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

import { MarkRaceScoredCommand } from './MarkRaceScoredCommand';
import { MarkRaceScoredCommandHandler } from './MarkRaceScoredCommandHandler';

const NOW = new Date('2026-10-17T10:00:00Z');

describe('MarkRaceScoredCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: MarkRaceScoredCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Locked });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new MarkRaceScoredCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('marks the race scored and saves it', async () => {
    const saved = await handler.execute(
      new MarkRaceScoredCommand({ raceId: RACE_ID }),
    );
    expect(saved.status).toBe(RaceStatus.Scored);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(() => new MarkRaceScoredCommand({ raceId: 'not-a-uuid' })).toThrow(
      ZodError,
    );
  });
});
