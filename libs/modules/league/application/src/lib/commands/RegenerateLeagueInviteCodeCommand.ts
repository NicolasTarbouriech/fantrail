import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const RegenerateLeagueInviteCodeCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
});
export type RegenerateLeagueInviteCodeCommandInput = z.infer<
  typeof RegenerateLeagueInviteCodeCommandInput
>;

export class RegenerateLeagueInviteCodeCommand extends Command<LeagueAggregate> {
  public readonly input: RegenerateLeagueInviteCodeCommandInput;

  constructor(input: RegenerateLeagueInviteCodeCommandInput) {
    super();
    this.input = RegenerateLeagueInviteCodeCommandInput.parse(input);
  }
}
