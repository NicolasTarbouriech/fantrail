import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceAggregate,
  RaceRepository,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { CreateRaceCommand } from './CreateRaceCommand';

@CommandHandler(CreateRaceCommand)
export class CreateRaceCommandHandler implements IEnhancedCommandHandler<CreateRaceCommand> {
  private readonly _logger = new MonitoringLogger(
    CreateRaceCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _trailEventRepository: TrailEventRepository,
  ) {}

  async execute({ input }: CreateRaceCommand): Promise<RaceAggregate> {
    if (input.data.trailEventId) {
      await this._trailEventRepository.getById(input.data.trailEventId);
    }
    const race = await this._raceRepository.create(input.data);
    this._logger.info('Race created', {
      raceId: race.id,
      data: {
        name: race.name,
        pickCount: race.pickCount,
        trailEventId: race.data.trailEventId,
      },
    });
    return race;
  }
}
