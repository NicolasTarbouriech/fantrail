import { QueryHandler } from '@nestjs/cqrs';

import { UserAggregate, UserRepository } from '@trail/modules/user/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';

import { GetUserQuery } from './GetUserQuery';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IEnhancedQueryHandler<GetUserQuery> {
  constructor(private readonly _userRepository: UserRepository) {}

  execute({ input }: GetUserQuery): Promise<UserAggregate> {
    return this._userRepository.getById(input.userId);
  }
}
