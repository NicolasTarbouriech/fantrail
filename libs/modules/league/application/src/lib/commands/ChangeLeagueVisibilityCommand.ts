import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
  LeagueVisibility,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const ChangeLeagueVisibilityCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
  visibility: z.nativeEnum(LeagueVisibility),
});
export type ChangeLeagueVisibilityCommandInput = z.infer<
  typeof ChangeLeagueVisibilityCommandInput
>;

export class ChangeLeagueVisibilityCommand extends Command<LeagueAggregate> {
  public readonly input: ChangeLeagueVisibilityCommandInput;

  constructor(input: ChangeLeagueVisibilityCommandInput) {
    super();
    this.input = ChangeLeagueVisibilityCommandInput.parse(input);
  }
}
