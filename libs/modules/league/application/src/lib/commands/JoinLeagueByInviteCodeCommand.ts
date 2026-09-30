import { z } from 'zod';

import {
  InviteCode,
  LeagueAggregate,
  UserId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const JoinLeagueByInviteCodeCommandInput = z.object({
  userId: UserId,
  inviteCode: InviteCode,
});
export type JoinLeagueByInviteCodeCommandInput = z.infer<
  typeof JoinLeagueByInviteCodeCommandInput
>;

export class JoinLeagueByInviteCodeCommand extends Command<LeagueAggregate> {
  public readonly input: JoinLeagueByInviteCodeCommandInput;

  constructor(input: JoinLeagueByInviteCodeCommandInput) {
    super();
    this.input = JoinLeagueByInviteCodeCommandInput.parse(input);
  }
}
