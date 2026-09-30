import { SessionToken } from './SessionToken';
import { buildAuthConfig } from './testing';

describe('SessionToken', () => {
  const USER_ID = '66666666-6666-4666-8666-666666666666';
  const sessionToken = new SessionToken(buildAuthConfig());

  it('verifies the user id it signed', async () => {
    await expect(
      sessionToken.verify(await sessionToken.sign(USER_ID)),
    ).resolves.toBe(USER_ID);
  });

  it('rejects a tampered token or one signed with another secret', async () => {
    const token = await sessionToken.sign(USER_ID);
    await expect(sessionToken.verify(`${token}x`)).resolves.toBeNull();
    const other = new SessionToken(
      buildAuthConfig({
        authenticationSecret: 'another-secret-that-is-long-enough-456',
      }),
    );
    await expect(other.verify(token)).resolves.toBeNull();
  });
});
