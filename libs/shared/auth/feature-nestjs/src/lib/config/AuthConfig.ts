import { z } from 'zod';

const MINIMUM_SECRET_LENGTH = 32;

export const AuthConfigParams = z.object({
  authenticationSecret: z
    .string()
    .min(
      MINIMUM_SECRET_LENGTH,
      `authenticationSecret must be at least ${MINIMUM_SECRET_LENGTH} characters (256 bits)`,
    ),
  sessionDurationInDays: z.number().int().positive(),
  cookieName: z.string().min(1),
  cookieDomain: z.string().min(1).nullable(),
  cookieSecure: z.boolean(),
});
export type AuthConfigParams = z.infer<typeof AuthConfigParams>;

export class AuthConfig {
  public readonly authenticationSecret: string;
  public readonly sessionDurationInDays: number;
  public readonly cookieName: string;
  public readonly cookieDomain: string | null;
  public readonly cookieSecure: boolean;

  constructor(config: AuthConfigParams) {
    const parsed = AuthConfigParams.parse(config);
    this.authenticationSecret = parsed.authenticationSecret;
    this.sessionDurationInDays = parsed.sessionDurationInDays;
    this.cookieName = parsed.cookieName;
    this.cookieDomain = parsed.cookieDomain;
    this.cookieSecure = parsed.cookieSecure;
  }
}
