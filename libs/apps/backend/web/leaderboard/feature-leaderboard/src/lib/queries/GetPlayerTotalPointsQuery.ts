import { z } from 'zod';

import { UserId } from '@trail/modules/user/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetPlayerTotalPointsQueryInput = z.object({
  userId: UserId,
});
export type GetPlayerTotalPointsQueryInput = z.infer<
  typeof GetPlayerTotalPointsQueryInput
>;

// The points of a player on every public race.
export class GetPlayerTotalPointsQuery extends Query<number> {
  public readonly input: GetPlayerTotalPointsQueryInput;

  constructor(input: GetPlayerTotalPointsQueryInput) {
    super();
    this.input = GetPlayerTotalPointsQueryInput.parse(input);
  }
}
