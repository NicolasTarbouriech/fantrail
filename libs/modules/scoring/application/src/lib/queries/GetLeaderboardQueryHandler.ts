import { QueryHandler } from '@nestjs/cqrs';

import {
  FieldScoreRepository,
  LeaderboardCalculator,
  LeaderboardEntry,
} from '@trail/modules/scoring/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetLeaderboardQuery } from './GetLeaderboardQuery';

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardQueryHandler implements IEnhancedQueryHandler<GetLeaderboardQuery> {
  constructor(private readonly _fieldScoreRepository: FieldScoreRepository) {}

  async execute({ input }: GetLeaderboardQuery): Promise<LeaderboardEntry[]> {
    const scoreList = await this._fieldScoreRepository.listByFieldIdList(
      input.fieldIdList,
      input.userIdList,
    );
    return LeaderboardCalculator.rank(input.userIdList, scoreList);
  }
}
