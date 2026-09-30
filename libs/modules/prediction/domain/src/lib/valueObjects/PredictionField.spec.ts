import { PredictionsHiddenError } from '../errors';
import {
  PREDICTION_FIELD_ID,
  buildPredictionField,
  buildPredictionRunnerId,
} from '../testing';

describe('PredictionField', () => {
  it('exposes the field context', () => {
    const field = buildPredictionField({
      withdrawnRunnerIdList: [buildPredictionRunnerId(3)],
    });
    expect(field.fieldId).toBe(PREDICTION_FIELD_ID);
    expect(field.pickCount).toBe(5);
    expect(field.isOpen).toBe(true);
    expect(field.hasRunner(buildPredictionRunnerId(3))).toBe(true);
    expect(field.isWithdrawn(buildPredictionRunnerId(3))).toBe(true);
    expect(field.isWithdrawn(buildPredictionRunnerId(4))).toBe(false);
  });

  it('reveals the predictions once locked only', () => {
    expect(() => buildPredictionField().assertPredictionsRevealed()).toThrow(
      PredictionsHiddenError,
    );
    expect(() =>
      buildPredictionField({ isOpen: false }).assertPredictionsRevealed(),
    ).not.toThrow();
  });
});
