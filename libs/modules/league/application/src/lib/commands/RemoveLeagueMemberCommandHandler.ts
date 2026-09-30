import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { RemoveLeagueMemberCommand } from './RemoveLeagueMemberCommand';

@CommandHandler(RemoveLeagueMemberCommand)
export class RemoveLeagueMemberCommandHandler implements IEnhancedCommandHandler<RemoveLeagueMemberCommand> {
  private readonly _logger = new MonitoringLogger(
    RemoveLeagueMemberCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({
    input,
  }: RemoveLeagueMemberCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.getById(input.leagueId);
    league.removeMember(input.actor, input.userId);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League member removed', {
      leagueId: league.id,
      userId: input.actor.userId,
      data: { removedUserId: input.userId },
    });
    return saved;
  }
}
