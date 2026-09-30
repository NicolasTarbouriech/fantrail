import { DomainError } from '@trail/shared/tooling/util-error';

export class RaceWithoutFieldError extends DomainError {
  constructor() {
    super('Race needs at least one field to open');
  }
}
