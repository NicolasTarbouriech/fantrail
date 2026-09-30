import { DomainError } from '@trail/shared/tooling/util-error';

export class ResultFieldNotLockedError extends DomainError {
  constructor() {
    super('Results can only be published once the field is locked');
  }
}
