import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { getRequest } from './getRequest';

// Runs after AuthGuard, which authenticates either an admin user or the api-key used by scripts.
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);
    if (request.isApiKey || request.user?.isAdmin) {
      return true;
    }
    throw new GraphQLError('Admin access required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}
