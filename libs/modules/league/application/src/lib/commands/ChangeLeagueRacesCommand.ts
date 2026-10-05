import { z } from 'zod';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueId,
  RaceId,
} from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const ChangeLeagueRacesCommandInput = z.object({
  actor: LeagueActor,
  leagueId: LeagueId,
  raceIdList: z.array(RaceId),
});
export type ChangeLeagueRacesCommandInput = z.infer<
  typeof ChangeLeagueRacesCommandInput
>;

export class ChangeLeagueRacesCommand extends Command<LeagueAggregate> {
  public readonly input: ChangeLeagueRacesCommandInput;

  constructor(input: ChangeLeagueRacesCommandInput) {
    super();
    this.input = ChangeLeagueRacesCommandInput.parse(input);
  }
}
