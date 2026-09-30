import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { LockRaceCommand } from './LockRaceCommand';

@CommandHandler(LockRaceCommand)
export class LockRaceCommandHandler implements IEnhancedCommandHandler<LockRaceCommand> {
  private readonly _logger = new MonitoringLogger(LockRaceCommandHandler.name);

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: LockRaceCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    race.lock(new Date());
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race locked', { raceId: race.id });
    return saved;
  }
}
