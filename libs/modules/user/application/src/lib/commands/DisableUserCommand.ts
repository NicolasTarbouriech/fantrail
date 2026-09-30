import { z } from 'zod';

import { UserAggregate, UserId } from '@trail/modules/user/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const DisableUserCommandInput = z.object({
  userId: UserId,
});
export type DisableUserCommandInput = z.infer<typeof DisableUserCommandInput>;

export class DisableUserCommand extends Command<UserAggregate> {
  public readonly input: DisableUserCommandInput;

  constructor(input: DisableUserCommandInput) {
    super();
    this.input = DisableUserCommandInput.parse(input);
  }
}
