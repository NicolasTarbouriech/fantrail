import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceRepository,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { AddRunnerListCommand } from './AddRunnerListCommand';

@CommandHandler(AddRunnerListCommand)
export class AddRunnerListCommandHandler implements IEnhancedCommandHandler<AddRunnerListCommand> {
  private readonly _logger = new MonitoringLogger(
    AddRunnerListCommandHandler.name,
  );

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _startListRepository: StartListRepository,
  ) {}

  async execute({ input }: AddRunnerListCommand): Promise<StartListAggregate> {
    const race = await this._raceRepository.getByFieldId(input.fieldId);
    const startList = await this._startListRepository.getByFieldId(
      input.fieldId,
    );
    startList.addRunnerList(
      input.dataList,
      race.findField(input.fieldId),
      new Date(),
    );
    const saved = await this._startListRepository.save(startList);
    this._logger.info('Runners added', {
      raceId: race.id,
      fieldId: input.fieldId,
      data: { runnerCount: input.dataList.length },
    });
    return saved;
  }
}
