import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthenticatedRequest } from './AuthenticatedRequest';

export function getRequest(context: ExecutionContext): AuthenticatedRequest {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest<AuthenticatedRequest>();
  }
  return GqlExecutionContext.create(context).getContext<{
    req: AuthenticatedRequest;
  }>().req;
}
