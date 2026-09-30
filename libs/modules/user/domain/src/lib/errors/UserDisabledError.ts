import { DomainError } from '@trail/shared/tooling/util-error';

export class UserDisabledError extends DomainError {
  constructor() {
    super('This account is disabled');
  }
}
