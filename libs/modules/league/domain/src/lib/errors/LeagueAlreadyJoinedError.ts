import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueAlreadyJoinedError extends DomainError {
  constructor() {
    super('You already are a member of this league');
  }
}
