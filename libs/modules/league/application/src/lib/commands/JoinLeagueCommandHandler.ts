import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { JoinLeagueCommand } from './JoinLeagueCommand';

@CommandHandler(JoinLeagueCommand)
export class JoinLeagueCommandHandler implements IEnhancedCommandHandler<JoinLeagueCommand> {
  private readonly _logger = new MonitoringLogger(
    JoinLeagueCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: JoinLeagueCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.join(input.userId, new Date());
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League joined', {
      leagueId: league.id,
      userId: input.userId,
    });
    return saved;
  }
}
