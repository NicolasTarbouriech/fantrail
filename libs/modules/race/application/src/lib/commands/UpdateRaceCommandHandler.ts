import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { UpdateRaceCommand } from './UpdateRaceCommand';

@CommandHandler(UpdateRaceCommand)
export class UpdateRaceCommandHandler implements IEnhancedCommandHandler<UpdateRaceCommand> {
  private readonly _logger = new MonitoringLogger(
    UpdateRaceCommandHandler.name,
  );

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: UpdateRaceCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    race.update(input.data);
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race updated', { raceId: race.id });
    return saved;
  }
}
