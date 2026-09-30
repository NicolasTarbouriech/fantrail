import { GetUserQueryHandler } from './GetUserQueryHandler';
import { ListUsersByIdListQueryHandler } from './ListUsersByIdListQueryHandler';
import { ListUsersQueryHandler } from './ListUsersQueryHandler';
import { VerifyUserCredentialsQueryHandler } from './VerifyUserCredentialsQueryHandler';

export const queryHandlerList = [
  GetUserQueryHandler,
  ListUsersByIdListQueryHandler,
  ListUsersQueryHandler,
  VerifyUserCredentialsQueryHandler,
];
