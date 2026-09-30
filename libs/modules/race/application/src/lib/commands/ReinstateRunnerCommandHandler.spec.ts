import { ZodError } from 'zod';

import {
  FieldLockedError,
  RaceAggregate,
  RaceRepository,
  RaceStatus,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildRaceAggregate,
  buildRunnerId,
  buildStartList,
} from '@trail/modules/race/domain-testing';

import { ReinstateRunnerCommand } from './ReinstateRunnerCommand';
import { ReinstateRunnerCommandHandler } from './ReinstateRunnerCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('ReinstateRunnerCommandHandler', () => {
  let race: RaceAggregate;
  let startList: StartListAggregate;
  let startListRepository: StartListRepository;
  let handler: ReinstateRunnerCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    startList = buildStartList();
    startList.withdrawRunner(
      buildRunnerId(1),
      race.findField(MEN_FIELD_ID),
      NOW,
    );
    const raceRepository = {
      getByFieldId: jest.fn().mockResolvedValue(race),
    } as unknown as RaceRepository;
    startListRepository = {
      getByFieldId: jest.fn().mockResolvedValue(startList),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as StartListRepository;
    handler = new ReinstateRunnerCommandHandler(
      raceRepository,
      startListRepository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the start list and saves it', async () => {
    const saved = await handler.execute(
      new ReinstateRunnerCommand({
        fieldId: MEN_FIELD_ID,
        runnerId: buildRunnerId(1),
      }),
    );
    expect(saved.findRunner(buildRunnerId(1)).isWithdrawn).toBe(false);
    expect(startListRepository.save).toHaveBeenCalledWith(startList);
  });

  it('refuses once the field is locked', async () => {
    jest.setSystemTime(new Date('2026-10-15T18:00:00Z'));
    await expect(
      handler.execute(
        new ReinstateRunnerCommand({
          fieldId: MEN_FIELD_ID,
          runnerId: buildRunnerId(1),
        }),
      ),
    ).rejects.toThrow(FieldLockedError);
    expect(startListRepository.save).not.toHaveBeenCalled();
  });

  it('rejects an invalid input', () => {
    expect(
      () =>
        new ReinstateRunnerCommand({
          ...{ fieldId: MEN_FIELD_ID, runnerId: buildRunnerId(1) },
          fieldId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
