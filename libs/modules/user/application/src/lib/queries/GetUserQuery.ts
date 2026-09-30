import { z } from 'zod';

import { UserAggregate, UserId } from '@trail/modules/user/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const GetUserQueryInput = z.object({
  userId: UserId,
});
export type GetUserQueryInput = z.infer<typeof GetUserQueryInput>;

export class GetUserQuery extends Query<UserAggregate> {
  public readonly input: GetUserQueryInput;

  constructor(input: GetUserQueryInput) {
    super();
    this.input = GetUserQueryInput.parse(input);
  }
}
