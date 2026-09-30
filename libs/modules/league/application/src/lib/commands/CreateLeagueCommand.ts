import { z } from 'zod';

import {
  LeagueAggregate,
  LeagueName,
  LeagueVisibility,
  UserId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const CreateLeagueCommandInput = z.object({
  ownerId: UserId,
  name: LeagueName,
  visibility: z.nativeEnum(LeagueVisibility),
});
export type CreateLeagueCommandInput = z.infer<typeof CreateLeagueCommandInput>;

export class CreateLeagueCommand extends Command<LeagueAggregate> {
  public readonly input: CreateLeagueCommandInput;

  constructor(input: CreateLeagueCommandInput) {
    super();
    this.input = CreateLeagueCommandInput.parse(input);
  }
}
