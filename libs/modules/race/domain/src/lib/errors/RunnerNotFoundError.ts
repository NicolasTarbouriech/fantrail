import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class RunnerNotFoundError extends NotFoundDomainError {
  constructor(public readonly runnerId: string) {
    super(`Runner ${runnerId} not found`);
  }
}
