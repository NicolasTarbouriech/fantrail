import { AuthConfig, AuthConfigParams } from './config/AuthConfig';

export function buildAuthConfig(
  overrides: Partial<AuthConfigParams> = {},
): AuthConfig {
  return new AuthConfig({
    authenticationSecret: 'a-test-secret-that-is-long-enough-123',
    sessionDurationInDays: 30,
    cookieName: 'fantrail_session',
    cookieDomain: null,
    cookieSecure: true,
    ...overrides,
  });
}
