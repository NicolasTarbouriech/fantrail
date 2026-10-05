import { z } from 'zod';

import {
  RaceAggregate,
  RaceId,
  TrailEventId,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const ChangeRaceTrailEventCommandInput = z.object({
  raceId: RaceId,
  trailEventId: TrailEventId.nullable(),
});
export type ChangeRaceTrailEventCommandInput = z.infer<
  typeof ChangeRaceTrailEventCommandInput
>;

export class ChangeRaceTrailEventCommand extends Command<RaceAggregate> {
  public readonly input: ChangeRaceTrailEventCommandInput;

  constructor(input: ChangeRaceTrailEventCommandInput) {
    super();
    this.input = ChangeRaceTrailEventCommandInput.parse(input);
  }
}
