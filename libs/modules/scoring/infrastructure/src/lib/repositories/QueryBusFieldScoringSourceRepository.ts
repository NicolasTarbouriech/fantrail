import { Injectable } from '@nestjs/common';

import { ListPredictionsByFieldQuery } from '@trail/modules/prediction/application';
import {
  GetRaceByFieldIdQuery,
  GetStartListQuery,
} from '@trail/modules/race/application';
import { GetFieldResultQuery } from '@trail/modules/result/application';
import {
  FieldId,
  FieldScoringSource,
  FieldScoringSourceRepository,
  ScoredPredictionData,
} from '@trail/modules/scoring/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

// Gathers the result, the field ranks and the complete predictions through each module's queries.
@Injectable()
export class QueryBusFieldScoringSourceRepository extends FieldScoringSourceRepository {
  constructor(private readonly _queryBus: EnhancedQueryBus) {
    super();
  }

  async findByFieldId(fieldId: FieldId): Promise<FieldScoringSource | null> {
    const result = await this._queryBus.execute(
      new GetFieldResultQuery({ fieldId }),
    );
    if (!result.isPublished) {
      return null;
    }
    const [race, startList, predictionList] = await Promise.all([
      this._queryBus.execute(new GetRaceByFieldIdQuery({ fieldId })),
      this._queryBus.execute(new GetStartListQuery({ fieldId })),
      this._queryBus.execute(new ListPredictionsByFieldQuery({ fieldId })),
    ]);
    return FieldScoringSource.create({
      fieldId,
      resultVersion: result.version,
      result: {
        rankingList: result.data.rankingList,
        winnerTimeInSeconds: result.data.winnerTimeInSeconds,
      },
      timeTolerancePercent: race.timeTolerancePercent,
      favoriteRankByRunnerId: startList.favoriteRankByRunnerId,
      predictionList: predictionList.flatMap(
        (prediction): ScoredPredictionData[] => {
          const { winnerTimeEstimateInSeconds, finalizedAt } = prediction;
          const pickList = prediction.pickList.flatMap((runnerId) =>
            runnerId === null ? [] : [runnerId],
          );
          if (
            !prediction.isComplete ||
            winnerTimeEstimateInSeconds === null ||
            finalizedAt === null
          ) {
            return [];
          }
          return [
            {
              userId: prediction.userId,
              pickList,
              winnerTimeEstimateInSeconds,
              finalizedAt,
            },
          ];
        },
      ),
    });
  }
}
