import { z } from 'zod';

import { RaceAggregate, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const MarkRaceScoredCommandInput = z.object({
  raceId: RaceId,
});
export type MarkRaceScoredCommandInput = z.infer<
  typeof MarkRaceScoredCommandInput
>;

export class MarkRaceScoredCommand extends Command<RaceAggregate> {
  public readonly input: MarkRaceScoredCommandInput;

  constructor(input: MarkRaceScoredCommandInput) {
    super();
    this.input = MarkRaceScoredCommandInput.parse(input);
  }
}
