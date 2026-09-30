import { QueryHandler } from '@nestjs/cqrs';

import {
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListStartListsQuery } from './ListStartListsQuery';

@QueryHandler(ListStartListsQuery)
export class ListStartListsQueryHandler implements IEnhancedQueryHandler<ListStartListsQuery> {
  constructor(private readonly _startListRepository: StartListRepository) {}

  execute({ input }: ListStartListsQuery): Promise<StartListAggregate[]> {
    return this._startListRepository.listByFieldIdList(input.fieldIdList);
  }
}
