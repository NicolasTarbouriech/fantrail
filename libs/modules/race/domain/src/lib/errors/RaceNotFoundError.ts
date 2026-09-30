import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class RaceNotFoundError extends NotFoundDomainError {
  constructor() {
    super('Race not found');
  }
}
