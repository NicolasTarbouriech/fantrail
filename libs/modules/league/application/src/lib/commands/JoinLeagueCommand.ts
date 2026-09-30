import { z } from 'zod';

import {
  LeagueAggregate,
  LeagueId,
  UserId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const JoinLeagueCommandInput = z.object({
  userId: UserId,
  leagueId: LeagueId,
});
export type JoinLeagueCommandInput = z.infer<typeof JoinLeagueCommandInput>;

export class JoinLeagueCommand extends Command<LeagueAggregate> {
  public readonly input: JoinLeagueCommandInput;

  constructor(input: JoinLeagueCommandInput) {
    super();
    this.input = JoinLeagueCommandInput.parse(input);
  }
}
