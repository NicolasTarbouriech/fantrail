import { QueryHandler } from '@nestjs/cqrs';

import { GetLeagueQuery } from '@trail/modules/league/application';
import { ListRevealedPredictionsByFieldQuery } from '@trail/modules/prediction/application';
import { PredictionAggregate } from '@trail/modules/prediction/domain';
import {
  EnhancedQueryBus,
  IEnhancedQueryHandler,
} from '@trail/shared/cqrs/util-nestjs';

import { ListLeagueFieldPredictionsQuery } from './ListLeagueFieldPredictionsQuery';

@QueryHandler(ListLeagueFieldPredictionsQuery)
export class ListLeagueFieldPredictionsQueryHandler implements IEnhancedQueryHandler<ListLeagueFieldPredictionsQuery> {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  async execute({
    input,
  }: ListLeagueFieldPredictionsQuery): Promise<PredictionAggregate[]> {
    const league = await this._queryBus.execute(
      new GetLeagueQuery({ leagueId: input.leagueId, viewer: input.viewer }),
    );
    return this._queryBus.execute(
      new ListRevealedPredictionsByFieldQuery({
        fieldId: input.fieldId,
        userIdList: league.memberIdList,
      }),
    );
  }
}
