import { QueryHandler } from '@nestjs/cqrs';

import { UserAggregate, UserRepository } from '@trail/modules/user/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListUsersByIdListQuery } from './ListUsersByIdListQuery';

@QueryHandler(ListUsersByIdListQuery)
export class ListUsersByIdListQueryHandler implements IEnhancedQueryHandler<ListUsersByIdListQuery> {
  constructor(private readonly _userRepository: UserRepository) {}

  execute({ input }: ListUsersByIdListQuery): Promise<UserAggregate[]> {
    return this._userRepository.listByIdList(input.userIdList);
  }
}
