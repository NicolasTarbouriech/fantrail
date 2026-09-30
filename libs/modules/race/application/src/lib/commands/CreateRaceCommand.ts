import { z } from 'zod';

import { RaceAggregate, RaceData } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const CreateRaceCommandInput = z.object({
  data: RaceData,
});
export type CreateRaceCommandInput = z.infer<typeof CreateRaceCommandInput>;

export class CreateRaceCommand extends Command<RaceAggregate> {
  public readonly input: CreateRaceCommandInput;

  constructor(input: CreateRaceCommandInput) {
    super();
    this.input = CreateRaceCommandInput.parse(input);
  }
}
