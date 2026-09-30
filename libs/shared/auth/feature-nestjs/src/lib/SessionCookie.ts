import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

import { AuthConfig } from './config/AuthConfig';

// httpOnly so that scripts never read the session, set on the parent domain so that every front shares it.
@Injectable()
export class SessionCookie {
  constructor(private readonly _config: AuthConfig) {}

  set(res: Response, token: string): void {
    res.cookie(this._config.cookieName, token, {
      ...this._options(),
      maxAge: this._config.sessionDurationInDays * 24 * 3600 * 1000,
    });
  }

  clear(res: Response): void {
    res.clearCookie(this._config.cookieName, this._options());
  }

  read(req: Request): string | null {
    const cookieValue: unknown = req.cookies?.[this._config.cookieName];
    if (typeof cookieValue === 'string' && cookieValue) {
      return cookieValue;
    }
    const [scheme, token] = (req.header('authorization') ?? '').split(' ');
    return scheme === 'Bearer' && token ? token : null;
  }

  private _options(): CookieOptions {
    return {
      httpOnly: true,
      secure: this._config.cookieSecure,
      sameSite: 'lax',
      domain: this._config.cookieDomain ?? undefined,
      path: '/',
    };
  }
}
