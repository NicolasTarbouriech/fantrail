import { DomainError } from '@trail/shared/tooling/util-error';

export class PickCountLockedError extends DomainError {
  constructor() {
    super('Pick count can only change while the race is a draft');
  }
}
