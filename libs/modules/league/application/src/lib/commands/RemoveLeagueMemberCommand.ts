import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
  UserId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const RemoveLeagueMemberCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
  userId: UserId,
});
export type RemoveLeagueMemberCommandInput = z.infer<
  typeof RemoveLeagueMemberCommandInput
>;

export class RemoveLeagueMemberCommand extends Command<LeagueAggregate> {
  public readonly input: RemoveLeagueMemberCommandInput;

  constructor(input: RemoveLeagueMemberCommandInput) {
    super();
    this.input = RemoveLeagueMemberCommandInput.parse(input);
  }
}
