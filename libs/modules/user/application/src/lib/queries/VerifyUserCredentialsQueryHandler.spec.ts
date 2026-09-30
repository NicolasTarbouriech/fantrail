import {
  InvalidCredentialsError,
  PasswordHasher,
  UserDisabledError,
  UserRepository,
} from '@trail/modules/user/domain';
import { buildUserAggregate } from '@trail/modules/user/domain-testing';

import { VerifyUserCredentialsQuery } from './VerifyUserCredentialsQuery';
import { VerifyUserCredentialsQueryHandler } from './VerifyUserCredentialsQueryHandler';

describe('VerifyUserCredentialsQueryHandler', () => {
  function given(
    user: ReturnType<typeof buildUserAggregate> | null,
    isValid: boolean,
  ) {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(user),
    } as unknown as UserRepository;
    const passwordHasher = {
      verify: jest.fn().mockResolvedValue(isValid),
    } as unknown as PasswordHasher;
    return {
      passwordHasher,
      handler: new VerifyUserCredentialsQueryHandler(
        userRepository,
        passwordHasher,
      ),
    };
  }
  const query = new VerifyUserCredentialsQuery({
    email: 'kilian@example.com',
    password: 'Trail-2026',
  });

  it('returns the user when the password matches', async () => {
    const user = buildUserAggregate();
    const { handler, passwordHasher } = given(user, true);
    await expect(handler.execute(query)).resolves.toBe(user);
    expect(passwordHasher.verify).toHaveBeenCalledWith(
      'Trail-2026',
      'hashed:password',
    );
  });

  it('rejects a wrong password', async () => {
    await expect(
      given(buildUserAggregate(), false).handler.execute(query),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('still compares a hash when the email is unknown', async () => {
    const { handler, passwordHasher } = given(null, false);
    await expect(handler.execute(query)).rejects.toThrow(
      InvalidCredentialsError,
    );
    expect(passwordHasher.verify).toHaveBeenCalledWith(
      'Trail-2026',
      expect.stringMatching(/^\$2[ab]\$10\$/),
    );
  });

  it('rejects a disabled account', async () => {
    const user = buildUserAggregate({
      disabledAt: new Date('2026-10-01T10:00:00Z'),
    });
    await expect(given(user, true).handler.execute(query)).rejects.toThrow(
      UserDisabledError,
    );
  });
});
