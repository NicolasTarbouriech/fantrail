import { QueryHandler } from '@nestjs/cqrs';

import {
  TrailEventAggregate,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListTrailEventsQuery } from './ListTrailEventsQuery';

@QueryHandler(ListTrailEventsQuery)
export class ListTrailEventsQueryHandler implements IEnhancedQueryHandler<ListTrailEventsQuery> {
  constructor(private readonly _trailEventRepository: TrailEventRepository) {}

  execute(): Promise<TrailEventAggregate[]> {
    return this._trailEventRepository.list();
  }
}
