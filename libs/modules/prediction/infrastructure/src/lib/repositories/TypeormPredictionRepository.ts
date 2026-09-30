import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  CreatePredictionParams,
  FieldId,
  PredictionAggregate,
  PredictionNotFoundError,
  PredictionRepository,
  UserId,
} from '@trail/modules/prediction/domain';
import {
  PREDICTION_USER_FIELD_UNIQUE_INDEX,
  PredictionEntity,
  isUniqueViolation,
} from '@trail/shared/database/data-access-main';

import { mapPredictionAggregate } from '../mappers/mapPredictionAggregate';

@Injectable()
export class TypeormPredictionRepository extends PredictionRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(PredictionEntity)
    private readonly _predictionRepository: Repository<PredictionEntity>,
  ) {
    super();
  }

  async findByUserAndField(
    userId: UserId,
    fieldId: FieldId,
  ): Promise<PredictionAggregate | null> {
    const entity = await this._predictionRepository.findOne({
      where: { user_id: userId, field_id: fieldId },
    });
    return entity ? this._mapEntity(entity) : null;
  }

  async listByUser(userId: UserId): Promise<PredictionAggregate[]> {
    const entityList = await this._predictionRepository.find({
      where: { user_id: userId },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async listByField(
    fieldId: FieldId,
    userIdList?: UserId[],
  ): Promise<PredictionAggregate[]> {
    const entityList = await this._predictionRepository.find({
      where: {
        field_id: fieldId,
        ...(userIdList ? { user_id: In(userIdList) } : {}),
      },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async create({
    userId,
    fieldId,
    pickCount,
  }: CreatePredictionParams): Promise<PredictionAggregate> {
    try {
      await this._predictionRepository.insert({
        user_id: userId,
        field_id: fieldId,
        pick_list: Array.from({ length: pickCount }, () => null),
        winner_time_estimate_in_seconds: null,
        finalized_at: null,
      });
    } catch (error) {
      // Two saves at once for the same field: the other one created it, reuse it.
      if (!isUniqueViolation(error, PREDICTION_USER_FIELD_UNIQUE_INDEX)) {
        throw error;
      }
    }
    return this._getExisting(userId, fieldId);
  }

  async save(prediction: PredictionAggregate): Promise<PredictionAggregate> {
    await this._predictionRepository.update(
      { id: prediction.id },
      {
        pick_list: prediction.pickList,
        winner_time_estimate_in_seconds: prediction.winnerTimeEstimateInSeconds,
        finalized_at: prediction.finalizedAt,
      },
    );
    return this._getExisting(prediction.userId, prediction.fieldId);
  }

  private async _getExisting(
    userId: UserId,
    fieldId: FieldId,
  ): Promise<PredictionAggregate> {
    const prediction = await this.findByUserAndField(userId, fieldId);
    if (!prediction) {
      throw new PredictionNotFoundError();
    }
    return prediction;
  }

  private _mapEntity(entity: PredictionEntity): PredictionAggregate {
    const aggregate = mapPredictionAggregate(entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
