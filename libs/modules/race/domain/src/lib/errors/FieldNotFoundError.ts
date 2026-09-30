import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class FieldNotFoundError extends NotFoundDomainError {
  constructor(public readonly fieldId: string) {
    super(`Field ${fieldId} not found`);
  }
}
