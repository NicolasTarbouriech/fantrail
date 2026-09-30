import { QueryHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetRaceByFieldIdQuery } from './GetRaceByFieldIdQuery';

@QueryHandler(GetRaceByFieldIdQuery)
export class GetRaceByFieldIdQueryHandler implements IEnhancedQueryHandler<GetRaceByFieldIdQuery> {
  constructor(private readonly _raceRepository: RaceRepository) {}

  execute({ input }: GetRaceByFieldIdQuery): Promise<RaceAggregate> {
    return this._raceRepository.getByFieldId(input.fieldId);
  }
}
