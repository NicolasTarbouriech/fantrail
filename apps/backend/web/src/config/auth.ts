import { AuthConfigParams } from '@trail/shared/auth/feature-nestjs';
import {
  bool,
  integer,
  requireStr,
  str,
} from '@trail/shared/tooling/util-environment';

// Read at bootstrap only, so that tooling importing the resolvers (schema generation) runs without secrets.
export function readAuthConfig(): AuthConfigParams {
  return {
    authenticationSecret: requireStr('AUTHENTICATION_SECRET'),
    sessionDurationInDays: integer('SESSION_DURATION_IN_DAYS', 30),
    cookieName: 'fantrail_session',
    cookieDomain: str('COOKIE_DOMAIN', '') || null,
    cookieSecure: bool('COOKIE_SECURE', true),
  };
}
