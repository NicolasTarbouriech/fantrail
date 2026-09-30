import { DomainError } from '@trail/shared/tooling/util-error';

export class PickCountMismatchError extends DomainError {
  constructor(
    public readonly expected: number,
    public readonly received: number,
  ) {
    super(`Expected ${expected} pick positions, got ${received}`);
  }
}
