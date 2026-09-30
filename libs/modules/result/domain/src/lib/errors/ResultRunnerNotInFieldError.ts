import { DomainError } from '@trail/shared/tooling/util-error';

export class ResultRunnerNotInFieldError extends DomainError {
  constructor(public readonly runnerId: string) {
    super(`Runner ${runnerId} does not run in this field`);
  }
}
