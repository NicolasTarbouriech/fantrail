import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
} from '@trail/modules/league/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetLeagueQueryInput = z.object({
  leagueId: LeagueId,
  viewer: LeagueActor,
});
export type GetLeagueQueryInput = z.infer<typeof GetLeagueQueryInput>;

export class GetLeagueQuery extends Query<LeagueAggregate> {
  public readonly input: GetLeagueQueryInput;

  constructor(input: GetLeagueQueryInput) {
    super();
    this.input = GetLeagueQueryInput.parse(input);
  }
}
