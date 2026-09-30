import { DomainError } from '@trail/shared/tooling/util-error';

export class EmailAlreadyUsedError extends DomainError {
  constructor() {
    super('This email is already used');
  }
}
