import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceRepository,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { WithdrawRunnerCommand } from './WithdrawRunnerCommand';

@CommandHandler(WithdrawRunnerCommand)
export class WithdrawRunnerCommandHandler implements IEnhancedCommandHandler<WithdrawRunnerCommand> {
  private readonly _logger = new MonitoringLogger(
    WithdrawRunnerCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _startListRepository: StartListRepository,
  ) {}

  async execute({ input }: WithdrawRunnerCommand): Promise<StartListAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    const startList = await this._startListRepository.getByFieldId(
      input.fieldId,
    );
    startList.withdrawRunner(
      input.runnerId,
      race.findField(input.fieldId),
      new Date(),
    );
    const saved = await this._startListRepository.save(startList);
    this._logger.info('Runner withdrawn', {
      raceId: race.id,
      fieldId: input.fieldId,
      data: { runnerId: input.runnerId },
    });
    return saved;
  }
}
