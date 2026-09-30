import { z } from 'zod';

import { RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const OpenRaceCommandInput = z.object({
  raceId: RaceId,
});
export type OpenRaceCommandInput = z.infer<typeof OpenRaceCommandInput>;

export class OpenRaceCommand extends Command<RaceAggregate> {
  public readonly input: OpenRaceCommandInput;

  constructor(input: OpenRaceCommandInput) {
    super();
    this.input = OpenRaceCommandInput.parse(input);
  }
}
