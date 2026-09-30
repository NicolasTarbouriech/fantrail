import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { AddFieldCommand } from './AddFieldCommand';

@CommandHandler(AddFieldCommand)
export class AddFieldCommandHandler implements IEnhancedCommandHandler<AddFieldCommand> {
  private readonly _logger = new MonitoringLogger(AddFieldCommandHandler.name);

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: AddFieldCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    const field = race.addField(input.data);
    const saved = await this._raceRepository.save(race);
    this._logger.info('Field added', {
      raceId: race.id,
      fieldId: field.id,
      data: { gender: field.gender },
    });
    return saved;
  }
}
