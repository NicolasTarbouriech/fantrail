import { z } from 'zod';

import {
  Email,
  PlainPassword,
  Pseudo,
  UserAggregate,
} from '@trail/modules/user/domain';
import { Command } from '@trail/shared/cqrs/util-nestjs';

export const RegisterUserCommandInput = z.object({
  email: Email,
  pseudo: Pseudo,
  password: PlainPassword,
});
export type RegisterUserCommandInput = z.infer<typeof RegisterUserCommandInput>;

export class RegisterUserCommand extends Command<UserAggregate> {
  public readonly input: RegisterUserCommandInput;

  constructor(input: RegisterUserCommandInput) {
    super();
    this.input = RegisterUserCommandInput.parse(input);
  }
}
