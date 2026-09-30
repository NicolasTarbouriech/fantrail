import { QueryHandler } from '@nestjs/cqrs';

import {
  PredictionAggregate,
  PredictionFieldRepository,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListRevealedPredictionsByFieldQuery } from './ListRevealedPredictionsByFieldQuery';

@QueryHandler(ListRevealedPredictionsByFieldQuery)
export class ListRevealedPredictionsByFieldQueryHandler implements IEnhancedQueryHandler<ListRevealedPredictionsByFieldQuery> {
  constructor(
    private readonly _predictionRepository: PredictionRepository,
    private readonly _predictionFieldRepository: PredictionFieldRepository,
  ) {}

  async execute({
    input,
  }: ListRevealedPredictionsByFieldQuery): Promise<PredictionAggregate[]> {
    const field = await this._predictionFieldRepository.getByFieldId(
      input.fieldId,
    );
    field.assertPredictionsRevealed();
    return this._predictionRepository.listByField(
      input.fieldId,
      input.userIdList,
    );
  }
}
