import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { LockFieldCommand } from './LockFieldCommand';

@CommandHandler(LockFieldCommand)
export class LockFieldCommandHandler implements IEnhancedCommandHandler<LockFieldCommand> {
  private readonly _logger = new MonitoringLogger(LockFieldCommandHandler.name);

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: LockFieldCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    race.lockField(input.fieldId, new Date());
    const saved = await this._raceRepository.save(race);
    this._logger.info('Field locked', {
      raceId: race.id,
      fieldId: input.fieldId,
    });
    return saved;
  }
}
