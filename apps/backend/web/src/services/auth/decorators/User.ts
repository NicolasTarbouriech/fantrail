import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserAggregate } from '@trail/modules/user/domain';

import { getRequest } from '../guards/getRequest';

export const User = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserAggregate | undefined =>
    getRequest(context).user,
);
