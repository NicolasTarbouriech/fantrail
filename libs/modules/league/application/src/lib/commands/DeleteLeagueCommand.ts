import { z } from 'zod';

import { LeagueActor, LeagueId } from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const DeleteLeagueCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
});
export type DeleteLeagueCommandInput = z.infer<typeof DeleteLeagueCommandInput>;

export class DeleteLeagueCommand extends Command<boolean> {
  public readonly input: DeleteLeagueCommandInput;

  constructor(input: DeleteLeagueCommandInput) {
    super();
    this.input = DeleteLeagueCommandInput.parse(input);
  }
}
