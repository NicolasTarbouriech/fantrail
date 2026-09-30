import { QueryHandler } from '@nestjs/cqrs';

import { RaceAggregate, RaceRepository } from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListRacesQuery } from './ListRacesQuery';

@QueryHandler(ListRacesQuery)
export class ListRacesQueryHandler implements IEnhancedQueryHandler<ListRacesQuery> {
  constructor(private readonly _raceRepository: RaceRepository) {}

  execute({ input }: ListRacesQuery): Promise<RaceAggregate[]> {
    return this._raceRepository.list({ statusList: input.statusList });
  }
}
