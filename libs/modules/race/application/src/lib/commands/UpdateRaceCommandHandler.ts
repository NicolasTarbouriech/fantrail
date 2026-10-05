import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceAggregate,
  RaceRepository,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { UpdateRaceCommand } from './UpdateRaceCommand';

@CommandHandler(UpdateRaceCommand)
export class UpdateRaceCommandHandler implements IEnhancedCommandHandler<UpdateRaceCommand> {
  private readonly _logger = new MonitoringLogger(
    UpdateRaceCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _trailEventRepository: TrailEventRepository,
  ) {}

  async execute({ input }: UpdateRaceCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    if (input.data.trailEventId) {
      await this._trailEventRepository.getById(input.data.trailEventId);
    }
    race.update(input.data);
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race updated', {
      raceId: race.id,
      data: { trailEventId: saved.data.trailEventId },
    });
    return saved;
  }
}
