import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueForbiddenError extends DomainError {
  constructor() {
    super('Only the owner of the league can do this');
  }
}
