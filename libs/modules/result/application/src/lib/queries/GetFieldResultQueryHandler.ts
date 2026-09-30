import { QueryHandler } from '@nestjs/cqrs';

import {
  FieldResultAggregate,
  FieldResultRepository,
} from '@trail/modules/result/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetFieldResultQuery } from './GetFieldResultQuery';

@QueryHandler(GetFieldResultQuery)
export class GetFieldResultQueryHandler implements IEnhancedQueryHandler<GetFieldResultQuery> {
  constructor(private readonly _fieldResultRepository: FieldResultRepository) {}

  execute({ input }: GetFieldResultQuery): Promise<FieldResultAggregate> {
    return this._fieldResultRepository.getByFieldId(input.fieldId);
  }
}
