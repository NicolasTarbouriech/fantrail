import { z } from 'zod';

import { LeagueActor, LeagueId } from '@trail/modules/league/domain';
import { FieldId, PredictionAggregate } from '@trail/modules/prediction/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListLeagueFieldPredictionsQueryInput = z.object({
  leagueId: LeagueId,
  fieldId: FieldId,
  viewer: LeagueActor,
});
export type ListLeagueFieldPredictionsQueryInput = z.infer<
  typeof ListLeagueFieldPredictionsQueryInput
>;

// The predictions of the league members on a field, revealed once the field locks.
export class ListLeagueFieldPredictionsQuery extends Query<
  PredictionAggregate[]
> {
  public readonly input: ListLeagueFieldPredictionsQueryInput;

  constructor(input: ListLeagueFieldPredictionsQueryInput) {
    super();
    this.input = ListLeagueFieldPredictionsQueryInput.parse(input);
  }
}
