import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class LeagueNotFoundError extends NotFoundDomainError {
  constructor() {
    super('League not found');
  }
}
