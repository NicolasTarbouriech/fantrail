import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class TrailEventNotFoundError extends NotFoundDomainError {
  constructor() {
    super('Trail event not found');
  }
}
