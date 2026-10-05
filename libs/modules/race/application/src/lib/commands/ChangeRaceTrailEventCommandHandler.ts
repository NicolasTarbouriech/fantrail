import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceAggregate,
  RaceRepository,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { ChangeRaceTrailEventCommand } from './ChangeRaceTrailEventCommand';

@CommandHandler(ChangeRaceTrailEventCommand)
export class ChangeRaceTrailEventCommandHandler implements IEnhancedCommandHandler<ChangeRaceTrailEventCommand> {
  private readonly _logger = new MonitoringLogger(
    ChangeRaceTrailEventCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _trailEventRepository: TrailEventRepository,
  ) {}

  async execute({
    input,
  }: ChangeRaceTrailEventCommand): Promise<RaceAggregate> {
    if (input.trailEventId) {
      await this._trailEventRepository.getById(input.trailEventId);
    }
    const race = await this._raceRepository.getById(input.raceId);
    race.changeTrailEvent(input.trailEventId);
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race trail event changed', {
      raceId: race.id,
      data: { trailEventId: input.trailEventId },
    });
    return saved;
  }
}
