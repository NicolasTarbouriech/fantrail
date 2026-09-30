import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class UserNotFoundError extends NotFoundDomainError {
  constructor() {
    super('User not found');
  }
}
