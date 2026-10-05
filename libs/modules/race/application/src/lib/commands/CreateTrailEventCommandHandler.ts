import { CommandHandler } from '@nestjs/cqrs';

import {
  TrailEventAggregate,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { CreateTrailEventCommand } from './CreateTrailEventCommand';

@CommandHandler(CreateTrailEventCommand)
export class CreateTrailEventCommandHandler implements IEnhancedCommandHandler<CreateTrailEventCommand> {
  private readonly _logger = new MonitoringLogger(
    CreateTrailEventCommandHandler.name,
  );

  constructor(private readonly _trailEventRepository: TrailEventRepository) {}

  async execute({
    input,
  }: CreateTrailEventCommand): Promise<TrailEventAggregate> {
    const trailEvent = await this._trailEventRepository.create(input.data);
    this._logger.info('Trail event created', {
      data: {
        trailEventId: trailEvent.id,
        name: trailEvent.name,
        hasLogo: trailEvent.logo !== null,
      },
    });
    return trailEvent;
  }
}
