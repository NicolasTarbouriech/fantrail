import { CommandHandler } from '@nestjs/cqrs';

import { TrailEventRepository } from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { DeleteTrailEventCommand } from './DeleteTrailEventCommand';

@CommandHandler(DeleteTrailEventCommand)
export class DeleteTrailEventCommandHandler implements IEnhancedCommandHandler<DeleteTrailEventCommand> {
  private readonly _logger = new MonitoringLogger(
    DeleteTrailEventCommandHandler.name,
  );

  constructor(private readonly _trailEventRepository: TrailEventRepository) {}

  async execute({ input }: DeleteTrailEventCommand): Promise<void> {
    const trailEvent = await this._trailEventRepository.getById(
      input.trailEventId,
    );
    await this._trailEventRepository.delete(trailEvent);
    this._logger.info('Trail event deleted, its races are detached', {
      data: { trailEventId: trailEvent.id, name: trailEvent.name },
    });
  }
}
