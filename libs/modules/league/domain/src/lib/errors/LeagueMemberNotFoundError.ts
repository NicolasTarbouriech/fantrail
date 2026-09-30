import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueMemberNotFoundError extends DomainError {
  constructor() {
    super('This player is not a member of the league');
  }
}
