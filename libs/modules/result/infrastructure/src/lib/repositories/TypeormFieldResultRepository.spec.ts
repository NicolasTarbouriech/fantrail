import { EventPublisher } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

import {
  RESULT_FIELD_ID,
  buildFieldResultAggregate,
  buildFieldResultData,
  buildResultField,
} from '@trail/modules/result/domain-testing';
import { FieldResultEntity } from '@trail/shared/database/data-access-main';

import { TypeormFieldResultRepository } from './TypeormFieldResultRepository';

const OTHER_FIELD_ID = '33333333-3333-4333-8333-333333333333';
const PUBLISHED_AT = new Date('2026-10-17T08:00:00Z');
const data = buildFieldResultData();
const ENTITY = {
  field_id: RESULT_FIELD_ID,
  version: 2,
  ranking_list: data.rankingList,
  winner_time_in_seconds: data.winnerTimeInSeconds,
  dnf_runner_id_list: data.dnfRunnerIdList,
  published_at: PUBLISHED_AT,
} as FieldResultEntity;

describe('TypeormFieldResultRepository', () => {
  let fieldResultRepository: Repository<FieldResultEntity>;
  let repository: TypeormFieldResultRepository;

  beforeEach(() => {
    fieldResultRepository = {
      findOne: jest.fn().mockResolvedValue(ENTITY),
      find: jest.fn().mockResolvedValue([ENTITY]),
      insert: jest.fn().mockResolvedValue(undefined),
    } as unknown as Repository<FieldResultEntity>;
    const publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormFieldResultRepository(
      publisher,
      fieldResultRepository,
    );
  });

  it('reads the latest version, or an unpublished result', async () => {
    const result = await repository.getByFieldId(RESULT_FIELD_ID);
    expect(result).toMatchObject({
      version: 2,
      isPublished: true,
      publishedAt: PUBLISHED_AT,
    });
    expect(result.data).toEqual(data);
    jest.mocked(fieldResultRepository.findOne).mockResolvedValueOnce(null);
    expect(await repository.getByFieldId(RESULT_FIELD_ID)).toMatchObject({
      version: 0,
      isPublished: false,
    });
  });

  it('lists the latest version of several fields', async () => {
    const [published, unpublished] = await repository.listByFieldIdList([
      RESULT_FIELD_ID,
      OTHER_FIELD_ID,
    ]);
    expect(published.version).toBe(2);
    expect(unpublished).toMatchObject({
      fieldId: OTHER_FIELD_ID,
      isPublished: false,
    });
  });

  it('appends the new version', async () => {
    const result = buildFieldResultAggregate({
      version: 2,
      data,
      publishedAt: PUBLISHED_AT,
    });
    result.publishResult(data, buildResultField(), PUBLISHED_AT);
    await repository.save(result);
    expect(fieldResultRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        field_id: RESULT_FIELD_ID,
        version: 3,
        ranking_list: data.rankingList,
      }),
    );
  });

  it('writes nothing for an unpublished result', async () => {
    await repository.save(buildFieldResultAggregate());
    expect(fieldResultRepository.insert).not.toHaveBeenCalled();
  });
});
