import { PredictionAggregate } from '../aggregates';
import { FieldId, UserId } from '../types';

export interface CreatePredictionParams {
  userId: UserId;
  fieldId: FieldId;
  pickCount: number;
}

export abstract class PredictionRepository {
  abstract findByUserAndField(
    userId: UserId,
    fieldId: FieldId,
  ): Promise<PredictionAggregate | null>;
  abstract listByUser(userId: UserId): Promise<PredictionAggregate[]>;
  abstract listByField(
    fieldId: FieldId,
    userIdList?: UserId[],
  ): Promise<PredictionAggregate[]>;
  abstract create(params: CreatePredictionParams): Promise<PredictionAggregate>;
  abstract save(prediction: PredictionAggregate): Promise<PredictionAggregate>;
}
