import { QueryHandler } from '@nestjs/cqrs';

import {
  FieldScoreRepository,
  PlayerFieldScore,
} from '@trail/modules/scoring/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListFieldScoresQuery } from './ListFieldScoresQuery';

@QueryHandler(ListFieldScoresQuery)
export class ListFieldScoresQueryHandler implements IEnhancedQueryHandler<ListFieldScoresQuery> {
  constructor(private readonly _fieldScoreRepository: FieldScoreRepository) {}

  execute({ input }: ListFieldScoresQuery): Promise<PlayerFieldScore[]> {
    return this._fieldScoreRepository.listByFieldIdList(
      input.fieldIdList,
      input.userIdList,
    );
  }
}
