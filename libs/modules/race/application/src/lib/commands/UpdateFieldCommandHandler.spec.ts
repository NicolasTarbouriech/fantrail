import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildFieldData,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';

import { UpdateFieldCommand } from './UpdateFieldCommand';
import { UpdateFieldCommandHandler } from './UpdateFieldCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('UpdateFieldCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: UpdateFieldCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    raceRepository = {
      getByFieldId: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new UpdateFieldCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new UpdateFieldCommand({
        fieldId: MEN_FIELD_ID,
        data: buildFieldData({ lockAt: new Date('2026-10-15T17:00:00Z') }),
      }),
    );
    expect(saved.findField(MEN_FIELD_ID).lockAt).toEqual(
      new Date('2026-10-15T17:00:00Z'),
    );
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new UpdateFieldCommand({
          ...{
            fieldId: MEN_FIELD_ID,
            data: buildFieldData({ lockAt: new Date('2026-10-15T17:00:00Z') }),
          },
          fieldId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
