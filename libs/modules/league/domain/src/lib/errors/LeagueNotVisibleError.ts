import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class LeagueNotVisibleError extends NotFoundDomainError {
  constructor() {
    super('League not found');
  }
}
