import { GetRaceByFieldIdQuery } from '@trail/modules/race/application';
import { RaceStatus } from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildRaceAggregate,
  buildRunnerId,
  buildStartList,
} from '@trail/modules/race/domain-testing';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { QueryBusResultFieldRepository } from './QueryBusResultFieldRepository';

describe('QueryBusResultFieldRepository', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('knows whether the field is locked and who runs in it', async () => {
    jest.useFakeTimers({ now: new Date('2026-10-16T10:00:00Z') });
    const race = buildRaceAggregate({ status: RaceStatus.Open });
    const startList = buildStartList({ runnerCount: 3 });
    const queryBus = {
      execute: jest.fn((query) =>
        Promise.resolve(
          query instanceof GetRaceByFieldIdQuery ? race : startList,
        ),
      ),
    } as unknown as EnhancedQueryBus;
    const field = await new QueryBusResultFieldRepository(
      queryBus,
    ).getByFieldId(MEN_FIELD_ID);
    expect(() => field.assertLocked()).not.toThrow();
    expect(field.hasRunner(buildRunnerId(3))).toBe(true);
    expect(field.hasRunner(buildRunnerId(4))).toBe(false);
  });
});
