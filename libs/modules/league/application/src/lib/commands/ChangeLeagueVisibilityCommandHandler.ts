import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { ChangeLeagueVisibilityCommand } from './ChangeLeagueVisibilityCommand';

@CommandHandler(ChangeLeagueVisibilityCommand)
export class ChangeLeagueVisibilityCommandHandler implements IEnhancedCommandHandler<ChangeLeagueVisibilityCommand> {
  private readonly _logger = new MonitoringLogger(
    ChangeLeagueVisibilityCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({
    input,
  }: ChangeLeagueVisibilityCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.changeVisibility(input.actor, input.visibility);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League visibility changed', {
      leagueId: league.id,
      userId: input.actor.userId,
      data: { visibility: input.visibility },
    });
    return saved;
  }
}
