import { DomainError } from '@trail/shared/tooling/util-error';

export class FieldLockBeforeStartError extends DomainError {
  constructor() {
    super('Field must lock at or before its start');
  }
}
