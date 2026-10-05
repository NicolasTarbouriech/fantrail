import { CommandHandler } from '@nestjs/cqrs';

import {
  TrailEventAggregate,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { UpdateTrailEventCommand } from './UpdateTrailEventCommand';

@CommandHandler(UpdateTrailEventCommand)
export class UpdateTrailEventCommandHandler implements IEnhancedCommandHandler<UpdateTrailEventCommand> {
  private readonly _logger = new MonitoringLogger(
    UpdateTrailEventCommandHandler.name,
  );

  constructor(private readonly _trailEventRepository: TrailEventRepository) {}

  async execute({
    input,
  }: UpdateTrailEventCommand): Promise<TrailEventAggregate> {
    const trailEvent = await this._trailEventRepository.getById(
      input.trailEventId,
    );
    trailEvent.update(input.data);
    const saved = await this._trailEventRepository.save(trailEvent);
    this._logger.info('Trail event updated', {
      data: {
        trailEventId: saved.id,
        name: saved.name,
        hasLogo: saved.logo !== null,
      },
    });
    return saved;
  }
}
