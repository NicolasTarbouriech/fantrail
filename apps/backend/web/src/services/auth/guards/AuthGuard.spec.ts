import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GraphQLError } from 'graphql';

import { UserNotFoundError } from '@trail/modules/user/domain';
import {
  USER_ID,
  buildUserAggregate,
} from '@trail/modules/user/domain-testing';
import { SessionCookie, SessionToken } from '@trail/shared/auth/feature-nestjs';
import { buildAuthConfig } from '@trail/shared/auth/feature-nestjs-testing';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { AuthGuard } from './AuthGuard';
import { AuthenticatedRequest } from './AuthenticatedRequest';

function buildContext(
  request: Partial<AuthenticatedRequest>,
): ExecutionContext {
  return {
    getType: () => 'http',
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

function buildRequest(
  headers: Record<string, string> = {},
  cookies: Record<string, string> = {},
) {
  return {
    cookies,
    header: (name: string) => headers[name.toLowerCase()],
  } as unknown as AuthenticatedRequest;
}

describe('AuthGuard', () => {
  let queryBus: EnhancedQueryBus;
  let reflector: Reflector;
  let guard: AuthGuard;
  const sessionToken = new SessionToken(buildAuthConfig());

  beforeEach(() => {
    queryBus = {
      execute: jest.fn().mockResolvedValue(buildUserAggregate()),
    } as unknown as EnhancedQueryBus;
    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    guard = new AuthGuard(
      queryBus,
      reflector,
      sessionToken,
      new SessionCookie(buildAuthConfig()),
    );
  });

  it('loads the user of a valid session cookie', async () => {
    const request = buildRequest(
      {},
      { fantrail_session: await sessionToken.sign(USER_ID) },
    );
    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);
    expect(request.user?.id).toBe(USER_ID);
  });

  it('accepts a bearer token', async () => {
    const request = buildRequest({
      authorization: `Bearer ${await sessionToken.sign(USER_ID)}`,
    });
    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);
    expect(request.user?.id).toBe(USER_ID);
  });

  it('refuses a missing or invalid token when authentication is mandatory', async () => {
    await expect(
      guard.canActivate(buildContext(buildRequest())),
    ).rejects.toThrow(GraphQLError);
    await expect(
      guard.canActivate(
        buildContext(buildRequest({}, { fantrail_session: 'forged' })),
      ),
    ).rejects.toThrow('Authentication required');
  });

  it('lets anonymous requests through when authentication is not mandatory', async () => {
    jest.mocked(reflector.getAllAndOverride).mockReturnValue(true);
    const request = buildRequest();
    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);
    expect(request.user).toBeUndefined();
  });

  it('refuses a disabled user', async () => {
    jest
      .mocked(queryBus.execute)
      .mockResolvedValueOnce(
        buildUserAggregate({ disabledAt: new Date('2026-10-01T10:00:00Z') }),
      );
    const request = buildRequest(
      {},
      { fantrail_session: await sessionToken.sign(USER_ID) },
    );
    await expect(guard.canActivate(buildContext(request))).rejects.toThrow(
      'Authentication required',
    );
  });

  it('treats a deleted user as anonymous', async () => {
    jest.mocked(queryBus.execute).mockRejectedValue(new UserNotFoundError());
    const token = await sessionToken.sign(USER_ID);
    await expect(
      guard.canActivate(
        buildContext(buildRequest({}, { fantrail_session: token })),
      ),
    ).rejects.toThrow('Authentication required');
    jest.mocked(reflector.getAllAndOverride).mockReturnValue(true);
    await expect(
      guard.canActivate(
        buildContext(buildRequest({}, { fantrail_session: token })),
      ),
    ).resolves.toBe(true);
  });

  it('rethrows unexpected errors', async () => {
    jest
      .mocked(queryBus.execute)
      .mockRejectedValueOnce(new Error('database down'));
    const request = buildRequest(
      {},
      { fantrail_session: await sessionToken.sign(USER_ID) },
    );
    await expect(guard.canActivate(buildContext(request))).rejects.toThrow(
      'database down',
    );
  });
});
