import { DomainError } from '@trail/shared/tooling/util-error';

export class DuplicatePickError extends DomainError {
  constructor(public readonly runnerId: string) {
    super(`Runner ${runnerId} is picked more than once`);
  }
}
