import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';

import { AuthConfig } from './config/AuthConfig';

const ISSUER = 'fantrail';
const ALGORITHM = 'HS256';

@Injectable()
export class SessionToken {
  private readonly _secret: Uint8Array;

  constructor(private readonly _config: AuthConfig) {
    this._secret = new TextEncoder().encode(_config.authenticationSecret);
  }

  sign(userId: string): Promise<string> {
    return new SignJWT({})
      .setProtectedHeader({ alg: ALGORITHM })
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setIssuedAt()
      .setExpirationTime(`${this._config.sessionDurationInDays}d`)
      .sign(this._secret);
  }

  async verify(token: string): Promise<string | null> {
    try {
      const { payload } = await jwtVerify(token, this._secret, {
        issuer: ISSUER,
        algorithms: [ALGORITHM],
      });
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
}
