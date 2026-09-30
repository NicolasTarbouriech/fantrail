import { ZodError } from 'zod';

import { AuthModule } from './AuthModule';
import { SessionCookie } from './SessionCookie';
import { SessionToken } from './SessionToken';
import { AuthConfig } from './config/AuthConfig';

const params = {
  authenticationSecret: 'a-test-secret-that-is-long-enough-123',
  sessionDurationInDays: 30,
  cookieName: 'fantrail_session',
  cookieDomain: null,
  cookieSecure: true,
};

describe('AuthModule', () => {
  it('provides the session token and cookie to the whole application', () => {
    const module = AuthModule.register(params);
    expect(module.global).toBe(true);
    expect(module.exports).toEqual([AuthConfig, SessionToken, SessionCookie]);
  });

  it('refuses a secret shorter than 256 bits', () => {
    expect(() =>
      AuthModule.register({ ...params, authenticationSecret: 'short' }),
    ).toThrow(ZodError);
  });
});
