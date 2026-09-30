import { CommandHandler } from '@nestjs/cqrs';

import {
  InviteCodeGenerator,
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { CreateLeagueCommand } from './CreateLeagueCommand';

@CommandHandler(CreateLeagueCommand)
export class CreateLeagueCommandHandler implements IEnhancedCommandHandler<CreateLeagueCommand> {
  private readonly _logger = new MonitoringLogger(
    CreateLeagueCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: CreateLeagueCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.create({
      name: input.name,
      visibility: input.visibility,
      ownerId: input.ownerId,
      inviteCode: InviteCodeGenerator.generate(),
    });
    this._logger.info('League created', {
      leagueId: league.id,
      userId: input.ownerId,
      data: { visibility: league.visibility },
    });
    return league;
  }
}
