import { CommandHandler } from '@nestjs/cqrs';

import { LeagueRepository } from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { DeleteLeagueCommand } from './DeleteLeagueCommand';

@CommandHandler(DeleteLeagueCommand)
export class DeleteLeagueCommandHandler implements IEnhancedCommandHandler<DeleteLeagueCommand> {
  private readonly _logger = new MonitoringLogger(
    DeleteLeagueCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: DeleteLeagueCommand): Promise<boolean> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.assertDeletableBy(input.actor);
    await this._leagueRepository.delete(league.id);
    this._logger.info('League deleted', {
      leagueId: league.id,
      userId: input.actor.userId,
    });
    return true;
  }
}
