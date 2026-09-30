import { Request } from 'express';

import { UserAggregate } from '@trail/modules/user/domain';

export interface AuthenticatedRequest extends Request {
  user?: UserAggregate;
  isApiKey?: boolean;
}
