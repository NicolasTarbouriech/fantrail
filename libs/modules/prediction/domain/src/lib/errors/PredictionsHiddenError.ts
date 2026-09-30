import { DomainError } from '@trail/shared/tooling/util-error';

export class PredictionsHiddenError extends DomainError {
  constructor() {
    super('Predictions of other players stay hidden until the field locks');
  }
}
