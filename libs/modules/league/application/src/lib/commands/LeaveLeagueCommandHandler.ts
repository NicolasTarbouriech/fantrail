import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { LeaveLeagueCommand } from './LeaveLeagueCommand';

@CommandHandler(LeaveLeagueCommand)
export class LeaveLeagueCommandHandler implements IEnhancedCommandHandler<LeaveLeagueCommand> {
  private readonly _logger = new MonitoringLogger(
    LeaveLeagueCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: LeaveLeagueCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.leave(input.userId);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League left', {
      leagueId: league.id,
      userId: input.userId,
    });
    return saved;
  }
}
