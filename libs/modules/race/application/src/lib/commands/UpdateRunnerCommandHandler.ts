import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceRepository,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { UpdateRunnerCommand } from './UpdateRunnerCommand';

@CommandHandler(UpdateRunnerCommand)
export class UpdateRunnerCommandHandler implements IEnhancedCommandHandler<UpdateRunnerCommand> {
  private readonly _logger = new MonitoringLogger(
    UpdateRunnerCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _startListRepository: StartListRepository,
  ) {}

  async execute({ input }: UpdateRunnerCommand): Promise<StartListAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    const startList = await this._startListRepository.getByFieldId(
      input.fieldId,
    );
    startList.updateRunner(
      input.runnerId,
      input.data,
      race.findField(input.fieldId),
      new Date(),
    );
    const saved = await this._startListRepository.save(startList);
    this._logger.info('Runner updated', {
      raceId: race.id,
      fieldId: input.fieldId,
      data: { runnerId: input.runnerId },
    });
    return saved;
  }
}
