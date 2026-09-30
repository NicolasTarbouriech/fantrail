import { z } from 'zod';

import {
  LeagueAggregate,
  LeagueId,
  UserId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const LeaveLeagueCommandInput = z.object({
  userId: UserId,
  leagueId: LeagueId,
});
export type LeaveLeagueCommandInput = z.infer<typeof LeaveLeagueCommandInput>;

export class LeaveLeagueCommand extends Command<LeagueAggregate> {
  public readonly input: LeaveLeagueCommandInput;

  constructor(input: LeaveLeagueCommandInput) {
    super();
    this.input = LeaveLeagueCommandInput.parse(input);
  }
}
