import { DomainError } from '@trail/shared/tooling/util-error';

export class WithdrawnRunnerPickError extends DomainError {
  constructor(public readonly runnerId: string) {
    super(`Runner ${runnerId} withdrew and cannot be picked anymore`);
  }
}
