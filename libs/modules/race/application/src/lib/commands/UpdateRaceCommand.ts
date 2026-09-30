import { z } from 'zod';

import { RaceAggregate, RaceData, RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const UpdateRaceCommandInput = z.object({
  raceId: RaceId,
  data: RaceData,
});
export type UpdateRaceCommandInput = z.infer<typeof UpdateRaceCommandInput>;

export class UpdateRaceCommand extends Command<RaceAggregate> {
  public readonly input: UpdateRaceCommandInput;

  constructor(input: UpdateRaceCommandInput) {
    super();
    this.input = UpdateRaceCommandInput.parse(input);
  }
}
