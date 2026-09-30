import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { CancelRaceCommand } from './CancelRaceCommand';

@CommandHandler(CancelRaceCommand)
export class CancelRaceCommandHandler implements IEnhancedCommandHandler<CancelRaceCommand> {
  private readonly _logger = new MonitoringLogger(
    CancelRaceCommandHandler.name,
  );

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: CancelRaceCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    race.cancel();
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race cancelled', { raceId: race.id });
    return saved;
  }
}
