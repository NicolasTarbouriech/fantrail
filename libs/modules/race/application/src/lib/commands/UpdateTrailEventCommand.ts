import { z } from 'zod';

import {
  TrailEventAggregate,
  TrailEventData,
  TrailEventId,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const UpdateTrailEventCommandInput = z.object({
  trailEventId: TrailEventId,
  data: TrailEventData,
});
export type UpdateTrailEventCommandInput = z.infer<
  typeof UpdateTrailEventCommandInput
>;

export class UpdateTrailEventCommand extends Command<TrailEventAggregate> {
  public readonly input: UpdateTrailEventCommandInput;

  constructor(input: UpdateTrailEventCommandInput) {
    super();
    this.input = UpdateTrailEventCommandInput.parse(input);
  }
}
