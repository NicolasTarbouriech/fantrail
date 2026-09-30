import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GraphQLError } from 'graphql';

import { GetUserQuery } from '@trail/modules/user/application';
import { SessionCookie, SessionToken } from '@trail/shared/auth/feature-nestjs';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';
import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

import { ADMIN_API_KEY } from '../../../config/app';
import { AUTH_NOT_MANDATORY_KEY } from './AuthNotMandatory';
import { getRequest } from './getRequest';

const unauthenticated = (): GraphQLError =>
  new GraphQLError('Authentication required', {
    extensions: { code: 'UNAUTHENTICATED' },
  });

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _queryBus: EnhancedQueryBus,
    private readonly _reflector: Reflector,
    private readonly _sessionToken: SessionToken,
    private readonly _sessionCookie: SessionCookie,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context);
    if (request.user || request.isApiKey) {
      return true;
    }
    if (ADMIN_API_KEY && request.header('api-key') === ADMIN_API_KEY) {
      request.isApiKey = true;
      return true;
    }
    const isMandatory = !this._reflector.getAllAndOverride<boolean>(
      AUTH_NOT_MANDATORY_KEY,
      [context.getHandler(), context.getClass()],
    );
    const token = this._sessionCookie.read(request);
    const userId = token ? await this._sessionToken.verify(token) : null;
    if (!userId) {
      if (isMandatory) {
        throw unauthenticated();
      }
      return true;
    }
    try {
      const user = await this._queryBus.execute(new GetUserQuery({ userId }));
      if (user.isDisabled) {
        throw unauthenticated();
      }
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof NotFoundDomainError && !isMandatory) {
        return true;
      }
      throw error instanceof NotFoundDomainError ? unauthenticated() : error;
    }
  }
}
