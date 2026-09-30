import { z } from 'zod';

import {
  FieldId,
  LeaderboardEntry,
  UserId,
} from '@trail/modules/scoring/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetLeaderboardQueryInput = z.object({
  fieldIdList: z.array(FieldId),
  userIdList: z.array(UserId),
});
export type GetLeaderboardQueryInput = z.infer<typeof GetLeaderboardQueryInput>;

export class GetLeaderboardQuery extends Query<LeaderboardEntry[]> {
  public readonly input: GetLeaderboardQueryInput;

  constructor(input: GetLeaderboardQueryInput) {
    super();
    this.input = GetLeaderboardQueryInput.parse(input);
  }
}
