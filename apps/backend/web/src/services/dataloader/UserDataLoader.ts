import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { ListUsersByIdListQuery } from '@trail/modules/user/application';
import { UserAggregate, UserNotFoundError } from '@trail/modules/user/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  public readonly loader = new DataLoader<string, UserAggregate>(
    async (idList: readonly string[]) => {
      const userList = await this._queryBus.execute(
        new ListUsersByIdListQuery({ userIdList: [...idList] }),
      );
      const userById = new Map(userList.map((user) => [user.id, user]));
      return idList.map((id) => userById.get(id) ?? new UserNotFoundError());
    },
  );
}
