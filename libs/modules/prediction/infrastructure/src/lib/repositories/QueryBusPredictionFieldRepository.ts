import { Injectable } from '@nestjs/common';

import {
  FieldId,
  PredictionField,
  PredictionFieldRepository,
} from '@trail/modules/prediction/domain';
import {
  GetRaceByFieldIdQuery,
  GetStartListQuery,
} from '@trail/modules/race/application';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

// Reads the field through the race module queries, never through its tables.
@Injectable()
export class QueryBusPredictionFieldRepository extends PredictionFieldRepository {
  constructor(private readonly _queryBus: EnhancedQueryBus) {
    super();
  }

  async getByFieldId(fieldId: FieldId): Promise<PredictionField> {
    const [race, startList] = await Promise.all([
      this._queryBus.execute(new GetRaceByFieldIdQuery({ fieldId })),
      this._queryBus.execute(new GetStartListQuery({ fieldId })),
    ]);
    return PredictionField.create({
      fieldId,
      pickCount: race.pickCount,
      isOpen: race.isOpenForPredictions(fieldId, new Date()),
      runnerIdList: startList.runnerList.map(({ id }) => id),
      withdrawnRunnerIdList: startList.runnerList
        .filter(({ isWithdrawn }) => isWithdrawn)
        .map(({ id }) => id),
    });
  }
}
