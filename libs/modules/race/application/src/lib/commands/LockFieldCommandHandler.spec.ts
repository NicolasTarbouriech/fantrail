import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';

import { LockFieldCommand } from './LockFieldCommand';
import { LockFieldCommandHandler } from './LockFieldCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('LockFieldCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: LockFieldCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getByFieldId: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new LockFieldCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new LockFieldCommand({ fieldId: MEN_FIELD_ID }),
    );
    expect(saved.findField(MEN_FIELD_ID).lockedAt).toEqual(NOW);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new LockFieldCommand({
          ...{ fieldId: MEN_FIELD_ID },
          fieldId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
