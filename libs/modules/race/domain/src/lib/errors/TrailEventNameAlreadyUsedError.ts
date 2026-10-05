import { DomainError } from '@trail/shared/tooling/util-error';

export class TrailEventNameAlreadyUsedError extends DomainError {
  constructor() {
    super('Trail event name already used');
  }
}
