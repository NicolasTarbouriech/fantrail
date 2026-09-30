import { QueryHandler } from '@nestjs/cqrs';

import { UserAggregate, UserRepository } from '@trail/modules/user/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { ListUsersQuery } from './ListUsersQuery';

@QueryHandler(ListUsersQuery)
export class ListUsersQueryHandler implements IEnhancedQueryHandler<ListUsersQuery> {
  constructor(private readonly _userRepository: UserRepository) {}

  execute(): Promise<UserAggregate[]> {
    return this._userRepository.list();
  }
}
