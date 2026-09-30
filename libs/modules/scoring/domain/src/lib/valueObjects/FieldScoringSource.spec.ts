import { SCORING_FIELD_ID, buildFieldScoringSource } from '../testing';

describe('FieldScoringSource', () => {
  it('exposes what scoring needs', () => {
    const source = buildFieldScoringSource();
    expect(source).toMatchObject({
      fieldId: SCORING_FIELD_ID,
      resultVersion: 1,
      timeTolerancePercent: 3,
      winnerTimeInSeconds: 86400,
    });
    expect(source.predictionList).toHaveLength(2);
  });
});
