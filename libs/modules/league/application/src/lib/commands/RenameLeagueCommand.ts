import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
  LeagueName,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const RenameLeagueCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
  name: LeagueName,
});
export type RenameLeagueCommandInput = z.infer<typeof RenameLeagueCommandInput>;

export class RenameLeagueCommand extends Command<LeagueAggregate> {
  public readonly input: RenameLeagueCommandInput;

  constructor(input: RenameLeagueCommandInput) {
    super();
    this.input = RenameLeagueCommandInput.parse(input);
  }
}
