import { CommandHandler } from '@nestjs/cqrs';

import {
  InviteCodeGenerator,
  LeagueAggregate,
  LeagueRaceAssertion,
  LeagueRaceRepository,
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

  constructor(
    private readonly _leagueRepository: LeagueRepository,
    private readonly _leagueRaceRepository: LeagueRaceRepository,
  ) {}

  async execute({ input }: CreateLeagueCommand): Promise<LeagueAggregate> {
    const raceIdList = LeagueRaceAssertion.assertSelection(
      input.raceIdList,
      await this._leagueRaceRepository.listAvailableRaceIds(),
    );
    const league = await this._leagueRepository.create({
      name: input.name,
      visibility: input.visibility,
      ownerId: input.ownerId,
      inviteCode: InviteCodeGenerator.generate(),
      raceIdList,
    });
    this._logger.info('League created', {
      leagueId: league.id,
      userId: input.ownerId,
      data: { visibility: league.visibility, raceCount: raceIdList.length },
    });
    return league;
  }
}
