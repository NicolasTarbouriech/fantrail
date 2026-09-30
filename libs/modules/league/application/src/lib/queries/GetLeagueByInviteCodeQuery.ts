import { z } from 'zod';

import { InviteCode, LeagueAggregate } from '@trail/modules/league/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetLeagueByInviteCodeQueryInput = z.object({
  inviteCode: InviteCode,
});
export type GetLeagueByInviteCodeQueryInput = z.infer<
  typeof GetLeagueByInviteCodeQueryInput
>;

export class GetLeagueByInviteCodeQuery extends Query<LeagueAggregate> {
  public readonly input: GetLeagueByInviteCodeQueryInput;

  constructor(input: GetLeagueByInviteCodeQueryInput) {
    super();
    this.input = GetLeagueByInviteCodeQueryInput.parse(input);
  }
}
