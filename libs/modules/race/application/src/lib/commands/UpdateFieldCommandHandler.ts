import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { UpdateFieldCommand } from './UpdateFieldCommand';

@CommandHandler(UpdateFieldCommand)
export class UpdateFieldCommandHandler implements IEnhancedCommandHandler<UpdateFieldCommand> {
  private readonly _logger = new MonitoringLogger(
    UpdateFieldCommandHandler.name,
  );

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: UpdateFieldCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    race.updateField(input.fieldId, input.data, new Date());
    const saved = await this._raceRepository.save(race);
    this._logger.info('Field updated', {
      raceId: race.id,
      fieldId: input.fieldId,
    });
    return saved;
  }
}
