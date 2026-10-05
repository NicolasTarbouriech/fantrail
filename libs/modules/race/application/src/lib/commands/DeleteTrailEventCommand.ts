import { z } from 'zod';

import { TrailEventId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const DeleteTrailEventCommandInput = z.object({
  trailEventId: TrailEventId,
});
export type DeleteTrailEventCommandInput = z.infer<
  typeof DeleteTrailEventCommandInput
>;

export class DeleteTrailEventCommand extends Command<void> {
  public readonly input: DeleteTrailEventCommandInput;

  constructor(input: DeleteTrailEventCommandInput) {
    super();
    this.input = DeleteTrailEventCommandInput.parse(input);
  }
}
