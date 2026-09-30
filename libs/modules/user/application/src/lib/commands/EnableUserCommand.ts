import { z } from 'zod';

import { UserAggregate, UserId } from '@trail/modules/user/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const EnableUserCommandInput = z.object({
  userId: UserId,
});
export type EnableUserCommandInput = z.infer<typeof EnableUserCommandInput>;

export class EnableUserCommand extends Command<UserAggregate> {
  public readonly input: EnableUserCommandInput;

  constructor(input: EnableUserCommandInput) {
    super();
    this.input = EnableUserCommandInput.parse(input);
  }
}
