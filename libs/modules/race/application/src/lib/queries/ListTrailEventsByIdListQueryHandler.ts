import { QueryHandler } from '@nestjs/cqrs';

import {
  TrailEventAggregate,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListTrailEventsByIdListQuery } from './ListTrailEventsByIdListQuery';

@QueryHandler(ListTrailEventsByIdListQuery)
export class ListTrailEventsByIdListQueryHandler implements IEnhancedQueryHandler<ListTrailEventsByIdListQuery> {
  constructor(private readonly _trailEventRepository: TrailEventRepository) {}

  execute({
    input,
  }: ListTrailEventsByIdListQuery): Promise<TrailEventAggregate[]> {
    return this._trailEventRepository.list({
      idList: input.trailEventIdList,
    });
  }
}
