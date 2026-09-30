import { z } from 'zod';

import { UserAggregate, UserId } from '@trail/modules/user/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListUsersByIdListQueryInput = z.object({
  userIdList: z.array(UserId),
});
export type ListUsersByIdListQueryInput = z.infer<
  typeof ListUsersByIdListQueryInput
>;

export class ListUsersByIdListQuery extends Query<UserAggregate[]> {
  public readonly input: ListUsersByIdListQueryInput;

  constructor(input: ListUsersByIdListQueryInput) {
    super();
    this.input = ListUsersByIdListQueryInput.parse(input);
  }
}
