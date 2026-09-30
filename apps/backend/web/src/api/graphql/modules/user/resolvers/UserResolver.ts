import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  DisableUserCommand,
  EnableUserCommand,
  ListUsersQuery,
} from '@trail/modules/user/application';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { AdminUserType } from '../types/AdminUserType';

@Resolver(() => AdminUserType)
@UseGuards(AuthGuard, AdminGuard)
export class UserResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
  ) {}

  @Query(() => [AdminUserType])
  async adminUsers(): Promise<AdminUserType[]> {
    const userList = await this._queryBus.execute(new ListUsersQuery());
    return userList.map((user) => new AdminUserType(user));
  }

  @Mutation(() => AdminUserType)
  async disableUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminUserType> {
    return new AdminUserType(
      await this._commandBus.execute(new DisableUserCommand({ userId })),
    );
  }

  @Mutation(() => AdminUserType)
  async enableUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminUserType> {
    return new AdminUserType(
      await this._commandBus.execute(new EnableUserCommand({ userId })),
    );
  }
}
