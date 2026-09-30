import { ZodError } from 'zod';

import { BcryptPasswordHasher } from './BcryptPasswordHasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  it('verifies the password it hashed and nothing else', async () => {
    const passwordHash = await hasher.hash('Correct-horse1');
    expect(passwordHash).not.toContain('Correct-horse1');
    await expect(hasher.verify('Correct-horse1', passwordHash)).resolves.toBe(
      true,
    );
    await expect(hasher.verify('Wrong-horse1', passwordHash)).resolves.toBe(
      false,
    );
  });

  it('refuses a too short password', async () => {
    await expect(hasher.hash('short')).rejects.toThrow(ZodError);
  });
});
