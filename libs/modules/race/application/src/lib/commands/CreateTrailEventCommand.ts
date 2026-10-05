import { z } from 'zod';

import {
  TrailEventAggregate,
  TrailEventData,
} from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const CreateTrailEventCommandInput = z.object({
  data: TrailEventData,
});
export type CreateTrailEventCommandInput = z.infer<
  typeof CreateTrailEventCommandInput
>;

export class CreateTrailEventCommand extends Command<TrailEventAggregate> {
  public readonly input: CreateTrailEventCommandInput;

  constructor(input: CreateTrailEventCommandInput) {
    super();
    this.input = CreateTrailEventCommandInput.parse(input);
  }
}
