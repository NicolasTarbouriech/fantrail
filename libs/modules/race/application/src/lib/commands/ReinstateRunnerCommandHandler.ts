import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceRepository,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { ReinstateRunnerCommand } from './ReinstateRunnerCommand';

@CommandHandler(ReinstateRunnerCommand)
export class ReinstateRunnerCommandHandler implements IEnhancedCommandHandler<ReinstateRunnerCommand> {
  private readonly _logger = new MonitoringLogger(
    ReinstateRunnerCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _startListRepository: StartListRepository,
  ) {}

  async execute({
    input,
  }: ReinstateRunnerCommand): Promise<StartListAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    const startList = await this._startListRepository.getByFieldId(
      input.fieldId,
    );
    startList.reinstateRunner(
      input.runnerId,
      race.findField(input.fieldId),
      new Date(),
    );
    const saved = await this._startListRepository.save(startList);
    this._logger.info('Runner reinstated', {
      raceId: race.id,
      fieldId: input.fieldId,
      data: { runnerId: input.runnerId },
    });
    return saved;
  }
}
