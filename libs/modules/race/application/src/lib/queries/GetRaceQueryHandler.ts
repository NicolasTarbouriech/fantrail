import { QueryHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetRaceQuery } from './GetRaceQuery';

@QueryHandler(GetRaceQuery)
export class GetRaceQueryHandler implements IEnhancedQueryHandler<GetRaceQuery> {
  constructor(private readonly _raceRepository: RaceRepository) {}

  execute({ input }: GetRaceQuery): Promise<RaceAggregate> {
    return this._raceRepository.getById(input.raceId);
  }
}
