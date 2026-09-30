import { ZodError } from 'zod';

import {
  Gender,
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  buildField,
  buildFieldData,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';

import { AddFieldCommand } from './AddFieldCommand';
import { AddFieldCommandHandler } from './AddFieldCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('AddFieldCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let handler: AddFieldCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({
      status: RaceStatus.Draft,
      fieldList: [buildField()],
    });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    handler = new AddFieldCommandHandler(raceRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the race and saves it', async () => {
    const saved = await handler.execute(
      new AddFieldCommand({
        raceId: RACE_ID,
        data: buildFieldData({ gender: Gender.Women }),
      }),
    );
    expect(saved.fieldList.map(({ gender }) => gender)).toEqual([
      Gender.Men,
      Gender.Women,
    ]);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new AddFieldCommand({
          ...{
            raceId: RACE_ID,
            data: buildFieldData({ gender: Gender.Women }),
          },
          raceId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
