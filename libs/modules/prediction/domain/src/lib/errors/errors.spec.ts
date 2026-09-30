import { PredictionNotFoundError } from './PredictionNotFoundError';

describe('PredictionNotFoundError', () => {
  it('is a not found error', () => {
    expect(new PredictionNotFoundError().code).toBe('PREDICTION_NOT_FOUND');
  });
});
