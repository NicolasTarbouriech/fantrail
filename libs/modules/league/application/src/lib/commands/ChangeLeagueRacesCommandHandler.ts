import { CommandHandler } from '@nestjs/cqrs';

import {
  LeagueAggregate,
  LeagueRaceRepository,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { ChangeLeagueRacesCommand } from './ChangeLeagueRacesCommand';

@CommandHandler(ChangeLeagueRacesCommand)
export class ChangeLeagueRacesCommandHandler implements IEnhancedCommandHandler<ChangeLeagueRacesCommand> {
  private readonly _logger = new MonitoringLogger(
    ChangeLeagueRacesCommandHandler.name,
  );

  constructor(
    private readonly _leagueRepository: LeagueRepository,
    private readonly _leagueRaceRepository: LeagueRaceRepository,
  ) {}

  async execute({ input }: ChangeLeagueRacesCommand): Promise<LeagueAggregate> {
    const [league, availableRaceIdList] = await Promise.all([
      this._leagueRepository.getById(input.leagueId),
      this._leagueRaceRepository.listAvailableRaceIds(),
    ]);
    league.changeRaces(input.actor, input.raceIdList, availableRaceIdList);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League races changed', {
      leagueId: league.id,
      userId: input.actor.userId,
      data: { raceCount: league.raceIdList.length },
    });
    return saved;
  }
}
