import { z } from 'zod';

import { RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const LockRaceCommandInput = z.object({
  raceId: RaceId,
});
export type LockRaceCommandInput = z.infer<typeof LockRaceCommandInput>;

export class LockRaceCommand extends Command<RaceAggregate> {
  public readonly input: LockRaceCommandInput;

  constructor(input: LockRaceCommandInput) {
    super();
    this.input = LockRaceCommandInput.parse(input);
  }
}
