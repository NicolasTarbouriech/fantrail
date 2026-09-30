import { UserRepository } from '@trail/modules/user/domain';
import {
  USER_ID,
  buildUserAggregate,
} from '@trail/modules/user/domain-testing';

import { GetUserQuery } from './GetUserQuery';
import { GetUserQueryHandler } from './GetUserQueryHandler';
import { ListUsersByIdListQuery } from './ListUsersByIdListQuery';
import { ListUsersByIdListQueryHandler } from './ListUsersByIdListQueryHandler';
import { ListUsersQueryHandler } from './ListUsersQueryHandler';

describe('user query handlers', () => {
  const user = buildUserAggregate();
  const userRepository = {
    getById: jest.fn().mockResolvedValue(user),
    list: jest.fn().mockResolvedValue([user]),
    listByIdList: jest.fn().mockResolvedValue([user]),
  } as unknown as UserRepository;

  it('GetUserQueryHandler reads a user by id', async () => {
    await expect(
      new GetUserQueryHandler(userRepository).execute(
        new GetUserQuery({ userId: USER_ID }),
      ),
    ).resolves.toBe(user);
  });

  it('ListUsersQueryHandler lists every user', async () => {
    await expect(
      new ListUsersQueryHandler(userRepository).execute(),
    ).resolves.toEqual([user]);
  });

  it('ListUsersByIdListQueryHandler reads users by id', async () => {
    await expect(
      new ListUsersByIdListQueryHandler(userRepository).execute(
        new ListUsersByIdListQuery({ userIdList: [USER_ID] }),
      ),
    ).resolves.toEqual([user]);
  });
});
