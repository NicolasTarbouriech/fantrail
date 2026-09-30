import {
  GetRaceByFieldIdQuery,
  GetStartListQuery,
} from '@trail/modules/race/application';
import { RaceStatus } from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildField,
  buildRaceAggregate,
  buildRunnerId,
  buildStartList,
} from '@trail/modules/race/domain-testing';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { QueryBusPredictionFieldRepository } from './QueryBusPredictionFieldRepository';

describe('QueryBusPredictionFieldRepository', () => {
  const NOW = new Date('2026-10-14T10:00:00Z');

  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds the field context from the race and its start list', async () => {
    jest.useFakeTimers({ now: NOW });
    const startList = buildStartList({ runnerCount: 3 });
    startList.withdrawRunner(buildRunnerId(2), buildField(), NOW);
    const race = buildRaceAggregate({ status: RaceStatus.Open });
    const queryBus = {
      execute: jest.fn((query) =>
        Promise.resolve(
          query instanceof GetRaceByFieldIdQuery ? race : startList,
        ),
      ),
    } as unknown as EnhancedQueryBus;
    const field = await new QueryBusPredictionFieldRepository(
      queryBus,
    ).getByFieldId(MEN_FIELD_ID);
    expect(field).toMatchObject({
      fieldId: MEN_FIELD_ID,
      pickCount: 5,
      isOpen: true,
    });
    expect(field.hasRunner(buildRunnerId(3))).toBe(true);
    expect(field.isWithdrawn(buildRunnerId(2))).toBe(true);
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(GetStartListQuery),
    );
  });
});
