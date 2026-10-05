import { CommandHandler } from '@nestjs/cqrs';

import { LeagueRepository } from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { RemoveRaceFromLeaguesCommand } from './RemoveRaceFromLeaguesCommand';

@CommandHandler(RemoveRaceFromLeaguesCommand)
export class RemoveRaceFromLeaguesCommandHandler implements IEnhancedCommandHandler<RemoveRaceFromLeaguesCommand> {
  private readonly _logger = new MonitoringLogger(
    RemoveRaceFromLeaguesCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({ input }: RemoveRaceFromLeaguesCommand): Promise<void> {
    const leagueList = await this._leagueRepository.list({
      raceId: input.raceId,
    });
    for (const league of leagueList) {
      league.removeRace(input.raceId);
      await this._leagueRepository.save(league);
    }
    this._logger.info('Deleted race removed from leagues', {
      raceId: input.raceId,
      data: { leagueCount: leagueList.length },
    });
  }
}
