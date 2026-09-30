import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { RenameLeagueCommand } from './RenameLeagueCommand';

@CommandHandler(RenameLeagueCommand)
export class RenameLeagueCommandHandler implements IEnhancedCommandHandler<RenameLeagueCommand> {
  private readonly _logger = new MonitoringLogger(
    RenameLeagueCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: RenameLeagueCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.rename(input.actor, input.name);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League renamed', {
      leagueId: league.id,
      userId: input.actor.userId,
    });
    return saved;
  }
}
