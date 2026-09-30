import { DomainError } from '@trail/shared/tooling/util-error';

export class PseudoAlreadyUsedError extends DomainError {
  constructor() {
    super('This pseudo is already used');
  }
}
