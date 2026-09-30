import { ListPredictionsByFieldQuery } from '@trail/modules/prediction/application';
import {
  buildPredictionAggregate,
  buildPredictionRunnerId,
} from '@trail/modules/prediction/domain-testing';
import {
  GetRaceByFieldIdQuery,
  GetStartListQuery,
} from '@trail/modules/race/application';
import {
  MEN_FIELD_ID,
  buildRaceAggregate,
  buildStartList,
} from '@trail/modules/race/domain-testing';
import { GetFieldResultQuery } from '@trail/modules/result/application';
import {
  buildFieldResultAggregate,
  buildFieldResultData,
} from '@trail/modules/result/domain-testing';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { QueryBusFieldScoringSourceRepository } from './QueryBusFieldScoringSourceRepository';

const r = buildPredictionRunnerId;

describe('QueryBusFieldScoringSourceRepository', () => {
  function queryBusReturning(
    result: ReturnType<typeof buildFieldResultAggregate>,
  ) {
    const complete = buildPredictionAggregate({
      pickList: [r(1), r(2), r(3), r(4), r(5)],
      winnerTimeEstimateInSeconds: 86400,
      finalizedAt: new Date('2026-10-10T10:00:00Z'),
    });
    const incomplete = buildPredictionAggregate({
      pickList: [r(1), null, null, null, null],
    });
    return {
      execute: jest.fn((query) => {
        if (query instanceof GetFieldResultQuery)
          return Promise.resolve(result);
        if (query instanceof GetRaceByFieldIdQuery)
          return Promise.resolve(buildRaceAggregate());
        if (query instanceof GetStartListQuery)
          return Promise.resolve(buildStartList());
        if (query instanceof ListPredictionsByFieldQuery)
          return Promise.resolve([complete, incomplete]);
        return Promise.reject(new Error('unexpected query'));
      }),
    } as unknown as EnhancedQueryBus;
  }

  it('keeps only complete predictions', async () => {
    const result = buildFieldResultAggregate({
      version: 2,
      data: buildFieldResultData(),
      publishedAt: new Date(),
    });
    const source = await new QueryBusFieldScoringSourceRepository(
      queryBusReturning(result),
    ).findByFieldId(MEN_FIELD_ID);
    expect(source?.resultVersion).toBe(2);
    expect(source?.timeTolerancePercent).toBe(3);
    expect(source?.predictionList).toHaveLength(1);
    expect(source?.predictionList[0].pickList).toEqual([
      r(1),
      r(2),
      r(3),
      r(4),
      r(5),
    ]);
  });

  it('returns null while no result is published', async () => {
    const source = await new QueryBusFieldScoringSourceRepository(
      queryBusReturning(buildFieldResultAggregate()),
    ).findByFieldId(MEN_FIELD_ID);
    expect(source).toBeNull();
  });
});
