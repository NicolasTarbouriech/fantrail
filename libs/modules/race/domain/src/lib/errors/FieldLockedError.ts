import { DomainError } from '@trail/shared/tooling/util-error';

export class FieldLockedError extends DomainError {
  constructor(public readonly fieldId: string) {
    super(`Field ${fieldId} is locked`);
  }
}
