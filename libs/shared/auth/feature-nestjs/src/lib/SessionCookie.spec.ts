import { Request, Response } from 'express';

import { SessionCookie } from './SessionCookie';
import { buildAuthConfig } from './testing';

const requestWith = (
  cookies: Record<string, string>,
  headers: Record<string, string> = {},
): Request =>
  ({
    cookies,
    header: (name: string) => headers[name.toLowerCase()],
  }) as unknown as Request;

describe('SessionCookie', () => {
  const sessionCookie = new SessionCookie(
    buildAuthConfig({ cookieDomain: '.fantrail.run' }),
  );

  it('sets an httpOnly cookie for the session duration on the parent domain', () => {
    const res = { cookie: jest.fn() } as unknown as Response;
    sessionCookie.set(res, 'token');
    expect(res.cookie).toHaveBeenCalledWith('fantrail_session', 'token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: '.fantrail.run',
      path: '/',
      maxAge: 30 * 24 * 3600 * 1000,
    });
  });

  it('clears the cookie with the same options', () => {
    const res = { clearCookie: jest.fn() } as unknown as Response;
    new SessionCookie(buildAuthConfig()).clear(res);
    expect(res.clearCookie).toHaveBeenCalledWith(
      'fantrail_session',
      expect.objectContaining({ domain: undefined }),
    );
  });

  it('reads the cookie first, then a bearer token', () => {
    expect(
      sessionCookie.read(requestWith({ fantrail_session: 'from-cookie' })),
    ).toBe('from-cookie');
    expect(
      sessionCookie.read(
        requestWith({}, { authorization: 'Bearer from-header' }),
      ),
    ).toBe('from-header');
    expect(
      sessionCookie.read(requestWith({}, { authorization: 'Basic abc' })),
    ).toBeNull();
    expect(sessionCookie.read(requestWith({}))).toBeNull();
  });
});
