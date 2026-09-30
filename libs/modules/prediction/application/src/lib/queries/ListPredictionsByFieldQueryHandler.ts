import { QueryHandler } from '@nestjs/cqrs';

import {
  PredictionAggregate,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListPredictionsByFieldQuery } from './ListPredictionsByFieldQuery';

@QueryHandler(ListPredictionsByFieldQuery)
export class ListPredictionsByFieldQueryHandler implements IEnhancedQueryHandler<ListPredictionsByFieldQuery> {
  constructor(private readonly _predictionRepository: PredictionRepository) {}

  execute({
    input,
  }: ListPredictionsByFieldQuery): Promise<PredictionAggregate[]> {
    return this._predictionRepository.listByField(
      input.fieldId,
      input.userIdList,
    );
  }
}
