import { QueryHandler } from '@nestjs/cqrs';

import {
  FieldResultAggregate,
  FieldResultRepository,
} from '@trail/modules/result/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListFieldResultsQuery } from './ListFieldResultsQuery';

@QueryHandler(ListFieldResultsQuery)
export class ListFieldResultsQueryHandler implements IEnhancedQueryHandler<ListFieldResultsQuery> {
  constructor(private readonly _fieldResultRepository: FieldResultRepository) {}

  execute({ input }: ListFieldResultsQuery): Promise<FieldResultAggregate[]> {
    return this._fieldResultRepository.listByFieldIdList(input.fieldIdList);
  }
}
