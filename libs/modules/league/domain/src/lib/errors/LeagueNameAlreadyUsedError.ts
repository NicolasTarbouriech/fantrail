import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueNameAlreadyUsedError extends DomainError {
  constructor() {
    super('This league name is already used');
  }
}
