import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  buildRaceAggregate,
  buildRaceData,
} from '@trail/modules/race/domain-testing';

import { UpdateRaceCommand } from './UpdateRaceCommand';
import { UpdateRaceCommandHandler } from './UpdateRaceCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('UpdateRaceCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: UpdateRaceCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new UpdateRaceCommandHandler(raceRepository);
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
