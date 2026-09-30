import { NotFoundDomainError } from '@trail/shared/tooling/util-error';

export class PredictionNotFoundError extends NotFoundDomainError {
  constructor() {
    super('Prediction not found');
  }
}
