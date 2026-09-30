import { ZodError } from 'zod';

import { PasswordHasher, UserRepository } from '@trail/modules/user/domain';
import { buildUserAggregate } from '@trail/modules/user/domain-testing';

import { RegisterUserCommand } from './RegisterUserCommand';
import { RegisterUserCommandHandler } from './RegisterUserCommandHandler';

describe('RegisterUserCommandHandler', () => {
  it('stores the hashed password, never the plain one', async () => {
    const user = buildUserAggregate();
    const userRepository = {
      create: jest.fn().mockResolvedValue(user),
    } as unknown as UserRepository;
    const passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed'),
    } as unknown as PasswordHasher;
    const handler = new RegisterUserCommandHandler(
      userRepository,
      passwordHasher,
    );
    await expect(
      handler.execute(
        new RegisterUserCommand({
          email: 'Kilian@Example.com',
          pseudo: 'Kilian',
          password: 'Trail-2026',
        }),
      ),
    ).resolves.toBe(user);
    expect(passwordHasher.hash).toHaveBeenCalledWith('Trail-2026');
    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'kilian@example.com',
      pseudo: 'Kilian',
      passwordHash: 'hashed',
    });
  });

  it('rejects a weak password before hashing', () => {
    expect(
      () =>
        new RegisterUserCommand({
          email: 'kilian@example.com',
          pseudo: 'Kilian',
          password: 'password',
        }),
    ).toThrow(ZodError);
  });
});
