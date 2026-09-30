import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class FieldResultNotPublishedError extends NotFoundDomainError {
  constructor() {
    super('No result published for this field');
  }
}
