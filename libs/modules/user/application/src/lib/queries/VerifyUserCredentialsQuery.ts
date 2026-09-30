import { z } from 'zod';

import { Email, UserAggregate } from '@trail/modules/user/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const VerifyUserCredentialsQueryInput = z.object({
  email: Email,
  password: z.string().min(1).max(72),
});
export type VerifyUserCredentialsQueryInput = z.infer<
  typeof VerifyUserCredentialsQueryInput
>;

export class VerifyUserCredentialsQuery extends Query<UserAggregate> {
  public readonly input: VerifyUserCredentialsQueryInput;

  constructor(input: VerifyUserCredentialsQueryInput) {
    super();
    this.input = VerifyUserCredentialsQueryInput.parse(input);
  }
}
