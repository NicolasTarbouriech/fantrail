import { QueryHandler } from '@nestjs/cqrs';

import {
  FieldScoreRepository,
  PlayerFieldScore,
} from '@trail/modules/scoring/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetPlayerFieldScoreQuery } from './GetPlayerFieldScoreQuery';

@QueryHandler(GetPlayerFieldScoreQuery)
export class GetPlayerFieldScoreQueryHandler implements IEnhancedQueryHandler<GetPlayerFieldScoreQuery> {
  constructor(private readonly _fieldScoreRepository: FieldScoreRepository) {}

  execute({
    input,
  }: GetPlayerFieldScoreQuery): Promise<PlayerFieldScore | null> {
    return this._fieldScoreRepository.findByUserAndField(
      input.userId,
      input.fieldId,
    );
  }
}
