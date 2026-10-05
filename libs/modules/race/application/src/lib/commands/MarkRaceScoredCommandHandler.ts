import { CommandHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { MarkRaceScoredCommand } from './MarkRaceScoredCommand';

@CommandHandler(MarkRaceScoredCommand)
export class MarkRaceScoredCommandHandler implements IEnhancedCommandHandler<MarkRaceScoredCommand> {
  private readonly _logger = new MonitoringLogger(
    MarkRaceScoredCommandHandler.name,
  );

  constructor(private readonly _raceRepository: RaceRepository) {}

  async execute({ input }: MarkRaceScoredCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    race.markScored(new Date());
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race marked scored', { raceId: race.id });
    return saved;
  }
}
