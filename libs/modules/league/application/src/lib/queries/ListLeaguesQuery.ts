import { z } from 'zod';

import {
  LeagueAggregate,
  LeagueVisibility,
  UserId,
} from '@trail/modules/league/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListLeaguesQueryInput = z.object({
  visibility: z.nativeEnum(LeagueVisibility).optional(),
  memberId: UserId.optional(),
});
export type ListLeaguesQueryInput = z.infer<typeof ListLeaguesQueryInput>;

export class ListLeaguesQuery extends Query<LeagueAggregate[]> {
  public readonly input: ListLeaguesQueryInput;

  constructor(input: ListLeaguesQueryInput) {
    super();
    this.input = ListLeaguesQueryInput.parse(input);
  }
}
