import { EventPublisher } from '@nestjs/cqrs';
import { QueryFailedError, Repository } from 'typeorm';

import { PredictionNotFoundError } from '@trail/modules/prediction/domain';
import {
  PREDICTION_FIELD_ID,
  PREDICTION_ID,
  PREDICTION_USER_ID,
  buildPredictionAggregate,
  buildPredictionRunnerId,
} from '@trail/modules/prediction/domain-testing';
import { PredictionEntity } from '@trail/shared/database/data-access-main';

import { TypeormPredictionRepository } from './TypeormPredictionRepository';

const ENTITY: PredictionEntity = {
  id: PREDICTION_ID,
  user_id: PREDICTION_USER_ID,
  field_id: PREDICTION_FIELD_ID,
  pick_list: [buildPredictionRunnerId(1), null, null, null, null],
  winner_time_estimate_in_seconds: null,
  finalized_at: null,
  created_at: new Date('2026-10-01T10:00:00Z'),
  updated_at: new Date('2026-10-01T10:00:00Z'),
} as PredictionEntity;

describe('TypeormPredictionRepository', () => {
  let predictionRepository: Repository<PredictionEntity>;
  let repository: TypeormPredictionRepository;

  beforeEach(() => {
    predictionRepository = {
      findOne: jest.fn().mockResolvedValue(ENTITY),
      find: jest.fn().mockResolvedValue([ENTITY]),
      insert: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    } as unknown as Repository<PredictionEntity>;
    const publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormPredictionRepository(
      publisher,
      predictionRepository,
    );
  });

  it('finds the prediction of a user on a field, or null', async () => {
    const prediction = await repository.findByUserAndField(
      PREDICTION_USER_ID,
      PREDICTION_FIELD_ID,
    );
    expect(prediction?.pickList).toEqual(ENTITY.pick_list);
    jest.mocked(predictionRepository.findOne).mockResolvedValueOnce(null);
    await expect(
      repository.findByUserAndField(PREDICTION_USER_ID, PREDICTION_FIELD_ID),
    ).resolves.toBeNull();
  });

  it('lists predictions by user and by field', async () => {
    expect(await repository.listByUser(PREDICTION_USER_ID)).toHaveLength(1);
    await repository.listByField(PREDICTION_FIELD_ID);
    expect(predictionRepository.find).toHaveBeenLastCalledWith({
      where: { field_id: PREDICTION_FIELD_ID },
    });
    await repository.listByField(PREDICTION_FIELD_ID, [PREDICTION_USER_ID]);
    expect(predictionRepository.find).toHaveBeenLastCalledWith({
      where: { field_id: PREDICTION_FIELD_ID, user_id: expect.anything() },
    });
  });

  it('creates an empty prediction with one slot per pick', async () => {
    await repository.create({
      userId: PREDICTION_USER_ID,
      fieldId: PREDICTION_FIELD_ID,
      pickCount: 5,
    });
    expect(predictionRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({ pick_list: [null, null, null, null, null] }),
    );
  });

  it('reuses the prediction created by a concurrent save', async () => {
    jest.mocked(predictionRepository.insert).mockRejectedValueOnce(
      new QueryFailedError(
        'INSERT',
        [],
        Object.assign(new Error('duplicate'), {
          code: '23505',
          constraint: 'UQ_predictions_user_field',
        }),
      ),
    );
    const prediction = await repository.create({
      userId: PREDICTION_USER_ID,
      fieldId: PREDICTION_FIELD_ID,
      pickCount: 5,
    });
    expect(prediction.id).toBe(PREDICTION_ID);
  });

  it('rethrows other errors and throws when the prediction vanished', async () => {
    jest
      .mocked(predictionRepository.insert)
      .mockRejectedValueOnce(new Error('connection lost'));
    await expect(
      repository.create({
        userId: PREDICTION_USER_ID,
        fieldId: PREDICTION_FIELD_ID,
        pickCount: 5,
      }),
    ).rejects.toThrow('connection lost');
    jest.mocked(predictionRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.save(buildPredictionAggregate())).rejects.toThrow(
      PredictionNotFoundError,
    );
  });

  it('saves the picks, the time and the finalization date', async () => {
    const finalizedAt = new Date('2026-10-14T10:00:00Z');
    await repository.save(
      buildPredictionAggregate({
        winnerTimeEstimateInSeconds: 86400,
        finalizedAt,
      }),
    );
    expect(predictionRepository.update).toHaveBeenCalledWith(
      { id: PREDICTION_ID },
      {
        pick_list: [null, null, null, null, null],
        winner_time_estimate_in_seconds: 86400,
        finalized_at: finalizedAt,
      },
    );
  });
});
