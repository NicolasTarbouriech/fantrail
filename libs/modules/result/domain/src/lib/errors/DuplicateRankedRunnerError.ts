import { DomainError } from '@trail/shared/tooling/util-error';

export class DuplicateRankedRunnerError extends DomainError {
  constructor(public readonly runnerId: string) {
    super(`Runner ${runnerId} is ranked more than once`);
  }
}
