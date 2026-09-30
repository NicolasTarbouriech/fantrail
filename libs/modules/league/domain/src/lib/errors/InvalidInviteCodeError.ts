import { DomainError } from '@trail/shared/tooling/util-error';

export class InvalidInviteCodeError extends DomainError {
  constructor() {
    super('This invite code is not valid for this league');
  }
}
