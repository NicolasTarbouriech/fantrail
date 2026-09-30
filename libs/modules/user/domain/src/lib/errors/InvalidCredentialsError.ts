import { DomainError } from '@trail/shared/tooling/util-error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password');
  }
}
