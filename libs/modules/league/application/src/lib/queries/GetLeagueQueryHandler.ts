import { QueryHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetLeagueQuery } from './GetLeagueQuery';

@QueryHandler(GetLeagueQuery)
export class GetLeagueQueryHandler implements IEnhancedQueryHandler<GetLeagueQuery> {
  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: GetLeagueQuery): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.assertViewableBy(input.viewer);
    return league;
  }
}
