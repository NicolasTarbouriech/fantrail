import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { RegenerateLeagueInviteCodeCommand } from './RegenerateLeagueInviteCodeCommand';

@CommandHandler(RegenerateLeagueInviteCodeCommand)
export class RegenerateLeagueInviteCodeCommandHandler implements IEnhancedCommandHandler<RegenerateLeagueInviteCodeCommand> {
  private readonly _logger = new MonitoringLogger(
    RegenerateLeagueInviteCodeCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({
    input,
  }: RegenerateLeagueInviteCodeCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.regenerateInviteCode(input.actor);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League invite code regenerated', {
      leagueId: league.id,
      userId: input.actor.userId,
    });
    return saved;
  }
}
