import { DomainError } from '@trail/shared/tooling/util-error';

export class InvalidPickPositionError extends DomainError {
  constructor(public readonly pickPosition: number) {
    super(`Pick position must be between 1 and 10, got ${pickPosition}`);
  }
}
