import { QueryHandler } from '@nestjs/cqrs';

import {
  PredictionField,
  PredictionFieldRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetPredictionFieldQuery } from './GetPredictionFieldQuery';

@QueryHandler(GetPredictionFieldQuery)
export class GetPredictionFieldQueryHandler implements IEnhancedQueryHandler<GetPredictionFieldQuery> {
  constructor(
    private readonly _predictionFieldRepository: PredictionFieldRepository,
  ) {}

  execute({ input }: GetPredictionFieldQuery): Promise<PredictionField> {
    return this._predictionFieldRepository.getByFieldId(input.fieldId);
  }
}
