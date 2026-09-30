import { z } from 'zod';

import { RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const CancelRaceCommandInput = z.object({
  raceId: RaceId,
});
export type CancelRaceCommandInput = z.infer<typeof CancelRaceCommandInput>;

export class CancelRaceCommand extends Command<RaceAggregate> {
  public readonly input: CancelRaceCommandInput;

  constructor(input: CancelRaceCommandInput) {
    super();
    this.input = CancelRaceCommandInput.parse(input);
  }
}
