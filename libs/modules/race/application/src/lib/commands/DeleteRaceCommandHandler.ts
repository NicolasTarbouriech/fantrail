import { CommandHandler } from '@nestjs/cqrs';

import { RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { DeleteRaceCommand } from './DeleteRaceCommand';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceCommandHandler implements IEnhancedCommandHandler<DeleteRaceCommand> {
  private readonly _logger = new MonitoringLogger(
    DeleteRaceCommandHandler.name,
  );

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: DeleteRaceCommand): Promise<void> {
    const race = await this._raceRepository.getById(input.raceId);
    race.delete(new Date());
    await this._raceRepository.delete(race);
    race.commit();
    this._logger.info('Race deleted', {
      raceId: race.id,
      data: { fieldCount: race.fieldList.length },
    });
  }
}
