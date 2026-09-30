import { UserRepository } from '@trail/modules/user/domain';
import {
  USER_ID,
  buildUserAggregate,
} from '@trail/modules/user/domain-testing';

import { DisableUserCommand } from './DisableUserCommand';
import { DisableUserCommandHandler } from './DisableUserCommandHandler';
import { EnableUserCommand } from './EnableUserCommand';
import { EnableUserCommandHandler } from './EnableUserCommandHandler';

describe('DisableUserCommandHandler and EnableUserCommandHandler', () => {
  const user = buildUserAggregate();
  const userRepository = {
    getById: jest.fn().mockResolvedValue(user),
    save: jest.fn((aggregate) => Promise.resolve(aggregate)),
  } as unknown as UserRepository;

  it('disables then enables the account', async () => {
    const disabled = await new DisableUserCommandHandler(
      userRepository,
    ).execute(new DisableUserCommand({ userId: USER_ID }));
    expect(disabled.isDisabled).toBe(true);
    const enabled = await new EnableUserCommandHandler(userRepository).execute(
      new EnableUserCommand({ userId: USER_ID }),
    );
    expect(enabled.isDisabled).toBe(false);
    expect(userRepository.save).toHaveBeenCalledTimes(2);
  });
});
