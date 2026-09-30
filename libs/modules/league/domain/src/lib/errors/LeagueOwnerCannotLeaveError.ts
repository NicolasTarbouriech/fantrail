import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueOwnerCannotLeaveError extends DomainError {
  constructor() {
    super('The owner cannot leave the league, delete it instead');
  }
}
