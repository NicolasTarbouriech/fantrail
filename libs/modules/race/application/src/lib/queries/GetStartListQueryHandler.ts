import { QueryHandler } from '@nestjs/cqrs';

import {
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetStartListQuery } from './GetStartListQuery';

@QueryHandler(GetStartListQuery)
export class GetStartListQueryHandler implements IEnhancedQueryHandler<GetStartListQuery> {
  constructor(private readonly _startListRepository: StartListRepository) {}

  execute({ input }: GetStartListQuery): Promise<StartListAggregate> {
    return this._startListRepository.getByFieldId(input.fieldId);
  }
}
