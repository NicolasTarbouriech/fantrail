import { QueryHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueNotFoundError,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetLeagueByInviteCodeQuery } from './GetLeagueByInviteCodeQuery';

@QueryHandler(GetLeagueByInviteCodeQuery)
export class GetLeagueByInviteCodeQueryHandler implements IEnhancedQueryHandler<GetLeagueByInviteCodeQuery> {
  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({
    input,
  }: GetLeagueByInviteCodeQuery): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.findByInviteCode(
      input.inviteCode,
    );
    if (!league) {
      throw new LeagueNotFoundError();
    }
    return league;
  }
}
