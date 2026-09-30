import { Injectable } from '@nestjs/common';

import {
  GetRaceByFieldIdQuery,
  GetStartListQuery,
} from '@trail/modules/race/application';
import {
  FieldId,
  ResultField,
  ResultFieldRepository,
} from '@trail/modules/result/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

@Injectable()
export class QueryBusResultFieldRepository extends ResultFieldRepository {
  constructor(private readonly _queryBus: EnhancedQueryBus) {
    super();
  }

  async getByFieldId(fieldId: FieldId): Promise<ResultField> {
    const [race, startList] = await Promise.all([
      this._queryBus.execute(new GetRaceByFieldIdQuery({ fieldId })),
      this._queryBus.execute(new GetStartListQuery({ fieldId })),
    ]);
    return ResultField.create({
      fieldId,
      isLocked: race.findField(fieldId).isLockedAt(new Date()),
      runnerIdList: startList.runnerList.map(({ id }) => id),
    });
  }
}
