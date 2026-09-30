import { DomainError } from '@trail/shared/tooling/util-error';

export class FieldNotLockedError extends DomainError {
  constructor(public readonly fieldId: string) {
    super(`Field ${fieldId} is not locked yet`);
  }
}
