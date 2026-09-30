import { QueryHandler } from '@nestjs/cqrs';

import {
  PredictionAggregate,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetPredictionQuery } from './GetPredictionQuery';

@QueryHandler(GetPredictionQuery)
export class GetPredictionQueryHandler implements IEnhancedQueryHandler<GetPredictionQuery> {
  constructor(private readonly _predictionRepository: PredictionRepository) {}

  execute({ input }: GetPredictionQuery): Promise<PredictionAggregate | null> {
    return this._predictionRepository.findByUserAndField(
      input.userId,
      input.fieldId,
    );
  }
}
