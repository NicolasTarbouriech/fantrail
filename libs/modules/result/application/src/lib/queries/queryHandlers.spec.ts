import { FieldResultRepository } from '@trail/modules/result/domain';
import {
  RESULT_FIELD_ID,
  buildFieldResultAggregate,
} from '@trail/modules/result/domain-testing';

import { GetFieldResultQuery } from './GetFieldResultQuery';
import { GetFieldResultQueryHandler } from './GetFieldResultQueryHandler';
import { ListFieldResultsQuery } from './ListFieldResultsQuery';
import { ListFieldResultsQueryHandler } from './ListFieldResultsQueryHandler';

describe('result query handlers', () => {
  const result = buildFieldResultAggregate();
  const fieldResultRepository = {
    getByFieldId: jest.fn().mockResolvedValue(result),
    listByFieldIdList: jest.fn().mockResolvedValue([result]),
  } as unknown as FieldResultRepository;

  it('GetFieldResultQueryHandler reads the latest result of a field', async () => {
    await expect(
      new GetFieldResultQueryHandler(fieldResultRepository).execute(
        new GetFieldResultQuery({ fieldId: RESULT_FIELD_ID }),
      ),
    ).resolves.toBe(result);
  });

  it('ListFieldResultsQueryHandler reads the results of several fields', async () => {
    await expect(
      new ListFieldResultsQueryHandler(fieldResultRepository).execute(
        new ListFieldResultsQuery({ fieldIdList: [RESULT_FIELD_ID] }),
      ),
    ).resolves.toEqual([result]);
  });
});
