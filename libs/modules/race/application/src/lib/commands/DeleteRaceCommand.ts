import { z } from 'zod';

import { RaceId } from '@trail/modules/race/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const DeleteRaceCommandInput = z.object({
  raceId: RaceId,
});
export type DeleteRaceCommandInput = z.infer<typeof DeleteRaceCommandInput>;

export class DeleteRaceCommand extends Command<void> {
  public readonly input: DeleteRaceCommandInput;

  constructor(input: DeleteRaceCommandInput) {
    super();
    this.input = DeleteRaceCommandInput.parse(input);
  }
}
