import { EntityManager, Repository } from 'typeorm';

import {
  SCORING_FIELD_ID,
  buildPlayerFieldScore,
  buildScoringUserId,
} from '@trail/modules/scoring/domain-testing';
import { FieldScoreEntity } from '@trail/shared/database/data-access-main';

import { mapFieldScoreEntity } from '../mappers/mapPlayerFieldScore';
import { TypeormFieldScoreRepository } from './TypeormFieldScoreRepository';

describe('TypeormFieldScoreRepository', () => {
  const entity = mapFieldScoreEntity(buildPlayerFieldScore());
  let manager: EntityManager;
  let fieldScoreRepository: Repository<FieldScoreEntity>;
  let repository: TypeormFieldScoreRepository;

  beforeEach(() => {
    manager = {
      delete: jest.fn(),
      insert: jest.fn(),
    } as unknown as EntityManager;
    fieldScoreRepository = {
      manager: { transaction: jest.fn((work) => work(manager)) },
      find: jest.fn().mockResolvedValue([entity]),
      findOne: jest.fn().mockResolvedValue(entity),
    } as unknown as Repository<FieldScoreEntity>;
    repository = new TypeormFieldScoreRepository(fieldScoreRepository);
  });

  it('replaces every score of the field in one transaction', async () => {
    await repository.replaceForField(SCORING_FIELD_ID, [
      buildPlayerFieldScore(),
    ]);
    expect(manager.delete).toHaveBeenCalledWith(FieldScoreEntity, {
      field_id: SCORING_FIELD_ID,
    });
    expect(manager.insert).toHaveBeenCalledWith(FieldScoreEntity, [
      expect.objectContaining({ field_id: SCORING_FIELD_ID }),
    ]);
  });

  it('only deletes when nobody scored', async () => {
    await repository.replaceForField(SCORING_FIELD_ID, []);
    expect(manager.delete).toHaveBeenCalled();
    expect(manager.insert).not.toHaveBeenCalled();
  });

  it('lists scores of some fields and users', async () => {
    expect(await repository.listByFieldIdList([])).toEqual([]);
    expect(await repository.listByFieldIdList([SCORING_FIELD_ID])).toHaveLength(
      1,
    );
    await repository.listByFieldIdList(
      [SCORING_FIELD_ID],
      [buildScoringUserId(1)],
    );
    expect(fieldScoreRepository.find).toHaveBeenLastCalledWith({
      where: { field_id: expect.anything(), user_id: expect.anything() },
    });
  });

  it('finds the score of a user on a field, or null', async () => {
    expect(
      (
        await repository.findByUserAndField(
          buildScoringUserId(1),
          SCORING_FIELD_ID,
        )
      )?.total,
    ).toBe(entity.total);
    jest.mocked(fieldScoreRepository.findOne).mockResolvedValueOnce(null);
    await expect(
      repository.findByUserAndField(buildScoringUserId(1), SCORING_FIELD_ID),
    ).resolves.toBeNull();
  });
});
