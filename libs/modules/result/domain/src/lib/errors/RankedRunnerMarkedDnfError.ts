import { DomainError } from '@trail/shared/tooling/util-error';

export class RankedRunnerMarkedDnfError extends DomainError {
  constructor(public readonly runnerId: string) {
    super(
      `Runner ${runnerId} cannot be both ranked and marked as did not finish`,
    );
  }
}
