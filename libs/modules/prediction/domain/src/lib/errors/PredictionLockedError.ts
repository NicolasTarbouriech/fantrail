import { DomainError } from '@trail/shared/tooling/util-error';

export class PredictionLockedError extends DomainError {
  constructor() {
    super('Predictions are closed for this field');
  }
}
