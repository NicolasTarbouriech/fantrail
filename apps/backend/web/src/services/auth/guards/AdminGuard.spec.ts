import { ExecutionContext } from '@nestjs/common';

import { UserRole } from '@trail/modules/user/domain';
import { buildUserAggregate } from '@trail/modules/user/domain-testing';

import { AdminGuard } from './AdminGuard';
import { AuthenticatedRequest } from './AuthenticatedRequest';

const contextOf = (request: Partial<AuthenticatedRequest>): ExecutionContext =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('lets admins and the api key through', () => {
    expect(
      guard.canActivate(
        contextOf({ user: buildUserAggregate({ role: UserRole.Admin }) }),
      ),
    ).toBe(true);
    expect(guard.canActivate(contextOf({ isApiKey: true }))).toBe(true);
  });

  it('refuses players and anonymous requests', () => {
    expect(() =>
      guard.canActivate(contextOf({ user: buildUserAggregate() })),
    ).toThrow('Admin access required');
    expect(() => guard.canActivate(contextOf({}))).toThrow(
      'Admin access required',
    );
  });
});
