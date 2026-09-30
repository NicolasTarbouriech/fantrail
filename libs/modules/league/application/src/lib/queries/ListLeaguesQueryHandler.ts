import { QueryHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListLeaguesQuery } from './ListLeaguesQuery';

@QueryHandler(ListLeaguesQuery)
export class ListLeaguesQueryHandler implements IEnhancedQueryHandler<ListLeaguesQuery> {
  constructor(private readonly _leagueRepository: LeagueRepository) {}

  execute({ input }: ListLeaguesQuery): Promise<LeagueAggregate[]> {
    return this._leagueRepository.list({
      visibility: input.visibility,
      memberId: input.memberId,
    });
  }
}
