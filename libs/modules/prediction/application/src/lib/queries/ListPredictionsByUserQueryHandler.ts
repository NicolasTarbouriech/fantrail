import { QueryHandler } from '@nestjs/cqrs';

import {
  PredictionAggregate,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListPredictionsByUserQuery } from './ListPredictionsByUserQuery';

@QueryHandler(ListPredictionsByUserQuery)
export class ListPredictionsByUserQueryHandler implements IEnhancedQueryHandler<ListPredictionsByUserQuery> {
  constructor(private readonly _predictionRepository: PredictionRepository) {}

  execute({
    input,
  }: ListPredictionsByUserQuery): Promise<PredictionAggregate[]> {
    return this._predictionRepository.listByUser(input.userId);
  }
}
