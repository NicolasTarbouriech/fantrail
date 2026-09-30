import { CommandHandler } from '@nestjs/cqrs';

import {
  RaceAggregate,
  RaceRepository,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { OpenRaceCommand } from './OpenRaceCommand';

@CommandHandler(OpenRaceCommand)
export class OpenRaceCommandHandler implements IEnhancedCommandHandler<OpenRaceCommand> {
  private readonly _logger = new MonitoringLogger(OpenRaceCommandHandler.name);

  constructor(
    private readonly _raceRepository: RaceRepository,
    private readonly _startListRepository: StartListRepository,
  ) {}

  async execute({ input }: OpenRaceCommand): Promise<RaceAggregate> {
    const race = await this._raceRepository.getById(input.raceId);
    const startListList = await this._startListRepository.listByFieldIdList(
      race.fieldList.map(({ id }) => id),
    );
    race.open(
      Object.fromEntries(
        startListList.map((startList) => [
          startList.fieldId,
          startList.activeRunnerList.length,
        ]),
      ),
    );
    const saved = await this._raceRepository.save(race);
    this._logger.info('Race opened', { raceId: race.id });
    return saved;
  }
}
