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

import { WithdrawRunnerCommand } from './WithdrawRunnerCommand';
import { WithdrawRunnerCommandHandler } from './WithdrawRunnerCommandHandler';

const NOW = new Date('2026-10-14T10:00:00Z');

describe('WithdrawRunnerCommandHandler', () => {
  let race: RaceAggregate;
  let startList: StartListAggregate;
  let startListRepository: StartListRepository;
  let handler: WithdrawRunnerCommandHandler;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    race = buildRaceAggregate({ status: RaceStatus.Open });
    startList = buildStartList();
    const raceRepository = {
      getByFieldId: jest.fn().mockResolvedValue(race),
    } as unknown as RaceRepository;
    startListRepository = {
      getByFieldId: jest.fn().mockResolvedValue(startList),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as StartListRepository;
    handler = new WithdrawRunnerCommandHandler(
      raceRepository,
      startListRepository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('changes the start list and saves it', async () => {
    const saved = await handler.execute(
      new WithdrawRunnerCommand({
        fieldId: MEN_FIELD_ID,
        runnerId: buildRunnerId(1),
      }),
    );
    expect(saved.findRunner(buildRunnerId(1)).withdrawnAt).toEqual(NOW);
    expect(startListRepository.save).toHaveBeenCalledWith(startList);
  });

  it('refuses once the field is locked', async () => {
    jest.setSystemTime(new Date('2026-10-15T18:00:00Z'));
    await expect(
      handler.execute(
        new WithdrawRunnerCommand({
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
        new WithdrawRunnerCommand({
          ...{ fieldId: MEN_FIELD_ID, runnerId: buildRunnerId(1) },
          fieldId: 'not-a-uuid',
        }),
    ).toThrow(ZodError);
  });
});
