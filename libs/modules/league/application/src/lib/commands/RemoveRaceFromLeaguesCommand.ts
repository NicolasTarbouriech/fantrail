import { z } from 'zod';

import { RaceId } from '@trail/modules/league/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const RemoveRaceFromLeaguesCommandInput = z.object({
  raceId: RaceId,
});
export type RemoveRaceFromLeaguesCommandInput = z.infer<
  typeof RemoveRaceFromLeaguesCommandInput
>;

export class RemoveRaceFromLeaguesCommand extends Command<void> {
  public readonly input: RemoveRaceFromLeaguesCommandInput;

  constructor(input: RemoveRaceFromLeaguesCommandInput) {
    super();
    this.input = RemoveRaceFromLeaguesCommandInput.parse(input);
  }
}
